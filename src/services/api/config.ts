import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';

const ENV = {
  development: {
    BASE_URL: Platform.OS === 'ios' ? 'https://support.deverp.net': 'http://support.deverp.net',
    TIMEOUT: 30000,
  },
  staging: {
    BASE_URL: Platform.OS === 'ios' ? 'https://support.deverp.net' : 'http://support.deverp.net',
    TIMEOUT: 30000,
  },
  production: {
    BASE_URL: Platform.OS === 'ios' ? 'https://support.deverp.net' :'http://support.deverp.net',
    TIMEOUT: 30000,
  },
};

const getEnvVars = () => ENV.development;
const { BASE_URL, TIMEOUT } = getEnvVars();

export interface ApiResponse<T = any> {
  d?: string;
  success?: string | number;
  message?: string;
  data?: T;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  data?: any;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

function unwrapString(value: any): any {
  if (typeof value !== 'string') return value;

  let current = value;
  while (true) {
    try {
      const parsed = JSON.parse(current);
      if (typeof parsed === 'string') {
        current = parsed;
      } else {
        return parsed;
      }
    } catch {
      return current;
    }
  }
}

function deepClean(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(deepClean);
  } else if (obj !== null && typeof obj === 'object') {
    const cleaned: any = {};
    for (const key in obj) {
      if (['Data', 'footer'].includes(key)) {
        cleaned[key] = String(obj[key]);
      } else {
        cleaned[key] = deepClean(obj[key]);
      }
    }
    return cleaned;
  } else {
    return unwrapString(obj);
  }
}

apiClient.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      return Promise.reject({
        message: 'No internet connection',
        statusCode: 0,
      });
    }

    const token = await AsyncStorage.getItem('erp_token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  error => Promise.reject(error),
);
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    try {
      console.log("🚀 ~ response:", response)
      if (response.data && response.data.d) {
        let raw = response?.data?.d;
        console.log('🚀 ~----------------- raw:',);
        let parsedData: any;

        try { 
          if (typeof raw === 'string') {
            let sanitized = raw.replace(/[\u0000-\u001F]+/g, '');
            sanitized = sanitized.replace(/^\uFEFF/, '');

            // Fix escaped quotes: \" -> "
            sanitized = sanitized.replace(/\\"/g, '"');

            // Optional: remove double-escaped backslashes \\n -> \n
            sanitized = sanitized.replace(/\\\\n/g, '');
            sanitized = sanitized.replace(/\\\\/g, '');
 
            parsedData = JSON.parse(sanitized);
          } else if (typeof raw === 'object') {
            parsedData = raw;
          } else {
            throw new Error('Unsupported response format');
          }
        } catch (error) {
          console.log('🚀 ~ JSON parse error:', error, '\nraw:', raw);
          if (typeof raw === 'string' && raw.includes(',')) {
            const [successPart, ...msgParts] = raw.split(',');
            parsedData = {
              success: successPart.trim(),
              message: msgParts.join(',').trim(),
            };
          } else {
            parsedData = { message: raw };
          }
        }

        const cleanedData = deepClean(parsedData);

        if (String(cleanedData.success) !== '0') {
          return {
            ...response,
            data: cleanedData,
          };
        } else {
          return Promise.reject({
            message: cleanedData.message || 'API request failed',
            statusCode: response.status,
            data: cleanedData,
          });
        }
      }
      return response;
    } catch (err) {
      console.error('❌ Failed to parse API response:', err);
      return Promise.reject({
        message: 'Invalid response format',
        statusCode: response.status,
        data: response.data,
      });
    }
  },
  error => {
    console.log('🚀 ~ error:', error);
    if (error.response) {
      return Promise.reject({
        message: error.response.data?.message || 'API error occurred',
        statusCode: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      return Promise.reject({
        message: 'No response from server',
        statusCode: 0,
      });
    } else {
      return Promise.reject({
        message: error.message || 'Unknown error occurred',
        statusCode: 0,
      });
    }
  },
);

export default apiClient;
