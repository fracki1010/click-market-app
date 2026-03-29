import React from "react";
import { Card, CardBody, Chip, Divider } from "@heroui/react";
import { FaBoxOpen, FaTruckFast, FaRotateLeft } from "react-icons/fa6";

export const ConditionsPage: React.FC = () => {
  return (
    <main className="flex-grow bg-background min-h-screen pb-20 transition-colors">
      <section className="bg-success text-success-foreground py-14 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <FaBoxOpen className="text-5xl mx-auto mb-5 text-white" />
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            Condiciones de Compra
          </h1>
          <p className="text-success-50/90">
            Ultima actualizacion: 27 de marzo de 2026
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 -mt-8 relative z-10">
        <Card className="shadow-lg border-none bg-content1">
          <CardBody className="p-7 md:p-10 space-y-7">
            <div className="flex items-center gap-2">
              <Chip color="success" size="sm" variant="flat">
                Entregas y devoluciones
              </Chip>
            </div>

            <p className="text-default-600 leading-relaxed">
              Estas condiciones aplican a compras realizadas en Click Market y
              buscan cuidar tanto a clientes como al equipo de reparto.
            </p>

            <Divider />

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-default-900 flex items-center gap-2">
                <FaTruckFast className="text-success" /> Entrega de pedidos
              </h2>
              <p className="text-default-600">
                Las entregas se realizan en las zonas habilitadas y dentro de la
                franja horaria elegida, con posibilidad de ajustes por clima o
                alta demanda.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-default-900">
                Productos faltantes o sustituciones
              </h2>
              <p className="text-default-600">
                Si un producto no esta disponible, podremos ofrecer reemplazo
                equivalente previa confirmacion o excluirlo del pedido.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-default-900 flex items-center gap-2">
                <FaRotateLeft className="text-success" /> Cambios y reclamos
              </h2>
              <p className="text-default-600">
                Si recibis un producto en mal estado o incorrecto, contactanos
                dentro de las primeras 24 horas para gestionar cambio, reintegro
                o nota de credito segun corresponda.
              </p>
            </div>
          </CardBody>
        </Card>
      </section>
    </main>
  );
};
