import axios from "axios";
// import querystring from 'querystring';
const service = axios.create({
  // baseURL: import.meta.env.VITE_APP_BASE_API,
  baseURL: '/api',
  timeout: 5000,
});
service.interceptors.request.use(
  (config) => {
    //  if (config.method === 'post') {
    //    config.data = querystring.stringify(config.data);
    //  }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code === 200 || res.code === 0) {
      return res;
    } else {
      return Promise.reject({
        message: res.message || res.msg || "",
        msg: res.msg || "",
        status: res.code,
      });
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default service;

export const get = (url: string, params?: any) => {
  return service.get(url, { params });
};

export const post = (url: string, data: any) => {
  return service.post(url, data);
};

export const put = (url: string, data: any) => {
  return service.put(url, data);
};

export const del = (url: string, data: any) => {
  return service.delete(url, { data });
};