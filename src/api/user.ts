import { get, post } from "@/composables/request";

// 用户登录
export const gymLogin = (params: {
  username: string;
  password: string;
}) => {
  return post(`/system/gymLogin`, params);
};

export const getPlanList = () => {
  return get(`/api/member/plan`);
};