import { 
  getMemberList, 
  createMember, 
  updateMember, 
  deleteMember, 
  getMemberStats 
} from '@/api/member'

// 会员数据服务
export const memberService = {
  // 获取会员列表（分页）
  async getMembers(start = 0, end = 9, search = '', status = 'all') {
    try {
      const page = Math.floor(start / (end - start + 1)) + 1
      const pageSize = end - start + 1
      
      const params = {
        page,
        pageSize,
        ...(search && { search }),
        ...(status !== 'all' && { status })
      }

      const response = await getMemberList(params)
      
      // 假设API返回格式为 { data: [], total: number, page: number, pageSize: number }
      return {
        data: response.data || response.list || [],
        count: response.total || response.count || 0
      }
    } catch (error) {
      console.error('Error fetching members:', error)
      // 如果API失败，回退到localStorage
      return this.getMembersFromLocalStorage(start, end, search, status)
    }
  },

  // 从localStorage获取会员数据（作为后备方案）
  getMembersFromLocalStorage(start = 0, end = 9, search = '', status = 'all') {
    try {
      const storedMembers = localStorage.getItem('gym_members')
      let allMembers = storedMembers ? JSON.parse(storedMembers) : mockMembers

      // 搜索条件
      if (search) {
        const searchLower = search.toLowerCase()
        allMembers = allMembers.filter(member => 
          member.name.toLowerCase().includes(searchLower) ||
          member.member_id.toLowerCase().includes(searchLower) ||
          member.phone.includes(search)
        )
      }

      // 状态筛选
      if (status !== 'all') {
        const isActive = status === 'active'
        allMembers = allMembers.filter(member => {
          const isMemberActive = new Date(member.expire_date) >= new Date()
          return isActive ? isMemberActive : !isMemberActive
        })
      }

      // 排序
      allMembers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

      // 分页
      const data = allMembers.slice(start, end + 1)
      const count = allMembers.length

      return { data, count }
    } catch (error) {
      console.error('Error fetching members from localStorage:', error)
      return { data: [], count: 0 }
    }
  },

  // 添加会员
  async addMember(memberData) {
    try {
      const response = await createMember(memberData)
      return response
    } catch (error) {
      console.error('Error adding member:', error)
      // 如果API失败，回退到localStorage
      return this.addMemberToLocalStorage(memberData)
    }
  },

  // 添加会员到localStorage（作为后备方案）
  addMemberToLocalStorage(memberData) {
    try {
      const storedMembers = localStorage.getItem('gym_members')
      const members = storedMembers ? JSON.parse(storedMembers) : mockMembers
      
      const newMember = {
        ...memberData,
        id: Date.now(), // 简单的ID生成
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      members.push(newMember)
      localStorage.setItem('gym_members', JSON.stringify(members))
      return newMember
    } catch (error) {
      console.error('Error adding member to localStorage:', error)
      throw error
    }
  },

  // 更新会员
  async updateMember(id, memberData) {
    try {
      const response = await updateMember(id, memberData)
      return response
    } catch (error) {
      console.error('Error updating member:', error)
      // 如果API失败，回退到localStorage
      return this.updateMemberInLocalStorage(id, memberData)
    }
  },

  // 更新localStorage中的会员（作为后备方案）
  updateMemberInLocalStorage(id, memberData) {
    try {
      const storedMembers = localStorage.getItem('gym_members')
      const members = storedMembers ? JSON.parse(storedMembers) : mockMembers
      
      const index = members.findIndex(member => member.id === id)
      if (index !== -1) {
        members[index] = {
          ...members[index],
          ...memberData,
          updated_at: new Date().toISOString()
        }
        localStorage.setItem('gym_members', JSON.stringify(members))
        return members[index]
      }
      throw new Error('Member not found')
    } catch (error) {
      console.error('Error updating member in localStorage:', error)
      throw error
    }
  },

  // 删除会员
  async deleteMember(id) {
    try {
      const response = await deleteMember(id)
      return response
    } catch (error) {
      console.error('Error deleting member:', error)
      // 如果API失败，回退到localStorage
      return this.deleteMemberFromLocalStorage(id)
    }
  },

  // 从localStorage删除会员（作为后备方案）
  deleteMemberFromLocalStorage(id) {
    try {
      const storedMembers = localStorage.getItem('gym_members')
      const members = storedMembers ? JSON.parse(storedMembers) : mockMembers
      
      const filteredMembers = members.filter(member => member.id !== id)
      localStorage.setItem('gym_members', JSON.stringify(filteredMembers))
      return { success: true }
    } catch (error) {
      console.error('Error deleting member from localStorage:', error)
      throw error
    }
  },

  // 获取会员统计信息
  async getMemberStats() {
    try {
      const response = await getMemberStats()
      return response
    } catch (error) {
      console.error('Error fetching member stats:', error)
      // 如果API失败，回退到localStorage计算
      return this.getMemberStatsFromLocalStorage()
    }
  },

  // 从localStorage计算会员统计信息（作为后备方案）
  getMemberStatsFromLocalStorage() {
    try {
      const storedMembers = localStorage.getItem('gym_members')
      const members = storedMembers ? JSON.parse(storedMembers) : mockMembers
      
      const totalMembers = members.length
      const activeMembers = members.filter(member => 
        new Date(member.expire_date) >= new Date()
      ).length
      
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      const newMembers = members.filter(member => 
        new Date(member.created_at) >= startOfMonth
      ).length

      return {
        totalMembers,
        activeMembers,
        expiredMembers: totalMembers - activeMembers,
        newMembers
      }
    } catch (error) {
      console.error('Error fetching member stats from localStorage:', error)
      return {
        totalMembers: 0,
        activeMembers: 0,
        expiredMembers: 0,
        newMembers: 0
      }
    }
  }
}

// 模拟数据
export const mockMembers = [
  {
    id: 1,
    member_id: 'M001',
    name: '张三',
    phone: '13800138001',
    email: 'zhangsan@example.com',
    join_date: '2024-01-15',
    expire_date: '2024-12-15',
    membership_type: '年度会员',
    status: 'active',
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: 2,
    member_id: 'M002',
    name: '李四',
    phone: '13800138002',
    email: 'lisi@example.com',
    join_date: '2024-02-01',
    expire_date: '2024-08-01',
    membership_type: '半年会员',
    status: 'expired',
    created_at: '2024-02-01T08:00:00Z'
  },
  {
    id: 3,
    member_id: 'M003',
    name: '王五',
    phone: '13800138003',
    email: 'wangwu@example.com',
    join_date: '2024-03-10',
    expire_date: '2025-03-10',
    membership_type: '年度会员',
    status: 'active',
    created_at: '2024-03-10T08:00:00Z'
  }
]
