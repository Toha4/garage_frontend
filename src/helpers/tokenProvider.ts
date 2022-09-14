import axios from "axios";
import api from "../services/api";
import { TokenResponseType } from "./types";


export const createTokenProvider = () => {
  const TOKEN_STORE_NAME = "token";
  let observers: any[] = [];

  let _refreshTokenRequest: Promise<boolean | undefined> | null = null;

  const getAccessToken = () => {
    const _token = localStorage.getItem(TOKEN_STORE_NAME) || null;
    return _token;
  };

  const requestValidAccessToken = async () => {
    try {
      const res = await axios.post<TokenResponseType>(
        `${api.defaults.baseURL}/api/auth/refresh/`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          // credentials: 'include',
          withCredentials: true
        }
      );

      const token = res.data;
      if (token) {
        setAccessToken(token);
        return true;
      }
    } catch (_error) {
      setAccessToken(null);
      return false;
    }
  };

  const updateAccessToken = async () => {
    // если не было запроса на обновление создаем запрос 
    // и запоминаем его в переменную для избежания race condition
    if (_refreshTokenRequest === null) {
      _refreshTokenRequest = requestValidAccessToken();
    }

    // а теперь резолвим этот запрос
    const result = await _refreshTokenRequest;
    _refreshTokenRequest = null;
    return result;
  };

  const isToken = () => {
    const _token = localStorage.getItem(TOKEN_STORE_NAME) || null;
    return !!_token;
  };

  const subscribe = (observer: any) => {
    observers.push(observer);
    const isLogged = isToken();
    observer(isLogged);
  };

  const unsubscribe = (observer: any) => {
    observers = observers.filter(_observer => _observer !== observer);
  };

  const notify = () => {
    const isLogged = isToken();
    observers.forEach(observer => observer(isLogged));
  };

  const setAccessToken = (token: TokenResponseType | null) => {
    if (token) {
      localStorage.setItem(TOKEN_STORE_NAME, token["access"]);
    } else {
      localStorage.removeItem(TOKEN_STORE_NAME);
    }
    notify();
  };

  return {
    getAccessToken,
    updateAccessToken,
    isToken,
    setAccessToken,
    subscribe,
    unsubscribe
  };
};
