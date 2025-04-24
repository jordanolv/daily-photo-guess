import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://94.130.72.168:6049/api',
  headers: {
    'Content-Type': 'application/json'
  }
});
