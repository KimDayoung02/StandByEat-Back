import { model } from "mongoose";
const mongoose = require("mongoose");
import { OrderSchema } from "../schemas/order-schema";

const Order = model("order", OrderSchema);

export class OrderModel {
  async create(orderInfo) {
    const createdNewOrder = await Order.create(orderInfo);
    return createdNewOrder;
  }

  async findAllByUserId(userId) {
    const orders = await Order.find({ userId: userId })
      .populate("storeId", "storeName")
      .populate("userId", "name");
    return orders;
  }

  async createOrderByNewInfo(orderInfo) {
    const createdNewOrder = await Order.create(orderInfo);
    return createdNewOrder;
  }

  async findAll() {
    const orders = await Order.find({})
      .populate("userId", "name")
      .populate("storeId", "storeName");
    return orders;
  }

  async findById(orderId) {
    const findorder = await Order.findOne({ _id: orderId })
      .populate("userId")
      .populate("storeId");
    return findorder;
  }

  async update({ orderId, update }) {
    const filter = { _id: orderId };

    const updatedOrder = await Order.findOneAndUpdate(filter, update);
    return updatedOrder;
  }

  async delete(orderId) {
    const deleteOrder = await Order.findByIdAndDelete({ _id: orderId });
    return deleteOrder;
  }

  async getOrdersByUserId(userId) {
    const orders = await Order.find({ userId });
    return orders;
  }
}

const orderModel = new OrderModel();

export { orderModel };
