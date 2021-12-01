import { Axios } from "axios";

export module AxiosInterceptors {
  export function bearerToken(token: string) {
    return (axios: Axios) => {
      axios.interceptors.request.use(
        (config) => {
          const authorization = `Bearer ${token}`;
          (config.headers || {}).authorization = authorization;
          return config;
        },
        (error) => Promise.reject(error)
      );
    };
  }
}
