import { Schema, model, Document, Types } from "mongoose";

export interface ICartItem extends Document {
  cartId: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    cartId: { type: Schema.Types.ObjectId, ref: "Cart", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

const CartItem = model<ICartItem>("CartItem", cartItemSchema);
export default CartItem;
