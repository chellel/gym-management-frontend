// 课程数据服务
export const classService = {
  // 获取课程列表
  async getClasses(date = null) {
    try {
      const storedClasses = localStorage.getItem('gym_classes')
      let classes = storedClasses ? JSON.parse(storedClasses) : mockClasses

      if (date) {
        classes = classes.filter(cls => cls.date === date)
      }

      // 排序
      classes.sort((a, b) => {
        if (a.date !== b.date) {
          return new Date(a.date) - new Date(b.date)
        }
        return a.start_time.localeCompare(b.start_time)
      })

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

  // 删除课程
  async deleteClass(id) {
    try {
      const storedClasses = localStorage.getItem('gym_classes')
      const classes = storedClasses ? JSON.parse(storedClasses) : mockClasses
      
      const filteredClasses = classes.filter(cls => cls.id !== id)
      localStorage.setItem('gym_classes', JSON.stringify(filteredClasses))
    } catch (error) {
      console.error('Error deleting class:', error)
      throw error
    }
  },

  // 课程预约
  async bookClass(classId, memberId) {
    try {
      const storedBookings = localStorage.getItem('gym_bookings')
      const bookings = storedBookings ? JSON.parse(storedBookings) : []
      
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
      const bookings = storedBookings ? JSON.parse(storedBookings) : []
      
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
      const bookings = storedBookings ? JSON.parse(storedBookings) : []
      
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
  {
    id: 1,
    name: '瑜伽课程',
    instructor: '李教练',
    date: '2024-01-20',
    start_time: '09:00',
    end_time: '10:00',
    location: '瑜伽室A',
    max_participants: 20,
    current_participants: 15,
    description: '适合初学者的瑜伽课程，帮助放松身心。',
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: 2,
    name: '动感单车',
    instructor: '王教练',
    date: '2024-01-20',
    start_time: '19:00',
    end_time: '20:00',
    location: '单车房',
    max_participants: 25,
    current_participants: 22,
    description: '高强度有氧运动，燃烧卡路里。',
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: 3,
    name: '力量训练',
    instructor: '张教练',
    date: '2024-01-21',
    start_time: '10:00',
    end_time: '11:30',
    location: '器械区',
    max_participants: 15,
    current_participants: 8,
    description: '专业力量训练指导，增强肌肉力量。',
    created_at: '2024-01-15T08:00:00Z'
  }
]
