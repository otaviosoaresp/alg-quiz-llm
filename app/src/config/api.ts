import { AxiosHttpClient } from '../infra/http/AxiosHttpClient';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const httpClient = new AxiosHttpClient(API_BASE_URL);