
export interface IProduct {
  sold: number;
  images: string[];
  subcategory: ISubcategory[];
  ratingsQuantity: number;
  _id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  priceAfterDiscount: number;
  imageCover: string;
  category: ICategory;
  brand: IBrand;
  ratingsAverage: number;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: Date,
  updatedAt: Date,
}

export interface ISubcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}
export interface IBrand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}
export interface ICart{
  status: string;
  numOfCartItems: number;
  cartId: string;
  data: CartData;
}

export interface CartData {
  _id: string;
  cartOwner: string;
  products: CartProductDetails[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalCartPrice: number;
}

export interface CartProductDetails {
  count: number;
  _id: string;
  product: CartProduct;
  price: number;
}

export interface CartProduct {
  subcategory: CartProductSubcategory[];
  _id: string;
  title: string;
  quantity: number;
  imageCover: string;
  category: CartProductCategory;
  brand: CartProductCategory;
  ratingsAverage: number;
  id: string;
}

export interface CartProductCategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface CartProductSubcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}
export interface IOrderProduct {
  subcategory: ISubcategory[];
  ratingsQuantity: number;
  _id: string;
  title: string;
  imageCover: string;
  category: ICategory;
  brand: IBrand;
  ratingsAverage: number;
  id: string; 
}
 export interface WishlistProduct {
  sold: number;
  images: string[];
  subcategory: WishlistProuctSubcategory[];
  ratingsQuantity: number;
  _id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  imageCover: string;
  category: WishlistProuctCategory;
  brand: WishlistProuctCategory;
  ratingsAverage: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

export interface WishlistProuctCategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface WishlistProuctSubcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

export interface IAddess {
  _id:number;
  name: string;
  details: string;
  phone: string;
  city: string;

}
export interface IUserData {
    role: 'user'; // Assuming 'user' is the only possibility based on the sample
    active: boolean;
    wishlist: string[]; // Array of Product IDs
    _id: string;
    name: string;
    email: string;
    phone: string;
    password: string; // Hashed password
    addresses: IAddess[];
    createdAt: string; // ISO 8601 Date String
    updatedAt: string; // ISO 8601 Date String
    __v: number;
}