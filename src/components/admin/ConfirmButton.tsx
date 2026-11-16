"use client";

/** Submit button for a destructive form action. Asks before proceeding. */
export function ConfirmButton({ label, confirm, className = "btn btn-outline btn-sm" }: { label: string; confirm: string; className?: string }) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(confirm)) e.preventDefault();
      }}
    >
      {label}
    </button>
  );
}
