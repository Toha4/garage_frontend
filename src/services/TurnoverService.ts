import BaseService from "./BaseService";
import { TurnoverMovingMaterialType, TurnoverType } from "./types";

class TurnoverService extends BaseService {
  private _apiURL: string;

  constructor() {
    super();

    this._apiURL = "/api/warehouse/turnover/";
  }

  getTurnovers = async (params = {}) => {
    return await this.getResource(this._apiURL, params);
  };

  getTurnoversMaterial = async (params = {}) => {
    return await this.getResource(`${this._apiURL}material/`, params);
  };

  createReason = async (turnover: TurnoverType) => {
    return await this.createResourceJSON(this._apiURL, turnover);
  };

  deleteTurnover = async (pk: number) => {
    return await this.deleteResource(`${this._apiURL}${pk}`);
  };

  movingMaterial = async (mobing_data: TurnoverMovingMaterialType) => {
    return await this.createResourceJSON(`${this._apiURL}moving_material/`, mobing_data);
  };
}

export default TurnoverService;
