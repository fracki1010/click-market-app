import React from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { Construction, Mail, MessageCircle } from "lucide-react";
import { useSelector } from "react-redux";

import { RootState } from "../../../store/store";

export const MaintenancePage: React.FC = () => {
  const { whatsappNumber, storeEmail } = useSelector(
    (state: RootState) => state.settings,
  );

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-neutral-950 transition-colors duration-300">
      <Card className="max-w-md w-full border-none shadow-2xl dark:bg-neutral-900/50">
        <CardBody className="flex flex-col items-center text-center p-8 gap-6">
          <div className="p-4 bg-warning/10 rounded-full text-warning animate-pulse">
            <Construction size={48} />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Modo Mantenimiento
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Estamos trabajando para mejorar tu experiencia. Volveremos muy
              pronto con novedades.
            </p>
          </div>

          <div className="w-full h-px bg-divider" />

          <div className="flex flex-col gap-3 w-full">
            <p className="text-sm font-medium text-gray-400">
              ¿Necesitas ayuda urgente?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                as="a"
                color="success"
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
                startContent={<MessageCircle size={18} />}
                target="_blank"
                variant="flat"
              >
                WhatsApp
              </Button>
              <Button
                as="a"
                color="primary"
                href={`mailto:${storeEmail}`}
                startContent={<Mail size={18} />}
                variant="flat"
              >
                Enviar Email
              </Button>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            Agradecemos tu paciencia.
          </p>
        </CardBody>
      </Card>
    </main>
  );
};
