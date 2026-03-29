import React from "react";
import { Card, CardBody, Chip, Divider } from "@heroui/react";
import {
  FaFileContract,
  FaScaleBalanced,
  FaCartShopping,
} from "react-icons/fa6";

export const TermsPage: React.FC = () => {
  return (
    <main className="flex-grow bg-background min-h-screen pb-20 transition-colors">
      <section className="bg-secondary text-secondary-foreground py-14 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <FaFileContract className="text-5xl mx-auto mb-5 text-white" />
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            Terminos de Uso
          </h1>
          <p className="text-secondary-50/90">
            Ultima actualizacion: 27 de marzo de 2026
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 -mt-8 relative z-10">
        <Card className="shadow-lg border-none bg-content1">
          <CardBody className="p-7 md:p-10 space-y-7">
            <div className="flex items-center gap-2">
              <Chip color="secondary" size="sm" variant="flat">
                Uso de la plataforma
              </Chip>
            </div>

            <p className="text-default-600 leading-relaxed">
              Al usar Click Market aceptas estos terminos. Te pedimos utilizar
              la plataforma de forma legal, respetuosa y sin afectar la
              experiencia de otras personas.
            </p>

            <Divider />

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-default-900 flex items-center gap-2">
                <FaCartShopping className="text-secondary" /> Cuenta y compras
              </h2>
              <p className="text-default-600">
                Sos responsable de mantener tus datos actualizados y verificar
                direccion, telefono y detalle del pedido antes de confirmar.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-default-900">
                Precios y disponibilidad
              </h2>
              <p className="text-default-600">
                Los precios y el stock pueden cambiar sin previo aviso. En caso
                de diferencias, te contactaremos antes de cerrar la entrega.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-default-900 flex items-center gap-2">
                <FaScaleBalanced className="text-secondary" /> Uso permitido
              </h2>
              <p className="text-default-600">
                No esta permitido usar la plataforma para fraude, suplantacion
                de identidad o cualquier accion que dañe el servicio.
              </p>
            </div>
          </CardBody>
        </Card>
      </section>
    </main>
  );
};
