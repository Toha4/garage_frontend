import BaseService from "./BaseService";
import { CarWriteType } from "./types";

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

  updateCar = async (pk: number, car: CarWriteType, params = {}) => {
    return await this.partialUpdate(`${this._apiURL}${pk}`, car, params);
  };

  getCarsTags = async (params = {}) => {
    return await this.getResource(`${this._apiURL}tags/`, params);
  };
}

export default CarService;
