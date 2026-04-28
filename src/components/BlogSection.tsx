import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { blogPosts } from "@/data/blog";

const CATEGORY_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  Guías:        { bg: "bg-blue-500/15",   text: "text-blue-400",   dot: "bg-blue-400"   },
  Normativa:    { bg: "bg-amber-500/15",  text: "text-amber-400",  dot: "bg-amber-400"  },
  Mantenimiento:{ bg: "bg-green-500/15",  text: "text-green-400",  dot: "bg-green-400"  },
  default:      { bg: "bg-primary/15",    text: "text-primary",    dot: "bg-primary"     },
};

const POST_GRADIENTS = [
  "from-blue-900/60 to-primary-dark",
  "from-amber-900/50 to-primary-dark",
  "from-emerald-900/50 to-primary-dark",
];

export default function BlogSection() {
  return (
    <section className="bg-light py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={14} className="text-primary" />
              <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
                Recursos técnicos
              </p>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-dark uppercase tracking-tight leading-tight">
              Guías y normativas<br />
              <span className="text-primary">para su operación</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-dark uppercase tracking-wider hover:text-primary transition-colors border-b border-gray-300 hover:border-primary pb-1 self-end md:self-auto whitespace-nowrap"
          >
            Ver todos los artículos <ArrowRight size={13} />
          </Link>
        </div>

        {/* Posts grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {blogPosts.map((post, i) => {
            const style = CATEGORY_STYLES[post.category] ?? CATEGORY_STYLES.default;
            const gradient = POST_GRADIENTS[i % POST_GRADIENTS.length];

            return (
              <article key={post.title} className="group bg-white border border-gray-200 hover:border-primary hover:shadow-lg transition-all overflow-hidden flex flex-col">

                {/* Thumbnail */}
                <Link href={post.href} className={`block h-48 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
                  {/* Grid pattern overlay */}
                  <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage:
                        "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
                      backgroundSize: "30px 30px",
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen size={36} className="text-white/10" strokeWidth={1} />
                  </div>
                  {/* Category pill */}
                  <div className="absolute bottom-4 left-4">
                    <span className={`inline-flex items-center gap-1.5 ${style.bg} ${style.text} text-[9px] font-bold uppercase tracking-wider px-2.5 py-1.5`}>
                      <span className={`w-1 h-1 rounded-full ${style.dot}`} />
                      {post.category}
                    </span>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Clock size={9} />
                      {post.date}
                    </span>
                    <span className="text-gray-200">·</span>
                    <span className="text-[10px] text-gray-400">5 min lectura</span>
                  </div>
                  <h3 className="font-bold text-sm text-dark group-hover:text-primary transition-colors mb-2 leading-snug flex-1">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <Link
                    href={post.href}
                    className="inline-flex items-center gap-1.5 text-xs text-primary font-bold uppercase tracking-wider hover:gap-2.5 transition-all"
                  >
                    Leer artículo <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
