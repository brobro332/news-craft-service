import axios, { AxiosRequestConfig } from "axios";

const API_BASE_URL = "/api";

export const apiAxios = async <T = any,>(
  path: string,
  options?: AxiosRequestConfig
): Promise<T> => {
  const res = await axios(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  return (res.data as { data: T }).data;
};
