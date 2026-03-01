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
} from "react-icons/fa6";
import { Link } from "react-router";

import { useAuth } from "../hooks/useAuth";
import { EditProfileModal } from "../components/EditProfileModal";
import { useAddresses } from "../hooks/useAddresses";
import { AddressCard } from "../components/AddressCard";
import { AddAddressModal } from "../components/AddAddressModal";
import { CreateAddressPayload } from "../types/Address";

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
          <p className="font-bold text-gray-900 dark:text-white leading-tight">
            {title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {subtitle}
          </p>
        </div>
        <FaChevronRight
          className="text-gray-300 dark:text-gray-600"
          size={14}
        />
      </CardBody>
    );

    if (to) {
      return (
        <Card
          as={Link}
          isPressable
          className="border-none shadow-sm hover:shadow-md transition-all bg-white dark:bg-neutral-800"
          to={to}
        >
          {content}
        </Card>
      );
    }

    return (
      <Card
        isPressable
        className="border-none shadow-sm hover:shadow-md transition-all bg-white dark:bg-neutral-800"
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
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "")}&background=random`}
          />
          <Button
            isIconOnly
            className="absolute -bottom-1 -right-1 shadow-lg bg-white dark:bg-neutral-700"
            radius="full"
            size="sm"
            variant="flat"
            onPress={() => setIsEditOpen(true)}
          >
            <FaUserPen className="text-primary" size={14} />
          </Button>
        </div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white text-center">
          {user.name}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-2">
          {user.email}
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
      </div>

      <div className="space-y-6">
        {/* Sección: Mi Actividad */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest px-1 mb-3">
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
              <div className="mt-2 space-y-3 pl-4 border-l-2 border-warning-100 dark:border-warning-900/30">
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
            <h2 className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest px-1 mb-3">
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
          <h2 className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest px-1 mb-3">
            Cuenta
          </h2>
          <div className="grid gap-3">
            <DashItem
              icon={FaUserPen}
              subtitle="Cambia tu nombre, email o contraseña"
              title="Editar Perfil"
              onPress={() => setIsEditOpen(true)}
            />
            <Divider className="my-2 bg-transparent" />
            <Button
              className="w-full h-14 font-bold text-danger bg-danger/10 hover:bg-danger/20"
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
