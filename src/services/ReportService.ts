import BaseService from "./BaseService";

class ReportService extends BaseService {
  private _apiURL: string;

  constructor() {
    super();

    this._apiURL = "/api/reports/";
  }

  getReportCars = async (params = {}) => {
    return await this.getResource(`${this._apiURL}cars/`, params);
  };

  exportReportCarsExcel = async (params = {}) => {
    return await this.getResource(`${this._apiURL}cars/excel/`, params);
  };

  getReportMechanics = async (params = {}) => {
    return await this.getResource(`${this._apiURL}mechanics/`, params);
  };

  exportReportMechanicsExcel = async (params = {}) => {
    return await this.getResource(`${this._apiURL}mechanics/excel/`, params);
  };

  getReportMaterials = async (params = {}) => {
    return await this.getResource(`${this._apiURL}materials/`, params);
  };

  exportReportMaterialsExcel = async (params = {}) => {
    return await this.getResource(`${this._apiURL}materials/excel/`, params);
  };
}

export default ReportService;
