import dayjs from 'dayjs'

// 签到数据服务
export const checkinService = {
  // 会员签到
  async checkIn(memberId) {
    try {
      const storedCheckins = localStorage.getItem('gym_checkins')
      const checkins = storedCheckins ? JSON.parse(storedCheckins) : []
      
      const today = dayjs().format('YYYY-MM-DD')
      
      // 检查今天是否已经签到
      const todayCheckin = checkins.find(checkin => 
        checkin.member_id === memberId && checkin.date === today
      )
      
      if (todayCheckin) {
        return { success: false, message: '您今天已经签到过了' }
      }
      
      const newCheckin = {
        id: Date.now(),
        member_id: memberId,
        date: today,
        checkin_time: dayjs().format('HH:mm:ss'),
        timestamp: new Date().toISOString()
      }
      
      checkins.push(newCheckin)
      localStorage.setItem('gym_checkins', JSON.stringify(checkins))
      
      return { success: true, message: '签到成功！', checkin: newCheckin }
    } catch (error) {
      console.error('Error checking in:', error)
      return { success: false, message: '签到失败，请重试' }
    }
  },

  // 获取会员签到记录
  async getMemberCheckins(memberId, days = 30) {
    try {
      const storedCheckins = localStorage.getItem('gym_checkins')
      const checkins = storedCheckins ? JSON.parse(storedCheckins) : []
      
      const startDate = dayjs().subtract(days, 'day').format('YYYY-MM-DD')
      
      const memberCheckins = checkins
        .filter(checkin => 
          checkin.member_id === memberId && 
          checkin.date >= startDate
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date))
      
      return memberCheckins
    } catch (error) {
      console.error('Error fetching member checkins:', error)
      return []
    }
  },

  // 检查今天是否已签到
  async isCheckedInToday(memberId) {
    try {
      const storedCheckins = localStorage.getItem('gym_checkins')
      const checkins = storedCheckins ? JSON.parse(storedCheckins) : []
      
      const today = dayjs().format('YYYY-MM-DD')
      
      return checkins.some(checkin => 
        checkin.member_id === memberId && checkin.date === today
      )
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
