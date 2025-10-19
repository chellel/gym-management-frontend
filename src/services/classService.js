import dayjs from 'dayjs'

// 课程数据服务
export const classService = {
  // 获取课程列表
  async getClasses(date = null) {
    try {
      const storedClasses = localStorage.getItem('gym_classes')
      let classes = storedClasses ? JSON.parse(storedClasses) : mockClasses

      // 更新当前参与人数（基于预约数据）
      const storedBookings = localStorage.getItem('gym_bookings')
      const bookings = storedBookings ? JSON.parse(storedBookings) : mockBookings
      
      return classes
    } catch (error) {
      console.error('Error fetching classes:', error)
      throw error
    }
  },

  // 添加课程
  async addClass(classData) {
    try {
      const storedClasses = localStorage.getItem('gym_classes')
      const classes = storedClasses ? JSON.parse(storedClasses) : mockClasses
      
      const newClass = {
        ...classData,
        id: Date.now(), // 简单的ID生成
        created_at: new Date().toISOString()
      }
      
      classes.push(newClass)
      localStorage.setItem('gym_classes', JSON.stringify(classes))
    } catch (error) {
      console.error('Error adding class:', error)
      throw error
    }
  },

  // 更新课程
  async updateClass(id, classData) {
    try {
      const storedClasses = localStorage.getItem('gym_classes')
      const classes = storedClasses ? JSON.parse(storedClasses) : mockClasses
      
      const index = classes.findIndex(cls => cls.id === id)
      if (index !== -1) {
        classes[index] = { ...classes[index], ...classData }
        localStorage.setItem('gym_classes', JSON.stringify(classes))
      }
    } catch (error) {
      console.error('Error updating class:', error)
      throw error
    }
  },


  // 课程预约
  async bookClass(classId, memberId) {
    try {
      const storedBookings = localStorage.getItem('gym_bookings')
      const bookings = storedBookings ? JSON.parse(storedBookings) : mockBookings
      
      const newBooking = {
        id: Date.now(),
        class_id: classId,
        member_id: memberId,
        booking_date: new Date().toISOString(),
        status: 'confirmed'
      }
      
      bookings.push(newBooking)
      localStorage.setItem('gym_bookings', JSON.stringify(bookings))
    } catch (error) {
      console.error('Error booking class:', error)
      throw error
    }
  },

  // 取消预约
  async cancelBooking(classId, memberId) {
    try {
      const storedBookings = localStorage.getItem('gym_bookings')
      const bookings = storedBookings ? JSON.parse(storedBookings) : mockBookings
      
      const filteredBookings = bookings.filter(booking => 
        !(booking.class_id === classId && booking.member_id === memberId)
      )
      localStorage.setItem('gym_bookings', JSON.stringify(filteredBookings))
    } catch (error) {
      console.error('Error canceling booking:', error)
      throw error
    }
  },

  // 获取会员的预约记录
  async getMemberBookings(memberId) {
    try {
      const storedBookings = localStorage.getItem('gym_bookings')
      const bookings = storedBookings ? JSON.parse(storedBookings) : mockBookings
      
      const storedClasses = localStorage.getItem('gym_classes')
      const classes = storedClasses ? JSON.parse(storedClasses) : mockClasses
      
      const memberBookings = bookings
        .filter(booking => booking.member_id === memberId)
        .map(booking => {
          const classInfo = classes.find(cls => cls.id === booking.class_id)
          return {
            ...booking,
            classes: classInfo
          }
        })
        .sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date))

      return memberBookings
    } catch (error) {
      console.error('Error fetching member bookings:', error)
      throw error
    }
  }
}

// 模拟课程数据
export const mockClasses = [
  // 今天的课程
  {
    id: 1,
    name: '晨间瑜伽',
    instructor: '李教练',
    date: dayjs().format('YYYY-MM-DD'),
    start_time: '07:00',
    end_time: '08:00',
    location: '瑜伽室A',
    max_participants: 20,
    current_participants: 15,
    description: '适合初学者的晨间瑜伽课程，帮助唤醒身体，开启美好一天。',
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: 2,
    name: '动感单车',
    instructor: '王教练',
    date: dayjs().format('YYYY-MM-DD'),
    start_time: '19:00',
    end_time: '20:00',
    location: '单车房',
    max_participants: 25,
    current_participants: 22,
    description: '高强度有氧运动，配合动感音乐，燃烧卡路里。',
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: 3,
    name: '力量训练基础',
    instructor: '张教练',
    date: dayjs().format('YYYY-MM-DD'),
    start_time: '18:00',
    end_time: '19:00',
    location: '器械区',
    max_participants: 15,
    current_participants: 8,
    description: '专业力量训练指导，适合初学者，增强肌肉力量。',
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: 4,
    name: '普拉提核心',
    instructor: '陈教练',
    date: dayjs().format('YYYY-MM-DD'),
    start_time: '20:00',
    end_time: '21:00',
    location: '瑜伽室B',
    max_participants: 18,
    current_participants: 12,
    description: '专注于核心肌群训练，改善身体姿态和平衡。',
    created_at: '2024-01-15T08:00:00Z'
  },

  // 明天的课程
  {
    id: 5,
    name: '晨跑团',
    instructor: '刘教练',
    date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    start_time: '06:30',
    end_time: '07:30',
    location: '户外跑道',
    max_participants: 30,
    current_participants: 25,
    description: '户外晨跑，呼吸新鲜空气，提升心肺功能。',
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: 6,
    name: '高温瑜伽',
    instructor: '李教练',
    date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    start_time: '09:00',
    end_time: '10:00',
    location: '高温瑜伽室',
    max_participants: 15,
    current_participants: 10,
    description: '在高温环境下进行瑜伽练习，深度排毒。',
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: 7,
    name: '拳击训练',
    instructor: '赵教练',
    date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    start_time: '19:30',
    end_time: '20:30',
    location: '拳击台',
    max_participants: 12,
    current_participants: 9,
    description: '专业拳击技巧训练，提升反应速度和协调性。',
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: 8,
    name: '有氧舞蹈',
    instructor: '孙教练',
    date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    start_time: '20:00',
    end_time: '21:00',
    location: '舞蹈室',
    max_participants: 25,
    current_participants: 20,
    description: '跟随音乐节奏的有氧舞蹈，享受运动的乐趣。',
    created_at: '2024-01-15T08:00:00Z'
  },

  // 后天的课程
  {
    id: 9,
    name: '游泳训练',
    instructor: '周教练',
    date: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    start_time: '07:00',
    end_time: '08:00',
    location: '游泳池',
    max_participants: 20,
    current_participants: 16,
    description: '专业游泳技巧指导，提升游泳水平。',
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: 10,
    name: 'HIIT高强度训练',
    instructor: '张教练',
    date: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    start_time: '18:00',
    end_time: '19:00',
    location: '多功能训练区',
    max_participants: 20,
    current_participants: 18,
    description: '高强度间歇训练，快速燃脂塑形。',
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: 11,
    name: '瑜伽流',
    instructor: '李教练',
    date: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    start_time: '19:00',
    end_time: '20:00',
    location: '瑜伽室A',
    max_participants: 20,
    current_participants: 14,
    description: '流畅的瑜伽动作串联，提升身体柔韧性。',
    created_at: '2024-01-15T08:00:00Z'
  },

  // 本周其他课程
  {
    id: 12,
    name: '泰拳训练',
    instructor: '赵教练',
    date: dayjs().add(3, 'day').format('YYYY-MM-DD'),
    start_time: '19:00',
    end_time: '20:00',
    location: '泰拳训练区',
    max_participants: 15,
    current_participants: 11,
    description: '传统泰拳技巧训练，提升格斗技能。',
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: 13,
    name: '拉伸放松',
    instructor: '陈教练',
    date: dayjs().add(3, 'day').format('YYYY-MM-DD'),
    start_time: '21:00',
    end_time: '21:30',
    location: '瑜伽室B',
    max_participants: 25,
    current_participants: 18,
    description: '深度拉伸课程，缓解肌肉紧张，促进恢复。',
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: 14,
    name: '杠铃操',
    instructor: '王教练',
    date: dayjs().add(4, 'day').format('YYYY-MM-DD'),
    start_time: '18:30',
    end_time: '19:30',
    location: '器械区',
    max_participants: 20,
    current_participants: 16,
    description: '使用杠铃进行全身训练，增强肌肉力量。',
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: 15,
    name: 'Zumba舞蹈',
    instructor: '孙教练',
    date: dayjs().add(4, 'day').format('YYYY-MM-DD'),
    start_time: '20:00',
    end_time: '21:00',
    location: '舞蹈室',
    max_participants: 30,
    current_participants: 28,
    description: '热情的拉丁舞蹈，在音乐中燃烧卡路里。',
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: 16,
    name: '冥想瑜伽',
    instructor: '李教练',
    date: dayjs().add(5, 'day').format('YYYY-MM-DD'),
    start_time: '08:00',
    end_time: '09:00',
    location: '冥想室',
    max_participants: 15,
    current_participants: 8,
    description: '结合冥想和瑜伽，净化心灵，放松身心。',
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: 17,
    name: 'CrossFit训练',
    instructor: '张教练',
    date: dayjs().add(5, 'day').format('YYYY-MM-DD'),
    start_time: '19:00',
    end_time: '20:00',
    location: 'CrossFit训练区',
    max_participants: 12,
    current_participants: 10,
    description: '高强度功能性训练，全面提升身体素质。',
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: 18,
    name: '水中健身',
    instructor: '周教练',
    date: dayjs().add(6, 'day').format('YYYY-MM-DD'),
    start_time: '10:00',
    end_time: '11:00',
    location: '游泳池',
    max_participants: 20,
    current_participants: 12,
    description: '在水中进行的有氧运动，对关节友好。',
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: 19,
    name: '太极课程',
    instructor: '吴教练',
    date: dayjs().add(6, 'day').format('YYYY-MM-DD'),
    start_time: '09:00',
    end_time: '10:00',
    location: '太极练习区',
    max_participants: 25,
    current_participants: 20,
    description: '传统太极拳练习，修身养性，强身健体。',
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: 20,
    name: '夜间瑜伽',
    instructor: '陈教练',
    date: dayjs().add(6, 'day').format('YYYY-MM-DD'),
    start_time: '21:00',
    end_time: '22:00',
    location: '瑜伽室A',
    max_participants: 18,
    current_participants: 15,
    description: '舒缓的夜间瑜伽，帮助放松，改善睡眠质量。',
    created_at: '2024-01-15T08:00:00Z'
  }
]

// 模拟预约数据
export const mockBookings = [
  {
    id: 1,
    class_id: 1,
    member_id: 1,
    booking_date: '2024-01-15T08:30:00Z',
    status: 'confirmed'
  },
  {
    id: 2,
    class_id: 2,
    member_id: 1,
    booking_date: '2024-01-15T18:30:00Z',
    status: 'confirmed'
  },
  {
    id: 3,
    class_id: 3,
    member_id: 2,
    booking_date: '2024-01-15T17:30:00Z',
    status: 'confirmed'
  },
  {
    id: 4,
    class_id: 5,
    member_id: 3,
    booking_date: '2024-01-16T06:00:00Z',
    status: 'confirmed'
  },
  {
    id: 5,
    class_id: 6,
    member_id: 1,
    booking_date: '2024-01-16T08:30:00Z',
    status: 'confirmed'
  },
  {
    id: 6,
    class_id: 7,
    member_id: 4,
    booking_date: '2024-01-16T19:00:00Z',
    status: 'confirmed'
  },
  {
    id: 7,
    class_id: 8,
    member_id: 2,
    booking_date: '2024-01-16T19:30:00Z',
    status: 'confirmed'
  },
  {
    id: 8,
    class_id: 9,
    member_id: 5,
    booking_date: '2024-01-17T06:30:00Z',
    status: 'confirmed'
  },
  {
    id: 9,
    class_id: 10,
    member_id: 3,
    booking_date: '2024-01-17T17:30:00Z',
    status: 'confirmed'
  },
  {
    id: 10,
    class_id: 11,
    member_id: 1,
    booking_date: '2024-01-17T18:30:00Z',
    status: 'confirmed'
  },
  {
    id: 11,
    class_id: 12,
    member_id: 6,
    booking_date: '2024-01-18T18:30:00Z',
    status: 'confirmed'
  },
  {
    id: 12,
    class_id: 13,
    member_id: 2,
    booking_date: '2024-01-18T20:30:00Z',
    status: 'confirmed'
  },
  {
    id: 13,
    class_id: 14,
    member_id: 4,
    booking_date: '2024-01-19T18:00:00Z',
    status: 'confirmed'
  },
  {
    id: 14,
    class_id: 15,
    member_id: 7,
    booking_date: '2024-01-19T19:30:00Z',
    status: 'confirmed'
  },
  {
    id: 15,
    class_id: 16,
    member_id: 1,
    booking_date: '2024-01-20T07:30:00Z',
    status: 'confirmed'
  },
  {
    id: 16,
    class_id: 17,
    member_id: 3,
    booking_date: '2024-01-20T18:30:00Z',
    status: 'confirmed'
  },
  {
    id: 17,
    class_id: 18,
    member_id: 8,
    booking_date: '2024-01-21T09:30:00Z',
    status: 'confirmed'
  },
  {
    id: 18,
    class_id: 19,
    member_id: 9,
    booking_date: '2024-01-21T08:30:00Z',
    status: 'confirmed'
  },
  {
    id: 19,
    class_id: 20,
    member_id: 2,
    booking_date: '2024-01-21T20:30:00Z',
    status: 'confirmed'
  }
]
