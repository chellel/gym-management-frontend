import { get, post, put, del } from '@/composables/request'

// 预约接口类型定义
export interface Booking {
  id: number
  scheduleId: number
  memberId: number
  bookingTime: string
  checkinTime?: string
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string
  remark?: string
  isDeleted: number
  deleteTime?: string
}

export interface BookingFormData {
  scheduleId: number
  memberId: number
  remark?: string
}

export interface BookingQueryParams {
  page?: number
  pageSize?: number
  scheduleId?: number
  memberId?: number
  startTime?: string
  endTime?: string
  isDeleted?: number
}

// 获取预约列表
export const getBookingList = (params?: BookingQueryParams) => {
  return post('/system/gymbooking/list', params)
}

// 获取预约详情
export const getBookingDetail = (id: number) => {
  return get(`/system/gymbooking/${id}`)
}

// 获取排班对应的预约详情
export const getBookingByScheduleId = (params: any) => {
  return post(`/system/gymbooking/schedule`, params)
}

// 创建预约
export const createBooking = (params: any) => {
  return post('/system/gymbooking/add', params)
}

// 更新预约
export const updateBooking = (id: number, data: Partial<BookingFormData>) => {
  return put(`/system/gymbooking/${id}`, data)
}

// 取消预约（软删除）
export const cancelBooking = (id: number) => {
  return post(`/system/gymbooking/remove`, { id })
}

// 签到
export const checkinBooking = (id: number) => {
  return post(`/system/gymbooking/checkin`, { id })
}


// 获取排班的预约列表
export const getScheduleBookings = (scheduleId: number) => {
  return get(`/system/gymbooking/schedule/${scheduleId}`)
}
