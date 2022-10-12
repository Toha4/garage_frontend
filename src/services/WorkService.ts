import BaseService from "./BaseService";
import { WorkCategoryType, WorkType } from "./types";

class WorkService extends BaseService {
  private _apiURLWork: string;
  private _apiURLWorkCategory: string;

  constructor() {
    super();

    this._apiURLWork = "/api/orders/work/";
    this._apiURLWorkCategory = "/api/orders/work_category/";
  }

  geWorks = async (params = {}) => {
    return await this.getResource(this._apiURLWork, params);
  };

  createWork = async (work: WorkType) => {
    return await this.createResourceJSON(this._apiURLWork, work);
  };

  getWork = async (pk: number) => {
    return await this.getResource(`${this._apiURLWork}${pk}`);
  };

  updateWork = async (pk: number, work: WorkType) => {
    return await this.updateResourceJSON(`${this._apiURLWork}${pk}`, work);
  };

  deleteWork = async (pk: number) => {
    return await this.deleteResource(`${this._apiURLWork}${pk}`);
  };  

  geWorktCategoryes = async (params = {}) => {
    return await this.getResource(this._apiURLWorkCategory, params);
  };

  createWorkCategory = async (category: WorkCategoryType) => {
    return await this.createResourceJSON(this._apiURLWorkCategory, category);
  };

  getWorkCategory = async (pk: number) => {
    return await this.getResource(`${this._apiURLWorkCategory}${pk}`);
  };

  updateWorkCategory = async (pk: number, category: WorkCategoryType) => {
    return await this.updateResourceJSON(`${this._apiURLWorkCategory}${pk}`, category);
  };

  deleteWorkCategory = async (pk: number) => {
    return await this.deleteResource(`${this._apiURLWorkCategory}${pk}`);
  };
}

export default WorkService;
