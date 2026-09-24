"use client";

import { useState, useRef, ChangeEvent, DragEvent, useCallback } from "react";
import {
  UploadCloud,
  X,
  Loader2,
  Crop as CropIcon,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  HardDrive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Cropper, { Area, Point } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { getCroppedImg } from "@/lib/crop-image";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/image-url";

interface GooglePickerDoc {
  id: string;
  name?: string;
  mimeType?: string;
  url?: string;
}

interface GooglePickerCallbackData {
  action: string;
  docs?: GooglePickerDoc[];
}

interface DocsViewInstance {
  setIncludeFolders: (include: boolean) => DocsViewInstance;
  setSelectFolderEnabled: (enabled: boolean) => DocsViewInstance;
  setMimeTypes: (mimeTypes: string) => DocsViewInstance;
}

interface GooglePickerInstance {
  setVisible: (visible: boolean) => void;
}

interface PickerBuilderInstance {
  addView: (view: DocsViewInstance) => PickerBuilderInstance;
  setOAuthToken: (token: string) => PickerBuilderInstance;
  setAppId: (appId: string) => PickerBuilderInstance;
  setOrigin: (origin: string) => PickerBuilderInstance;
  setCallback: (
    callback: (data: GooglePickerCallbackData) => void,
  ) => PickerBuilderInstance;
  build: () => GooglePickerInstance;
}

declare global {
  interface Window {
    gapi?: {
      load: (apiName: string, callback: () => void) => void;
    };
    google?: {
      picker?: {
        ViewId: {
          DOCS_IMAGES: string;
        };
        Action: {
          PICKED: string;
          CANCEL: string;
        };
        DocsView: new (viewId?: string) => DocsViewInstance;
        PickerBuilder: new () => PickerBuilderInstance;
      };
    };
  }
}

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  aspectRatio?: number;
}

function loadGooglePickerScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if (window.gapi?.load) {
      window.gapi.load("picker", resolve);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.gapi?.load) {
        window.gapi.load("picker", resolve);
      } else {
        resolve();
      }
    };
    script.onerror = () =>
      reject(new Error("Failed to load Google API library"));
    document.body.appendChild(script);
  });
}

export function ImageUpload({
  value,
  onChange,
  disabled,
  aspectRatio = 16 / 9,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingDrive, setIsLoadingDrive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Cropper states
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageSrc(reader.result?.toString() || null);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      setRotation(0);
      setShowCropper(true);
    });
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels);
    },
    [],
  );

  const openGoogleDrivePicker = async () => {
    if (disabled || isUploading || isLoadingDrive) return;

    try {
      setIsLoadingDrive(true);
      await loadGooglePickerScript();

      const res = await fetch("/api/auth/google-drive-picker");
      if (!res.ok) {
        const err = await res.json();
        throw new Error(
          err.error || "Failed to authenticate with Google Drive",
        );
      }

      const { accessToken, appId } = await res.json();

      if (!window.google?.picker) {
        throw new Error(
          "Google Picker API is not ready yet. Please try again.",
        );
      }

      const view = new window.google.picker.DocsView(
        window.google.picker.ViewId.DOCS_IMAGES,
      )
        .setIncludeFolders(true)
        .setSelectFolderEnabled(false)
        .setMimeTypes("image/png,image/jpeg,image/jpg,image/webp,image/gif");

      const picker = new window.google.picker.PickerBuilder()
        .addView(view)
        .setOAuthToken(accessToken)
        .setAppId(appId)
        .setOrigin(window.location.origin)
        .setCallback((data: GooglePickerCallbackData) => {
          try {
            const action = data?.action;

            if (
              action == "picked" ||
              action === window.google?.picker?.Action?.PICKED
            ) {
              const doc = data?.docs?.[0];

              if (!doc || !doc.id) {
                console.error(
                  "[Picker Callback] Missing document ID in response",
                  data,
                );
                toast.error("Invalid file selected");
                return;
              }

              (async () => {
                const toastId = toast.loading(
                  "Loading image from Google Drive...",
                );
                try {
                  setIsUploading(true);
                  const imgRes = await fetch(
                    `/api/drive-image?fileId=${doc.id}`,
                  );

                  if (!imgRes.ok) {
                    const errData = await imgRes.json().catch(() => null);
                    throw new Error(
                      errData?.error ||
                        "Failed to load selected image from Google Drive",
                    );
                  }

                  const blob = await imgRes.blob();
                  const objectUrl = URL.createObjectURL(blob);

                  setImageSrc(objectUrl);
                  setZoom(1);
                  setCrop({ x: 0, y: 0 });
                  setRotation(0);
                  setShowCropper(true);
                  toast.dismiss(toastId);
                } catch (err: unknown) {
                  console.error("Google Drive Image Fetch Error:", err);
                  const message =
                    err instanceof Error
                      ? err.message
                      : "Failed to load Drive image";
                  toast.error(message, { id: toastId });
                } finally {
                  setIsUploading(false);
                }
              })();
            }
          } catch (err) {
            console.error("[Picker Callback] Error:", err);
            toast.error(
              "An unexpected error occurred while processing the selected file.",
            );
          }
        })
        .build();

      picker.setVisible(true);
    } catch (error: unknown) {
      console.error("Google Drive Picker error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to open Google Drive picker";
      toast.error(message);
    } finally {
      setIsLoadingDrive(false);
    }
  };

  const uploadCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    const toastId = toast.loading("Processing and saving cropped image...");
    try {
      setIsUploading(true);
      setShowCropper(false);

      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append("file", croppedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || "Upload failed");
      }

      const data = await res.json();
      onChange(data.url || data.id);
      toast.success("Image saved successfully!", { id: toastId });
    } catch (error: unknown) {
      console.error(error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to upload image. Make sure you are signed in with Google.";
      toast.error(message, { id: toastId });
    } finally {
      setIsUploading(false);
      setImageSrc(null);
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
    e.target.value = "";
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <>
      {value ? (
        <div
          className="relative w-full rounded-xl overflow-hidden border border-border group bg-muted"
          style={{ aspectRatio: aspectRatio.toString() }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getImageUrl(value)}
            alt="Uploaded preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-wrap items-center justify-center gap-2 p-4">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading || isLoadingDrive}
            >
              <UploadCloud className="w-4 h-4 mr-1.5" />
              Replace (Computer)
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={openGoogleDrivePicker}
              disabled={disabled || isUploading || isLoadingDrive}
            >
              <HardDrive className="w-4 h-4 mr-1.5" />
              Replace (Drive)
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onChange("")}
              disabled={disabled || isUploading || isLoadingDrive}
            >
              <X className="w-4 h-4 mr-1.5" />
              Remove
            </Button>
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              accept="image/*"
              onChange={onFileChange}
              disabled={disabled || isUploading}
            />
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors bg-card ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/40"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
        >
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            accept="image/*"
            onChange={onFileChange}
            disabled={disabled || isUploading}
          />

          {isUploading || isLoadingDrive ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground py-6">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm font-medium">
                {isLoadingDrive
                  ? "Connecting to Google Drive..."
                  : "Loading & Processing Image..."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-2 w-full max-w-sm">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-1">
                <UploadCloud className="w-6 h-6 text-muted-foreground" />
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  Select or upload media
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Drag & drop an image or pick from your preferred source
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full font-mono text-xs cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                >
                  <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
                  Upload Computer
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full font-mono text-xs cursor-pointer"
                  onClick={openGoogleDrivePicker}
                  disabled={disabled}
                >
                  <HardDrive className="w-3.5 h-3.5 mr-1.5 text-primary" />
                  Google Drive
                </Button>
              </div>

              <p className="text-[11px] text-muted-foreground font-sans">
                Supports JPG, PNG, WEBP, or GIF
              </p>
            </div>
          )}
        </div>
      )}

      <Dialog
        open={showCropper}
        onOpenChange={(open: boolean) => !open && setShowCropper(false)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Cropping Canvas Viewport */}
            <div className="relative w-full h-[50vh] bg-muted rounded-xl overflow-hidden">
              {imageSrc && (
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={aspectRatio}
                  showGrid={true}
                  zoomWithScroll={true}
                  minZoom={1}
                  maxZoom={4}
                  zoomSpeed={0.3}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                />
              )}
            </div>

            {/* Interactive Zoom and Area Resizing Controls */}
            <div className="bg-muted/40 p-4 rounded-xl border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => setZoom((prev) => Math.max(1, prev - 0.2))}
                  disabled={zoom <= 1}
                  title="Zoom Out (Crop larger area)"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>

                <input
                  type="range"
                  min="1"
                  max="4"
                  step="0.02"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  title="Adjust crop size"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => setZoom((prev) => Math.min(4, prev + 0.2))}
                  disabled={zoom >= 4}
                  title="Zoom In (Crop smaller area)"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>

                <span className="font-mono text-xs text-muted-foreground w-12 text-right">
                  {Math.round(zoom * 100)}%
                </span>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setZoom(1);
                    setCrop({ x: 0, y: 0 });
                    setRotation(0);
                  }}
                  className="text-xs font-mono"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  Reset
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center font-sans">
              Drag to reposition. Use the slider or mouse wheel / trackpad pinch
              to resize the cropped area while preserving the locked framing.
            </p>
          </div>

          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setShowCropper(false)}>
              Cancel
            </Button>
            <Button onClick={uploadCroppedImage} disabled={isUploading}>
              {isUploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CropIcon className="w-4 h-4 mr-2" />
              )}
              Crop & Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
