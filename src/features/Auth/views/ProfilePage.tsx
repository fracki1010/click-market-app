import { useState } from "react";
import { Card, CardBody, Avatar, Button, Chip, Divider } from "@heroui/react";
import {
  FaUserPen,
  FaArrowRightFromBracket,
  FaBagShopping,
  FaUserShield,
  FaPlus,
  FaMapLocationDot,
  FaBoxesStacked,
  FaTableCells,
  FaGear,
  FaChevronRight,
  FaSun,
  FaMoon,
  FaLaptop,
  FaGoogle,
  FaPhone,
  FaClockRotateLeft,
} from "react-icons/fa6";
import { Link } from "react-router";

import { useAuth } from "../hooks/useAuth";
import { EditProfileModal } from "../components/EditProfileModal";
import { useAddresses } from "../hooks/useAddresses";
import { AddressCard } from "../components/AddressCard";
import { AddAddressModal } from "../components/AddAddressModal";
import { CreateAddressPayload } from "../types/Address";
import { useTheme } from "../../Settings/hooks/useTheme";

export const ProfilePage = () => {
  const { user, logoutUser, updateUserState, loading: authLoading } = useAuth();
  const {
    addresses,
    loading: addressesLoading,
    addAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddresses();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);
  const [currentTheme, setTheme] = useTheme();

  const handleEditSubmit = async (data: any) => {
    try {
      updateUserState(data);
      setIsEditOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddAddress = async (data: CreateAddressPayload) => {
    try {
      await addAddress(data);
      setIsAddAddressOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return null;

  const isAdmin = user.role === "admin" || user.role === "ADMIN";
  const isGoogleProfile = user.authProvider === "google";
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user.name || "",
  )}&background=random`;
  const profileAvatar = user.avatar || fallbackAvatar;

  const DashItem = ({
    icon: Icon,
    title,
    subtitle,
    to,
    onPress,
    color = "primary",
  }: any) => {
    const content = (
      <CardBody className="flex flex-row items-center gap-4 p-4">
        <div className={`p-3 rounded-2xl bg-${color}/10 text-${color}`}>
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <p className="font-bold text-default-900 leading-tight">{title}</p>
          <p className="text-xs text-default-500 mt-0.5">{subtitle}</p>
        </div>
        <FaChevronRight className="text-default-300" size={14} />
      </CardBody>
    );

    if (to) {
      return (
        <Card
          as={Link}
          isPressable
          className="border-none shadow-sm hover:shadow-md transition-all bg-content1"
          to={to}
        >
          {content}
        </Card>
      );
    }

    return (
      <Card
        isPressable
        className="border-none shadow-sm hover:shadow-md transition-all bg-content1"
        onPress={onPress}
      >
        {content}
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl pb-24 md:pb-12">
      {/* 1. Header del Perfil */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <Avatar
            isBordered
            className="w-24 h-24 text-2xl"
            color={isAdmin ? "secondary" : "primary"}
            name={user.name}
            src={profileAvatar}
          />
          <Button
            isIconOnly
            className="absolute -bottom-1 -right-1 shadow-lg bg-content1"
            radius="full"
            size="sm"
            variant="flat"
            onPress={() => setIsEditOpen(true)}
          >
            <FaUserPen className="text-primary" size={14} />
          </Button>
        </div>
        <h1 className="text-2xl font-black text-default-900 text-center">
          {user.name}
        </h1>
        <p className="text-sm text-default-500 text-center">
          {user.email}
        </p>
        <p className="text-sm text-default-500 text-center mb-2 flex items-center gap-2">
          <FaPhone className="text-default-400" size={12} />
          {user.phone || "Sin número de teléfono"}
        </p>
        {isAdmin && (
          <Chip
            color="secondary"
            size="sm"
            startContent={<FaUserShield />}
            variant="flat"
          >
            Administrador
          </Chip>
        )}
        {isGoogleProfile && (
          <Chip
            className="mt-2"
            color="primary"
            size="sm"
            startContent={<FaGoogle />}
            variant="flat"
          >
            Perfil gestionado por Google
          </Chip>
        )}
      </div>

      <div className="space-y-6">
        {/* Sección: Mi Actividad */}
        <section>
          <h2 className="text-xs font-bold text-default-400 uppercase tracking-widest px-1 mb-3">
            Mi Actividad
          </h2>
          <div className="grid gap-3">
            <DashItem
              icon={FaBagShopping}
              subtitle="Rastrea y gestiona tus pedidos"
              title="Mis Compras"
              to="/my-orders"
            />
            <DashItem
              color="warning"
              icon={FaMapLocationDot}
              subtitle="Gestiona tus puntos de entrega"
              title="Mis Direcciones"
              onPress={() => setShowAddresses(!showAddresses)}
            />
            {showAddresses && (
              <div className="mt-2 space-y-3 pl-4 border-l-2 border-warning-200">
                {addresses.map((addr) => (
                  <AddressCard
                    key={addr._id}
                    address={addr}
                    isLoading={addressesLoading}
                    onDelete={deleteAddress}
                    onSetDefault={setDefaultAddress}
                  />
                ))}
                <Button
                  className="w-full font-bold"
                  color="warning"
                  size="sm"
                  startContent={<FaPlus />}
                  variant="flat"
                  onPress={() => setIsAddAddressOpen(true)}
                >
                  Nueva Dirección
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Sección: Administración (Solo si es Admin) */}
        {isAdmin && (
          <section>
            <h2 className="text-xs font-bold text-default-400 uppercase tracking-widest px-1 mb-3">
              Administración
            </h2>
            <div className="grid gap-3">
              <DashItem
                color="secondary"
                icon={FaTableCells}
                subtitle="Métricas y estadísticas de venta"
                title="Dashboard Admin"
                to="/admin/dashboard"
              />
              <DashItem
                color="secondary"
                icon={FaBoxesStacked}
                subtitle="Gestionar stock y productos"
                title="Inventario"
                to="/admin/inventory"
              />
              <DashItem
                color="secondary"
                icon={FaBoxesStacked}
                subtitle="Ver y procesar pedidos"
                title="Ordenes Globales"
                to="/admin/orders"
              />
              <DashItem
                color="secondary"
                icon={FaClockRotateLeft}
                subtitle="Auditar eventos y actividad del sistema"
                title="Trazabilidad"
                to="/admin/movements"
              />
              <DashItem
                color="secondary"
                icon={FaGear}
                subtitle="Configuración del sistema"
                title="Ajustes de Tienda"
                to="/settings"
              />
            </div>
          </section>
        )}

        {/* Sección: Cuenta y Soporte */}
        <section>
          <h2 className="text-xs font-bold text-default-400 uppercase tracking-widest px-1 mb-3">
            Cuenta
          </h2>
          <div className="grid gap-3">
            {/* Theme Switcher Discreto */}
            <Card className="border-none shadow-sm bg-content1 px-1">
              <CardBody className="flex flex-row items-center gap-4 p-4">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  {currentTheme === "light" ? (
                    <FaSun size={20} />
                  ) : currentTheme === "dark" ? (
                    <FaMoon size={20} />
                  ) : (
                    <FaGear size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-default-900 leading-tight">
                    Apariencia
                  </p>
                  <p className="text-xs text-default-500 mt-0.5">
                    {currentTheme === "light"
                      ? "Modo Claro"
                      : currentTheme === "dark"
                        ? "Modo Oscuro"
                        : "Tema del Sistema"}
                  </p>
                </div>
                <div className="flex bg-default-100 p-1 rounded-xl gap-1">
                  {[
                    { key: "light", icon: FaSun },
                    { key: "dark", icon: FaMoon },
                    { key: "system", icon: FaLaptop },
                  ].map((t) => (
                    <Button
                      key={t.key}
                      isIconOnly
                      className={`w-9 h-9 min-w-0 transition-all ${
                        currentTheme === t.key
                          ? "bg-white dark:bg-default-600 shadow-sm text-primary"
                          : "bg-transparent text-default-400"
                      }`}
                      radius="lg"
                      size="sm"
                      variant="light"
                      onPress={() => setTheme(t.key as any)}
                    >
                      <t.icon size={16} />
                    </Button>
                  ))}
                </div>
              </CardBody>
            </Card>

            <DashItem
              icon={FaUserPen}
              subtitle="Cambia tus datos y agrega tu teléfono"
              title="Editar Perfil"
              onPress={() => setIsEditOpen(true)}
            />
            <Divider className="my-2 bg-transparent" />
            <Button
              className="w-full h-14 font-bold text-danger bg-danger-50 hover:bg-danger-100 transition-colors"
              radius="full"
              startContent={<FaArrowRightFromBracket size={20} />}
              variant="flat"
              onPress={logoutUser}
            >
              Cerrar Sesión
            </Button>
          </div>
        </section>
      </div>

      <EditProfileModal
        isLoading={authLoading}
        isOpen={isEditOpen}
        user={user}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditSubmit}
      />

      <AddAddressModal
        isLoading={addressesLoading}
        isOpen={isAddAddressOpen}
        onClose={() => setIsAddAddressOpen(false)}
        onSubmit={handleAddAddress}
      />
    </div>
  );
};
