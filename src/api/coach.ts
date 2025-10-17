import { get, post, put, del } from "@/composables/request";

// 教练信息接口
export interface Coach {
  id: number
  name: string
  email: string
  phone: string
  avatar?: string
  experience: string
  status: 'active' | 'inactive' | 'suspended'
  hire_date: string
  bio?: string
  emergency_contact?: string
  emergency_phone?: string
  created_at: string
  updated_at: string
}

// 教练统计信息接口
export interface CoachStats {
  coach_id: number
  total_classes: number
  total_members: number
  monthly_classes: number
  monthly_members: number
}

// 教练排班接口
export interface CoachSchedule {
  id: number
  coach_id: number
  activity: string
  location: string
  date: string
  start_time: string
  end_time: string
  max_capacity: number
  current_bookings: number
  status: 'confirmed' | 'cancelled' | 'completed'
  notes?: string
}

// 查询参数接口
export interface CoachQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

// 创建教练参数接口
export interface CreateCoachParams {
  name: string
  email: string
  phone: string
  experience: string
  bio?: string
  emergency_contact?: string
  emergency_phone?: string
}

// 更新教练参数接口
export interface UpdateCoachParams {
  name?: string
  email?: string
  phone?: string
  experience?: string
  bio?: string
  emergency_contact?: string
  emergency_phone?: string
  status?: 'active' | 'inactive' | 'suspended'
}

// 教练管理API
export const coachApi = {
  // 获取教练列表
  getCoaches: (params?: CoachQueryParams) => {
    return get('/api/admin/coaches', { params })
  },

  // 获取单个教练信息
  getCoach: (id: number) => {
    return get(`/api/admin/coaches/${id}`)
  },

  // 创建教练
  createCoach: (data: CreateCoachParams) => {
    return post('/api/admin/coaches', data)
  },

  // 更新教练信息
  updateCoach: (id: number, data: UpdateCoachParams) => {
    return put(`/api/admin/coaches/${id}`, data)
  },

  // 删除教练
  deleteCoach: (id: number) => {
    return del(`/api/admin/coaches/${id}`, { data: { id } })
  },

  // 获取教练统计信息
  getCoachStats: (id: number, dateRange?: { start: string; end: string }) => {
    return get(`/api/admin/coaches/${id}/stats`, { 
      params: dateRange 
    })
  },

  // 获取教练排班
  getCoachSchedule: (id: number, dateRange?: { start: string; end: string }) => {
    return get(`/api/admin/coaches/${id}/schedule`, { 
      params: dateRange 
    })
  },

  // 更新教练排班
  updateCoachSchedule: (id: number, scheduleId: number, data: Partial<CoachSchedule>) => {
    return put(`/api/admin/coaches/${id}/schedule/${scheduleId}`, data)
  },

  // 添加教练排班
  addCoachSchedule: (id: number, data: Omit<CoachSchedule, 'id' | 'coach_id'>) => {
    return post(`/api/admin/coaches/${id}/schedule`, data)
  },

  // 删除教练排班
  deleteCoachSchedule: (id: number, scheduleId: number) => {
    return del(`/api/admin/coaches/${id}/schedule/${scheduleId}`, { data: { id: scheduleId, coach_id: id   } })
  },

  // 获取教练学员列表
  getCoachMembers: (id: number, params?: { page?: number; limit?: number; search?: string }) => {
    return get(`/api/admin/coaches/${id}/members`, { params })
  },

  // 获取教练课程评价
  getCoachReviews: (id: number, params?: { page?: number; limit?: number; date_range?: string }) => {
    return get(`/api/admin/coaches/${id}/reviews`, { params })
  },

  // 导出教练数据
  exportCoaches: (params?: CoachQueryParams) => {
    return get('/api/admin/coaches/export', { 
      params,
      responseType: 'blob'
    })
  },

  // 上传教练头像
  uploadCoachAvatar: (id: number, file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return post(`/api/admin/coaches/${id}/avatar`, formData)
  }
}

// 模拟数据生成函数（用于开发测试）
export const generateMockCoaches = (count: number = 10): Coach[] => {
  const specialties = [
    ['瑜伽', '普拉提'],
    ['力量训练', '功能性训练'],
    ['有氧运动', 'HIIT'],
    ['游泳', '水中健身'],
    ['拳击', '格斗'],
    ['舞蹈', '有氧舞蹈'],
    ['康复训练', '物理治疗'],
    ['营养指导', '体重管理']
  ]

  const certifications = [
    '瑜伽教练证',
    '普拉提教练证',
    '力量训练教练证',
    '有氧运动教练证',
    '游泳教练证',
    '拳击教练证',
    '舞蹈教练证',
    '康复训练师证',
    '营养师证',
    '急救证'
  ]

  const statuses: ('active' | 'inactive' | 'suspended')[] = ['active', 'inactive', 'suspended']

  return Array.from({ length: count }, (_, index) => {
    const id = index + 1
    const specialty = specialties[index % specialties.length]
    const certification = certifications.slice(0, Math.floor(Math.random() * 4) + 2)
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const hireDate = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)

    return {
      id,
      name: `教练${id}`,
      email: `coach${id}@gym.com`,
      phone: `138${String(id).padStart(8, '0')}`,
      avatar: null,
      specialty,
      experience: `${Math.floor(Math.random() * 10) + 1}年`,
      certifications: certification,
      status,
      hire_date: hireDate.toISOString().split('T')[0],
      salary: Math.floor(Math.random() * 10000) + 5000,
      commission_rate: Math.floor(Math.random() * 20) + 5,
      bio: `专业${specialty.join('、')}教练，拥有丰富的教学经验。`,
      emergency_contact: `紧急联系人${id}`,
      emergency_phone: `139${String(id).padStart(8, '0')}`,
      created_at: hireDate.toISOString(),
      updated_at: new Date().toISOString()
    }
  })
}

export const generateMockCoachStats = (coachId: number): CoachStats => {
  return {
    coach_id: coachId,
    total_classes: Math.floor(Math.random() * 500) + 100,
    total_members: Math.floor(Math.random() * 200) + 50,
    monthly_classes: Math.floor(Math.random() * 50) + 10,
    monthly_members: Math.floor(Math.random() * 30) + 10
  }
}

