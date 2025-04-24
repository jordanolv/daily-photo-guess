import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:6049/api',
  headers: {
    'Content-Type': 'application/json'
  }
});
