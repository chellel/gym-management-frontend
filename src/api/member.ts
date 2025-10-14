import { get, post, put, del } from "@/composables/request";

// 获取会员列表（分页）
export const getMemberList = (params: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}) => {
  return post(`/system/user/list`, params);
};

// 获取会员详情
export const getMemberDetail = (id: number) => {
  return get(`/users/${id}`);
};

// 创建新会员
export const createMember = (data: {
  name: string;
  member_id: string;
  phone: string;
  email?: string;
  membership_type: string;
  expire_date: string;
  join_date?: string;
}) => {
  return post(`/users`, data);
};

// 更新会员信息
export const updateMember = (id: number, data: {
  name?: string;
  member_id?: string;
  phone?: string;
  email?: string;
  membership_type?: string;
  expire_date?: string;
}) => {
  return put(`/users/${id}`, data);
};

// 删除会员
export const deleteMember = (id: number) => {
  return del(`/users/${id}`, {});
};

// 获取会员统计信息
export const getMemberStats = () => {
  return get(`/users/stats`);
};

// 获取会员套餐列表（保留原有功能）
export const getPlanList = () => {
  return get(`/member/plan`);
};