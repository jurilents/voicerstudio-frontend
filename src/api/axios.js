import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

api.interceptors.response.use(
  // success
  (response) => response,
  // error
  async (error) => {
    console.log('Server Error:', error);
    if (error && !error.data && error.response?.data) {
      error.data = error.response.data;
    }

    if (!error) {
      toast.error(`Unknown server error`);
    } else if (error.data instanceof Blob) {
      const text = await error.data.text();
      const json = JSON.parse(text);
      console.log('Error JSON:', json);

      if (json.message) {
        toast.error(json.message);
      } else if (json.status === 400 && json.errors instanceof Object) {
        toast.error((
          <>
            <strong>Validation Failed</strong>
            <ul>
              {Object.entries(json.errors).map(([key, messages]) => (
                <>
                  {messages.map((message, index) => (
                    <li key={index}>
                      {message?.endsWith('.') ? message.substring(0, message.length - 1) : message}
                    </li>
                  ))}
                </>
              ))}
            </ul>
          </>
        ));
      }
    } else if (error.code === 'ERR_NETWORK') {
      toast.error((
        <>
          <strong>Server is offline.</strong>
          Please, check your internet connection or wait until the server is up and running
          again.
          <em style={{ display: 'inline-block', marginTop: '15px' }}>
            If you see this message for a long time, please contact support:
          </em>
          <br />
          <a href='https://t.me/jurilents' style={{ color: 'var(--c-primary-light)' }}>@jurilents </a>
          (Rus/Ukr/Eng)
        </>
      ));
    } else if (!error.data) {
      toast.error(`Unknown error: ${error.message}`);
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
    const result = await api.get(`v1/text2speech/languages?service=${serviceName}`, {
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
    if (!result) return null;
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
