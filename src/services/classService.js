import { supabase } from '../supabase'

// 课程数据服务
export const classService = {
  // 获取课程列表
  async getClasses(date = null) {
    let query = supabase
      .from('classes')
      .select('*')

    if (date) {
      query = query.eq('date', date)
    }

    const { data, error } = await query
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })

    if (error) {
      console.error('Error fetching classes:', error)
      throw error
    }

    return data
  },

  // 添加课程
  async addClass(classData) {
    const { error } = await supabase
      .from('classes')
      .insert([{
        ...classData,
        created_at: new Date().toISOString()
      }])

    if (error) {
      console.error('Error adding class:', error)
      throw error
    }
  },

  // 更新课程
  async updateClass(id, classData) {
    const { error } = await supabase
      .from('classes')
      .update(classData)
      .eq('id', id)

    if (error) {
      console.error('Error updating class:', error)
      throw error
    }
  },

  // 删除课程
  async deleteClass(id) {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting class:', error)
      throw error
    }
  },

  // 课程预约
  async bookClass(classId, memberId) {
    const { error } = await supabase
      .from('bookings')
      .insert([{
        class_id: classId,
        member_id: memberId,
        booking_date: new Date().toISOString(),
        status: 'confirmed'
      }])

    if (error) {
      console.error('Error booking class:', error)
      throw error
    }
  },

  // 取消预约
  async cancelBooking(classId, memberId) {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('class_id', classId)
      .eq('member_id', memberId)

    if (error) {
      console.error('Error canceling booking:', error)
      throw error
    }
  },

  // 获取会员的预约记录
  async getMemberBookings(memberId) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        classes (
          id,
          name,
          date,
          start_time,
          end_time,
          instructor,
          location
        )
      `)
      .eq('member_id', memberId)
      .order('booking_date', { ascending: false })

    if (error) {
      console.error('Error fetching member bookings:', error)
      throw error
    }

    return data
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
