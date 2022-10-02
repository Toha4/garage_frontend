import BaseService from "./BaseService";
import { CarType } from "./types";

class CarService extends BaseService {
  private _apiURL: string;

  constructor() {
    super();

    this._apiURL = "/api/core/car/";
  }

  getCars = async (params = {}) => {
    return await this.getResource(this._apiURL, params);
  };

  getCar = async (pk: number) => {
    return await this.getResource(`${this._apiURL}${pk}`);
  };

  updateCar = async (pk: number, car: CarType) => {
    return await this.updateResourceJSON(`${this._apiURL}${pk}`, car);
  };
}

export default CarService;
