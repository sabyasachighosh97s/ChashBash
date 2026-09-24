// src/api/client.ts

import axios, {
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

import {
  BASE_URL,
  PROBLEM_HISTORY_BASE_URL,
  NOMINATIM_BASE_URL,
} from '../config/env';

import { API_ROUTES } from './routes';
// ==========================================
// AXIOS INSTANCE
// ==========================================

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// ==========================================
// AUTH HEADER
// ==========================================

const getAuthHeaders = (token?: string) => {
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// ==========================================
// GET
// ==========================================

export const apiGet = async <T = any>(
  url: string,
  token?: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  return apiClient.get<T>(url, {
    ...config,

    headers: {
      ...getAuthHeaders(token),
      ...(config?.headers || {}),
    },
  });
};

// ==========================================
// POST
// ==========================================

export const apiPost = async <T = any>(
  url: string,
  data?: any,
  token?: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  return apiClient.post<T>(url, data, {
    ...config,

    headers: {
      ...getAuthHeaders(token),
      ...(config?.headers || {}),
    },
  });
};

// ==========================================
// PUT
// ==========================================

export const apiPut = async <T = any>(
  url: string,
  data?: any,
  token?: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  return apiClient.put<T>(url, data, {
    ...config,

    headers: {
      ...getAuthHeaders(token),
      ...(config?.headers || {}),
    },
  });
};

// ==========================================
// DELETE
// ==========================================

export const apiDelete = async <T = any>(
  url: string,
  token?: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  return apiClient.delete<T>(url, {
    ...config,

    headers: {
      ...getAuthHeaders(token),
      ...(config?.headers || {}),
    },
  });
};

// ==========================================
// NOMINATIM REVERSE GEOCODING GET
// ==========================================

export const nominatimReverseGet = async <T = any>(
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  return axios.get<T>(
    `${NOMINATIM_BASE_URL}${API_ROUTES.GET.NOMINATIM_REVERSE}`,
    {
      ...config,
      headers: {
        'User-Agent': 'ChashBash/1.0',
        ...(config?.headers || {}),
      },
    },
  );
};

// ==========================================
// PROBLEM HISTORY GET
// ==========================================

export const problemHistoryGet = async <T = any>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  const fullUrl = `${PROBLEM_HISTORY_BASE_URL}${url}`;
  // console.log('URL:', fullUrl);
  // console.log('PARAMS:', config?.params);
;

  return axios.get<T>(fullUrl, {
    ...config,
  });
};

// ==========================================
// PROBLEM HISTORY COMMENTS GET
// ==========================================

export const problemHistoryCommentsGet = async <T = any>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  const fullUrl = `${PROBLEM_HISTORY_BASE_URL}${url}`;

  // console.log('URL:', fullUrl);


  return axios.get<T>(fullUrl, {
    ...config,
  });
};

// ==========================================
// DEFAULT AXIOS INSTANCE
// ==========================================

export default apiClient;