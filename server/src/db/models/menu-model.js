import { model } from 'mongoose';
const mongoose = require('mongoose');
import { MenuSchema } from '../schemas/menu-schema';
// import { ObjectId } from 'mongoose';
// import { ObjectId } from '..db';

const Menu = model('menu', MenuSchema);

export class MenuModel {
  async create(menuInfo) {
    const createdNewMenu = await Menu.create(menuInfo);
    return createdNewMenu;
  }

  async findAll(query) {
    const menus = await Menu.find(query).populate('storeId', 'storeName');
    return menus;
  }

  async findById(menuId) {
    const findmenu = await Menu.findOne({ _id: menuId });
    return findmenu;
  }

  async update({ menuId, update }) {
    const filter = { _id: menuId };

    const updatedMenu = await Menu.findOneAndUpdate(filter, update);
    return updatedMenu;
  }

  async delete(menuId) {
    const deleteMenu = await Menu.findByIdAndDelete({ _id: menuId });
    return deleteMenu;
  }
}

const menuModel = new MenuModel();

export { menuModel };
