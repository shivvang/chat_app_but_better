import axios from "axios";
import { HOST } from "@/utils/constant";

const apiCLient = axios.create({
  baseURL: HOST,
});
