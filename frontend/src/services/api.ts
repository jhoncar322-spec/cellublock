import axios, { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(email: string, password: string, name: string) {
    const response = await this.api.post('/auth/register', { email, password, name });
    return response.data;
  }

  async verifyAuth() {
    const response = await this.api.get('/auth/verify');
    return response.data;
  }

  async generateQR(expiresIn?: string) {
    const response = await this.api.post('/devices/generate-qr', { expiresIn });
    return response.data;
  }

  async enrollDevice(enrollmentToken: string, deviceInfo: any) {
    const response = await this.api.post('/devices/enroll', { enrollmentToken, deviceInfo });
    return response.data;
  }

  async getDevices(params?: any) {
    const response = await this.api.get('/devices', { params });
    return response.data;
  }

  async getDeviceById(deviceId: string) {
    const response = await this.api.get(`/devices/${deviceId}`);
    return response.data;
  }

  async blockDevice(deviceId: string, reason: string) {
    const response = await this.api.post(`/devices/${deviceId}/block`, { reason });
    return response.data;
  }

  async unblockDevice(deviceId: string, reason: string) {
    const response = await this.api.post(`/devices/${deviceId}/unblock`, { reason });
    return response.data;
  }

  async deleteDevice(deviceId: string) {
    const response = await this.api.delete(`/devices/${deviceId}`);
    return response.data;
  }

  async getStatistics() {
    const response = await this.api.get('/admin/statistics');
    return response.data;
  }

  async getLogs(params?: any) {
    const response = await this.api.get('/admin/logs', { params });
    return response.data;
  }
}

export default new ApiService();
