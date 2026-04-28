import { features } from "@/data/features";
import Container from "@/components/ui/Container";

export default function PromoBanner() {
  return (
    <section className="bg-white border-b border-gray-100">
      <Container className="py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="flex items-center gap-3">
                <Icon size={28} className="text-primary flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <h3 className="font-bold text-dark text-sm">{f.title}</h3>
                  <p className="text-xs text-gray-400">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
