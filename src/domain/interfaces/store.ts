export interface FilterStoreByModel {
  organisation: string;
}

export interface CreateStoreModel {
  name: string;
  members?: string[];
  organisation: string;
}
