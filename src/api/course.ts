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

// 模拟数据生成函数（用于开发测试）
export const generateMockCourses = (count: number = 15): Course[] => {
  const courseNames = [
    '瑜伽基础班', '普拉提核心训练', '动感单车', '杠铃操', '力量训练',
    'HIIT高强度训练', 'CrossFit训练', '拳击训练', '泰拳训练', '游泳训练',
    '有氧舞蹈', 'Zumba舞蹈', '太极课程', '冥想瑜伽', '高温瑜伽',
    '拉伸放松', '水中健身', '晨跑团', '夜跑团', '户外徒步'
  ];

  const descriptions = [
    '适合初学者的瑜伽课程，帮助建立正确的体式基础',
    '专注于核心肌群训练的普拉提课程',
    '高强度的有氧运动，燃烧卡路里',
    '使用杠铃进行全身力量训练',
    '专业的器械力量训练指导',
    '高强度间歇训练，快速燃脂',
    '功能性训练，提升整体体能',
    '拳击技巧训练，提高反应能力',
    '泰拳格斗技巧学习',
    '游泳技巧指导和水中健身',
    '跟随音乐节奏的有氧舞蹈',
    '拉丁风格的舞蹈健身',
    '传统太极养生课程',
    '结合冥想的瑜伽练习',
    '高温环境下的瑜伽练习',
    '肌肉拉伸和放松课程',
    '水中进行的低冲击健身',
    '早晨户外跑步训练',
    '夜间跑步训练',
    '户外徒步健身活动'
  ];

  return Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    const name = courseNames[index % courseNames.length];
    const description = descriptions[index % descriptions.length];
    const duration = [30, 45, 60, 75, 90][Math.floor(Math.random() * 5)];
    const createTime = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);

    return {
      id,
      name: `${name}${index >= courseNames.length ? ` ${Math.floor(index / courseNames.length) + 1}` : ''}`,
      description,
      duration_minutes: duration,
      create_by: 'admin',
      create_time: createTime.toISOString(),
      update_by: 'admin',
      update_time: new Date().toISOString(),
      remark: `${name}的备注信息`,
      is_deleted: 0,
      delete_time: null
    };
  });
};

// 课程类型枚举
export const COURSE_TYPES = {
  YOGA: '瑜伽',
  PILATES: '普拉提',
  CARDIO: '有氧',
  STRENGTH: '力量',
  MARTIAL_ARTS: '格斗',
  DANCE: '舞蹈',
  SWIMMING: '游泳',
  OUTDOOR: '户外',
  MIND_BODY: '身心',
  SPECIALTY: '特色'
} as const;

// 课程难度等级
export const COURSE_LEVELS = {
  BEGINNER: '初级',
  INTERMEDIATE: '中级',
  ADVANCED: '高级',
  ALL_LEVELS: '全级别'
} as const;
