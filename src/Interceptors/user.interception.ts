import axios from "axios";

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    
    // Xử lý authentication errors
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      // Không cần navigate ở đây vì AuthProvider sẽ xử lý
      console.log('Authentication error: Token expired or invalid');
    }
    
    return Promise.reject(error);
  });