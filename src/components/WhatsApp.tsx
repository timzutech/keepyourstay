import { whatsappLink } from "@/lib/site";

export function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.6-1.2A9 9 0 1 0 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 8.5c-.4 2.9 3.600 6.900 6.500 6.500" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function WhatsAppLink({
  number,
  message,
  className = "btn btn-outline",
  children = "Message us on WhatsApp",
}: {
  number: string;
  message?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <a href={whatsappLink(number, message)} target="_blank" rel="noopener noreferrer" className={className}>
      <WhatsAppIcon />
      <span>{children}</span>
      <span className="sr-only"> (opens WhatsApp in a new tab)</span>
    </a>
  );
}
