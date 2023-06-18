import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

export const languagesApi = {
  getAll: async (credentials) => {
    const result = await api.get(`v1/speech-info/languages`, {
      headers: { 'X-Credentials': credentials },
    });
    return result.data;
  },
};

export const speechApi = {
  single: async (body, credentials) => {
    const result = await api.post(`v1/speech/single`, body, {
      headers: { 'X-Credentials': credentials },
      responseType: 'blob',
    });
    return {
      url: URL.createObjectURL(new Blob([result.data])),
      duration: +result.headers['x-duration'],
    };
  },
  batch: async (body, credentials) => {
    const result = await api.post(`v1/speech/batch`, body, {
      headers: { 'X-Credentials': credentials },
      responseType: 'blob',
    });
    return {
      url: URL.createObjectURL(new Blob([result.data])),
      duration: +result.headers['x-duration'],
    };
  },
};
