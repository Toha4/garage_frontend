import BaseService from "./BaseService";
import { CarTaskType, CarTaskUpdateType } from "./types";

class CarTaskService extends BaseService {
  private _apiURL: string;

  constructor() {
    super();

    this._apiURL = "/api/car_tasks/car_tasks/";
  }

  getCarsTasks = async (params = {}) => {
    return await this.getResource(this._apiURL, params);
  };

  createCarTask = async (car_task: CarTaskType) => {
    return await this.createResourceJSON(this._apiURL, car_task);
  };

  getCarTask = async (pk: number) => {
    return await this.getResource(`${this._apiURL}${pk}`);
  };

  updateCarTask = async (pk: number, car_task: CarTaskUpdateType) => {
    return await this.partialUpdate(`${this._apiURL}${pk}`, car_task);
  };

  deleteCarTask = async (pk: number) => {
    return await this.deleteResource(`${this._apiURL}${pk}`);
  };

  exportTasksExcel = async (params = {}) => {
    return await this.getResource(`${this._apiURL}excel/`, params);
  };
}

export default CarTaskService;
