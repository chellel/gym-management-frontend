import { post } from "@/composables/request";

export const gymAdminLogin = (params: {
  username: string;
  password: string;
}) => {
  return post(`/system/gymAdminLogin`, params);
};