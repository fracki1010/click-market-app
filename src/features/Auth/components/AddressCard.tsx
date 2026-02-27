import React from "react";
import { Card, CardBody, Button, Chip } from "@heroui/react";
import { FaLocationDot, FaTrash, FaStar } from "react-icons/fa6";
import { Address } from "../types/Address";

interface AddressCardProps {
  address: Address;
  onDelete?: (id: string) => void;
  onSetDefault: (id: string) => void;
  isLoading?: boolean;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onDelete,
  onSetDefault,
  isLoading,
}) => {
  return (
    <Card
      isHoverable
      className={`shadow-sm border ${address.isDefault ? "border-warning-400 bg-warning-50/20" : "border-divider"}`}
    >
      <CardBody className="flex flex-row items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-full ${address.isDefault ? "bg-warning-100 text-warning-600" : "bg-primary/10 text-primary"}`}
          >
            <FaLocationDot size={20} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 dark:text-white">
                {address.address}
              </span>
              {address.isDefault && (
                <Chip
                  color="warning"
                  size="sm"
                  startContent={<FaStar />}
                  variant="flat"
                >
                  Principal
                </Chip>
              )}
            </div>
            <span className="text-xs text-default-500">
              {address.neighborhood}
            </span>
            {address.deliveryNotes && (
              <span className="text-xs italic text-default-400">
                "{address.deliveryNotes}"
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-1">
          {!address.isDefault && (
            <Button
              isIconOnly
              color="warning"
              isLoading={isLoading}
              size="sm"
              title="Marcar como principal"
              variant="light"
              onPress={() => onSetDefault(address._id)}
            >
              <FaStar />
            </Button>
          )}
          {onDelete && (
            <Button
              isIconOnly
              color="danger"
              isLoading={isLoading}
              size="sm"
              title="Eliminar dirección"
              variant="light"
              onPress={() => onDelete(address._id)}
            >
              <FaTrash />
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
