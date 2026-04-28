import type { ReactNode } from "react";
import { Fragment } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  breadcrumbs: BreadcrumbItem[];
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  heroClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export default function PageHero({
  breadcrumbs,
  eyebrow,
  title,
  description,
  actions,
  heroClassName = "",
  contentClassName = "",
  titleClassName = "",
  descriptionClassName = "",
}: PageHeroProps) {
  return (
    <>
      <div className="bg-white border-b border-gray-200">
        <Container className="py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-400">
            {breadcrumbs.map((item, index) => (
              <Fragment key={`${item.label}-${index}`}>
                {index > 0 && <ChevronRight size={12} />}
                {item.href ? (
                  <Link href={item.href} className="hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-dark font-medium">{item.label}</span>
                )}
              </Fragment>
            ))}
          </nav>
        </Container>
      </div>

      <section className={`bg-primary-dark text-white py-12 ${heroClassName}`.trim()}>
        <Container className={contentClassName}>
          <div
            className={
              actions
                ? "flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
                : undefined
            }
          >
            <div>
              {eyebrow ? (
                <div className="inline-flex items-center gap-1.5 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                  {eyebrow}
                </div>
              ) : null}
              <h1
                className={`text-3xl lg:text-4xl font-black uppercase tracking-tight leading-tight ${titleClassName}`.trim()}
              >
                {title}
              </h1>
              {description ? (
                <p
                  className={`mt-3 max-w-2xl text-sm text-white/70 leading-relaxed ${descriptionClassName}`.trim()}
                >
                  {description}
                </p>
              ) : null}
            </div>

            {actions ? <div className="w-full lg:w-80 flex-shrink-0">{actions}</div> : null}
          </div>
        </Container>
      </section>
    </>
  );
}
