import { notFound } from "next/navigation";

// Any unmatched address renders the site's 404 page inside the normal layout.
export default function CatchAll() {
  notFound();
}
