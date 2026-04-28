import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  linkHref?: string;
  linkLabel?: string;
}

export default function SectionHeader({ title, linkHref, linkLabel }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-2xl font-bold text-dark uppercase tracking-wide">{title}</h2>
      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className="text-primary hover:text-primary-dark text-sm font-bold uppercase tracking-wider transition-colors"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
