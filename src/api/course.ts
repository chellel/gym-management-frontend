import { get, post, put, del } from "@/composables/request";

// 课程信息接口
export interface Course {
  id: number
  name: string
  description?: string
  duration_minutes: number
  create_by: string
  create_time: string
  update_by: string
  update_time: string
  remark?: string
  is_deleted: number
  delete_time?: string
}

// 课程分页响应接口
export interface PageResult<T> {
  code: number;
  msg: string;
  rows: T[];
  total: number;
}

export interface CourseListResponse extends PageResult<Course> {}

// 课程表单数据接口
export interface CourseFormData {
  name: string
  description?: string
  duration_minutes: number
  remark?: string
}

// 获取课程列表（分页）
export const getCourseList = (params: {
  page?: number;
  pageSize?: number;
  search?: string;
  is_deleted?: number;
}) => {
  return post(`/system/gymcourse/list`, params) as unknown as Promise<CourseListResponse>;
};

// 获取课程详情
export const getCourseDetail = (id: number) => {
  return get(`/system/gymcourse/${id}`);
};

// 创建新课程
export const createCourse = (data: CourseFormData) => {
  return post(`/system/gymcourse/add`, data);
};

// 更新课程信息
export const updateCourse = (data: CourseFormData & { id: number }) => {
  return post(`/system/gymcourse/edit`, data);
};

// 删除课程（软删除）
export const deleteCourse = (id: number) => {
  return del(`/system/gymcourse/${id}`, {});
};

// 恢复已删除的课程
export const restoreCourse = (id: number) => {
  return post(`/system/gymcourse/restore/${id}`, {});
};

// 获取课程统计信息
export const getCourseStats = () => {
  return get(`/courses/stats`);
};
