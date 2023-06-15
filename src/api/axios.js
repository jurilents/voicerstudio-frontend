import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

export const languagesApi = {
  getAll: async (credentials) => {
    const result = await api.get(`v1/speech-info/languages`, {
      headers: {
        'X-Credentials': credentials,
      },
    });
    return result.data;
  },
};
