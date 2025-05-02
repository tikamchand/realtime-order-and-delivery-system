import { Schema, model, Document, Types } from "mongoose";

export interface ICart extends Document {
  userId: Types.ObjectId;
  isOrdered: boolean; 
}

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    isOrdered: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Cart = model<ICart>("Cart", cartSchema);
export default Cart;
