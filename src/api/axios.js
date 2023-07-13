import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  //   'https://api-voicerstudio.azurewebsites.net',
  // 'https://api.voicer-demo.tacles.net',
});

export const languagesApi = {
  getAll: async (serviceName, credentials) => {
    const result = await api.get(`v1/speech-info/languages?service=${serviceName}`, {
      headers: { 'X-Credentials': credentials },
    });
    return result.data;
  },
};

export const speechApi = {
  getDuration: async (body, credentials) => {
    const result = await api.post(`v1/speech/duration`, body, {
      headers: { 'X-Credentials': credentials },
      responseType: 'application/json',
    });
    return {
      baseDuration: +result.data.baseDuration,
    };
  },
  single: async (body, credentials) => {
    const result = await api.post(`v1/speech/single`, body, {
      headers: { 'X-Credentials': credentials },
      responseType: 'blob',
    });
    const blob = new Blob([result.data]);
    return {
      blob: blob,
      url: URL.createObjectURL(blob),
      duration: +result.headers['x-duration'],
      baseDuration: +result.headers['x-base-duration'],
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
      baseDuration: +result.headers['x-base-duration'],
    };
  },
};
