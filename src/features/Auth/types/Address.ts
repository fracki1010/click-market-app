export interface Address {
  _id: string;
  address: string;
  neighborhood: string;
  deliveryNotes?: string;
  isDefault?: boolean;
}

export interface CreateAddressPayload {
  address: string;
  neighborhood: string;
  deliveryNotes?: string;
  isDefault?: boolean;
}
