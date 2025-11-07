import dayjs from 'dayjs'
import { checkinBooking, getMemberBookings } from '@/api/booking'

// 签到数据服务
export const checkinService = {
  // 课程签到
  async checkIn(memberId, bookingId) {
    try {
      if (!bookingId) {
        return { success: false, message: '请选择要签到的课程' }
      }

      // 调用后端API进行课程签到
      const result = await checkinBooking(bookingId)
      
      if (result.code === 0) {
        return { 
          success: true, 
          message: '课程签到成功！',
          checkin: {
            bookingId: bookingId,
            checkinTime: dayjs().format('HH:mm:ss'),
            timestamp: new Date().toISOString()
          }
        }
      } else {
        return { success: false, message: result.msg || '签到失败，请重试' }
      }
    } catch (error) {
      console.error('Error checking in:', error)
      return { success: false, message: '签到失败，请重试' }
    }
  },

  // 获取会员签到记录
  async getMemberCheckins(memberId, days = 30) {
    try {
      // 获取会员的预约记录
      const result = await getMemberBookings(memberId, {
        page: 1,
        pageSize: days,
        startTime: dayjs().subtract(days, 'day').format('YYYY-MM-DD'),
        endTime: dayjs().format('YYYY-MM-DD')
      })
      
      if (result.code === 0) {
        // 只返回已签到的记录
        return result.data.rows
          .filter(booking => booking.checkinTime)
          .map(booking => ({
            id: booking.id,
            date: dayjs(booking.bookingTime).format('YYYY-MM-DD'),
            checkin_time: booking.checkinTime,
            timestamp: booking.updateTime,
            courseName: booking.schedule?.courseName || '未知课程',
            coachName: booking.schedule?.coachName || '未知教练'
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date))
      }
      
      return []
    } catch (error) {
      console.error('Error fetching member checkins:', error)
      return []
    }
  },

  // 检查今天是否已签到
  async isCheckedInToday(memberId) {
    try {
      const today = dayjs().format('YYYY-MM-DD')
      
      // 获取今天的预约记录
      const result = await getMemberBookings(memberId, {
        page: 1,
        pageSize: 10,
        startTime: today,
        endTime: today
      })
      
      if (result.code === 0) {
        // 检查是否有已签到的记录
        return result.data.rows.some(booking => booking.checkinTime)
      }
      
      return false
    } catch (error) {
      console.error('Error checking today checkin status:', error)
      return false
    }
  },

  // 获取签到统计
  async getCheckinStats(memberId) {
    try {
      const checkins = await this.getMemberCheckins(memberId, 30)
      
      const totalCheckins = checkins.length
      const thisWeekCheckins = checkins.filter(checkin => 
        dayjs(checkin.date).isAfter(dayjs().subtract(7, 'day'))
      ).length
      
      const consecutiveDays = this.getConsecutiveDays(checkins)
      
      return {
        totalCheckins,
        thisWeekCheckins,
        consecutiveDays,
        lastCheckin: checkins[0] || null
      }
    } catch (error) {
      console.error('Error getting checkin stats:', error)
      return {
        totalCheckins: 0,
        thisWeekCheckins: 0,
        consecutiveDays: 0,
        lastCheckin: null
      }
    }
  },

  // 获取今天可签到的课程
  async getTodayBookings(memberId) {
    try {
      const today = dayjs().format('YYYY-MM-DD')
      
      const result = await getMemberBookings(memberId, {
        page: 1,
        pageSize: 10,
        startTime: today,
        endTime: today
      })
      
      if (result.code === 0) {
        // 返回未签到的预约记录
        return result.data.rows
          .filter(booking => !booking.checkinTime)
          .map(booking => ({
            id: booking.id,
            scheduleId: booking.scheduleId,
            courseName: booking.schedule?.courseName || '未知课程',
            coachName: booking.schedule?.coachName || '未知教练',
            startTime: booking.schedule?.startTime || '',
            endTime: booking.schedule?.endTime || '',
            location: booking.schedule?.location || '未知地点',
            bookingTime: booking.bookingTime
          }))
      }
      
      return []
    } catch (error) {
      console.error('Error getting today bookings:', error)
      return []
    }
  },

  // 计算连续签到天数
  getConsecutiveDays(checkins) {
    if (checkins.length === 0) return 0
    
    let consecutiveDays = 0
    const today = dayjs()
    
    for (let i = 0; i < checkins.length; i++) {
      const checkinDate = dayjs(checkins[i].date)
      const expectedDate = today.subtract(i, 'day')
      
      if (checkinDate.format('YYYY-MM-DD') === expectedDate.format('YYYY-MM-DD')) {
        consecutiveDays++
      } else {
        break
      }
    }
    
    return consecutiveDays
  }
}

// 模拟签到数据
export const mockCheckins = [
  {
    id: 1,
    member_id: 1,
    date: '2024-01-15',
    checkin_time: '08:30:00',
    timestamp: '2024-01-15T08:30:00Z'
  },
  {
    id: 2,
    member_id: 1,
    date: '2024-01-14',
    checkin_time: '09:15:00',
    timestamp: '2024-01-14T09:15:00Z'
  },
  {
    id: 3,
    member_id: 1,
    date: '2024-01-13',
    checkin_time: '10:00:00',
    timestamp: '2024-01-13T10:00:00Z'
  },
  {
    id: 4,
    member_id: 2,
    date: '2024-01-15',
    checkin_time: '18:30:00',
    timestamp: '2024-01-15T18:30:00Z'
  },
  {
    id: 5,
    member_id: 3,
    date: '2024-01-15',
    checkin_time: '19:00:00',
    timestamp: '2024-01-15T19:00:00Z'
  }
]
