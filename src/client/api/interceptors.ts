import { Axios } from "axios";

export module AxiosInterceptors {
  export function authBearerToken(axios: Axios, token?: string) {
    axios.interceptors.request.use(
      (config) => {
        const authorization = `Bearer ${token}`;
        (config.headers || {}).authorization = authorization;
        return config;
      },
      (error) => Promise.reject(error)
    );
  }
}
