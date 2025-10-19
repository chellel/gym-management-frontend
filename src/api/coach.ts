import { get, post, put, del } from "@/composables/request";

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

// 教练统计信息接口
export interface CoachStats {
  coach_id: number
  total_classes: number
  total_members: number
  monthly_classes: number
  monthly_members: number
}

// 教练信息接口
export interface Coach {
  id: number
  userId: string
  name: string
  phone: string
  email: string
  gender: number
  birthDate: string
  role: string
  status: string
  experience?: string
  description?: string
  hireDate?: string
  remark?: string
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string
  isDeleted: number
}

export interface CoachScheduleMember {
  id: number
  scheduleId: number
  memberId: number
  memberName: string
  memberPhone: string
}

export interface PageResult<T> {
  code: number;
  msg: string;
  rows: T[];
  total: number;
}

export interface CoachListResponse extends PageResult<Coach> {
}

// 获取教练列表（分页）
export const getCoachList = (params: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}) => {
  return post(`/system/gymcoach/list`, params) as unknown as Promise<CoachListResponse>;
};

// 获取教练详情
export const getCoachDetail = (id: number) => {
  return get(`/system/gymcoach/${id}`);
};

// 创建新教练
export const createCoach = (data: any) => {
  return post(`/system/gymcoach/add`, data);
};

// 更新教练信息
export const updateCoach = (data: any) => {
  return post(`/system/gymcoach/edit`, data);
};

// 删除教练
export const deleteCoach = (id: number) => {
  return del(`/system/gymcoach/${id}`, {});
};

// 获取教练统计信息
export const getCoachStats = () => {
  return get(`/coaches/stats`);
};

// 获取教练排班
export const getCoachSchedule = (id: number, params?: {
  start_date?: string;
  end_date?: string;
}) => {
  return get(`/coaches/${id}/schedule`, { params });
};

// 添加教练排班
export const addCoachSchedule = (id: number, data: {
  activity: string;
  location: string;
  date: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  notes?: string;
}) => {
  return post(`/coaches/${id}/schedule`, data);
};

// 更新教练排班
export const updateCoachSchedule = (id: number, scheduleId: number, data: {
  activity?: string;
  location?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  max_capacity?: number;
  status?: string;
  notes?: string;
}) => {
  return put(`/coaches/${id}/schedule/${scheduleId}`, data);
};

// 删除教练排班
export const deleteCoachSchedule = (id: number, scheduleId: number) => {
  return del(`/coaches/${id}/schedule/${scheduleId}`, {});
};

// 模拟数据生成函数（用于开发测试）
export const generateMockCoaches = (count: number = 10): Coach[] => {
  const statuses: string[] = ['active', 'inactive', 'suspended']

  return Array.from({ length: count }, (_, index) => {
    const id = index + 1
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const hireDate = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)

    return {
      id,
      userId: `C${String(id).padStart(3, '0')}`,
      name: `教练${id}`,
      email: `coach${id}@gym.com`,
      phone: `139${String(id).padStart(8, '0')}`,
      gender: Math.floor(Math.random() * 2),
      birthDate: new Date(1980 + Math.floor(Math.random() * 20), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      role: 'coach',
      status,
      experience: `${Math.floor(Math.random() * 10) + 1}年`,
      description: `专业教练，拥有丰富的教学经验。`,
      hireDate: hireDate.toISOString().split('T')[0],
      remark: `教练${id}的备注信息`,
      createBy: 'admin',
      createTime: hireDate.toISOString(),
      updateBy: 'admin',
      updateTime: new Date().toISOString(),
      isDeleted: 0
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

