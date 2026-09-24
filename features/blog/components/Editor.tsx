"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { Node, mergeAttributes } from "@tiptap/core";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/image-url";
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Unlink,
  CornerDownRight,
  Image as ImageIcon,
  Video,
  MousePointerClick,
  UploadCloud,
  Loader2,
} from "lucide-react";

// Custom TipTap node for clickable Action / CTA Buttons
export const ActionButton = Node.create({
  name: "actionButton",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      href: {
        default: "#",
      },
      text: {
        default: "Read More",
      },
      download: {
        default: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="action-button-container"]',
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          const a = element.querySelector("a");
          return {
            href:
              a?.getAttribute("href") ||
              element.getAttribute("data-href") ||
              "#",
            text:
              a?.textContent?.replace(/^[📥\s]+/, "").replace(/[\s→↗]+$/, "") ||
              element.getAttribute("data-text") ||
              "Read More",
            download:
              a?.hasAttribute("download") ||
              element.getAttribute("data-download") === "true",
          };
        },
      },
      {
        tag: 'a[data-type="action-button"]',
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          return {
            href: element.getAttribute("href") || "#",
            text:
              element.textContent
                ?.replace(/^[📥\s]+/, "")
                .replace(/[\s→↗]+$/, "") || "Read More",
            download: element.hasAttribute("download"),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { href, text, download } = HTMLAttributes;
    const cleanText = (text || "Read More")
      .replace(/^[📥\s]+/, "")
      .replace(/[\s→↗]+$/, "");
    return [
      "div",
      {
        class: "my-6 flex",
        "data-type": "action-button-container",
        "data-href": href || "#",
        "data-text": cleanText,
        "data-download": download ? "true" : "false",
      },
      [
        "a",
        mergeAttributes({
          "data-type": "action-button",
          href: href || "#",
          target: "_blank",
          rel: "noopener noreferrer",
          class:
            "not-prose inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-mono font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 cursor-pointer no-underline",
          ...(download ? { download: "" } : {}),
        }),
        download ? `📥 ${cleanText}` : `${cleanText} ↗`,
      ],
    ];
  },
});

// Custom TipTap node for generic Embeds (Vimeo, Loom, Spotify, iframes)
export const EmbedNode = Node.create({
  name: "embed",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="generic-embed"]',
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          const iframe = element.querySelector("iframe");
          return {
            src:
              iframe?.getAttribute("src") ||
              element.getAttribute("data-src") ||
              null,
          };
        },
      },
      {
        tag: 'iframe[data-type="generic-embed"]',
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          return {
            src: element.getAttribute("src"),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      {
        class:
          "my-6 aspect-video w-full rounded-xl overflow-hidden border border-border shadow-sm",
        "data-type": "generic-embed",
        "data-src": HTMLAttributes.src,
      },
      [
        "iframe",
        mergeAttributes({
          "data-type": "generic-embed",
          src: HTMLAttributes.src,
          class: "w-full h-full border-0",
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          allowfullscreen: "true",
        }),
      ],
    ];
  },
});

// Custom TipTap node for direct Video files (.mp4, .webm, etc.)
export const VideoNode = Node.create({
  name: "video",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'video[data-type="article-video"]',
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          return {
            src: element.getAttribute("src"),
          };
        },
      },
      {
        tag: 'div[data-type="article-video-container"]',
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          const video = element.querySelector("video");
          return {
            src: video?.getAttribute("src") || element.getAttribute("data-src"),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      {
        class:
          "my-6 aspect-video w-full rounded-xl overflow-hidden border border-border shadow-sm bg-muted flex items-center justify-center",
        "data-type": "article-video-container",
        "data-src": HTMLAttributes.src,
      },
      [
        "video",
        mergeAttributes({
          "data-type": "article-video",
          src: HTMLAttributes.src,
          controls: "true",
          class: "w-full h-full object-cover",
        }),
      ],
    ];
  },
});

export const Editor = ({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Dialog States
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const [imageUrlDialogOpen, setImageUrlDialogOpen] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");

  const [embedDialogOpen, setEmbedDialogOpen] = useState(false);
  const [embedInput, setEmbedInput] = useState("");

  const [buttonDialogOpen, setButtonDialogOpen] = useState(false);
  const [buttonText, setButtonText] = useState("Read More");
  const [buttonUrl, setButtonUrl] = useState("");
  const [buttonIsDownload, setButtonIsDownload] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          autolink: false, // Ensures typing after a link does NOT automatically extend the link
          HTMLAttributes: {
            class:
              "text-primary underline underline-offset-4 font-medium hover:opacity-80 transition-opacity",
            target: "_blank",
            rel: "noopener noreferrer",
          },
        },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class:
            "rounded-xl overflow-hidden max-w-full my-6 border border-border shadow-sm",
        },
      }),
      Youtube.configure({
        HTMLAttributes: {
          class:
            "rounded-xl overflow-hidden aspect-video w-full my-6 border border-border shadow-sm",
        },
      }),
      EmbedNode,
      VideoNode,
      ActionButton,
    ],
    immediatelyRender: false,
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-none border border-border p-4 rounded-xl min-h-[350px] bg-background",
      },
    },
  });

  // Sync incoming content from async database loads into TipTap without clobbering active edits
  useEffect(() => {
    if (
      editor &&
      content !== undefined &&
      !editor.isFocused &&
      content !== editor.getHTML()
    ) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  // --- Link Handlers ---
  const openLinkDialog = () => {
    const previousUrl = editor.getAttributes("link").href || "";
    setLinkUrl(previousUrl || "https://");

    const { from, to } = editor.state.selection;
    if (from !== to) {
      const selectedText = editor.state.doc.textBetween(from, to, " ");
      setLinkText(selectedText);
    } else {
      setLinkText("");
    }
    setLinkDialogOpen(true);
  };

  const handleApplyLink = () => {
    const cleanUrl = linkUrl.trim();
    if (!cleanUrl || cleanUrl === "https://") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setLinkDialogOpen(false);
      return;
    }

    const { from, to } = editor.state.selection;
    if (from !== to) {
      // Wrap selected text in link, then move cursor to the end, unset mark, and append space
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: cleanUrl, target: "_blank" })
        .setTextSelection(to)
        .unsetMark("link")
        .insertContent(" ")
        .run();
    } else {
      // Insert link text with mark, then unset mark and insert space so author continues typing normally
      const textToInsert = linkText.trim() || cleanUrl;
      editor
        .chain()
        .focus()
        .insertContent({
          type: "text",
          text: textToInsert,
          marks: [
            { type: "link", attrs: { href: cleanUrl, target: "_blank" } },
          ],
        })
        .unsetMark("link")
        .insertContent(" ")
        .run();
    }
    setLinkDialogOpen(false);
  };

  const handleStopLinkHere = () => {
    // Unset link mark and insert space so user can continue typing normal text on the same line
    editor.chain().focus().unsetMark("link").insertContent(" ").run();
  };

  const handleRemoveLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkDialogOpen(false);
  };

  // --- Image URL Handlers ---
  const openImageUrlDialog = () => {
    setImageUrlInput("");
    setImageUrlDialogOpen(true);
  };

  const handleApplyImageUrl = () => {
    if (imageUrlInput.trim()) {
      const resolved = getImageUrl(imageUrlInput.trim());
      editor.chain().focus().setImage({ src: resolved }).run();
    }
    setImageUrlDialogOpen(false);
  };

  // --- Computer Image Upload Handler ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Uploading image to Google Drive...");
    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Failed to upload image");
      }

      const data = await res.json();
      const imageUrl = data.url || `/api/drive-image?fileId=${data.id}`;
      editor.chain().focus().setImage({ src: imageUrl, alt: file.name }).run();
      toast.success("Image uploaded and inserted!", { id: toastId });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to upload image";
      toast.error(message, { id: toastId });
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  // --- Video & Embed Handlers ---
  const openEmbedDialog = () => {
    setEmbedInput("");
    setEmbedDialogOpen(true);
  };

  const handleApplyEmbed = () => {
    const input = embedInput.trim();
    if (!input) {
      setEmbedDialogOpen(false);
      return;
    }

    // Check if user pasted an iframe
    const iframeSrcMatch = input.match(/src=["']([^"']+)["']/i);
    const resolvedUrl = iframeSrcMatch ? iframeSrcMatch[1] : input;

    // Check if YouTube
    if (
      resolvedUrl.includes("youtube.com") ||
      resolvedUrl.includes("youtu.be")
    ) {
      editor.commands.setYoutubeVideo({
        src: resolvedUrl,
        width: 640,
        height: 360,
      });
      setEmbedDialogOpen(false);
      return;
    }

    // Check if direct video file
    const cleanUrl = resolvedUrl.split("?")[0].toLowerCase();
    if (
      cleanUrl.endsWith(".mp4") ||
      cleanUrl.endsWith(".webm") ||
      cleanUrl.endsWith(".ogg") ||
      cleanUrl.endsWith(".mov")
    ) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "video",
          attrs: {
            src: resolvedUrl,
          },
        })
        .run();
      setEmbedDialogOpen(false);
      return;
    }

    // Generic embed / iframe (Vimeo, Loom, Spotify, etc.)
    editor
      .chain()
      .focus()
      .insertContent({
        type: "embed",
        attrs: {
          src: resolvedUrl,
        },
      })
      .run();
    setEmbedDialogOpen(false);
  };

  // --- Button Handlers ---
  const openButtonDialog = () => {
    setButtonText("Read More");
    setButtonUrl("");
    setButtonIsDownload(false);
    setButtonDialogOpen(true);
  };

  const handleApplyButton = () => {
    if (!buttonUrl.trim()) {
      toast.error("Please provide a destination link for the button");
      return;
    }

    editor
      .chain()
      .focus()
      .insertContent({
        type: "actionButton",
        attrs: {
          href: buttonUrl.trim(),
          text: buttonText.trim() || "Read More",
          download: buttonIsDownload,
        },
      })
      .run();

    setButtonDialogOpen(false);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Hidden input for computer image upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 border border-border rounded-xl bg-muted/40">
        {/* Undo & Redo */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 px-2 text-xs font-mono"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-3.5 h-3.5 mr-1" />
          Undo
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 px-2 text-xs font-mono"
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 className="w-3.5 h-3.5 mr-1" />
          Redo
        </Button>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Text Styling */}
        <Button
          type="button"
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="h-8 px-2 text-xs font-mono font-bold"
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5 mr-1" />
          Bold
        </Button>

        <Button
          type="button"
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-8 px-2 text-xs font-mono italic"
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5 mr-1" />
          Italic
        </Button>

        <Button
          type="button"
          variant={editor.isActive("underline") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="h-8 px-2 text-xs font-mono underline"
          title="Underline"
        >
          <UnderlineIcon className="w-3.5 h-3.5 mr-1" />
          Underline
        </Button>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Human Headings */}
        <Button
          type="button"
          variant={
            editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"
          }
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className="h-8 px-2 text-xs font-mono font-bold"
          title="Main Heading"
        >
          <Heading1 className="w-3.5 h-3.5 mr-1" />
          Heading
        </Button>

        <Button
          type="button"
          variant={
            editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"
          }
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className="h-8 px-2 text-xs font-mono font-bold"
          title="Subheading"
        >
          <Heading2 className="w-3.5 h-3.5 mr-1" />
          Subheading
        </Button>

        <Button
          type="button"
          variant={
            editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"
          }
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className="h-8 px-2 text-xs font-mono font-bold"
          title="Section Heading"
        >
          <Heading3 className="w-3.5 h-3.5 mr-1" />
          Section
        </Button>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Lists & Quotes */}
        <Button
          type="button"
          variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="h-8 px-2 text-xs font-mono"
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5 mr-1" />
          Bullets
        </Button>

        <Button
          type="button"
          variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="h-8 px-2 text-xs font-mono"
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5 mr-1" />
          Ordered
        </Button>

        <Button
          type="button"
          variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="h-8 px-2 text-xs font-mono"
          title="Quote"
        >
          <Quote className="w-3.5 h-3.5 mr-1" />
          Quote
        </Button>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Links */}
        <Button
          type="button"
          variant={editor.isActive("link") ? "secondary" : "ghost"}
          size="sm"
          onClick={openLinkDialog}
          className="h-8 px-2 text-xs font-mono"
          title="Insert or Edit Link"
        >
          <LinkIcon className="w-3.5 h-3.5 mr-1" />
          Link
        </Button>

        {/* When link is active, allow user to stop the link or remove it */}
        {editor.isActive("link") && (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleStopLinkHere}
              className="h-8 px-2 text-xs font-mono border-primary/40 text-primary hover:bg-primary/10"
              title="Stop linking and continue typing normal text on this line"
            >
              <CornerDownRight className="w-3.5 h-3.5 mr-1" />
              Stop Link
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveLink}
              className="h-8 px-2 text-xs font-mono text-muted-foreground"
              title="Remove link from selected text"
            >
              <Unlink className="w-3.5 h-3.5 mr-1" />
              Unlink
            </Button>
          </>
        )}

        <div className="w-px h-5 bg-border mx-1" />

        {/* Images */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploadingImage}
          className="h-8 px-2 text-xs font-mono"
          title="Upload image from computer to Google Drive"
        >
          {isUploadingImage ? (
            <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
          ) : (
            <UploadCloud className="w-3.5 h-3.5 mr-1 text-primary" />
          )}
          Upload Image
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={openImageUrlDialog}
          className="h-8 px-2 text-xs font-mono"
          title="Insert image by URL"
        >
          <ImageIcon className="w-3.5 h-3.5 mr-1" />
          Image URL
        </Button>

        {/* Video / Embed */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={openEmbedDialog}
          className="h-8 px-2 text-xs font-mono"
          title="Embed YouTube, Vimeo, video file, or iframe"
        >
          <Video className="w-3.5 h-3.5 mr-1 text-primary" />
          Video / Embed
        </Button>

        {/* Action Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={openButtonDialog}
          className="h-8 px-2.5 text-xs font-mono border-primary/30 text-primary hover:bg-primary/10"
          title="Insert a call-to-action button in the article"
        >
          <MousePointerClick className="w-3.5 h-3.5 mr-1" />
          Insert Button
        </Button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />

      {/* --- Link Dialog --- */}
      <Dialog
        open={linkDialogOpen}
        onOpenChange={(open: boolean) => !open && setLinkDialogOpen(false)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Insert / Edit Link</DialogTitle>
            <DialogDescription>
              Enter the link text and destination web address. After insertion,
              you can continue typing normally.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="link-text">Link Text</Label>
              <input
                id="link-text"
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="e.g. Visit Quinta's Portfolio"
                className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="link-url">Destination URL</Label>
              <input
                id="link-url"
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleApplyLink();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            {editor.isActive("link") && (
              <Button
                type="button"
                variant="outline"
                onClick={handleRemoveLink}
                className="mr-auto"
              >
                Remove Link
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => setLinkDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleApplyLink}>
              Apply Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Image URL Dialog --- */}
      <Dialog
        open={imageUrlDialogOpen}
        onOpenChange={(open: boolean) => !open && setImageUrlDialogOpen(false)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Image from URL</DialogTitle>
            <DialogDescription>
              Enter a web image URL or a shared Google Drive image link.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="image-url-input">Image URL</Label>
            <input
              id="image-url-input"
              type="url"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="https://... or Google Drive sharing link"
              className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleApplyImageUrl();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setImageUrlDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleApplyImageUrl}>
              Insert Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Embed / Video Dialog --- */}
      <Dialog
        open={embedDialogOpen}
        onOpenChange={(open: boolean) => !open && setEmbedDialogOpen(false)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Embed Video or Media</DialogTitle>
            <DialogDescription>
              Paste a YouTube link, Vimeo URL, direct video file (.mp4), or an
              iframe embed code snippet.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="embed-input">Video or Embed URL / Code</Label>
            <textarea
              id="embed-input"
              rows={3}
              value={embedInput}
              onChange={(e) => setEmbedInput(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... or <iframe src='...'></iframe>"
              className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEmbedDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleApplyEmbed}>
              Insert Media
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Action / CTA Button Dialog --- */}
      <Dialog
        open={buttonDialogOpen}
        onOpenChange={(open: boolean) => !open && setButtonDialogOpen(false)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Button</DialogTitle>
            <DialogDescription>
              Create a call-to-action button (e.g. to a project, full article,
              or external link) in the article body.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="btn-text">Button Label</Label>
              <input
                id="btn-text"
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="e.g. Read Full Story or Contact Quinta"
                className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="btn-url">Destination URL</Label>
              <input
                id="btn-url"
                type="url"
                value={buttonUrl}
                onChange={(e) => setButtonUrl(e.target.value)}
                placeholder="https://example.com/story"
                className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleApplyButton();
                  }
                }}
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-mono cursor-pointer select-none">
              <input
                type="checkbox"
                checked={buttonIsDownload}
                onChange={(e) => setButtonIsDownload(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              Mark as file download link (adds download attribute)
            </label>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setButtonDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleApplyButton}>
              Insert Button
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
