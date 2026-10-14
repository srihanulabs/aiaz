import { api } from "./axiosClient";
export const httpGet = async (reqUrl: string) => {
  const resp = await api.get(`${reqUrl}`);
  return resp;
};

export const httpPost = async (reqUrl: string, data: unknown) => {
  const postRequest = await api.post(reqUrl, data);
  return postRequest;
};
