import Image from "next/image";
import Link from "next/link";
import { getCatalogData, getProductUrl, isCatalogConnectionError } from "@/lib/catalog";
import type { Product } from "@/types/product";

const FEATURED_PRODUCTS_LIMIT = 8;
const PRODUCT_PLACEHOLDER = "/products/placeholder.svg";

function formatCLP(price: number | null) {
  if (price === null) {
    return "Consultar";
  }

  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(price);
}

function getProductRank(product: Product): number {
  let rank = 0;

  if (product.inStock) {
    rank += 4;
  }

  if (product.price !== null) {
    rank += 2;
  }

  if (product.images[0] && product.images[0] !== PRODUCT_PLACEHOLDER) {
    rank += 1;
  }

  if (product.description.trim()) {
    rank += 1;
  }

  return rank;
}

function pickFeaturedProducts(products: Product[]): Product[] {
  return [...products]
    .sort((left, right) => {
      const rankDifference = getProductRank(right) - getProductRank(left);

      if (rankDifference !== 0) {
        return rankDifference;
      }

      return left.name.localeCompare(right.name, "es-CL");
    })
    .slice(0, FEATURED_PRODUCTS_LIMIT);
}

async function loadFeaturedProducts(): Promise<Product[]> {
  try {
    const { products } = await getCatalogData();
    return pickFeaturedProducts(products);
  } catch (error) {
    if (isCatalogConnectionError(error)) {
      return [];
    }

    throw error;
  }
}

export default async function FeaturedProducts() {
  const products = await loadFeaturedProducts();

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-light py-14">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold uppercase tracking-wide text-dark">
            Productos Destacados
          </h2>
          <Link
            href="/collections"
            className="text-sm font-bold uppercase tracking-wider text-primary transition-colors hover:text-primary-dark"
          >
            Ver catalogo
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => {
            const primaryImage = product.images[0] ?? PRODUCT_PLACEHOLDER;

            return (
              <Link
                key={product.code}
                href={getProductUrl(product)}
                className="group overflow-hidden bg-white transition-all hover:shadow-md"
              >
                <div className="relative flex aspect-square items-center justify-center border-b border-gray-100 bg-white p-4">
                  <Image
                    src={primaryImage}
                    alt={product.name}
                    fill
                    className="object-contain p-3"
                  />
                </div>
                <div className="p-4">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">
                    {product.brand}
                  </p>
                  <h3 className="min-h-[32px] text-xs font-bold leading-snug text-dark transition-colors group-hover:text-primary line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-xs text-steel">SKU: {product.code}</p>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-base font-bold text-dark">
                      {formatCLP(product.price)}
                    </span>
                    {product.price !== null ? (
                      <span className="text-xs text-steel">+ IVA</span>
                    ) : null}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
