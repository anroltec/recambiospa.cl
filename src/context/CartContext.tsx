"use client";

import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (code: string) => void;
  updateQuantity: (code: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (code: string) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "recambiospa_cart";
const EMPTY_CART: CartItem[] = [];
const EMPTY_CART_RAW = "[]";

const cartListeners = new Set<() => void>();
let cartSnapshot: CartItem[] = EMPTY_CART;
let cartSnapshotRaw = EMPTY_CART_RAW;
let cartSnapshotInitialized = false;

function loadFromStorage(): CartItem[] {
  if (typeof window === "undefined") return EMPTY_CART;
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? EMPTY_CART_RAW;

    if (!cartSnapshotInitialized || raw !== cartSnapshotRaw) {
      cartSnapshot = raw === EMPTY_CART_RAW ? EMPTY_CART : (JSON.parse(raw) as CartItem[]);
      cartSnapshotRaw = raw;
      cartSnapshotInitialized = true;
    }

    return cartSnapshot;
  } catch {
    cartSnapshot = EMPTY_CART;
    cartSnapshotRaw = EMPTY_CART_RAW;
    cartSnapshotInitialized = true;
    return cartSnapshot;
  }
}

function saveToStorage(items: CartItem[]) {
  const normalizedItems = items.length === 0 ? EMPTY_CART : items;
  cartSnapshot = normalizedItems;
  cartSnapshotRaw = JSON.stringify(normalizedItems);
  cartSnapshotInitialized = true;

  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, cartSnapshotRaw);
  } catch {
    // storage unavailable
  }
}

function emitCartChange() {
  cartListeners.forEach((listener) => listener());
}

function subscribeToCart(listener: () => void) {
  cartListeners.add(listener);

  if (typeof window === "undefined") {
    return () => {
      cartListeners.delete(listener);
    };
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      listener();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    cartListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function getCartSnapshot() {
  return loadFromStorage();
}

function getCartServerSnapshot() {
  return EMPTY_CART;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getCartServerSnapshot
  );

  const updateItems = useCallback(
    (updater: CartItem[] | ((items: CartItem[]) => CartItem[])) => {
      const nextItems =
        typeof updater === "function" ? updater(loadFromStorage()) : updater;
      saveToStorage(nextItems);
      emitCartChange();
    },
    []
  );

  const addItem = useCallback((product: Product, quantity = 1) => {
    updateItems((prev) => {
      const existing = prev.find((i) => i.product.code === product.code);
      if (existing) {
        return prev.map((i) =>
          i.product.code === product.code
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, quantity }];
    });
  }, [updateItems]);

  const removeItem = useCallback((code: string) => {
    updateItems((prev) => prev.filter((i) => i.product.code !== code));
  }, [updateItems]);

  const updateQuantity = useCallback((code: string, quantity: number) => {
    if (quantity <= 0) {
      updateItems((prev) => prev.filter((i) => i.product.code !== code));
    } else {
      updateItems((prev) =>
        prev.map((i) => (i.product.code === code ? { ...i, quantity } : i))
      );
    }
  }, [updateItems]);

  const clearCart = useCallback(() => updateItems([]), [updateItems]);

  const isInCart = useCallback(
    (code: string) => items.some((i) => i.product.code === code),
    [items]
  );

  const totalQuantity = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = items.reduce(
    (acc, i) => acc + (i.product.price ?? 0) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalQuantity,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
