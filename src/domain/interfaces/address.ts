export interface FilterAddressByModel {
  user: string;
}

export interface CreateAddressModel {
  user: string;
  country: string;
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  postCode: string;
  phoneNumber: string;
  deliveryInstructions: string;
  securityCode: string;
}
