import { Schema, model, Document, Types, Model } from "mongoose";

export type OrderStatus = "pending" | "picked-up" | "on-the-way" | "delivered";
export type PaymentType = "cod" | "online";

export interface IOrder extends Document {
  userId: Types.ObjectId;
  total_price: number;
  delivery_status: OrderStatus;
  payment_type: PaymentType;
  isOrderPrepaid: boolean;
  delivery_address: string;
  delivery_partner_id: Types.ObjectId | null;
  isAssignedDeliveryPartner: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderModel extends Model<IOrder> {
  findUnassignedOrderByOrderId(orderId: string): Promise<IOrder | null>;
  updateOrderDeliveryStatus(
    orderId: string,
    status: OrderStatus,
    deliveryPartnerId: Types.ObjectId
  ): Promise<IOrder | null>;
}

const orderSchema = new Schema<IOrder, OrderModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    total_price: { type: Number, required: true },
    delivery_status: {
      type: String,
      enum: ["pending", "picked-up", "on-the-way", "delivered"],
      default: "pending",
    },
    payment_type: {
      type: String,
      enum: ["cod", "online"],
      required: true,
    },
    isOrderPrepaid: { type: Boolean, default: false },
    delivery_address: { type: String, required: true },
    delivery_partner_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isAssignedDeliveryPartner: { type: Boolean, default: false },
  },
  { timestamps: true }
);

orderSchema.statics.findUnassignedOrderByOrderId = async function (
  orderId: string
) {
  return this.findOne({
    _id: orderId,
    isAssignedDeliveryPartner: false,
  });
};

orderSchema.statics.updateOrderDeliveryStatus = async function (
  orderId: string,
  deliveryPartnerId: string,
  status: OrderStatus,
) {
  return this.findOneAndUpdate(
    { _id: orderId, delivery_partner_id: deliveryPartnerId },
    { delivery_status: status },
    { new: true }
  );
};

const Order = model<IOrder, OrderModel>("Order", orderSchema);
export default Order;
