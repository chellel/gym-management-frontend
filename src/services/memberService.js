import {
  getMemberList,
  createMember,
  updateMember,
  deleteMember,
  getMemberStats,
} from "@/api/member";

// 会员数据服务
export const memberService = {
  // 获取会员列表（分页）
  async getMembers(start = 0, end = 9, search = "", status = "all") {
    try {
      const page = Math.floor(start / (end - start + 1)) + 1;
      const pageSize = end - start + 1;

      const params = {
        page,
        pageSize,
        ...(search && { search }),
        ...(status !== "all" && { status }),
      };

      const response = await getMemberList(params);

      return {
        data: response.rows || [],
        count: response.total || 0,
      };
    } catch (error) {
      console.error("Error fetching members:", error);
      throw error;
    }
  },

  // 添加会员
  async addMember(memberData) {
    try {
      const response = await createMember(memberData);
      return response;
    } catch (error) {
      console.error("Error adding member:", error);
      throw error;
    }
  },

  // 更新会员
  async updateMember(id, memberData) {
    try {
      const response = await updateMember(id, memberData);
      return response;
    } catch (error) {
      console.error("Error updating member:", error);
      throw error;
    }
  },

  // 删除会员
  async deleteMember(id) {
    try {
      const response = await deleteMember(id);
      return response;
    } catch (error) {
      console.error("Error deleting member:", error);
      throw error;
    }
  },

  // 获取会员统计信息
  async getMemberStats() {
    try {
      const response = await getMemberStats();
      // 处理新的API返回格式
      if (response.code === 0 && response.data) {
        return {
          totalMembers: response.data.totalMembers || 0,
          activeMembers: response.data.activeMembers || 0,
          expiredMembers: response.data.expiredMembers || 0,
          newMembers: response.data.newMembers || 0,
        };
      }
      return response;
    } catch (error) {
      console.error("Error fetching member stats:", error);
      throw error;
    }
  },
};
