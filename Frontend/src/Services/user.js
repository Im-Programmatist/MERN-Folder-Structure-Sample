import axios from "../utils/axios";
import axiosDefault from "../utils/axiosDefault";
const URL = process.env.REACT_APP_ADMIN_API;

export default class CityService {
  getUsers = (id) => axiosDefault.post(`${URL}cities`, { state_id: id });
  fetchUsersCities = (data) => axios.post(`user/city/list`,data);
}
