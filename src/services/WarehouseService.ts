import BaseService from "./BaseService";
import { WarehouseType } from "./types";

class WarehouseService extends BaseService {
  private _apiURL: string;

  constructor() {
    super();

    this._apiURL = "/api/warehouse/warehouse/";
  }

  getWarehouses = async (params = {}) => {
    return await this.getResource(this._apiURL, params);
  };

  createWarehouse = async (warehouse: WarehouseType) => {
    return await this.createResourceJSON(this._apiURL, warehouse);
  };

  getWarehouse = async (pk: number) => {
    return await this.getResource(`${this._apiURL}${pk}`);
  };

  updateWarehouse = async (pk: number, warehouse: WarehouseType) => {
    return await this.updateResourceJSON(`${this._apiURL}${pk}`, warehouse);
  };

  deleteWarehouse = async (pk: number) => {
    return await this.deleteResource(`${this._apiURL}${pk}`);
  };
}

export default WarehouseService;
