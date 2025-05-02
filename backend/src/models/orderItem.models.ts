import { Schema, model, Document, Types } from "mongoose";

export interface IOrderItem extends Document {
  orderId: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  price: number; // snapshot of the product price at the time of ordering
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const OrderItem = model<IOrderItem>("OrderItem", orderItemSchema);
export default OrderItem;
