import Axios from "axios";
import { IOrder } from "../types/types";

const BASE_URL =
  process.env.NODE_ENV === "production" ? "api/" : "//localhost:3030/api/";

export const getTables = async () => {
  try {
    const query = BASE_URL + "tables/";
    const res = await Axios.get(query);
    return res.data;
  } catch (err) {
    console.log("Tables Query Failed");
    console.dir(err);
    throw err;
  }
};

export const getOrders = async () => {
  try {
    const query = BASE_URL + "orders/";
    const res = await Axios.get(query);
    return res.data;
  } catch (err) {
    console.log("Orders Query Failed");
    console.dir(err);
    throw err;
  }
};

export const saveCompleted = (order: any) => {
  const actionUrl = BASE_URL + `completed/${JSON.stringify(order)}`;
  Axios.get(actionUrl);
  // Axios.post(actionUrl, JSON.stringify(order));
};
