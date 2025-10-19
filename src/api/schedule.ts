import { get, post, put, del } from "@/composables/request";

// 排班信息接口
export interface Schedule {
  id: number;
  courseId: number;
  coachId: number;
  coachName: string;
  courseName: string;
  startTime: string;
  endTime: string;
  location: string;
  maxCapacity: number;
  status: "waiting" | "cancelled" | "completed";
  remark?: string;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
  isDeleted: number;
  deleteTime?: string;
}

// 排班分页响应接口
export interface PageResult<T> {
  code: number;
  msg: string;
  rows: T[];
  total: number;
}

export interface ScheduleListResponse extends PageResult<Schedule> {}

// 排班表单数据接口
export interface ScheduleFormData {
  courseId: number;
  coachId: number;
  startTime: string;
  endTime: string;
  location: string;
  maxCapacity: number;
  status: "waiting" | "cancelled" | "completed";
  remark?: string;
}

// 排班查询参数接口
export interface ScheduleQueryParams {
  page?: number;
  pageSize?: number;
  coachId?: number;
  courseId?: number;
  location?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  isDeleted?: number;
}

// 获取排班列表（分页）
export const getScheduleList = (params: ScheduleQueryParams) => {
  return post(`/system/gymschedule/list`, params) as unknown as Promise<ScheduleListResponse>;
};

// 获取排班详情
export const getScheduleDetail = (id: number) => {
  return get(`/system/gymschedule/${id}`);
};

// 创建新排班
export const createSchedule = (data: ScheduleFormData) => {
  return post(`/system/gymschedule/add`, data);
};

// 更新排班信息
export const updateSchedule = (data: ScheduleFormData & { id: number }) => {
  return post(`/system/gymschedule/edit`, data);
};

export const deleteSchedule = (id: number) => {
  return post(`/system/gymschedule/remove`, { id });
};

// 恢复已删除的排班
export const restoreSchedule = (id: number) => {
  return post(`/system/gymschedule/restore/${id}`, {});
};

// 获取排班统计信息
export const getScheduleStats = () => {
  return get(`/schedules/stats`);
};

// 获取教练排班
export const getCoachSchedules = (coachId: number, params?: { startDate?: string; endDate?: string }) => {
  return get(`/schedules/coach/${coachId}`, params);
};

// 获取场地排班
export const getLocationSchedules = (locationId: number, params?: { startDate?: string; endDate?: string }) => {
  return get(`/schedules/location/${locationId}`, params);
};
