"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CartApiResponse, CartLineItem } from "@/types/cart";
import type { Product } from "@/types/product";
import {
  getCartAddQuantity,
  normalizeCartLineQuantity,
} from "@/lib/minimumPurchase";

interface CartContextValue {
  items: CartLineItem[];
  totalQuantity: number;
  totalPrice: number;
  checkoutUrl: string | null;
  isLoading: boolean;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (code: string) => Promise<void>;
  updateQuantity: (code: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (code: string) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

const SHOPIFY_CART_KEY = "recambiospa_shopify_cart_id";
const LOCAL_CART_KEY = "recambiospa_cart";

const EMPTY_REMOTE_CART: CartApiResponse = {
  id: "",
  checkoutUrl: "",
  totalQuantity: 0,
  totalPrice: 0,
  currencyCode: null,
  items: [],
};

function getStoredValue(key: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

function setStoredValue(key: string, value: string | null) {
  if (typeof window === "undefined") return;

  if (value === null) {
    window.localStorage.removeItem(key);
    return;
  }

  window.localStorage.setItem(key, value);
}

function loadLocalItems(): CartLineItem[] {
  try {
    const raw = getStoredValue(LOCAL_CART_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as
      | CartLineItem[]
      | Array<{ quantity: number; product: Product; lineId?: string }>;

    return parsed.map((item) => ({
      lineId: item.lineId || item.product.code,
      quantity: item.quantity,
      product: item.product,
    }));
  } catch {
    return [];
  }
}

function saveLocalItems(items: CartLineItem[]) {
  setStoredValue(LOCAL_CART_KEY, items.length > 0 ? JSON.stringify(items) : null);
}

function upsertLocalItem(items: CartLineItem[], product: Product, quantity: number): CartLineItem[] {
  const existing = items.find((item) => item.product.code === product.code);
  const addQuantity = getCartAddQuantity(product, quantity, Boolean(existing));

  if (!existing) {
    return [...items, { lineId: product.code, product, quantity: addQuantity }];
  }

  return items.map((item) =>
    item.product.code === product.code
      ? { ...item, quantity: item.quantity + addQuantity }
      : item
  );
}

function getExistingCartLine(items: CartLineItem[], product: Product): CartLineItem | null {
  return items.find((item) => item.product.code === product.code) ?? null;
}

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

async function fetchExistingCart(cartId: string): Promise<CartApiResponse | null> {
  const response = await fetch(`/api/shopify/cart?cartId=${encodeURIComponent(cartId)}`, {
    method: "GET",
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const payload = await readJson<{ error?: string }>(response);
    throw new Error(payload.error || "Unable to load Shopify cart.");
  }

  const payload = await readJson<{ cart: CartApiResponse }>(response);
  return payload.cart;
}

async function createRemoteCart(): Promise<CartApiResponse> {
  const response = await fetch("/api/shopify/cart", {
    method: "POST",
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await readJson<{ error?: string }>(response);
    throw new Error(payload.error || "Unable to create Shopify cart.");
  }

  const payload = await readJson<{ cart: CartApiResponse }>(response);
  return payload.cart;
}

async function addRemoteLine(
  cartId: string,
  variantId: string,
  quantity: number
): Promise<CartApiResponse> {
  const response = await fetch("/api/shopify/cart/lines", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cartId, variantId, quantity }),
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await readJson<{ error?: string }>(response);
    throw new Error(payload.error || "Unable to add product to Shopify cart.");
  }

  const payload = await readJson<{ cart: CartApiResponse }>(response);
  return payload.cart;
}

async function updateRemoteLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<CartApiResponse> {
  const response = await fetch("/api/shopify/cart/lines", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cartId, lineId, quantity }),
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await readJson<{ error?: string }>(response);
    throw new Error(payload.error || "Unable to update Shopify cart line.");
  }

  const payload = await readJson<{ cart: CartApiResponse }>(response);
  return payload.cart;
}

async function removeRemoteLine(cartId: string, lineId: string): Promise<CartApiResponse> {
  const response = await fetch("/api/shopify/cart/lines", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cartId, lineId }),
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await readJson<{ error?: string }>(response);
    throw new Error(payload.error || "Unable to remove Shopify cart line.");
  }

  const payload = await readJson<{ cart: CartApiResponse }>(response);
  return payload.cart;
}

export function CartProvider({
  children,
  shopifyEnabled = true,
}: {
  children: ReactNode;
  shopifyEnabled?: boolean;
}) {
  const [remoteCart, setRemoteCart] = useState<CartApiResponse>(EMPTY_REMOTE_CART);
  const [localItems, setLocalItems] = useState<CartLineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [remoteUnavailable, setRemoteUnavailable] = useState(false);
  const [hasRemoteCart, setHasRemoteCart] = useState(false);
  const cartIdRef = useRef<string | null>(null);
  const mutationQueueRef = useRef<Promise<unknown>>(Promise.resolve());

  const syncRemoteCart = useCallback((nextCart: CartApiResponse | null) => {
    const normalizedCart = nextCart ?? EMPTY_REMOTE_CART;
    const nextCartId = normalizedCart.id || null;
    cartIdRef.current = nextCartId;
    setStoredValue(SHOPIFY_CART_KEY, nextCartId);
    startTransition(() => {
      setRemoteCart(normalizedCart);
      setHasRemoteCart(Boolean(nextCartId));
    });
  }, []);

  const replaceLocalCart = useCallback((items: CartLineItem[]) => {
    startTransition(() => {
      setLocalItems(items);
    });
  }, []);

  const syncLocalCart = useCallback((items: CartLineItem[]) => {
    saveLocalItems(items);
    replaceLocalCart(items);
  }, [replaceLocalCart]);

  const hydrateLocalCart = useCallback(() => {
    const items = loadLocalItems();
    replaceLocalCart(items);
    return items;
  }, [replaceLocalCart]);

  const runMutation = useCallback(function runMutation<T>(
    operation: () => Promise<T>
  ): Promise<T> {
    const queuedOperation = mutationQueueRef.current.then(operation, operation);
    mutationQueueRef.current = queuedOperation.then(
      () => undefined,
      () => undefined
    );
    return queuedOperation;
  }, []);

  const ensureRemoteCart = useCallback(async (): Promise<string> => {
    if (cartIdRef.current) {
      return cartIdRef.current;
    }

    const createdCart = await createRemoteCart();
    syncRemoteCart(createdCart);
    return createdCart.id;
  }, [syncRemoteCart]);

  useEffect(() => {
    let cancelled = false;

    if (!shopifyEnabled) {
      queueMicrotask(() => {
        if (!cancelled) {
          hydrateLocalCart();
          setIsLoading(false);
        }
      });

      const handleStorage = (event: StorageEvent) => {
        if (event.key === LOCAL_CART_KEY) {
          hydrateLocalCart();
        }
      };

      window.addEventListener("storage", handleStorage);

      return () => {
        cancelled = true;
        window.removeEventListener("storage", handleStorage);
      };
    }

    async function hydrateRemoteCart() {
      hydrateLocalCart();
      const storedCartId = getStoredValue(SHOPIFY_CART_KEY);

      if (!storedCartId) {
        if (!cancelled) {
          setHasRemoteCart(false);
          setIsLoading(false);
        }
        return;
      }

      cartIdRef.current = storedCartId;
      setHasRemoteCart(true);

      try {
        const cart = await fetchExistingCart(storedCartId);

        if (!cancelled) {
          setRemoteUnavailable(false);
          syncRemoteCart(cart);
        }
      } catch (error) {
        if (!cancelled) {
          console.warn(
            "[cart] failed to hydrate Shopify cart",
            error instanceof Error ? error.message : error
          );
          setRemoteUnavailable(true);
          syncRemoteCart(null);
          hydrateLocalCart();
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void hydrateRemoteCart();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === LOCAL_CART_KEY) {
        hydrateLocalCart();
        return;
      }

      if (event.key !== SHOPIFY_CART_KEY) return;

      const nextCartId = event.newValue;
      cartIdRef.current = nextCartId;

      if (!nextCartId) {
        syncRemoteCart(null);
        return;
      }

      setHasRemoteCart(true);

      void fetchExistingCart(nextCartId)
        .then((cart) => {
          setRemoteUnavailable(false);
          syncRemoteCart(cart);
        })
        .catch((error) => {
          console.warn(
            "[cart] failed to sync Shopify cart from storage",
            error instanceof Error ? error.message : error
          );
          setRemoteUnavailable(true);
          syncRemoteCart(null);
          hydrateLocalCart();
        });
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      cancelled = true;
      window.removeEventListener("storage", handleStorage);
    };
  }, [hydrateLocalCart, shopifyEnabled, syncRemoteCart]);

  const canUseRemoteCart = shopifyEnabled && !remoteUnavailable;
  const useRemoteSnapshot = canUseRemoteCart && hasRemoteCart;
  const shouldPreferLocalCart = !hasRemoteCart && localItems.length > 0;

  const addItem = useCallback(
    async (product: Product, quantity = 1) => {
      if (!shopifyEnabled || !product.variantId || !canUseRemoteCart || shouldPreferLocalCart) {
        return runMutation(async () => {
          syncLocalCart(upsertLocalItem(loadLocalItems(), product, quantity));
        });
      }

      return runMutation(async () => {
        const existingCartId = cartIdRef.current;
        const line = getExistingCartLine(remoteCart.items, product);
        const addQuantity = getCartAddQuantity(product, quantity, Boolean(line));

        try {
          try {
            const cartId = await ensureRemoteCart();
            const updatedCart = await addRemoteLine(cartId, product.variantId!, addQuantity);
            syncRemoteCart(updatedCart);
            return;
          } catch (error) {
            if (!existingCartId) {
              throw error;
            }

            cartIdRef.current = null;
            setStoredValue(SHOPIFY_CART_KEY, null);

            const cartId = await ensureRemoteCart();
            const updatedCart = await addRemoteLine(cartId, product.variantId!, addQuantity);
            syncRemoteCart(updatedCart);

            if (error instanceof Error) {
              console.warn("[cart] recreated Shopify cart after add failure", error.message);
            }
          }
        } catch (error) {
          console.warn(
            "[cart] falling back to local cart after Shopify add failure",
            error instanceof Error ? error.message : error
          );
          setRemoteUnavailable(true);
          syncRemoteCart(null);
          syncLocalCart(upsertLocalItem(loadLocalItems(), product, addQuantity));
        }
      });
    },
    [
      ensureRemoteCart,
      remoteCart.items,
      runMutation,
      shopifyEnabled,
      syncLocalCart,
      syncRemoteCart,
      canUseRemoteCart,
      shouldPreferLocalCart,
    ]
  );

  const removeItem = useCallback(
    async (code: string) => {
      if (!shopifyEnabled || !useRemoteSnapshot) {
        return runMutation(async () => {
          syncLocalCart(loadLocalItems().filter((item) => item.product.code !== code));
        });
      }

      return runMutation(async () => {
        const cartId = cartIdRef.current;
        const line = remoteCart.items.find((item) => item.product.code === code);

        if (!cartId || !line) {
          return;
        }

        const updatedCart = await removeRemoteLine(cartId, line.lineId);
        syncRemoteCart(updatedCart);
      });
    },
    [
      remoteCart.items,
      runMutation,
      shopifyEnabled,
      syncLocalCart,
      syncRemoteCart,
      useRemoteSnapshot,
    ]
  );

  const updateQuantity = useCallback(
    async (code: string, quantity: number) => {
      if (!shopifyEnabled || !useRemoteSnapshot) {
        return runMutation(async () => {
          const currentItems = loadLocalItems();

          if (quantity <= 0) {
            syncLocalCart(currentItems.filter((item) => item.product.code !== code));
            return;
          }

          syncLocalCart(
            currentItems.map((item) =>
              item.product.code === code
                ? { ...item, quantity: normalizeCartLineQuantity(item.product, quantity) }
                : item
            )
          );
        });
      }

      return runMutation(async () => {
        const cartId = cartIdRef.current;
        const line = remoteCart.items.find((item) => item.product.code === code);

        if (!cartId || !line) {
          return;
        }

        if (quantity <= 0) {
          const updatedCart = await removeRemoteLine(cartId, line.lineId);
          syncRemoteCart(updatedCart);
          return;
        }

        const updatedCart = await updateRemoteLine(
          cartId,
          line.lineId,
          normalizeCartLineQuantity(line.product, quantity)
        );
        syncRemoteCart(updatedCart);
      });
    },
    [
      remoteCart.items,
      runMutation,
      shopifyEnabled,
      syncLocalCart,
      syncRemoteCart,
      useRemoteSnapshot,
    ]
  );

  const clearCart = useCallback(async () => {
    if (!shopifyEnabled || !useRemoteSnapshot) {
      return runMutation(async () => {
        syncLocalCart([]);
      });
    }

    return runMutation(async () => {
      syncRemoteCart(null);
    });
  }, [runMutation, shopifyEnabled, syncLocalCart, syncRemoteCart, useRemoteSnapshot]);

  const activeItems = useRemoteSnapshot ? remoteCart.items : localItems;
  const totalQuantity = activeItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = activeItems.reduce(
    (sum, item) => sum + (item.product.price ?? 0) * item.quantity,
    0
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items: activeItems,
      totalQuantity,
      totalPrice,
      checkoutUrl: useRemoteSnapshot ? remoteCart.checkoutUrl || null : null,
      isLoading,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isInCart: (code: string) => activeItems.some((item) => item.product.code === code),
    }),
    [
      activeItems,
      addItem,
      clearCart,
      isLoading,
      remoteCart.checkoutUrl,
      removeItem,
      totalPrice,
      totalQuantity,
      useRemoteSnapshot,
      updateQuantity,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
