import React from "react";
import { Card, CardBody, Chip, Divider } from "@heroui/react";
import { FaShieldHalved, FaLock, FaUserCheck } from "react-icons/fa6";

export const PrivacyPage: React.FC = () => {
  return (
    <main className="flex-grow bg-background min-h-screen pb-20 transition-colors">
      <section className="bg-primary text-primary-foreground py-14 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <FaShieldHalved className="text-5xl mx-auto mb-5 text-secondary" />
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            Politica de Privacidad
          </h1>
          <p className="text-primary-50/90">
            Ultima actualizacion: 27 de marzo de 2026
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 -mt-8 relative z-10">
        <Card className="shadow-lg border-none bg-content1">
          <CardBody className="p-7 md:p-10 space-y-7">
            <div className="flex items-center gap-2">
              <Chip color="primary" size="sm" variant="flat">
                Click Market
              </Chip>
              <Chip color="secondary" size="sm" variant="flat">
                Tus datos, protegidos
              </Chip>
            </div>

            <p className="text-default-600 leading-relaxed">
              En Click Market usamos tus datos solo para operar tu cuenta,
              procesar pedidos y brindarte una mejor experiencia. Nunca vendemos
              tu informacion personal a terceros.
            </p>

            <Divider />

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-default-900 flex items-center gap-2">
                <FaUserCheck className="text-primary" /> Que datos recopilamos
              </h2>
              <p className="text-default-600">
                Podemos solicitar nombre, telefono, correo, direccion de entrega
                e historial de pedidos para gestionar compras y soporte.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-default-900 flex items-center gap-2">
                <FaLock className="text-primary" /> Como usamos tus datos
              </h2>
              <p className="text-default-600">
                Usamos esta informacion para confirmar pedidos, coordinar
                entregas, enviar notificaciones y mejorar el funcionamiento de
                la plataforma.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-default-900">
                Tus derechos
              </h2>
              <p className="text-default-600">
                Podes solicitar acceso, correccion o eliminacion de tus datos.
                Tambien podes pedir la baja de comunicaciones comerciales en
                cualquier momento.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-default-900">Contacto</h2>
              <p className="text-default-600">
                Si tenes dudas sobre privacidad, escribinos a
                click.market.serv@gmail.com y te responderemos a la brevedad.
              </p>
            </div>
          </CardBody>
        </Card>
      </section>
    </main>
  );
};
