import BaseService from "./BaseService";
import { EmployeeWriteType } from "./types";

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

  updateEmployee = async (pk: number, employee: EmployeeWriteType) => {
    return await this.partialUpdate(`${this._apiURL}${pk}`, employee);
  };
}

export default EmployeeService;
