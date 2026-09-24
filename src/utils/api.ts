// import axios, {
//   AxiosError,
//   AxiosInstance,
//   AxiosRequestConfig,
//   AxiosResponse,
// } from 'axios';
// // import NetInfo from '@react-native-community/netinfo';
// // import qs from 'qs';
// // import CryptoJS from 'crypto-js';
// // import {Toast} from '@sekizlipenguen/react-native-popup-confirm-toast';
// // import {AlertMesg} from '../Common/ToastAlert';
// // import {getItem, removeItem} from '../../config/getDataFromStorage';
// // import {resetTo} from './NavigationUtils';
// // import {cacheManager} from './mmkvStorage';
// import {BASE_URL} from '../config/env';

// interface ApiResponse<T = any> {
//   data: T;
//   status: number;
//   fromCache?: boolean;
//   isOffline?: boolean;
// }

// interface ApiError {
//   status: number;
//   data: any;
// }

// interface RequestMetadata {
//   startTime: number;
// }

// interface CustomAxiosRequestConfig extends AxiosRequestConfig {
//   metadata?: RequestMetadata;
// }

// const STORAGE_KEYS: string[] = [
//   'logoImageData',
//   'loginUser_data',
//   'profileImgData',
//   'userNameData',
//   'userType',
//   'bottomBannerData',
//   'topBannerData',
//   'currency',
//   'fcmToken',
//   'company_website',
// ];

// const delay = (ms: number): Promise<void> =>
//   new Promise(resolve => setTimeout(resolve, ms));

// const SLOW_THRESHOLD = 30000;

// const instance: AxiosInstance = axios.create({
//   baseURL: BASE_URL,
//   timeout: 50000,
// });

// instance.interceptors.request.use(
//   (config: CustomAxiosRequestConfig): CustomAxiosRequestConfig => {
//     config.metadata = {
//       startTime: new Date().getTime(),
//     };
//     return config;
//   },
// );

// const setupInterceptors = (): void => {
//   const encKey = 'greenQube_96740_64428';

//   instance.interceptors.response.use(
//     (response: AxiosResponse): AxiosResponse | ApiResponse => {
//       const start = (response.config as CustomAxiosRequestConfig)?.metadata
//         ?.startTime;

//       if (start && new Date().getTime() - start > SLOW_THRESHOLD) {
//         // Slow network detected
//       }

//       try {
//         const encrypted = findField(response?.data, 'respo');
//         const ivHex = findField(response?.data, 'eid');

//         if (encrypted && ivHex) {
//           const keyBytes = CryptoJS.SHA256(encKey);
//           const ivBytes = CryptoJS.enc.Hex.parse(ivHex);

//           const cipherParams = CryptoJS.lib.CipherParams.create({
//             ciphertext: CryptoJS.enc.Hex.parse(encrypted),
//           });

//           const decrypted = CryptoJS.AES.decrypt(
//             cipherParams,
//             keyBytes,
//             {
//               iv: ivBytes,
//               mode: CryptoJS.mode.CBC,
//               padding: CryptoJS.pad.Pkcs7,
//             },
//           );

//           const parsed = JSON.parse(
//             decrypted.toString(CryptoJS.enc.Utf8),
//           );

//           return {
//             data: parsed,
//             status: 200,
//           };
//         }
//       } catch (err) {
//         console.error('Decryption failed:', err);
//       }

//       return response;
//     },
//     (error: AxiosError) => Promise.reject(error),
//   );
// };

// setupInterceptors();

// const isInternetAvailable = async (
//   silent: boolean = false,
// ): Promise<boolean> => {
//   const state = await NetInfo.fetch();

//   const connected = !!(
//     state.isConnected &&
//     state.isInternetReachable
//   );

//   if (!connected && !silent) {
//     Toast.show({
//       time: 2,
//       text: 'You are offline. Showing cached data.',
//       ...AlertMesg[0],
//     });
//   }

//   return connected;
// };

// const logCurl = ({
//   url,
//   method,
//   headers,
//   body,
// }: {
//   url: string;
//   method: string;
//   headers?: Record<string, any>;
//   body?: any;
// }): void => {
//   let curl = `curl -X ${method} 'http://134.209.155.11:4003/${url}'`;

//   Object.entries(headers || {}).forEach(([key, value]) => {
//     curl += ` \\\n  -H '${key}: ${value}'`;
//   });

//   if (body) {
//     if (body instanceof FormData) {
//       (body as any)._parts.forEach(([key, value]: any[]) => {
//         if (typeof value === 'object' && value?.uri) {
//           curl += ` \\\n  -F '${key}=@${value.uri}'`;
//         } else {
//           curl += ` \\\n  -F '${key}=${value}'`;
//         }
//       });
//     } else if (
//       typeof body === 'string' &&
//       body.includes('=')
//     ) {
//       curl += ` \\\n  --data '${body}'`;
//     } else {
//       const jsonBody =
//         typeof body === 'string'
//           ? body
//           : JSON.stringify(body, null, 2);

//       curl += ` \\\n  --data '${jsonBody}'`;
//     }
//   }

//   console.log('\n🚀 ====== CURL REQUEST ======\n');
//   console.log(curl);
//   console.log('\n==============================\n');
// };

// export const axiosGet = async <T = any>(
//   url: string,
//   token: string | null = null,
//   extraHeaders: Record<string, any> = {},
//   abortController: AbortController | null = null,
// ): Promise<ApiResponse<T>> => {
//   const cacheKey = `GET_${url}`;
//   const online = await isInternetAvailable(true);

//   if (!online) {
//     const cached = cacheManager.getCache(cacheKey);

//     if (cached) {
//       return {
//         data: cached,
//         status: 200,
//         fromCache: true,
//       };
//     }

//     throw {
//       status: 0,
//       data: {
//         message: 'No internet & no cache',
//       },
//     };
//   }

//   logCurl({
//     url,
//     method: 'GET',
//     headers: {
//       ...(token && {Authorization: token}),
//       ...extraHeaders,
//     },
//   });

//   try {
//     const response = await instance.get<T>(url, {
//       headers: {
//         ...(token && {Authorization: token}),
//         ...extraHeaders,
//       },
//       signal: abortController?.signal,
//     });

//     cacheManager.setCache(cacheKey, response.data);

//     return response as ApiResponse<T>;
//   } catch (error) {
//     throw await handleError(error as AxiosError);
//   }
// };

// export const axiosPost = async <T = any>(
//   url: string,
//   body: any,
//   token: string | null = null,
//   isUrlEncoded = false,
//   extraHeaders: Record<string, any> = {},
//   abortController: AbortController | null = null,
// ): Promise<ApiResponse<T>> => {
//   const online = await isInternetAvailable(true);

//   if (!online) {
//     cacheManager.addToQueue({
//       url,
//       body,
//       token,
//       isUrlEncoded,
//       extraHeaders,
//       method: 'POST',
//     });

//     return {
//       data: {
//         message: 'Queued Locally',
//       } as T,
//       status: 202,
//       isOffline: true,
//     };
//   }

//   const payload = isUrlEncoded
//     ? qs.stringify(body)
//     : body;

//   const headers = {
//     'Content-Type': isFormData(body)
//       ? 'multipart/form-data'
//       : isUrlEncoded
//       ? 'application/x-www-form-urlencoded'
//       : 'application/json',
//     ...(token && {Authorization: token}),
//     ...extraHeaders,
//   };

//   logCurl({
//     url,
//     method: 'POST',
//     headers,
//     body: payload,
//   });

//   try {
//     return (await instance.post<T>(url, payload, {
//       headers,
//       signal: abortController?.signal,
//     })) as ApiResponse<T>;
//   } catch (error) {
//     throw await handleError(error as AxiosError);
//   }
// };

// export const axiosPut = async <T = any>(
//   url: string,
//   body: any,
//   token: string | null = null,
//   isUrlEncoded = false,
//   extraHeaders: Record<string, any> = {},
//   abortController: AbortController | null = null,
// ): Promise<ApiResponse<T>> => {
//   const online = await isInternetAvailable(true);

//   const headers = {
//     'Content-Type': isFormData(body)
//       ? 'multipart/form-data'
//       : isUrlEncoded
//       ? 'application/x-www-form-urlencoded'
//       : 'application/json',
//     ...(token && {Authorization: token}),
//     ...extraHeaders,
//   };

//   const payload = isUrlEncoded
//     ? qs.stringify(body)
//     : body;

//   try {
//     return (await instance.put<T>(url, payload, {
//       headers,
//       signal: abortController?.signal,
//     })) as ApiResponse<T>;
//   } catch (error) {
//     throw await handleError(error as AxiosError);
//   }
// };

// export const axiosDelete = async (
//   url: string,
//   token: string | null = null,
//   extraHeaders: Record<string, any> = {},
//   abortController: AbortController | null = null,
// ): Promise<ApiResponse> => {
//   try {
//     return (await instance.delete(url, {
//       headers: {
//         ...(token && {Authorization: token}),
//         ...extraHeaders,
//       },
//       signal: abortController?.signal,
//     })) as ApiResponse;
//   } catch (error) {
//     throw await handleError(error as AxiosError);
//   }
// };

// function findField(
//   obj: any,
//   keyToFind: string,
// ): any {
//   if (obj === null || typeof obj !== 'object') {
//     return undefined;
//   }

//   if (obj.hasOwnProperty(keyToFind)) {
//     return obj[keyToFind];
//   }

//   for (const key in obj) {
//     if (typeof obj[key] === 'object') {
//       const result = findField(
//         obj[key],
//         keyToFind,
//       );

//       if (result !== undefined) {
//         return result;
//       }
//     }
//   }

//   return undefined;
// }

// const isFormData = (
//   data: any,
// ): data is FormData => data instanceof FormData;

// const handleError = async (
//   error: AxiosError,
// ): Promise<ApiError> => {
//   if (axios.isCancel(error)) {
//     return {
//       status: 499,
//       data: {
//         message: 'Request cancelled',
//       },
//     };
//   }

//   if (error.code === 'ECONNABORTED') {
//     return {
//       status: 408,
//       data: {
//         message: 'Request timed out',
//       },
//     };
//   }

//   if (
//     error.response?.status === 401 &&
//     (error.response?.data as any)?.data?.code ===
//       'TOKEN_EXPIRED'
//   ) {
//     await delay(3000);

//     resetTo('Login', {
//       locale:
//         getItem('loginUser_data')?.lan_id || 1,
//     });

//     await Promise.all(
//       STORAGE_KEYS.map(key => removeItem(key)),
//     );
//   }

//   return {
//     status: error.response?.status || 500,
//     data:
//       error.response?.data || {
//         message: 'Connection error',
//       },
//   };
// };

// export default {
//   getInstance: () => instance,
//   axiosGet,
//   axiosPost,
//   axiosPut,
//   axiosDelete,
// };

import axios from 'axios';
import { PROBLEM_HISTORY_BASE_URL } from '../config/env';

const api = axios.create({
  baseURL: PROBLEM_HISTORY_BASE_URL,
  // baseURL: 'http://188.166.254.225:9900',
  timeout: 30000,
});

export default api;