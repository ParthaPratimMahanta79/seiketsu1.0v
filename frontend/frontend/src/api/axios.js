import axios from "axios";

const API = axios.create({
  baseURL: 'https://seiketsu-backend.onrender.com/api'
});

export default API;