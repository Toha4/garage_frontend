import BaseService from "./BaseService";
import { OrderType } from "./types";

class OrderService extends BaseService {
  private _apiURL: string;

  constructor() {
    super();

    this._apiURL = "/api/orders/order/";
  }

  getOrders = async (params = {}) => {
    return await this.getResource(this._apiURL, params);
  };

  createOrder = async (order: OrderType) => {
    return await this.createResourceJSON(this._apiURL, order);
  };

  getOrder = async (pk: number) => {
    return await this.getResource(`${this._apiURL}${pk}`);
  };

  updateOrder = async (pk: number, order: OrderType) => {
    return await this.updateResourceJSON(`${this._apiURL}${pk}`, order);
  };

  deleteOrder = async (pk: number) => {
    return await this.deleteResource(`${this._apiURL}${pk}`);
  };

  exportToExcel = async (params = {}) => {
    return await this.getResource(`${this._apiURL}excel/`, params);
  };
}

export default OrderService;
