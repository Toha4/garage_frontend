import BaseService from "./BaseService";
import { EmployeeType } from "./types";

class EmployeeService extends BaseService {
  private _apiURL: string;

  constructor() {
    super();

    this._apiURL = "/api/core/employee/";
  }

  getEmployees = async (params = {}) => {
    return await this.getResource(this._apiURL, params);
  };

  getEmployee = async (pk: number) => {
    return await this.getResource(`${this._apiURL}${pk}`);
  };

  updateEmployee = async (pk: number, employee: EmployeeType) => {
    return await this.updateResourceJSON(`${this._apiURL}${pk}`, employee);
  };
}

export default EmployeeService;
