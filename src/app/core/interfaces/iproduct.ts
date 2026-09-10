// These interfaces describe the shape the FRONTEND works with, not zizo-shop's
// raw JSON. The services adapt zizo-shop's DTOs into this shape via `map()`.

export interface IProduct {
  _id: string;
  id: string;
  title: string;
  description: string;
  price: number;
  priceAfterDiscount: number | null;
  quantity: number;
  imageCover: string;
  images: string[];
  category: ICategoryRef | null;
  isInWishlist: boolean;
  ratingsAverage: number;
  reviewCount: number;
}

export interface ICategoryRef {
  _id: string;
  name: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  parentCategoryId: string | null;
  subCategories: ICategory[];
}

export interface IBrand {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface IAddress {
  _id: string;
  city: string;
  street: string;
  zipCode: string;
}

export interface IReview {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface IApplyCouponResult {
  code: string;
  discountAmount: number;
  newTotal: number;
}

export interface ICart {
  status: string;
  numOfCartItems: number;
  cartId: string | null;
  data: CartData;
}

export interface CartData {
  _id: string | null;
  products: CartProductDetails[];
  totalCartPrice: number;
}

export interface CartProductDetails {
  count: number;
  _id: string; // cart-line id (== productId on zizo-shop, since cart is keyed by product)
  price: number;
  product: CartProduct;
}

export interface CartProduct {
  _id: string; // productId
  id: string;  // productId
  title: string;
  imageCover: string;
}

export interface WishlistProduct {
  _id: string; // productId (zizo-shop's add/remove routes key off productId)
  id: string;  // productId
  title: string;
  price: number;
  imageCover: string;
}

export interface IOrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subTotal: number;
}

export interface IOrder {
  _id: string;
  createdAt: string;
  totalPrice: number;
  subTotal: number;
  shippingFee: number;
  status: string;
  itemCount: number;
}

export interface IOrderDetail extends IOrder {
  discountAmount: number;
  couponCode: string | null;
  userEmail: string;
  addressId: string;
  items: IOrderItem[];
}

export interface IProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
