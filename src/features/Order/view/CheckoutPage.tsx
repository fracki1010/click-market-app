import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router"; // Standardizing to react-router
import {
  Select,
  SelectItem,
  RadioGroup,
  Radio,
  Button,
  Card,
  CardBody,
  Chip,
} from "@heroui/react";
import {
  FaTruckFast,
  FaMoneyBillWave,
  FaMapLocationDot,
  FaPlus,
  FaCheck,
  FaBagShopping,
  FaArrowRight,
  FaCreditCard,
  FaLandmark,
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/utils/currencyFormat";

import { useCreateOrder } from "../hook/useOrder";
import { useCart } from "../../Cart/hooks/useCart";
import { useAddresses } from "../../Auth/hooks/useAddresses";
import { AddressCard } from "../../Auth/components/AddressCard";
import { AddAddressModal } from "../../Auth/components/AddAddressModal";
import { CreateAddressPayload } from "../../Auth/types/Address";
import { useShippingSettings } from "../../Settings/hooks/useShippingSettings";

const DELIVERY_SLOTS = [
  { key: "manana", label: "Mañana (09:00 - 13:00)" },
  { key: "tarde", label: "Tarde (14:00 - 18:00)" },
  { key: "noche", label: "Noche (18:00 - 21:00)" },
];

export const CheckoutPage: React.FC = () => {
  const { items, total, fetchCart } = useCart();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const {
    addresses,
    loading: addressesLoading,
    setDefaultAddress,
    addAddress,
  } = useAddresses();
  const { calculateShipping } = useShippingSettings();
  const navigate = useNavigate();

  // Estados del formulario
  const [deliverySlot, setDeliverySlot] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Transfer");
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);

  // Lógica de costo de envío
  const shippingCost = calculateShipping(total);
  const finalTotal = total + shippingCost;

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (items.length === 0 && !isPending) {
      navigate("/products");
    }
  }, [items, navigate, isPending]);

  const handleAddAddress = async (data: CreateAddressPayload) => {
    try {
      await addAddress(data);
      setIsAddAddressOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!deliverySlot || !defaultAddress) return;

    createOrder({
      deliverySlot,
      paymentMethod: paymentMethod as "Cash" | "Card" | "Transfer",
    });
  };

  const defaultAddress = addresses.find((addr) => addr.isDefault);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-zinc-950 pb-24 lg:pb-12">
      {/* Hero Mini Section */}
      <div className="bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 pt-12 pb-8 mb-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white flex items-center gap-3">
              <FaBagShopping className="text-emerald-500" /> Finalizar Pedido
            </h1>
            <p className="text-slate-500 dark:text-zinc-400 mt-2 font-medium">
              Estas a un paso de recibir tus productos favoritos.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Columna Izquierda: Steps Form */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Dirección */}
              <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-zinc-800"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="flex items-center gap-3 text-xl font-black text-slate-800 dark:text-white">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 text-sm">
                      1
                    </span>
                    Dirección de Entrega
                  </h3>
                  <Button
                    color="primary"
                    radius="full"
                    size="sm"
                    startContent={<FaPlus />}
                    variant="flat"
                    onPress={() => setIsAddAddressOpen(true)}
                  >
                    Nueva
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {addresses.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 dark:bg-zinc-800/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-zinc-700">
                      <FaMapLocationDot className="mx-auto text-4xl text-slate-300 mb-3" />
                      <p className="text-slate-500 dark:text-zinc-400 mb-4 font-medium">
                        No tienes direcciones guardadas
                      </p>
                      <Button
                        className="bg-emerald-600 text-white font-bold"
                        radius="full"
                        onPress={() => setIsAddAddressOpen(true)}
                      >
                        Configurar mi primera dirección
                      </Button>
                    </div>
                  ) : (
                    addresses.map((addr) => (
                      <motion.div
                        key={addr._id}
                        whileHover={{ scale: 1.01 }}
                        className={`relative cursor-pointer transition-all duration-300 rounded-2xl border-2 ${
                          addr.isDefault
                            ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-500/5 shadow-md shadow-emerald-500/10"
                            : "border-transparent hover:border-slate-200 dark:hover:border-zinc-700"
                        }`}
                        onClick={() => setDefaultAddress(addr._id!)}
                      >
                        <AddressCard
                          address={addr}
                          isLoading={addressesLoading}
                          onSetDefault={setDefaultAddress}
                        />
                        {addr.isDefault && (
                          <div className="absolute -top-2 -right-2">
                            <div className="bg-emerald-500 text-white p-1.5 rounded-full shadow-lg">
                              <FaCheck size={12} />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.section>

              {/* Step 2: Horario */}
              <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-zinc-800"
              >
                <h3 className="flex items-center gap-3 text-xl font-black text-slate-800 dark:text-white mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 text-sm">
                    2
                  </span>
                  Horario de Preferencia
                </h3>
                <Select
                  isRequired
                  classNames={{
                    trigger: "h-14 border-2 rounded-2xl",
                    label: "font-bold text-slate-600 dark:text-zinc-400",
                  }}
                  label="¿Cuándo querés recibirlo?"
                  placeholder="Selecciona una franja horaria"
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
              </motion.section>

              {/* Step 3: Pago */}
              <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-zinc-800"
              >
                <h3 className="flex items-center gap-3 text-xl font-black text-slate-800 dark:text-white mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-sm">
                    3
                  </span>
                  Método de Pago
                </h3>
                <RadioGroup
                  color="success"
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  classNames={{
                    wrapper: "grid grid-cols-1 md:grid-cols-3 gap-4",
                  }}
                >
                  {[
                    {
                      value: "Transfer",
                      label: "Transferencia",
                      icon: <FaLandmark />,
                    },
                    {
                      value: "Cash",
                      label: "Efectivo",
                      icon: <FaMoneyBillWave />,
                    },
                    {
                      value: "Card",
                      label: "Tarjeta MP",
                      icon: <FaCreditCard />,
                    },
                  ].map((method) => (
                    <Radio
                      key={method.value}
                      value={method.value}
                      className={`max-w-none w-full m-0 border-2 rounded-2xl p-4 transition-all ${
                        paymentMethod === method.value
                          ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-500/5"
                          : "border-slate-100 dark:border-zinc-800"
                      }`}
                      classNames={{
                        base: "inline-flex m-0 bg-transparent hover:bg-slate-50 dark:hover:bg-zinc-800/50 flex-row-reverse w-full max-w-full items-center justify-between",
                        label: "w-full",
                      }}
                    >
                      <div className="flex items-center gap-3 font-bold text-slate-700 dark:text-zinc-200">
                        <span className="text-xl text-emerald-500">
                          {method.icon}
                        </span>
                        {method.label}
                      </div>
                    </Radio>
                  ))}
                </RadioGroup>
              </motion.section>

              <Button
                className={`hidden lg:flex w-full h-16 text-xl font-black shadow-xl transition-all active:scale-[0.98] ${
                  !deliverySlot || !defaultAddress
                    ? "bg-slate-200 text-slate-400 dark:bg-zinc-800"
                    : "bg-orange-500 text-white shadow-orange-500/25 hover:bg-orange-600"
                }`}
                isDisabled={!deliverySlot || !defaultAddress}
                isLoading={isPending}
                radius="lg"
                size="lg"
                type="submit"
              >
                {isPending
                  ? "Procesando..."
                  : `Confirmar Pedido • $${formatPrice(finalTotal)}`}
              </Button>
            </form>
          </div>

          {/* Columna Derecha: Resumen */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="sticky top-28"
            >
              <Card className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-xl rounded-[2.5rem] overflow-hidden">
                <CardBody className="p-8">
                  <h3 className="font-black text-2xl mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                    Mi Pedido{" "}
                    <span className="text-slate-300 dark:text-zinc-700">
                      ({items.length})
                    </span>
                  </h3>

                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar lg:pr-6">
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex gap-4 items-center group"
                      >
                        <div className="relative w-16 h-16 rounded-2xl bg-slate-50 dark:bg-zinc-800 overflow-hidden shrink-0 border border-slate-100 dark:border-zinc-700 group-hover:scale-105 transition-transform">
                          <img
                            alt={item.name}
                            className="w-full h-full object-cover"
                            src={item.image_url}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 dark:text-slate-200 truncate leading-snug">
                            {item.name}
                          </p>
                          <p className="text-sm font-medium text-slate-400">
                            {item.quantity} x ${formatPrice(item.price)}
                          </p>
                        </div>
                        <span className="font-black text-slate-900 dark:text-white">
                          ${formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 space-y-4 pt-6 border-t-2 border-dashed border-slate-100 dark:border-zinc-800">
                    <div className="flex justify-between items-center text-slate-600 dark:text-zinc-400 font-medium">
                      <span>Subtotal</span>
                      <span className="font-bold text-slate-800 dark:text-zinc-200">
                        ${formatPrice(total)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 text-slate-600 dark:text-zinc-400 font-medium">
                        <FaTruckFast className="text-emerald-500" /> Envío
                      </span>
                      {shippingCost === 0 ? (
                        <Chip
                          color="success"
                          size="sm"
                          variant="flat"
                          className="font-black"
                        >
                          GRATIS
                        </Chip>
                      ) : (
                        <span className="font-bold text-slate-800 dark:text-zinc-200">
                          ${formatPrice(shippingCost)}
                        </span>
                      )}
                    </div>

                    <div className="pt-4 flex justify-between items-end">
                      <div>
                        <span className="text-xs uppercase tracking-widest font-black text-slate-400 dark:text-zinc-500">
                          Total Final
                        </span>
                        <p className="text-4xl font-black text-slate-900 dark:text-white leading-none mt-1">
                          ${formatPrice(finalTotal)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Guarantees */}
              <div className="mt-6 flex justify-around p-4 opacity-60">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-black uppercase text-slate-500">
                    Fast Delivery
                  </span>
                  <FaTruckFast />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-black uppercase text-slate-500">
                    Secure Payment
                  </span>
                  <FaCheck />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <AnimatePresence>
        {items.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-zinc-800 p-4 z-50 flex items-center justify-between gap-4 pb-safe"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-slate-500 dark:text-zinc-500 leading-none">
                A pagar
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                ${formatPrice(finalTotal)}
              </span>
            </div>
            <Button
              className={`font-black px-10 h-14 shadow-lg transition-all active:scale-95 ${
                !deliverySlot || !defaultAddress
                  ? "bg-slate-200 text-slate-400 dark:bg-zinc-800"
                  : "bg-orange-500 text-white shadow-orange-500/20"
              }`}
              isDisabled={!deliverySlot || !defaultAddress}
              isLoading={isPending}
              endContent={!isPending && <FaArrowRight />}
              radius="full"
              onClick={() => handleSubmit()}
            >
              Comprar Ahora
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AddAddressModal
        isLoading={addressesLoading}
        isOpen={isAddAddressOpen}
        onClose={() => setIsAddAddressOpen(false)}
        onSubmit={handleAddAddress}
      />
    </main>
  );
};
