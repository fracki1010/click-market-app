import React, { useMemo, useState } from "react";
import { Card, CardBody, Chip, Input, Spinner } from "@heroui/react";
import {
  FaArrowRight,
  FaMagnifyingGlass,
  FaPhone,
  FaUsers,
} from "react-icons/fa6";
import { useNavigate, type NavigateFunction } from "react-router";

import {
  useAdminCustomers,
  type AdminCustomer,
} from "../hook/useAdminCustomers";

const goToCustomerDetail = (
  navigate: NavigateFunction,
  customer: AdminCustomer,
) => {
  const customerId = encodeURIComponent(
    customer.userId ||
      customer.email ||
      `firebase:${customer.firebaseUid || "sin-id"}`,
  );
  const params = new URLSearchParams();

  if (customer.email) params.set("email", customer.email);
  if (customer.name) params.set("name", customer.name);
  if (customer.phone) params.set("phone", customer.phone);
  if (customer.source) params.set("source", customer.source);
  if (customer.firebaseUid) params.set("firebaseUid", customer.firebaseUid);

  const queryString = params.toString();

  navigate(
    `/admin/customers/${customerId}${queryString ? `?${queryString}` : ""}`,
  );
};

const getInitials = (name: string) => {
  const chunks = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!chunks.length) return "CL";
  if (chunks.length === 1) return chunks[0].slice(0, 2).toUpperCase();

  return `${chunks[0][0]}${chunks[1][0]}`.toUpperCase();
};

export const AdminCustomersPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [brokenAvatars, setBrokenAvatars] = useState<Record<string, boolean>>(
    {},
  );
  const navigate = useNavigate();

  const { data, isLoading, isError } = useAdminCustomers(search);

  const customers = useMemo(() => data?.items || [], [data]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] justify-center items-center">
        <Spinner color="primary" label="Cargando clientes..." size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-5xl mx-auto">
        <Card className="border border-danger-200 bg-danger-50">
          <CardBody className="p-5 text-danger-700">
            No se pudo cargar la lista de clientes.
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto pb-10">
      <Card className="shadow-sm border border-slate-100 dark:border-zinc-800">
        <CardBody className="p-5 md:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <FaUsers className="text-primary" /> Clientes
                </h1>
                <p className="text-slate-500 text-xs md:text-sm mt-1">
                  Selecciona un cliente para ver su perfil, compras y
                  estadísticas.
                </p>
              </div>

              <Input
                className="w-full sm:w-80"
                color="primary"
                placeholder="Buscar por nombre, email o teléfono"
                startContent={<FaMagnifyingGlass className="text-slate-400" />}
                value={search}
                variant="bordered"
                onValueChange={setSearch}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Card className="border border-slate-100 dark:border-zinc-800 shadow-none">
                <CardBody className="p-4">
                  <p className="text-xs text-slate-500">Clientes encontrados</p>
                  <p className="text-2xl font-black text-slate-800 dark:text-white">
                    {customers.length}
                  </p>
                </CardBody>
              </Card>
            </div>

            {data?.firebaseSyncWarning && (
              <Card className="border border-warning-200 bg-warning-50 shadow-none">
                <CardBody className="p-3 text-warning-700 text-xs">
                  {data.firebaseSyncWarning}
                </CardBody>
              </Card>
            )}
          </div>
        </CardBody>
      </Card>

      {customers.length === 0 ? (
        <Card className="shadow-sm border border-slate-100 dark:border-zinc-800">
          <CardBody className="p-8 text-center text-slate-500">
            No encontramos clientes con ese filtro.
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {customers.map((customer) => (
            <Card
              key={customer.userId || customer.firebaseUid || customer.email}
              isPressable
              className="border border-slate-100 dark:border-zinc-800 shadow-sm transition-transform duration-150 active:scale-[0.99]"
              onPress={() => goToCustomerDetail(navigate, customer)}
            >
              <CardBody className="p-4 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  {(() => {
                    const avatarKey =
                      customer.userId || customer.firebaseUid || customer.email;
                    const avatarUrl = String(customer.avatar || "").trim();
                    const canShowAvatar =
                      !!avatarUrl && !brokenAvatars[avatarKey];

                    return canShowAvatar ? (
                      <img
                        alt={customer.name}
                        className="w-11 h-11 rounded-2xl object-cover shrink-0 border border-slate-200"
                        src={avatarUrl}
                        onError={() =>
                          setBrokenAvatars((prev) => ({
                            ...prev,
                            [avatarKey]: true,
                          }))
                        }
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-2xl bg-primary-50 text-primary font-black flex items-center justify-center shrink-0 border border-primary-100">
                        {getInitials(customer.name)}
                      </div>
                    );
                  })()}

                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800 dark:text-white truncate">
                      {customer.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {customer.email || "Sin email"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 inline-flex items-center gap-1">
                      <FaPhone /> {customer.phone || "Sin teléfono"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <Chip
                    color={customer.source === "google" ? "primary" : "default"}
                    size="sm"
                    variant="flat"
                  >
                    {customer.source}
                  </Chip>
                  <FaArrowRight className="text-xs text-primary" />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
