import BaseService from "./BaseService";
import { MaterialCategoryType, MaterialType } from "./types";

class MaterialService extends BaseService {
  private _apiURLMaterial: string;
  private _apiURLMaterialCategory: string;
  private _apiURLUnit: string;

  constructor() {
    super();

    this._apiURLMaterial = "/api/warehouse/material/";
    this._apiURLMaterialCategory = "/api/warehouse/material_category/";
    this._apiURLUnit = "/api/warehouse/unit/";
  }

  getMaterials = async (params = {}) => {
    return await this.getResource(this._apiURLMaterial, params);
  };

  createMaterial = async (material: MaterialType) => {
    return await this.createResourceJSON(this._apiURLMaterial, material);
  };

  getMaterial = async (pk: number, params = {}) => {
    return await this.getResource(`${this._apiURLMaterial}${pk}`, params);
  };

  updateMaterial = async (pk: number, material: MaterialType) => {
    return await this.updateResourceJSON(`${this._apiURLMaterial}${pk}`, material);
  };

  deleteMaterial = async (pk: number) => {
    return await this.deleteResource(`${this._apiURLMaterial}${pk}`);
  };

  getMaterialCategoryes = async (params = {}) => {
    return await this.getResource(this._apiURLMaterialCategory, params);
  };

  createMaterialCategory = async (category: MaterialCategoryType) => {
    return await this.createResourceJSON(this._apiURLMaterialCategory, category);
  };

  getMaterialCategory = async (pk: number) => {
    return await this.getResource(`${this._apiURLMaterialCategory}${pk}`);
  };

  updateMaterialCategory = async (pk: number, category: MaterialCategoryType) => {
    return await this.updateResourceJSON(`${this._apiURLMaterialCategory}${pk}`, category);
  };

  deleteMaterialCategory = async (pk: number) => {
    return await this.deleteResource(`${this._apiURLMaterialCategory}${pk}`);
  };

  getUnits = async (params = {}) => {
    return await this.getResource(this._apiURLUnit, params);
  };

  getMaterialRemains = async (params = {}) => {
    return await this.getResource(`${this._apiURLMaterial}remains/`, params);
  };

  getMaterialRemainsCategory = async (params = {}) => {
    return await this.getResource(`${this._apiURLMaterial}remains_category/`, params);
  };
}

export default MaterialService;
