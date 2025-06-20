const API_BASE_URL = "http://localhost:3000";

export const apiFetch = (path: string, options?: RequestInit) => {
  return fetch(`${API_BASE_URL}${path}`, options);
};
