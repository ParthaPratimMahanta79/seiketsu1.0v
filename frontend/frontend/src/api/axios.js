import axios from "axios";

const API = axios.create({
  baseURL: "https://seiketsu1-0v-3.onrender.com/api",
});

export default API;