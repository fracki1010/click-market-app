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
      imageUrl: apiItem.image || "https://via.placeholder.com/150", // Fallback de imagen
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
      address: api.shipping?.address || "",
      neighborhood: api.shipping?.neighborhood || "",
      deliveryNotes: api.shipping?.deliveryNotes || "",
      deliverySlot: api.shipping?.deliverySlot || "Estándar",
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
