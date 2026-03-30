import React from "react";
import { Link } from "react-router";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Button,
  Divider,
} from "@heroui/react";
import {
  FaMapLocationDot,
  FaTruckFast,
  FaClock,
  FaLocationDot,
  FaCircleCheck,
  FaMoneyBillWave,
  FaArrowRight,
} from "react-icons/fa6";

import { useShippingSettings } from "@/features/Settings/hooks/useShippingSettings";

const formatAmountNoDecimals = (value: unknown) => {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) return "0";

  return new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(numericValue);
};

// Array de zonas habilitadas (Podés editar los nombres según tu ciudad)
const deliveryZones = [
  {
    id: 1,
    category: "Barrios Privados",
    areas: ["Los Olivos", "Virgen del Rosario", "Horizonte", "Las Pircas"],
    time: "Menos de 60 min",
    color: "primary",
  },
  {
    id: 2,
    category: "Tunuyán Centro",
    areas: [
      "Microcentro",
      "Barrio Urquiza",
      "Barrio Güemes",
      "Barrio Los Manzanos",
    ],
    time: "Aprox. 90 min",
    color: "secondary",
  },
  {
    id: 3,
    category: "Zonas Aledañas",
    areas: ["Vista Flores", "Colonia Las Rosas", "Los Sauces"],
    time: "Entregas Programadas",
    color: "default",
  },
];

export const DeliveryZonesPage: React.FC = () => {
  const { serviceCostConfig, thresholdConfig } = useShippingSettings();

  const freeShippingThreshold = thresholdConfig
    ? `$${formatAmountNoDecimals(thresholdConfig)}`
    : "Calculando...";
  const deliveryCost = serviceCostConfig
    ? `$${serviceCostConfig}`
    : "Calculando...";

  return (
    <main className="flex-grow bg-background min-h-screen pb-20 transition-colors">
      {/* Hero de la página */}
      <section className="bg-primary text-primary-foreground py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <FaMapLocationDot className="text-6xl text-secondary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            ¿Llegamos a tu casa?
          </h1>
          <p className="text-lg text-primary-50/90 max-w-2xl mx-auto">
            Click Market está expandiendo su red todos los meses. Revisá
            nuestras zonas de cobertura y empezá a disfrutar de hacer el súper
            sin salir de casa.
          </p>
        </div>
      </section>

      {/* Grid de Zonas */}
      <section className="container mx-auto px-4 max-w-5xl -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deliveryZones.map((zone) => (
            <Card key={zone.id} className="shadow-lg border-none bg-content1">
              <CardHeader className="flex gap-3 px-6 pt-6 pb-2">
                <div
                  className={`p-3 rounded-full bg-${zone.color}/10 text-${zone.color}`}
                >
                  <FaLocationDot size={20} />
                </div>
                <div className="flex flex-col">
                  <p className="text-md font-bold text-default-800 uppercase">
                    {zone.category}
                  </p>
                  <p className="text-small text-default-500 flex items-center gap-1">
                    <FaClock className="text-xs" /> {zone.time}
                  </p>
                </div>
              </CardHeader>
              <Divider className="my-2 opacity-50" />
              <CardBody className="px-6 pb-6">
                <ul className="space-y-3">
                  {zone.areas.map((area, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-default-600 font-medium"
                    >
                      <FaCircleCheck className={`text-${zone.color} text-sm`} />
                      {area}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Información de Costos y Horarios */}
      <section className="container mx-auto px-4 max-w-5xl mt-16">
        <div className="bg-content1 rounded-2xl shadow-sm border border-divider p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="flex-1 space-y-6">
            <h2 className="text-2xl font-bold text-default-800">
              Condiciones de Entrega
            </h2>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-success-50 text-success rounded-xl mt-1">
                <FaMoneyBillWave size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-default-800">
                  Costo de Envío: {deliveryCost}
                </h3>
                <p className="text-default-500">
                  Llevamos tus compras en vehículos adecuados para asegurar la
                  calidad.
                  <span className="block mt-1 font-semibold text-success">
                    ¡Envío GRATIS en compras superiores a{" "}
                    {freeShippingThreshold}!
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-warning-50 text-warning rounded-xl mt-1">
                <FaTruckFast size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-default-800">
                  Franjas Horarias
                </h3>
                <p className="text-default-500">
                  Se realizan entregas de lunes a sábado entre
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Chip color="warning" size="sm" variant="flat">
                    (16:00 - 20:00)
                  </Chip>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col gap-4 bg-default-50 p-6 rounded-2xl">
            <h3 className="font-bold text-center text-default-700">
              ¿Estás en nuestra zona?
            </h3>
            <Button
              as={Link}
              className="font-bold shadow-lg"
              color="secondary"
              endContent={<FaArrowRight />}
              size="lg"
              to="/products"
            >
              Ir a comprar
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};
