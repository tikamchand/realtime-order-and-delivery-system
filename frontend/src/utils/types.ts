export type UserRole = "customer" | "delivery_partner" | "admin";

export interface IUser {
  _id: string;
  name: string;
  role: UserRole;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: IUser | null;
  isSignedIn: boolean;
  setIsSignedIn: (isSignedIn: boolean) => void;
  setUser: (user: IUser | null) => void;
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image_url: string;
  createdAt: Date;
  updatedAt: Date;
}
