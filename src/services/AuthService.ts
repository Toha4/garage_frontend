import { useState, useEffect } from "react";
import axios from "axios";
import BaseService from './BaseService';
import { createTokenProvider } from "../helpers/tokenProvider";
import { TokenResponseType } from "../helpers/types";

const tokenProvider = createTokenProvider();

export const { isToken } = tokenProvider;
export const { getAccessToken } = tokenProvider;
export const { updateAccessToken } = tokenProvider;

export interface IUser {
  pk: number;
  first_name: string
  last_name: string;
  initials: string;
  full_name: string;
  edit_access: boolean;
  is_superuser: boolean;
};


export const useAuth = () => {
  const _AuthService = new AuthService();

  const [isLogged, setIsLogged] = useState<boolean | null>(null);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const listener = (newIsLogged: boolean) => {
      setIsLogged(newIsLogged);
    };

    tokenProvider.subscribe(listener);
    return () => {
      tokenProvider.unsubscribe(listener);
    };
  }, []);

  useEffect(() => {
    if (isLogged) {
      _AuthService.getUser()
        .then((data) => setUser(data))
        .catch((error) => console.log(error));
    }
  }, [isLogged])

  return { isLogged, user };
};


class AuthService extends BaseService {
  private _apiURL: string;
  private _loginURL: string;
  private _logoutURL: string;

  constructor() {
    super();

    this._apiURL = '/api/';
    this._loginURL = `${this.apiBase}${this._apiURL}auth/login/`;
    this._logoutURL = `${this.apiBase}${this._apiURL}auth/logout/`;
  }

  login = async (params = {}) => {
    const response = await axios.post<TokenResponseType>(
      this._loginURL,
      JSON.stringify(params, this.toJson),
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        withCredentials: true
      }
    );

    try {
      const token = response.data;
      tokenProvider.setAccessToken(token)
    } catch (error) {
      return Promise.reject(error);
    }

    return Promise.resolve(response);
  };

  logout = async () => {
    const response = await axios.post<any>(
      this._logoutURL,
      {},
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });

    tokenProvider.setAccessToken(null);
    return Promise.resolve(response);
  };

  getUser = async () => {
    return await this.getResource(
      `${this._apiURL}users/me/`
    );
  };
}

export default new AuthService();