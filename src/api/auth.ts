import { getRequest, postRequest } from ".";

export const getOtp = (email: string) => {
  return postRequest("auth/otp", { email });
};

export const verifyOtp = (email: string, otp: string) => {
  return postRequest("auth/verify", { email, otp });
};

export const getSelf = () => {
  return getRequest("auth/self");
};