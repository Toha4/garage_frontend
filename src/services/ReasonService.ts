import BaseService from "./BaseService";
import { ReasonType } from "./types";

class ReasonService extends BaseService {
  private _apiURL: string;

  constructor() {
    super();

    this._apiURL = "/api/orders/reason/";
  }

  getReasons = async (params = {}) => {
    return await this.getResource(this._apiURL, params);
  };

  createReason = async (reason: ReasonType) => {
    return await this.createResourceJSON(this._apiURL, reason);
  };

  getReason = async (pk: number) => {
    return await this.getResource(`${this._apiURL}${pk}`);
  };

  updateReason = async (pk: number, reason: ReasonType) => {
    return await this.updateResourceJSON(`${this._apiURL}${pk}`, reason);
  };

  deleteReason = async (pk: number) => {
    return await this.deleteResource(`${this._apiURL}${pk}`);
  };
}

export default ReasonService;
