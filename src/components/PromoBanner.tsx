import { features } from "@/data/features";
import Container from "@/components/ui/Container";

export default function PromoBanner() {
  return (
    <section className="bg-primary-dark border-y border-white/10">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            const isLast = i === features.length - 1;
            return (
              <div
                key={f.title}
                className={`flex items-center gap-4 py-7 px-6 ${!isLast ? "border-r border-white/10" : ""}`}
              >
                <div className="w-10 h-10 bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={19} className="text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm leading-snug">{f.title}</h3>
                  <p className="text-[11px] text-white/40 mt-0.5">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
