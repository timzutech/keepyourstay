"use client";

import { useRef, useState } from "react";
import { browserClient } from "@/lib/supabase/browser";

const MAX_BYTES = 8 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/** Uploads to the public "media" bucket as the signed-in admin and returns the public URL. */
async function upload(file: File, folder: string) {
  if (!TYPES.includes(file.type)) throw new Error("Use a JPEG, PNG, WebP or AVIF image.");
  if (file.size > MAX_BYTES) throw new Error("Images must be smaller than 8 MB.");
  const supabase = browserClient();
  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").slice(-60);
  const path = `${folder}/${crypto.randomUUID()}-${safe}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { cacheControl: "31536000", upsert: false });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

export function ImageField({ name, label, folder, defaultValue = "" }: { name: string; label: string; folder: string; defaultValue?: string }) {
  const [url, setUrl] = useState(defaultValue);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div>
      <label htmlFor={`f-${name}`} className="label">{label}</label>
      <input id={`f-${name}`} name={name} className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <label className="btn btn-outline btn-sm cursor-pointer">
          {busy ? "Uploading…" : "Upload image"}
          <input
            type="file"
            accept={TYPES.join(",")}
            className="sr-only"
            disabled={busy}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setBusy(true);
              setStatus("");
              try {
                setUrl(await upload(file, folder));
                setStatus("Uploaded. Save to keep the change.");
              } catch (err) {
                setStatus((err as Error).message);
              } finally {
                setBusy(false);
                e.target.value = "";
              }
            }}
          />
        </label>
        <span role="status" className="text-sm">{status}</span>
      </div>
      {url && (
        // eslint-disable-next-line @next/next/no-img-element -- admin-only preview of an arbitrary URL
        <img src={url} alt="" className="mt-3 h-36 w-auto rounded border border-ink/30 object-cover" />
      )}
    </div>
  );
}

export function GalleryField({ name, folder, defaultValue = "" }: { name: string; folder: string; defaultValue?: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div>
      <label htmlFor={`f-${name}`} className="label">Gallery images</label>
      <textarea id={`f-${name}`} ref={ref} name={name} className="input font-mono !text-sm" rows={5} defaultValue={defaultValue} aria-describedby={`f-${name}-hint`} />
      <p id={`f-${name}-hint`} className="hint">One image per line: the image address, then “|”, then a short description for screen readers.</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <label className="btn btn-outline btn-sm cursor-pointer">
          {busy ? "Uploading…" : "Upload images"}
          <input
            type="file"
            multiple
            accept={TYPES.join(",")}
            className="sr-only"
            disabled={busy}
            onChange={async (e) => {
              const files = Array.from(e.target.files ?? []);
              if (!files.length || !ref.current) return;
              setBusy(true);
              setStatus("");
              try {
                for (const file of files) {
                  const url = await upload(file, folder);
                  const current = ref.current.value.trimEnd();
                  ref.current.value = `${current}${current ? "\n" : ""}${url} | `;
                }
                setStatus("Uploaded. Add a description after each “|”, then save.");
              } catch (err) {
                setStatus((err as Error).message);
              } finally {
                setBusy(false);
                e.target.value = "";
              }
            }}
          />
        </label>
        <span role="status" className="text-sm">{status}</span>
      </div>
    </div>
  );
}
