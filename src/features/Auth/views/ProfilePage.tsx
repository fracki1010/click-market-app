import { useState } from "react";
import { Card, CardBody, Avatar, Button, Input, Chip } from "@heroui/react";
import {
  FaUserPen,
  FaArrowRightFromBracket,
  FaBagShopping,
  FaEnvelope,
  FaUserShield,
  FaPlus,
  FaMapLocationDot,
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

  const isAdmin = user.role === "admin";

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* 1. Tarjeta Principal de Perfil */}
      <Card className="mb-6 overflow-visible border-none bg-white dark:bg-neutral-900 shadow-xl shadow-indigo-500/10">
        {/* Banner Decorativo */}
        <div className="h-40 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-xl relative">
          {/* Avatar Flotante */}
          <div className="absolute -bottom-12 left-8 p-1 bg-white dark:bg-neutral-900 rounded-full">
            <Avatar
              isBordered
              className="w-24 h-24 text-2xl"
              color={isAdmin ? "secondary" : "primary"}
              name={user.name}
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "")}&background=random`}
            />
          </div>
        </div>

        <CardBody className="pt-16 pb-8 px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {user.name}
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
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                @{user.username}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                color="danger"
                startContent={<FaArrowRightFromBracket />}
                variant="flat"
                onPress={logoutUser}
              >
                Cerrar Sesión
              </Button>
              <Button
                color="primary"
                startContent={<FaUserPen />}
                variant="solid"
                onPress={() => setIsEditOpen(true)}
              >
                Editar Perfil
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 2. Grid de Detalles y Accesos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna Izquierda: Información Personal y Direcciones */}
        <div className="md:col-span-2 space-y-6">
          {/* Información Personal */}
          <Card className="p-4 border border-divider">
            <h3 className="text-lg font-bold mb-4 px-2 flex items-center gap-2">
              <FaEnvelope className="text-primary" />
              Información Personal
            </h3>
            <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                isReadOnly
                defaultValue={user.name}
                label="Nombre Completo"
                labelPlacement="outside"
                variant="bordered"
              />
              <Input
                isReadOnly
                defaultValue={user.username}
                label="Nombre de Usuario"
                labelPlacement="outside"
                startContent={
                  <span className="text-default-400 text-small">@</span>
                }
                variant="bordered"
              />
              <Input
                isReadOnly
                className="md:col-span-2"
                defaultValue={user.email}
                label="Correo Electrónico"
                labelPlacement="outside"
                startContent={<FaEnvelope className="text-default-400" />}
                variant="bordered"
              />
            </CardBody>
          </Card>

          {/* Direcciones */}
          <Card className="p-4 border border-divider">
            <div className="flex justify-between items-center mb-4 px-2">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FaMapLocationDot className="text-primary" />
                Mis Direcciones
              </h3>
              <Button
                color="primary"
                size="sm"
                startContent={<FaPlus />}
                variant="flat"
                onPress={() => setIsAddAddressOpen(true)}
              >
                Agregar
              </Button>
            </div>
            <CardBody className="gap-4">
              {addresses.length === 0 ? (
                <div className="text-center py-8 bg-default-50 rounded-xl border-2 border-dashed border-default-200">
                  <p className="text-default-500">
                    No tienes direcciones guardadas.
                  </p>
                  <Button
                    className="mt-2"
                    size="sm"
                    variant="light"
                    onPress={() => setIsAddAddressOpen(true)}
                  >
                    Agregar mi primera dirección
                  </Button>
                </div>
              ) : (
                <div className="grid gap-3">
                  {addresses.map((addr) => (
                    <AddressCard
                      key={addr._id}
                      address={addr}
                      isLoading={addressesLoading}
                      onDelete={deleteAddress}
                      onSetDefault={setDefaultAddress}
                    />
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Columna Derecha: Accesos Rápidos */}
        <div className="space-y-6">
          <Card className="p-4 border border-divider">
            <h3 className="text-lg font-bold mb-4 px-2">Accesos Rápidos</h3>
            <CardBody className="gap-4">
              <Button
                as={Link}
                className="w-full justify-start h-14"
                color="primary"
                startContent={
                  <div className="p-2 bg-primary/20 rounded-full">
                    <FaBagShopping />
                  </div>
                }
                to="/my-orders"
                variant="flat"
              >
                <div className="flex flex-col items-start ml-2">
                  <span className="font-semibold">Mis Órdenes</span>
                  <span className="text-xs text-default-500">
                    Ver historial de compras
                  </span>
                </div>
              </Button>

              {isAdmin && (
                <Button
                  as={Link}
                  className="w-full justify-start h-14"
                  color="secondary"
                  startContent={
                    <div className="p-2 bg-secondary/20 rounded-full">
                      <FaUserShield />
                    </div>
                  }
                  to="/admin/dashboard"
                  variant="flat"
                >
                  <div className="flex flex-col items-start ml-2">
                    <span className="font-semibold">Panel Admin</span>
                    <span className="text-xs text-default-500">
                      Gestionar tienda
                    </span>
                  </div>
                </Button>
              )}
            </CardBody>
          </Card>

          <Card className="p-4 bg-primary/5 border border-primary/10">
            <CardBody>
              <h4 className="font-bold text-primary mb-1">Dato Curioso</h4>
              <p className="text-xs text-default-600">
                Tener tus direcciones actualizadas nos ayuda a entregarte tus
                pedidos mucho más rápido.
              </p>
            </CardBody>
          </Card>
        </div>
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
