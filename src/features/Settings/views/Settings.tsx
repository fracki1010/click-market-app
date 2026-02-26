import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Input,
  Button,
  Switch,
  Card,
  CardBody,
  Select,
  SelectItem,
  Divider,
} from "@heroui/react";
import {
  Settings as SettingsIcon,
  Truck,
  Palette,
  LogOut,
  Store,
  Bell,
  MessageCircle,
  AlertTriangle,
  Mail,
  Save,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { useAuth } from "../../Auth/hooks/useAuth";
import { RootState } from "../../../store/store";
// Asegúrate de que la ruta a updateSettings sea correcta en tu proyecto
import { updateSettings } from "../redux/settingsSlice";
import { useTheme } from "./../hooks/useTheme";

export const Setting: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useTheme();
  const { logoutUser } = useAuth();
  const dispatch = useDispatch();

  // 1. Obtenemos los settings actuales de Redux
  const settings = useSelector((state: RootState) => state.settings);

  // 2. Estado local para manejar los inputs antes de guardar
  const [formData, setFormData] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);

  // Sincronizar estado local si los settings de Redux cambian desde otro lado
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  // Manejador genérico para inputs de texto
  const handleChange = (
    field: keyof typeof formData,
    value: string | boolean | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 3. Función para guardar los cambios en Redux (y localStorage)
  const handleSave = () => {
    setIsSaving(true);
    // Convertimos los strings a números donde corresponde para evitar errores matemáticos
    dispatch(
      updateSettings({
        ...formData,
        shippingCost: Number(formData.shippingCost),
        freeShippingThreshold: Number(formData.freeShippingThreshold),
        lowStockAlert: Number(formData.lowStockAlert),
      }),
    );

    // Simulamos un pequeño retraso para feedback visual del botón
    setTimeout(() => setIsSaving(false), 600);
  };

  const handleThemeChange = (key: string) => {
    if (key) {
      setCurrentTheme(key as "light" | "dark" | "system");
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-slate-50 dark:bg-zinc-950 transition-colors pb-24">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <SettingsIcon className="text-emerald-500" size={32} />
            Configuración
          </h1>
          <p className="text-slate-500 mt-1">
            Administra las preferencias de Click Market
          </p>
        </div>

        <Tabs
          aria-label="Opciones de configuración"
          color="primary"
          variant="underlined"
        >
          {/* PESTAÑA: GENERAL */}
          <Tab
            key="general"
            title={
              <div className="flex items-center space-x-2">
                <Store size={18} />
                <span>General</span>
              </div>
            }
          >
            <div className="flex flex-col gap-4 mt-4">
              <Card className="shadow-sm border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <CardBody className="gap-6 p-6">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                    <Store className="text-emerald-500" /> Datos del Comercio
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nombre de la Tienda"
                      variant="bordered"
                      value={formData.storeName}
                      onValueChange={(val) => handleChange("storeName", val)}
                      startContent={
                        <Store size={16} className="text-slate-400" />
                      }
                    />
                    <Input
                      label="Email de Contacto"
                      variant="bordered"
                      value={formData.storeEmail}
                      onValueChange={(val) => handleChange("storeEmail", val)}
                      startContent={
                        <Mail size={16} className="text-slate-400" />
                      }
                    />
                    <Input
                      label="Número de WhatsApp"
                      variant="bordered"
                      placeholder="+54 9 123 456789"
                      value={formData.whatsappNumber}
                      onValueChange={(val) =>
                        handleChange("whatsappNumber", val)
                      }
                      startContent={
                        <MessageCircle size={16} className="text-slate-400" />
                      }
                    />
                  </div>
                </CardBody>
              </Card>

              <Card className="shadow-sm border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <CardBody className="gap-6 p-6">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                    <AlertTriangle className="text-orange-500" /> Mantenimiento
                  </h3>
                  <div className="flex justify-between items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white">
                        Modo Mantenimiento
                      </p>
                      <p className="text-sm text-slate-500">
                        Activa esta opción para deshabilitar la tienda
                        temporalmente.
                      </p>
                    </div>
                    <Switch
                      color="warning"
                      isSelected={formData.isMaintenance}
                      onValueChange={(val) =>
                        handleChange("isMaintenance", val)
                      }
                    />
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>

          {/* PESTAÑA: ENVÍOS Y LOGÍSTICA */}
          <Tab
            key="shipping"
            title={
              <div className="flex items-center space-x-2">
                <Truck size={18} />
                <span>Logística</span>
              </div>
            }
          >
            <div className="flex flex-col gap-4 mt-4">
              <Card className="shadow-sm border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <CardBody className="gap-6 p-6">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                    <Truck className="text-blue-500" /> Costos de Envío
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Costo de Envío Base ($)"
                      type="number"
                      variant="bordered"
                      value={formData.shippingCost.toString()}
                      onValueChange={(val) => handleChange("shippingCost", val)}
                    />
                    <Input
                      label="Monto para Envío Gratis ($)"
                      type="number"
                      variant="bordered"
                      value={formData.freeShippingThreshold.toString()}
                      onValueChange={(val) =>
                        handleChange("freeShippingThreshold", val)
                      }
                    />
                  </div>
                </CardBody>
              </Card>

              <Card className="shadow-sm border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <CardBody className="gap-6 p-6">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                    <Bell className="text-red-500" /> Alertas de Inventario
                  </h3>
                  <Input
                    label="Alerta de Stock Bajo (Cantidad)"
                    type="number"
                    variant="bordered"
                    value={formData.lowStockAlert.toString()}
                    onValueChange={(val) => handleChange("lowStockAlert", val)}
                    description="Se mostrará una alerta cuando un producto tenga esta cantidad o menos."
                  />
                </CardBody>
              </Card>
            </div>
          </Tab>

          {/* PESTAÑA: APARIENCIA */}
          <Tab
            key="appearance"
            title={
              <div className="flex items-center space-x-2">
                <Palette size={18} />
                <span>Apariencia</span>
              </div>
            }
          >
            <div className="mt-4">
              <Card className="shadow-sm border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <CardBody className="gap-6 p-6">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                    <Palette className="text-purple-500" /> Tema de la
                    Aplicación
                  </h3>
                  <Select
                    label="Selecciona el tema visual"
                    variant="bordered"
                    selectedKeys={[currentTheme]}
                    onChange={(e) => handleThemeChange(e.target.value)}
                  >
                    <SelectItem
                      key="light"
                      startContent={<SettingsIcon size={16} />}
                    >
                      Claro
                    </SelectItem>
                    <SelectItem
                      key="dark"
                      startContent={
                        <Palette className="text-indigo-400" size={16} />
                      }
                    >
                      Oscuro
                    </SelectItem>
                    <SelectItem
                      key="system"
                      startContent={<SettingsIcon size={16} />}
                    >
                      Sistema (Automático)
                    </SelectItem>
                  </Select>
                </CardBody>
              </Card>
            </div>
          </Tab>
        </Tabs>

        <Divider className="my-2" />

        {/* BOTONERA INFERIOR (Fija en dispositivos móviles o simplemente al final) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            color="danger"
            startContent={<LogOut size={18} />}
            variant="flat"
            onPress={logoutUser}
            className="w-full sm:w-auto font-medium"
          >
            Cerrar Sesión
          </Button>

          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="bordered"
              className="w-full sm:w-auto"
              onPress={() => setFormData(settings)} // Restablecer al estado de Redux
            >
              Deshacer
            </Button>
            <Button
              color="primary"
              className="w-full sm:w-auto font-bold shadow-lg"
              startContent={!isSaving && <Save size={18} />}
              isLoading={isSaving}
              onPress={handleSave}
            >
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};
