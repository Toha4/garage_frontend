import api from "./api";
import { getFormData, getSearchParams, toJson } from "../helpers/service";

export default class BaseService {
  protected apiBase: string | undefined;

  constructor() {
    this.apiBase = process.env.REACT_APP_API_URL;
  }

  getResource = async (url: string, params = {}) => {
    const response = await api({
      url: `${url}${getSearchParams(params)}`,
    });

    const responseOK = response && response.status === 200 && response.statusText === "OK";
    if (!responseOK) {
      throw new Error(`Could not fetch ${url}, received ${response.status}.`);
    }

    return response.data;
  };

  createResourceFormData = async (url: string, data: any) => {
    const response = await api({
      method: "POST",
      url: url,
      data: getFormData(data),
    });
    if (response.status !== 200) {
      throw response;
    }

    return response.data;
  };

  createResourceJSON = async (url: string, data = {}) => {
    const response = await api({
      method: "POST",
      url: url,
      data: JSON.stringify(data, toJson),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status !== 201) {
      throw response;
    }

    return response.data;
  };

  updateResourceJSON = async (url: string, data: any) => {
    const response = await api({
      method: "PUT",
      url: url,
      data: JSON.stringify(data, toJson),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status !== 200) {
      throw response;
    }

    return response.data;
  };

  updateResourceFormData = async (url: string, data: any) => {
    const response = await api({
      method: "PUT",
      url: url,
      data: getFormData(data),
    });
    if (response.status !== 200) {
      throw response;
    }

    return response.data;
  };

  partialUpdate = async (url: string, data: any) => {
    const response = await api({
      method: "PATCH",
      url: url,
      data: JSON.stringify(data, toJson),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status !== 200) {
      throw response;
    }

    return response.data;
  };

  deleteResource = async (url: string, params = {}) => {
    const response = await api({
      method: "DELETE",
      url: `${url}${getSearchParams(params)}`,
    });
    if (response.status !== 204) {
      throw new Error(`Could not fetch ${url}, received ${response.status}.`);
    }

    return response;
  };
}
