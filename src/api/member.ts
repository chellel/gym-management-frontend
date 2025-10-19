import { get, post, put, del } from "@/composables/request";

// 获取会员列表（分页）
export const getMemberList = (params: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}) => {
  return post(`/system/gymmember/list`, params);
};

// 获取会员详情
export const getMemberDetail = (id: number) => {
  return get(`/system/gymmember/${id}`);
};

// 创建新会员
export const createMember = (data: any) => {
  return post(`/system/gymmember/add`, data);
};

// 更新会员信息
export const updateMember = (data: any) => {
  return put(`/system/gymmember/edit`, data);
};

// 删除会员
export const stopMember = (id: number) => {
  return del(`/system/gymmember/${id}`, {});
};

// 获取会员统计信息
export const getMemberStats = () => {
  return get(`/system/gymmember/stats/summary`);
};
