import { IOrder, IOrderItem } from "../types/Order";

export function toOrderItem(apiItem: any): IOrderItem {
  // Verificamos si product viene como objeto poblado o como un simple ID (string)
  const productId =
    typeof apiItem.product === "string"
      ? apiItem.product
      : apiItem.product?._id || "unknown";

  return {
    productId: productId,
    quantity: apiItem.quantity,
    price: apiItem.price,
    product: {
      id: productId,
      name: apiItem.name || "Producto sin nombre", // Leemos el snapshot del nombre
      imageUrl: apiItem.image || "https://placehold.co/150x150/000000/FFFFFF", // Fallback de imagen
    },
  };
}

export function toOrder(api: any): IOrder {
  const isUserObject = typeof api.user === "object" && api.user !== null;
  const userId = isUserObject ? api.user._id : api.user;
  const customerName = isUserObject ? api.user.name : "Cliente Desconocido";

  return {
    id: api._id,
    orderNumber: api.orderNumber || api._id.slice(-6).toUpperCase(),
    userId: userId,
    customerName: customerName,
    orderDate: api.createdAt,
    status: api.status,

    shipping: {
      address: (() => {
        const val = api.shipping?.address;
        if (typeof val === "string") return val;
        if (typeof val === "object" && val !== null)
          return val.address || val.barrio || "";
        return "";
      })(),
      neighborhood: (() => {
        const val = api.shipping?.neighborhood || api.shipping?.barrio;
        if (typeof val === "string") return val;
        if (typeof val === "object" && val !== null)
          return val.neighborhood || val.barrio || val.address || "";
        // Si api.shipping mismo es el objeto de dirección (caso de respaldo)
        if (typeof api.shipping === "object" && api.shipping !== null) {
          return api.shipping.neighborhood || api.shipping.barrio || "";
        }
        return "";
      })(),
      deliveryNotes:
        typeof api.shipping?.deliveryNotes === "string"
          ? api.shipping.deliveryNotes
          : "",
      deliverySlot:
        typeof api.shipping?.deliverySlot === "string"
          ? api.shipping.deliverySlot
          : api.deliverySlot || "Estándar",
    },

    payment: {
      method: api.payment?.method || "Cash",
      status: api.payment?.status || "Pending",
    },

    subtotal: api.subtotal || 0,
    shippingPrice: api.shippingPrice || 0,
    total: api.total || 0,

    items: (api.items || []).map(toOrderItem),
  };
}
