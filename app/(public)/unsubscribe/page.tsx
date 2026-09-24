import type { Metadata } from "next";
import UnsubscribeClient from "./unsubscribe-client";

export const metadata: Metadata = {
  title: "Unsubscribe | Quinta Akpan",
  description:
    "Unsubscribe from personal notes and writing updates by Quinta Akpan.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UnsubscribePage() {
  return <UnsubscribeClient />;
}
