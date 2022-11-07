import BaseService from "./BaseService";
import { EntranceType } from "./types";

class EntranceService extends BaseService {
  private _apiURL: string;

  constructor() {
    super();

    this._apiURL = "/api/warehouse/entrance/";
  }

  getEntrances = async (params = {}) => {
    return await this.getResource(this._apiURL, params);
  };

  createEntrance = async (entrance: EntranceType) => {
    return await this.createResourceJSON(this._apiURL, entrance);
  };

  getEntrance = async (pk: number) => {
    return await this.getResource(`${this._apiURL}${pk}`);
  };

  updateEntrance = async (pk: number, entrance: EntranceType) => {
    return await this.updateResourceJSON(`${this._apiURL}${pk}`, entrance);
  };

  deleteEntrance = async (pk: number) => {
    return await this.deleteResource(`${this._apiURL}${pk}`);
  };

  getProviders = async () => {
    return await this.getResource(`${this._apiURL}providers/`);
  };
}

export default EntranceService;
