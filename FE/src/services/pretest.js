import API from "./api";

export const getPretestResult = async () => {
  const res = await API.get("/pretest/result");
  return res.data;
};