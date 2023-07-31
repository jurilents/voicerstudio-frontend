import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  //   'https://api-voicerstudio.azurewebsites.net',
  // 'https://api.voicer-demo.tacles.net',
});

api.interceptors.response.use(
  // success
  response => response,
  // error
  async (response) => {
    console.log('err', response.data);
    if (response?.data instanceof Blob) {
      const text = await response.data.text();
      const json = JSON.parse(text);
      toast.error(json.message);
    }
  },
);

export const credentialsApi = {
  secureCredentials: async (service, credentialsData) => {
    const result = await api.post(`v1/credentials/secure`, {
      service: service,
      data: credentialsData,
    });
    console.log('result', result);
    return result.data;
  },
};

export const languagesApi = {
  getAll: async (serviceName, credentials) => {
    const result = await api.get(`v1/speech-info/languages?service=${serviceName}`, {
      headers: { 'X-Credentials': credentials },
    });
    return result.data;
  },
};

export const speechApi = {
  // getDuration: async (body, credentials) => {
  //   const result = await api.post(`v1/text-2-speech/duration`, body, {
  //     headers: { 'X-Credentials': credentials },
  //     responseType: 'application/json',
  //   });
  //   return {
  //     baseDuration: +result.data.baseDuration,
  //   };
  // },
  single: async (body, credentials) => {
    const result = await api.post(`v1/text2speech/single`, body, {
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
    const result = await api.post(`v1/text2speech/batch`, body, {
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
