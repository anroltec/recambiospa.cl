import Link from "next/link";
import Image from "next/image";

interface Product {
  name: string;
  price: number;
  sku: string;
  brand: string;
  image?: string;
}

// Products with most rotation (from PRODUCTOS ROTATIVOS sheet)
const products: Product[] = [
  { name: "Foco LED Posición/Freno 125mm Luz Roja Braslux", price: 15900, sku: "04-01-06-014-1105", brand: "BRASLUX", image: "/products/braslux-lateral-rojo.jpg" },
  { name: "Foco LED 125mm Trasero Duo Ámbar/Rojo Braslux", price: 15770, sku: "99-01-06-014-77", brand: "BRASLUX", image: "/products/braslux-lateral-ambar.jpg" },
  { name: "Foco LED Trasero 125mm Retroceso Transparente Braslux", price: 16970, sku: "99-01-06-014-78", brand: "BRASLUX", image: "/products/braslux-lateral-ambar.jpg" },
  { name: "Foco LED Lateral Reflector Ovalado Braslux", price: 12690, sku: "04-01-02-014-71", brand: "BRASLUX", image: "/products/braslux-lateral-rojo.jpg" },
  { name: "Trabador Perno 243 50ml Loctite", price: 24900, sku: "00-05-51-056-482", brand: "LOCTITE", image: "/products/loctite-243.jpg" },
  { name: "Adhesivo Instantáneo 495 20grs Loctite", price: 10090, sku: "00-05-51-056-466", brand: "LOCTITE", image: "/products/loctite-495.jpg" },
  { name: "Sellador Carrocería 9360 290ml Teroson", price: 7490, sku: "00-05-51-056-467", brand: "TEROSON", image: "/products/sellador-roscas-569.jpg" },
  { name: "Lubricante Multiuso 8608 Super Lub 300ml Loctite", price: 3490, sku: "00-05-51-056-471", brand: "LOCTITE", image: "/products/loctite-8608.jpg" },
];

function formatCLP(price: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(price);
}

export default function FeaturedProducts() {
  return (
    <section className="py-14 bg-light">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-dark uppercase tracking-wide">
            Productos Más Vendidos
          </h2>
          <Link
            href="/collections"
            className="text-primary hover:text-primary-dark text-sm font-bold uppercase tracking-wider transition-colors"
          >
            Ver todo →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link
              key={product.sku}
              href={`/producto/${product.sku}`}
              className="group bg-white overflow-hidden hover:shadow-md transition-all"
            >
              <div className="relative aspect-square bg-white flex items-center justify-center border-b border-gray-100 p-4">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-3"
                  />
                ) : (
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-steel/50">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">
                  {product.brand}
                </p>
                <h3 className="text-xs font-bold text-dark leading-snug line-clamp-2 group-hover:text-primary transition-colors min-h-[32px]">
                  {product.name}
                </h3>
                <p className="text-xs text-steel mt-1">SKU: {product.sku}</p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-base font-bold text-dark">
                    {formatCLP(product.price)}
                  </span>
                  <span className="text-xs text-steel">+ IVA</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
