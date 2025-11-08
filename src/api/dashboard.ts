import { get, post, put, del } from "@/composables/request";

export const getDashboardData = () => {
  return get("/system/dashboard");
};

// 获取KPI指标数据
export const getKpiData = (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  return get("/system/dashboard/kpis", params);
};

// 获取会员增长趋势数据
export const getMemberGrowthData = (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  return get("/system/dashboard/member-growth", params);
};

// 获取课程预约Top5数据
export const getClassBookingTop5 = (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  return get("/system/dashboard/class-booking-top5", params);
};

// 获取训练高峰期数据
export const getPeakHoursData = (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  return get("/system/dashboard/peak-hours", params);
};

// 获取会员详细数据
export const getMemberDetails = (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  return get("/system/dashboard/member-details", params);
};

// 获取课程详细数据
export const getClassDetails = (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  return get("/system/dashboard/class-details", params);
};
