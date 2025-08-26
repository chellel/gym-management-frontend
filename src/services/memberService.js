import { supabase } from '../supabase'

// 会员数据服务
export const memberService = {
  // 获取会员列表（分页）
  async getMembers(start = 0, end = 9, search = '', status = 'all') {
    let query = supabase
      .from('members')
      .select('*', { count: 'exact' })

    // 搜索条件
    if (search) {
      query = query.or(`name.ilike.%${search}%,member_id.ilike.%${search}%,phone.ilike.%${search}%`)
    }

    // 状态筛选
    if (status !== 'all') {
      const isActive = status === 'active'
      if (isActive) {
        query = query.gte('expire_date', new Date().toISOString())
      } else {
        query = query.lt('expire_date', new Date().toISOString())
      }
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(start, end)

    if (error) {
      console.error('Error fetching members:', error)
      throw error
    }

    return { data, count }
  },

  // 添加会员
  async addMember(memberData) {
    const { error } = await supabase
      .from('members')
      .insert([{
        ...memberData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])

    if (error) {
      console.error('Error adding member:', error)
      throw error
    }
  },

  // 更新会员
  async updateMember(id, memberData) {
    const { error } = await supabase
      .from('members')
      .update({
        ...memberData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating member:', error)
      throw error
    }
  },

  // 删除会员
  async deleteMember(id) {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting member:', error)
      throw error
    }
  },

  // 获取会员统计信息
  async getMemberStats() {
    try {
      // 获取总会员数
      const { count: totalMembers } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })

      // 获取活跃会员数
      const { count: activeMembers } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .gte('expire_date', new Date().toISOString())

      // 获取本月新增会员数
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
      const { count: newMembers } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth)

      return {
        totalMembers: totalMembers || 0,
        activeMembers: activeMembers || 0,
        expiredMembers: (totalMembers || 0) - (activeMembers || 0),
        newMembers: newMembers || 0
      }
    } catch (error) {
      console.error('Error fetching member stats:', error)
      return {
        totalMembers: 0,
        activeMembers: 0,
        expiredMembers: 0,
        newMembers: 0
      }
    }
  }
}

// 模拟数据（当Supabase不可用时使用）
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
