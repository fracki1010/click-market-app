import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Input,
  Select,
  SelectItem,
  Textarea,
  RadioGroup,
  Radio,
  Button,
  Divider,
  Card,
  CardBody,
} from "@heroui/react";
import {
  FaTruckFast,
  FaMoneyBillWave,
  FaClock,
  FaMapLocationDot,
} from "react-icons/fa6";

import { useCreateOrder } from "../hook/useOrder";
import { useCart } from "../../Cart/hooks/useCart";

const DELIVERY_SLOTS = [
  { key: "manana", label: "Mañana (09:00 - 13:00)" },
  { key: "tarde", label: "Tarde (14:00 - 18:00)" },
  { key: "noche", label: "Noche (18:00 - 21:00)" },
];

export const CheckoutPage: React.FC = () => {
  const { items, total, fetchCart } = useCart();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const navigate = useNavigate();

  // Estados del formulario
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [deliverySlot, setDeliverySlot] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Transfer");

  // Lógica de costo de envío (Simulada en frontend para visualización, el backend tiene la final)
  const shippingCost = total > 20000 ? 0 : 1500;
  const finalTotal = total + shippingCost;

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (items.length === 0) {
      navigate("/products");
    }
  }, [items, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!address || !neighborhood || !deliverySlot) return;

    createOrder({
      shippingDetails: {
        address,
        neighborhood,
        deliveryNotes,
      },
      deliverySlot,
      paymentMethod: paymentMethod as "Cash" | "Card" | "Transfer",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Columna Izquierda: Formulario */}
        <div>
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
              Finalizar Compra
            </h2>
            <p className="text-slate-500">
              Completa los datos de entrega en tu barrio.
            </p>
          </div>

          <form
            className="space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800"
            onSubmit={handleSubmit}
          >
            {/* Sección Dirección */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-xl font-semibold text-emerald-600">
                <FaMapLocationDot /> Datos de Entrega
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  isRequired
                  label="Barrio / Complejo"
                  placeholder="Ej: Los Olivos"
                  value={neighborhood}
                  variant="bordered"
                  onValueChange={setNeighborhood}
                />
                <Input
                  isRequired
                  label="Dirección / Lote"
                  placeholder="Ej: Manzana F - Lote 12"
                  value={address}
                  variant="bordered"
                  onValueChange={setAddress}
                />
              </div>
              <Textarea
                label="Instrucciones para la guardia / repartidor"
                placeholder="Dejar en portería, tocar timbre, llamar al llegar..."
                value={deliveryNotes}
                variant="bordered"
                onValueChange={setDeliveryNotes}
              />
            </div>

            <Divider />

            {/* Sección Horario */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-xl font-semibold text-emerald-600">
                <FaClock /> Horario de Preferencia
              </h3>
              <Select
                isRequired
                label="Selecciona una franja horaria"
                placeholder="Elige cuándo recibirlo"
                selectedKeys={deliverySlot ? [deliverySlot] : []}
                variant="bordered"
                onChange={(e) => setDeliverySlot(e.target.value)}
              >
                {DELIVERY_SLOTS.map((slot) => (
                  <SelectItem key={slot.label} textValue={slot.label}>
                    {slot.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <Divider />

            {/* Sección Pago */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-xl font-semibold text-emerald-600">
                <FaMoneyBillWave /> Método de Pago
              </h3>
              <RadioGroup
                color="success"
                orientation="horizontal"
                value={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                <Radio value="Transfer">Transferencia</Radio>
                <Radio value="Cash">Efectivo contra entrega</Radio>
                <Radio value="Card">Tarjeta (MP)</Radio>
              </RadioGroup>
            </div>

            <Button
              className="w-full bg-emerald-600 text-white font-bold text-lg shadow-lg hover:bg-emerald-700"
              isLoading={isPending}
              size="lg"
              startContent={!isPending && <FaTruckFast />}
              type="submit"
            >
              {isPending
                ? "Procesando..."
                : `Confirmar Pedido - $${finalTotal.toFixed(2)}`}
            </Button>
          </form>
        </div>

        {/* Columna Derecha: Resumen */}
        <div className="lg:pl-10">
          <Card className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-md sticky top-10">
            <CardBody className="p-6">
              <h3 className="font-bold text-xl mb-4 dark:text-white border-b pb-2 dark:border-zinc-700">
                Resumen del Pedido
              </h3>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                      <img
                        alt={item.name}
                        className="w-full h-full object-cover"
                        src={item.image_url}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        Cant: {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2 border-t pt-4 dark:border-zinc-700">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Envío {shippingCost === 0 && "(Gratis)"}</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-2xl text-slate-900 dark:text-white pt-2">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
