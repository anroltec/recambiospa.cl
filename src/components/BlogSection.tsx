import Link from "next/link";
import { Calendar } from "lucide-react";
import { blogPosts } from "@/data/blog";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Badge from "@/components/ui/Badge";

export default function BlogSection() {
  return (
    <section className="py-14 bg-light">
      <Container>
        <SectionHeader title="Nuestro Blog" linkHref="/blog" linkLabel="Ver más" />
        <div className="grid md:grid-cols-3 gap-4">
          {blogPosts.map((post) => (
            <article
              key={post.title}
              className="bg-white overflow-hidden hover:shadow-md transition-all group"
            >
              <div className="h-44 bg-gradient-to-br from-primary-dark/10 to-primary/5 flex items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-300">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="m21 15-5-5L5 21" />
                </svg>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Badge label={post.category} />
                  <span className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Calendar size={10} />
                    {post.date}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-dark group-hover:text-primary transition-colors mb-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
                <Link
                  href={post.href}
                  className="inline-block mt-3 text-xs text-primary font-bold uppercase tracking-wider hover:text-primary-dark"
                >
                  Leer más →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
