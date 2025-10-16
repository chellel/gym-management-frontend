import { ref, reactive } from 'vue'

// 教练服务
export const useCoachService = () => {
  // 教练信息
  const coachInfo = ref({
    id: 1,
    name: '李教练',
    specialty: '瑜伽/普拉提/冥想',
    email: 'coach@example.com',
    phone: '13800138000',
    avatar: null,
    experience: '5年',
    certifications: ['瑜伽教练证', '普拉提教练证', '冥想导师证']
  })

  // 教练课程数据
  const coachClasses = ref([])
  
  // 教练可用时间
  const coachAvailability = ref([])
  
  // 全局课程数据
  const globalSchedules = ref([])
  
  // 课程学员数据
  const classMembers = ref([])
  
  // 教练的所有学员数据
  const allMembers = ref([])
  
  // 学员历史记录
  const memberHistory = ref([])

  // 获取教练课程
  const getCoachClasses = async (coachId, dateRange = null) => {
    try {
      // 模拟API调用
      const mockClasses = generateMockClasses(coachId, dateRange)
      coachClasses.value = mockClasses
      return mockClasses
    } catch (error) {
      console.error('获取教练课程失败:', error)
      throw error
    }
  }

  // 获取教练可用时间
  const getCoachAvailability = async (coachId) => {
    try {
      // 模拟API调用
      const mockAvailability = generateMockAvailability(coachId)
      coachAvailability.value = mockAvailability
      return mockAvailability
    } catch (error) {
      console.error('获取教练可用时间失败:', error)
      throw error
    }
  }

  // 添加可用时间
  const addAvailability = async (availabilityData) => {
    try {
      const newAvailability = {
        id: Date.now(),
        coach_id: coachInfo.value.id,
        ...availabilityData,
        status: 'available',
        created_at: new Date().toISOString()
      }
      
      coachAvailability.value.push(newAvailability)
      return newAvailability
    } catch (error) {
      console.error('添加可用时间失败:', error)
      throw error
    }
  }

  // 更新可用时间
  const updateAvailability = async (id, updateData) => {
    try {
      const index = coachAvailability.value.findIndex(a => a.id === id)
      if (index > -1) {
        coachAvailability.value[index] = {
          ...coachAvailability.value[index],
          ...updateData,
          updated_at: new Date().toISOString()
        }
        return coachAvailability.value[index]
      }
      throw new Error('可用时间不存在')
    } catch (error) {
      console.error('更新可用时间失败:', error)
      throw error
    }
  }

  // 删除可用时间
  const deleteAvailability = async (id) => {
    try {
      const index = coachAvailability.value.findIndex(a => a.id === id)
      if (index > -1) {
        coachAvailability.value.splice(index, 1)
        return true
      }
      throw new Error('可用时间不存在')
    } catch (error) {
      console.error('删除可用时间失败:', error)
      throw error
    }
  }

  // 获取全局课程
  const getGlobalSchedules = async (date = null) => {
    try {
      // 模拟API调用
      const mockSchedules = generateMockGlobalSchedules(date)
      globalSchedules.value = mockSchedules
      return mockSchedules
    } catch (error) {
      console.error('获取全局课程失败:', error)
      throw error
    }
  }

  // 获取课程学员
  const getClassMembers = async (classId) => {
    try {
      // 模拟API调用
      const mockMembers = generateMockClassMembers(classId)
      classMembers.value = mockMembers
      return mockMembers
    } catch (error) {
      console.error('获取课程学员失败:', error)
      throw error
    }
  }

  // 学员签到
  const markAttendance = async (classId, memberId, status = 'present') => {
    try {
      const member = classMembers.value.find(m => m.id === memberId)
      if (member) {
        member.attendance_status = status
        member.attendance_time = new Date().toISOString()
        return member
      }
      throw new Error('学员不存在')
    } catch (error) {
      console.error('签到失败:', error)
      throw error
    }
  }

  // 批量签到
  const batchMarkAttendance = async (classId, memberIds, status = 'present') => {
    try {
      const updatedMembers = []
      memberIds.forEach(memberId => {
        const member = classMembers.value.find(m => m.id === memberId)
        if (member) {
          member.attendance_status = status
          member.attendance_time = new Date().toISOString()
          updatedMembers.push(member)
        }
      })
      return updatedMembers
    } catch (error) {
      console.error('批量签到失败:', error)
      throw error
    }
  }

  // 导出学员名单
  const exportClassMembers = async (classId) => {
    try {
      const members = classMembers.value.filter(m => m.class_id === classId)
      const csvContent = generateCSV(members)
      downloadCSV(csvContent, `课程学员名单_${classId}.csv`)
      return csvContent
    } catch (error) {
      console.error('导出学员名单失败:', error)
      throw error
    }
  }

  // 获取教练的所有学员
  const getCoachMembers = async (coachId) => {
    try {
      if (!coachId) {
        throw new Error('教练ID不能为空')
      }
      
      // 模拟API调用
      const mockMembers = generateMockCoachMembers(coachId)
      
      if (!mockMembers || !Array.isArray(mockMembers)) {
        throw new Error('返回的学员数据格式错误')
      }
      
      allMembers.value = mockMembers
      return mockMembers
    } catch (error) {
      console.error('获取教练学员失败:', error)
      // 设置空数组作为默认值
      allMembers.value = []
      throw error
    }
  }

  // 获取学员历史记录
  const getMemberHistory = async (memberId, dateRange = null) => {
    try {
      // 模拟API调用
      const mockHistory = generateMockMemberHistory(memberId, dateRange)
      memberHistory.value = mockHistory
      return mockHistory
    } catch (error) {
      console.error('获取学员历史记录失败:', error)
      throw error
    }
  }

  // 生成模拟课程数据
  const generateMockClasses = (coachId, dateRange) => {
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    
    return [
      {
        id: 1,
        coach_id: coachId,
        activity: '晨间瑜伽',
        location: '瑜伽室A',
        date: new Date(weekStart).toISOString().split('T')[0],
        start_time: '07:00',
        end_time: '08:00',
        notes: '适合初学者',
        max_capacity: 20,
        current_bookings: 15,
        status: 'confirmed'
      },
      {
        id: 2,
        coach_id: coachId,
        activity: '普拉提核心',
        location: '瑜伽室B',
        date: new Date(weekStart.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        start_time: '09:00',
        end_time: '10:00',
        notes: '核心训练',
        max_capacity: 15,
        current_bookings: 12,
        status: 'confirmed'
      },
      {
        id: 3,
        coach_id: coachId,
        activity: '冥想瑜伽',
        location: '冥想室',
        date: new Date(weekStart.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        start_time: '19:00',
        end_time: '20:00',
        notes: '心灵净化',
        max_capacity: 10,
        current_bookings: 8,
        status: 'confirmed'
      },
      {
        id: 4,
        coach_id: coachId,
        activity: '高温瑜伽',
        location: '高温瑜伽室',
        date: new Date(weekStart.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        start_time: '18:00',
        end_time: '19:00',
        notes: '深度排毒',
        max_capacity: 12,
        current_bookings: 10,
        status: 'confirmed'
      },
      {
        id: 5,
        coach_id: coachId,
        activity: '夜间瑜伽',
        location: '瑜伽室A',
        date: new Date(weekStart.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        start_time: '21:00',
        end_time: '22:00',
        notes: '改善睡眠',
        max_capacity: 15,
        current_bookings: 11,
        status: 'confirmed'
      }
    ]
  }

  // 生成模拟可用时间数据
  const generateMockAvailability = (coachId) => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    return [
      {
        id: 1,
        coach_id: coachId,
        date: new Date(nextWeek).toISOString().split('T')[0],
        start_time: '09:00',
        end_time: '12:00',
        notes: '上午时间段',
        status: 'available',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        coach_id: coachId,
        date: new Date(nextWeek.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        start_time: '14:00',
        end_time: '18:00',
        notes: '下午时间段',
        status: 'available',
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        coach_id: coachId,
        date: new Date(nextWeek.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        start_time: '19:00',
        end_time: '22:00',
        notes: '晚间时间段',
        status: 'available',
        created_at: new Date().toISOString()
      }
    ]
  }

  // 生成模拟全局课程数据
  const generateMockGlobalSchedules = (date) => {
    const targetDate = date || new Date()
    const dateStr = targetDate.toISOString().split('T')[0]
    
    return [
      {
        id: 1,
        activity: '晨间瑜伽',
        location: '瑜伽室A',
        trainer_name: '李教练',
        trainer_id: 1,
        start_time: '07:00',
        end_time: '08:00',
        date: dateStr,
        max_capacity: 20,
        current_bookings: 15
      },
      {
        id: 2,
        activity: '动感单车',
        location: '单车房',
        trainer_name: '王教练',
        trainer_id: 2,
        start_time: '19:00',
        end_time: '20:00',
        date: dateStr,
        max_capacity: 25,
        current_bookings: 20
      },
      {
        id: 3,
        activity: '力量训练',
        location: '器械区',
        trainer_name: '张教练',
        trainer_id: 3,
        start_time: '18:00',
        end_time: '19:00',
        date: dateStr,
        max_capacity: 15,
        current_bookings: 12
      },
      {
        id: 4,
        activity: '普拉提核心',
        location: '瑜伽室B',
        trainer_name: '陈教练',
        trainer_id: 4,
        start_time: '20:00',
        end_time: '21:00',
        date: dateStr,
        max_capacity: 15,
        current_bookings: 10
      }
    ]
  }

  // 生成模拟课程学员数据
  const generateMockClassMembers = (classId) => {
    const today = new Date()
    const bookingTime = new Date(today.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    
    return [
      {
        id: 1,
        class_id: classId,
        name: '张三',
        phone: '13800138001',
        email: 'zhangsan@example.com',
        membership_type: 'VIP',
        attendance_status: 'present',
        attendance_time: new Date().toISOString(),
        booking_time: bookingTime.toISOString(),
        emergency_contact: '13800138011',
        medical_notes: '无',
        notes: 'VIP会员，上课积极'
      },
      {
        id: 2,
        class_id: classId,
        name: '李四',
        phone: '13800138002',
        email: 'lisi@example.com',
        membership_type: '普通',
        attendance_status: 'present',
        attendance_time: new Date().toISOString(),
        booking_time: bookingTime.toISOString(),
        emergency_contact: '13800138012',
        medical_notes: '无',
        notes: '普通会员'
      },
      {
        id: 3,
        class_id: classId,
        name: '王五',
        phone: '13800138003',
        email: 'wangwu@example.com',
        membership_type: 'VIP',
        attendance_status: 'absent',
        attendance_time: null,
        booking_time: bookingTime.toISOString(),
        emergency_contact: '13800138013',
        medical_notes: '无',
        notes: 'VIP会员，今天请假'
      },
      {
        id: 4,
        class_id: classId,
        name: '赵六',
        phone: '13800138004',
        email: 'zhaoliu@example.com',
        membership_type: '普通',
        attendance_status: 'present',
        attendance_time: new Date().toISOString(),
        booking_time: bookingTime.toISOString(),
        emergency_contact: '13800138014',
        medical_notes: '无',
        notes: '普通会员'
      },
      {
        id: 5,
        class_id: classId,
        name: '孙七',
        phone: '13800138005',
        email: 'sunqi@example.com',
        membership_type: 'VIP',
        attendance_status: 'present',
        attendance_time: new Date().toISOString(),
        booking_time: bookingTime.toISOString(),
        emergency_contact: '13800138015',
        medical_notes: '无',
        notes: 'VIP会员'
      }
    ]
  }

  // 生成模拟学员数据
  const generateMockCoachMembers = (coachId) => {
    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    const threeMonthsAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)
    
    return [
      {
        id: 1,
        name: '张三',
        phone: '13800138001',
        email: 'zhangsan@example.com',
        membership_type: 'VIP',
        status: 'active',
        join_date: threeMonthsAgo.toISOString().split('T')[0],
        last_class_date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        class_count: 25,
        monthly_class_count: 8,
        preferred_class_type: '瑜伽',
        preferred_time: '晚上',
        fitness_goal: '减脂塑形',
        notes: 'VIP会员，上课积极，进步明显'
      },
      {
        id: 2,
        name: '李四',
        phone: '13800138002',
        email: 'lisi@example.com',
        membership_type: '普通',
        status: 'active',
        join_date: new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        last_class_date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        class_count: 15,
        monthly_class_count: 4,
        preferred_class_type: '普拉提',
        preferred_time: '上午',
        fitness_goal: '核心训练',
        notes: '普通会员，偶尔缺课'
      },
      {
        id: 3,
        name: '王五',
        phone: '13800138003',
        email: 'wangwu@example.com',
        membership_type: 'VIP',
        status: 'active',
        join_date: thirtyDaysAgo.toISOString().split('T')[0],
        last_class_date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        class_count: 12,
        monthly_class_count: 12,
        preferred_class_type: '冥想瑜伽',
        preferred_time: '晚上',
        fitness_goal: '放松身心',
        notes: '新VIP会员，上课频率很高'
      },
      {
        id: 4,
        name: '赵六',
        phone: '13800138004',
        email: 'zhaoliu@example.com',
        membership_type: '普通',
        status: 'inactive',
        join_date: new Date(today.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        last_class_date: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        class_count: 8,
        monthly_class_count: 0,
        preferred_class_type: '高温瑜伽',
        preferred_time: '下午',
        fitness_goal: '排毒养颜',
        notes: '最近很少来上课，需要关注'
      },
      {
        id: 5,
        name: '孙七',
        phone: '13800138005',
        email: 'sunqi@example.com',
        membership_type: 'VIP',
        status: 'active',
        join_date: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        last_class_date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        class_count: 6,
        monthly_class_count: 6,
        preferred_class_type: '瑜伽流',
        preferred_time: '早上',
        fitness_goal: '提升柔韧性',
        notes: '新会员，学习能力强'
      },
      {
        id: 6,
        name: '周八',
        phone: '13800138006',
        email: 'zhouba@example.com',
        membership_type: '普通',
        status: 'active',
        join_date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        last_class_date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        class_count: 4,
        monthly_class_count: 4,
        preferred_class_type: '普拉提',
        preferred_time: '晚上',
        fitness_goal: '产后恢复',
        notes: '产后妈妈，需要特别关注'
      }
    ]
  }

  // 生成模拟学员历史记录
  const generateMockMemberHistory = (memberId, dateRange) => {
    const today = new Date()
    const startDate = dateRange && dateRange[0] ? dateRange[0] : new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    const endDate = dateRange && dateRange[1] ? dateRange[1] : today
    
    return [
      {
        id: 1,
        member_id: memberId,
        class_name: '晨间瑜伽',
        location: '瑜伽室A',
        date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        start_time: '07:00',
        end_time: '08:00',
        attendance_status: 'present',
        rating: 5,
        feedback: '课程很棒，老师很专业'
      },
      {
        id: 2,
        member_id: memberId,
        class_name: '普拉提核心',
        location: '瑜伽室B',
        date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        start_time: '09:00',
        end_time: '10:00',
        attendance_status: 'present',
        rating: 4,
        feedback: '强度适中，很舒服'
      },
      {
        id: 3,
        member_id: memberId,
        class_name: '冥想瑜伽',
        location: '冥想室',
        date: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        start_time: '19:00',
        end_time: '20:00',
        attendance_status: 'present',
        rating: 5,
        feedback: '非常放松，睡眠质量提升了'
      },
      {
        id: 4,
        member_id: memberId,
        class_name: '高温瑜伽',
        location: '高温瑜伽室',
        date: new Date(today.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        start_time: '18:00',
        end_time: '19:00',
        attendance_status: 'absent',
        rating: null,
        feedback: null
      },
      {
        id: 5,
        member_id: memberId,
        class_name: '夜间瑜伽',
        location: '瑜伽室A',
        date: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        start_time: '21:00',
        end_time: '22:00',
        attendance_status: 'present',
        rating: 4,
        feedback: '晚上练习很舒服'
      }
    ]
  }

  // 生成CSV内容
  const generateCSV = (members) => {
    const headers = ['姓名', '电话', '邮箱', '会员类型', '签到状态', '签到时间', '预约时间']
    const rows = members.map(member => [
      member.name,
      member.phone,
      member.email,
      member.membership_type,
      member.attendance_status === 'present' ? '已签到' : '未签到',
      member.attendance_time ? new Date(member.attendance_time).toLocaleString('zh-CN') : '',
      new Date(member.booking_time).toLocaleString('zh-CN')
    ])
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')
    
    return csvContent
  }

  // 下载CSV文件
  const downloadCSV = (content, filename) => {
    const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return {
    // 数据
    coachInfo,
    coachClasses,
    coachAvailability,
    globalSchedules,
    classMembers,
    allMembers,
    memberHistory,
    
    // 方法
    getCoachClasses,
    getCoachAvailability,
    addAvailability,
    updateAvailability,
    deleteAvailability,
    getGlobalSchedules,
    getClassMembers,
    markAttendance,
    batchMarkAttendance,
    exportClassMembers,
    getCoachMembers,
    getMemberHistory
  }
}
