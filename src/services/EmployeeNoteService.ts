import BaseService from "./BaseService";
import { EmployeeNoteType } from "./types";

class EmployeeNoteService extends BaseService {
  private _apiURL: string;

  constructor() {
    super();

    this._apiURL = "/api/reports/employee_notes/";
  }

  getEmployeeNotes = async (params = {}) => {
    return await this.getResource(this._apiURL, params);
  };

  createEmployeeNote = async (employee_notes: EmployeeNoteType) => {
    return await this.createResourceJSON(this._apiURL, employee_notes);
  };

  getEmployeeNote = async (pk: number) => {
    return await this.getResource(`${this._apiURL}${pk}`);
  };

  updateEmployeeNote = async (pk: number, employee_notes: EmployeeNoteType) => {
    return await this.updateResourceJSON(`${this._apiURL}${pk}`, employee_notes);
  };

  deleteEmployeeNote = async (pk: number) => {
    return await this.deleteResource(`${this._apiURL}${pk}`);
  };
}

export default EmployeeNoteService;
