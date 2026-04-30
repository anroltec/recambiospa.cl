import type { Product } from "@/types/product";

export interface CartLineItem {
  lineId: string;
  quantity: number;
  product: Product;
}

export interface CartApiResponse {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  totalPrice: number;
  currencyCode: string | null;
  items: CartLineItem[];
}
