import api from "./api";


export default class BaseService {
  protected apiBase: string | undefined;

  constructor() {
    this.apiBase = process.env.REACT_APP_API_URL;
  }

  getSearchParams = (params: any) => {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (params.hasOwnProperty(key) && value) {
        if (value instanceof Array) {
          if (value.length > 0) searchParams.set(key, value.join(','));
        } else {
          searchParams.set(key, `${value}`);
        }
      }
    }

    let result = searchParams.toString();
    if (result.length > 0) {
      result = `?${result}`;
    }
    return result;
  };

  getFormData = (params: any) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(params)) {
      if (params.hasOwnProperty(key) && value) {
        formData.append(key, `${value}`);
      }
    }

    return formData;
  };

  toJson = (key: string, value: any) => {
    if (
      value ||
      value == null ||
      typeof value == "boolean" ||
      typeof value == "string" ||
      typeof value == "number"
    )
      return value;
  }

  getResource = async (url: string, params = {}) => {
    const response = await api({
      url: `${url}${this.getSearchParams(params)}`
    });

    const responseOK = response && response.status === 200 && response.statusText === 'OK';
    if (!responseOK) {
      throw new Error(
        `Could not fetch ${url}, received ${response.status}.`
      )
    }

    return response.data;
  };

  createResourceFormData = async (url: string, data: any) => {
    const response = await api(
      {
        method: 'POST',
        url: url,
        data: this.getFormData(data),
      });
    if (response.status !== 200) {
      throw response;
    }

    return response.data;
  };

  createResourceJSON = async (url: string, data = {}) => {
    const response = await api(
      {
        method: 'POST',
        url: url,
        data: JSON.stringify(data, this.toJson),
        headers: {
          "Content-Type": "application/json"
        }
      });
    if (response.status !== 201) {
      throw response;
    }

    return response.data;
  };

  updateResourceJSON = async (url: string, data: any) => {
    const response = await api(
      {
        method: 'PUT',
        url: url,
        data: JSON.stringify(data, this.toJson),
        headers: {
          "Content-Type": "application/json"
        }
      });
    if (response.status !== 200) {
      throw response;
    }

    return response.data;
  };

  updateResourceFormData = async (url: string, data: any) => {
    const response = await api(
      {
        method: 'PUT',
        url: url,
        data: this.getFormData(data),
      });
    if (response.status !== 200) {
      throw response;
    }

    return response.data;
  };

  partialUpdate = async (url: string, data: any) => {
    const response = await api(
      {
        method: 'PATCH',
        url: url,
        data: JSON.stringify(data, this.toJson),
        headers: {
          "Content-Type": "application/json"
        }
      });
    if (response.status !== 200) {
      throw response;
    }

    return response.data;
  };

  deleteResource = async (url: string, params = {}) => {
    const response = await api(
      {
        method: 'DELETE',
        url: `${url}${this.getSearchParams(params)}`,
      });
    if (response.status !== 204) {
      throw new Error(
        `Could not fetch ${url}, received ${response.status}.`
      )
    }

    return response;
  };
}
