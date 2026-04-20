import Link from "next/link";
import { Calendar } from "lucide-react";

const posts = [
  {
    title: "Cómo elegir la batería correcta para tu camión",
    date: "15 Abril 2026",
    excerpt: "Guía completa para seleccionar la batería adecuada según el tipo de vehículo y condiciones de uso.",
    category: "Guías",
  },
  {
    title: "Normativa de iluminación para vehículos pesados",
    date: "10 Abril 2026",
    excerpt: "Todo lo que necesitas saber sobre la normativa vigente de iluminación para camiones y buses en Chile.",
    category: "Normativa",
  },
  {
    title: "Mantenimiento preventivo: amarras de carga",
    date: "5 Abril 2026",
    excerpt: "Consejos para mantener tus amarras en óptimas condiciones y cumplir con los estándares de seguridad.",
    category: "Mantenimiento",
  },
];

export default function BlogSection() {
  return (
    <section className="py-14 bg-light">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-dark uppercase tracking-wide">
            Nuestro Blog
          </h2>
          <Link
            href="/blog"
            className="text-primary hover:text-primary-dark text-sm font-bold uppercase tracking-wider transition-colors"
          >
            Ver más →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {posts.map((post) => (
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
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 uppercase tracking-wider">
                    {post.category}
                  </span>
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
                  href="/blog"
                  className="inline-block mt-3 text-xs text-primary font-bold uppercase tracking-wider hover:text-primary-dark"
                >
                  Leer más →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
