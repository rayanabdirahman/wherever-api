export interface FilterProductByModel {
  category: string;
  store: string;
  organisation: string;
}

export interface CreateProductModel {
  name: string;
  description: string;
  image: string;
  images: string[];
  brand: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  category: string;
  store: string;
  organisation: string;
}
