import { get, post, put, del } from "@/composables/request";

// 会员信息接口
export interface Member {
  id: number;
  userCode: string;
  userName: string;
  phone: string;
  email?: string;
  gender: number;
  birthDate?: string;
  role: string;
  userStatus: string;
  membershipType?: string;
  membershipExpireDate?: string;
  remainingDays?: number;
  remark?: string;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  isDeleted: number;
}

// 会员套餐类型接口
export interface MembershipType {
  id: number;
  typeCode: string;
  typeName: string;
  durationDays: number;
  price: number;
  originalPrice?: number;
  description?: string;
  benefits?: string;
  isUnlimited: boolean;
  isRefundable: boolean;
  refundPolicy?: string;
  status: string;
  sortOrder: number;
  remark?: string;
}

// 会员会籍办理请求接口
export interface MembershipRenewalRequest {
  memberId: number;
  membershipTypeId: number;
  startDate?: string; // 会籍开始日期，不填则从当前到期日期后开始或从今天开始
  discountAmount?: number; // 优惠金额
  remark?: string;
}

// 会员续费响应接口
export interface MembershipRenewalResponse {
  id: number;
  memberId: number;
  membershipTypeId: number;
  membershipType: string;
  startDate: string;
  expireDate: string;
  price: number;
  discountAmount: number;
  finalAmount: number;
  renewalType: string;
  status: string;
  remark?: string;
  createTime: string;
}

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

// 获取会员套餐类型列表
export const getMembershipTypes = (params?: {
  status?: string;
  sortOrder?: boolean;
}) => {
  return get(`/system/membershipType/list`, params);
};

// 获取会员当前会籍信息
export const getMemberMembership = (memberId: number) => {
  return get(`/system/membership/member/${memberId}`);
};

// 会员续费
export const renewMembership = (data: MembershipRenewalRequest) => {
  return post(`/system/membership/renew`, data);
};

// 获取会员续费历史
export const getMembershipHistory = (memberId: number, params?: {
  page?: number;
  pageSize?: number;
}) => {
  return get(`/system/membership/history/${memberId}`, params);
};

// 计算会籍价格
export const calculateRenewalPrice = (data: {
  memberId: number;
  membershipTypeId: number;
  startDate?: string;
  discountAmount?: number;
}) => {
  return post(`/system/membership/calculate-price`, data);
};

// 获取会员统计信息
export const getMemberStats = () => {
  return get(`/system/gymmember/stats/summary`);
};
