import { get } from "@/composables/request";

export const getPlanList = () => {
  return get(`/api/member/plan`);
};