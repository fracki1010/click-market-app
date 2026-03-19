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

const DELIVERY_SLOTS = [{ key: "next_day", label: "Mañana (16:00 - 20:00)" }];

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
  const [deliverySlot, setDeliverySlot] = useState(DELIVERY_SLOTS[0].label);
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
    <main className="min-h-screen bg-background pb-24 lg:pb-12 transition-colors">
      {/* Hero Mini Section */}
      <div className="bg-content1 border-b border-divider pt-12 pb-8 mb-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-black text-default-800 flex items-center gap-3">
              <FaBagShopping className="text-success" /> Finalizar Pedido
            </h1>
            <p className="text-default-500 mt-2 font-medium">
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
                className="bg-content1 p-6 md:p-8 rounded-[2rem] shadow-sm border border-divider"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="flex items-center gap-3 text-xl font-black text-default-800">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-success-50 text-success text-sm">
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
                    <div className="text-center py-10 bg-default-50 rounded-2xl border-2 border-dashed border-divider">
                      <FaMapLocationDot className="mx-auto text-4xl text-default-300 mb-3" />
                      <p className="text-default-500 mb-4 font-medium">
                        No tienes direcciones guardadas
                      </p>
                      <Button
                        className="bg-success text-white font-bold"
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
                            ? "border-success bg-success-50 shadow-md shadow-success/10"
                            : "border-transparent hover:border-default-200"
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
                            <div className="bg-success text-white p-1.5 rounded-full shadow-lg">
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
                className="bg-content1 p-6 md:p-8 rounded-[2rem] shadow-sm border border-divider"
              >
                <h3 className="flex items-center gap-3 text-xl font-black text-default-800 mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-warning-100 text-warning text-sm">
                    2
                  </span>
                  Horario de Entrega
                </h3>
                <p className="text-sm text-default-500 mb-4 font-medium -mt-4 ml-11">
                  Todos nuestros pedidos se entregan al día siguiente de la
                  compra en el horario fijo establecido.
                </p>
                <Select
                  isRequired
                  classNames={{
                    trigger: "h-14 border-2 rounded-2xl",
                    label: "font-bold text-default-600",
                  }}
                  label="Fecha y Horario de Entrega"
                  placeholder="Entrega asegurada para mañana"
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
                className="bg-content1 p-6 md:p-8 rounded-[2rem] shadow-sm border border-divider"
              >
                <h3 className="flex items-center gap-3 text-xl font-black text-default-800 mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary text-sm">
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
                          ? "border-success bg-success-50"
                          : "border-divider"
                      }`}
                      classNames={{
                        base: "inline-flex m-0 bg-transparent hover:bg-default-50 flex-row-reverse w-full max-w-full items-center justify-between",
                        label: "w-full",
                      }}
                    >
                      <div className="flex items-center gap-3 font-bold text-default-700">
                        <span className="text-xl text-success">
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
                    ? "bg-default-200 text-default-400"
                    : "bg-primary text-primary-foreground shadow-primary/25 hover:bg-primary-600"
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
              <Card className="bg-content1 border border-divider shadow-xl rounded-[2.5rem] overflow-hidden">
                <CardBody className="p-8">
                  <h3 className="font-black text-2xl mb-6 text-default-800 flex items-center gap-2">
                    Mi Pedido{" "}
                    <span className="text-default-300">({items.length})</span>
                  </h3>

                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar lg:pr-6">
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex gap-4 items-center group"
                      >
                        <div className="relative w-16 h-16 rounded-2xl bg-default-50 border border-divider overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                          <img
                            alt={item.name}
                            className="w-full h-full object-cover"
                            src={item.image_url}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-default-800 truncate leading-snug">
                            {item.name}
                          </p>
                          <p className="text-sm font-medium text-default-400">
                            {item.quantity} x ${formatPrice(item.price)}
                          </p>
                        </div>
                        <span className="font-black text-default-900">
                          ${formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 space-y-4 pt-6 border-t-2 border-dashed border-divider">
                    <div className="flex justify-between items-center text-default-600 font-medium">
                      <span>Subtotal</span>
                      <span className="font-bold text-default-800">
                        ${formatPrice(total)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 text-default-600 font-medium">
                        <FaTruckFast className="text-success" /> Envío
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
                        <span className="font-bold text-default-800">
                          ${formatPrice(shippingCost)}
                        </span>
                      )}
                    </div>

                    <div className="pt-4 flex justify-between items-end">
                      <div>
                        <span className="text-xs uppercase tracking-widest font-black text-default-400">
                          Total Final
                        </span>
                        <p className="text-4xl font-black text-default-900 leading-none mt-1">
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
                  <span className="text-[10px] font-black uppercase text-default-500">
                    Fast Delivery
                  </span>
                  <FaTruckFast />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-black uppercase text-default-500">
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
            className="lg:hidden fixed bottom-0 left-0 right-0 bg-content1/80 backdrop-blur-xl border-t border-divider p-4 z-50 flex items-center justify-between gap-4 pb-safe"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-default-500 leading-none">
                A pagar
              </span>
              <span className="text-2xl font-black text-default-900 leading-tight">
                ${formatPrice(finalTotal)}
              </span>
            </div>
            <Button
              className={`font-black px-10 h-14 shadow-lg transition-all active:scale-95 ${
                !deliverySlot || !defaultAddress
                  ? "bg-default-200 text-default-400"
                  : "bg-primary text-primary-foreground shadow-primary/20"
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
