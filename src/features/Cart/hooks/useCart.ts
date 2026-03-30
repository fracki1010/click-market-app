import type { RootState } from "../../../store/store";
import type { IProduct } from "../../Products/types/Product";
import type { ICartItem } from "../types/Cart";

import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { cartStart, cartSuccess, cartFailure } from "../redux/cartSlice";
// Importamos tu API existente
import {
  getCart as getCartApi,
  addItemToCart as addItemApi,
  updateItemQuantity as updateItemApi,
  removeItemFromCart as removeItemApi,
} from "../services/apiCart";

// Clave para localStorage
const GUEST_CART_KEY = "educart_guest_cart";
const CART_SYNC_DEBOUNCE_MS = 300;

export function useCart() {
  const dispatch = useDispatch();

  const { user, token } = useSelector((state: RootState) => state.auth);
  const { items, total, loading, error, cartId } = useSelector(
    (state: RootState) => state.cart,
  );
  const itemsRef = useRef(items);
  const pendingQuantitySyncRef = useRef<Record<string, number>>({});
  const quantitySyncTimersRef = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const calculateTotal = (cartItems: ICartItem[]) =>
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const applyCartState = useCallback(
    (cartItems: ICartItem[], nextCartId?: string) => {
      dispatch(
        cartSuccess({
          items: cartItems,
          total: calculateTotal(cartItems),
          id: nextCartId ?? cartId ?? "0",
          userId: user ? String(user.id) : "0",
        }),
      );
    },
    [dispatch, cartId, user],
  );

  const clearScheduledQuantitySync = useCallback((productId: string) => {
    const activeTimer = quantitySyncTimersRef.current[productId];

    if (activeTimer) {
      clearTimeout(activeTimer);
      delete quantitySyncTimersRef.current[productId];
    }
  }, []);

  const fetchCart = useCallback(async () => {
    dispatch(cartStart());

    // MODO INVITADO (Leer de LocalStorage)
    if (!user || !token) {
      const storedCart = localStorage.getItem(GUEST_CART_KEY);
      let guestItems: ICartItem[] = storedCart ? JSON.parse(storedCart) : [];

      // Sanitize guest items
      guestItems = guestItems.map((item) => ({
        ...item,
        productId: String(item.productId || `guest-${Math.random()}`),
      }));

      const guestTotal = guestItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );

      dispatch(
        cartSuccess({
          items: guestItems,
          total: guestTotal,
          id: "0",
          userId: "0",
        }),
      );

      return;
    }

    // MODO CLIENTE (API)
    try {
      // Antes de pedir el carrito a la API, revisamos si hay algo "pendiente" en local
      const localCartJson = localStorage.getItem(GUEST_CART_KEY);

      if (localCartJson) {
        const localItems: ICartItem[] = JSON.parse(localCartJson);

        if (localItems.length > 0) {
          // Subimos cada item local al backend
          // Usamos Promise.all para hacerlo en paralelo (más rápido)
          await Promise.all(
            localItems.map((item) =>
              addItemApi(item.productId, item.quantity).catch((err) =>
                console.error(`Error sincronizando item ${item.name}:`, err),
              ),
            ),
          );
        }

        //  Borramos el carrito local para no duplicar en el futuro
        localStorage.removeItem(GUEST_CART_KEY);
      }

      const data = await getCartApi();

      // Mapeo de respuesta API a estructura Redux
      const mappedItems = data.items.map((i: any) => {
        const productId = String(
          i.product?.id ||
            i.product?._id ||
            i.product_id ||
            i.id ||
            i._id ||
            `temp-${Math.random()}`,
        );

        return {
          cartId: data.id,
          productId,
          name: i.product?.name || "Producto sin nombre",
          quantity: i.quantity,
          price: i.product?.price || 0,
          image_url:
            i.product?.imageUrl ||
            i.product?.image_url ||
            "https://placehold.co/100",
        };
      });

      const serverTotal = mappedItems.reduce(
        (acc: number, item: any) => acc + item.price * item.quantity,
        0,
      );

      dispatch(
        cartSuccess({
          items: mappedItems,
          total: serverTotal,
          id: data.id,
          userId: String(user.id),
        }),
      );
    } catch (err) {
      console.error("Error loading server cart:", err);
      dispatch(cartFailure("Error al cargar el carrito del servidor"));
    }
  }, [user, token, dispatch]);

  const scheduleQuantitySync = useCallback(
    (productId: string, quantity: number) => {
      pendingQuantitySyncRef.current[productId] = quantity;
      clearScheduledQuantitySync(productId);

      quantitySyncTimersRef.current[productId] = setTimeout(async () => {
        const nextQuantity = pendingQuantitySyncRef.current[productId];

        delete pendingQuantitySyncRef.current[productId];
        delete quantitySyncTimersRef.current[productId];

        if (typeof nextQuantity !== "number") return;

        try {
          await updateItemApi(productId, nextQuantity);
        } catch (err) {
          await fetchCart();
          dispatch(cartFailure("Error al actualizar cantidad"));
        }
      }, CART_SYNC_DEBOUNCE_MS);
    },
    [clearScheduledQuantitySync, fetchCart, dispatch],
  );

  // Helper para guardar en localStorage (Solo Invitados)
  const saveLocalCart = (newItems: ICartItem[]) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newItems));
    applyCartState(newItems, "0");
  };

  // AGREGAR ITEM
  const addItem = async (product: IProduct, quantity: number = 1) => {
    // MODO INVITADO
    if (!user) {
      const currentItems = itemsRef.current;
      const existingItem = currentItems.find((i) => i.productId === product.id);
      let newItems = [...currentItems];

      if (existingItem) {
        // Si ya existe, sumamos cantidad
        newItems = newItems.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      } else {
        // Si es nuevo, lo creamos
        const newItem: ICartItem = {
          cartId: "0",
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image_url: product.imageUrl || "", // Asegurar que exista imagen
        };

        newItems.push(newItem);
      }
      saveLocalCart(newItems);

      return;
    }

    // MODO CLIENTE (API)
    try {
      const currentItems = itemsRef.current;
      const existingItem = currentItems.find((i) => i.productId === product.id);
      let optimisticItems = [...currentItems];

      if (existingItem) {
        optimisticItems = optimisticItems.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      } else {
        optimisticItems.push({
          cartId: cartId || "0",
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          image_url: product.imageUrl || "",
        });
      }

      applyCartState(optimisticItems);
      await addItemApi(product.id, quantity);
    } catch (err) {
      await fetchCart();
      dispatch(cartFailure("Error al agregar producto"));
    }
  };

  const updateItem = async (productId: string, quantity: number) => {
    // MODO INVITADO
    if (!user) {
      const newItems = itemsRef.current.map((i) => {
        if (i.productId === productId) {
          return { ...i, quantity: quantity };
        }

        return i;
      });

      saveLocalCart(newItems);

      return;
    }

    // MODO CLIENTE
    try {
      const currentItems = itemsRef.current;
      const optimisticItems = currentItems.map((i) =>
        i.productId === productId ? { ...i, quantity } : i,
      );

      applyCartState(optimisticItems);
      scheduleQuantitySync(productId, quantity);
    } catch (err) {
      await fetchCart();
      dispatch(cartFailure("Error al actualizar cantidad"));
    }
  };

  const removeItem = async (productId: string) => {
    // MODO INVITADO
    if (!user) {
      const newItems = itemsRef.current.filter((i) => i.productId !== productId);

      saveLocalCart(newItems);

      return;
    }

    // MODO CLIENTE
    try {
      clearScheduledQuantitySync(productId);
      delete pendingQuantitySyncRef.current[productId];

      const currentItems = itemsRef.current;
      const optimisticItems = currentItems.filter(
        (i) => i.productId !== productId,
      );

      applyCartState(optimisticItems);
      await removeItemApi(productId); // O cartItem.id si fuera necesario
    } catch (err) {
      await fetchCart();
      dispatch(cartFailure("Error al eliminar producto"));
    }
  };

  useEffect(() => {
    return () => {
      Object.values(quantitySyncTimersRef.current).forEach((timer) => {
        clearTimeout(timer);
      });
      quantitySyncTimersRef.current = {};
      pendingQuantitySyncRef.current = {};
    };
  }, []);

  const emptyCart = async () => {
    dispatch(cartStart());

    // Si es invitado, solo borramos local
    if (!user) {
      localStorage.removeItem(GUEST_CART_KEY);
      dispatch(cartSuccess({ items: [], total: 0, id: "0", userId: "0" }));

      return;
    }

    // Si es cliente
    dispatch(cartSuccess({ items: [], total: 0, id: "0", userId: "0" }));
  };

  return {
    items,
    total,
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
    fetchCart,
    emptyCart,
  };
}
