import { model } from 'mongoose';
const mongoose = require('mongoose');
import { OrderSchema } from '../schemas/order-schema';

const Order = model('order', OrderSchema);

export class OrderModel {
  async create(orderInfo) {
    const createdNewOrder = await Order.create(orderInfo);
    return createdNewOrder;
  }

  async findAll() {
    const orders = await Order.find({});
    return orders;
  }
  async findById(orderId) {
    const findorder = await Order.findOne({ _id: orderId })
      .populate('userId')
      .populate('storeId');
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
}

const orderModel = new OrderModel();

export { orderModel };
