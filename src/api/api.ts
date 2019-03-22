import axios, { AxiosResponse } from 'axios';
import { API } from '../store/const';
import { Survey } from '../store';
import { authHeader } from '../helpers/global';

export default {
  login(payload): Promise<AxiosResponse> {
    return axios.post(`${API}/api/accounts`, payload, { headers: authHeader() });
  },
  createSurvey(payload: Survey): Promise<AxiosResponse> {
    return axios.post(`${API}/api/surveys`, payload, { headers: authHeader() });
  },

  getSurveyList(): Promise<AxiosResponse> {
    return axios.get(`${API}/api/surveys`, { headers: authHeader() });
  },

  getSurveyDetail(id): Promise<AxiosResponse> {
    return axios.get(`${API}/api/surveys/${id}`);
  },

  modifySurvey({_id, title, questions}: Survey): Promise<AxiosResponse> {
    return axios.put(`${API}/api/surveys/${_id}`, {
      _id,
      title,
      questions
    }, {
      headers: authHeader()
    });
  },

  deleteSurvey(id): Promise<AxiosResponse> {
    return axios.delete(`${API}/api/surveys/${id}`, { headers: authHeader() });
  },

  requestDeploySurvey(id): Promise<AxiosResponse> {
    return axios.post(`${API}/api/surveys/${id}`, {} ,{ headers: authHeader() });
  },

  getResponseDetail(id, participant): Promise<AxiosResponse> {
    return axios.get(`${API}/api/response/${id}/${participant}`);
  },

  submitResponse(payload): Promise<AxiosResponse> {
    return axios.post(`${API}/api/response/${payload.survey_id}`, payload, { headers: authHeader() });
  },

  getResponseResult(id): Promise<AxiosResponse> {
    return axios.get(`${API}/api/response/${id}`, { headers: authHeader() });
  }
};
