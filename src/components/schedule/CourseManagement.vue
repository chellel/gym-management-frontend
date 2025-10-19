<template>
  <div class="space-y-6">
    <!-- 课程管理头部 -->
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div class="flex items-center space-x-4">
          <h2 class="text-xl font-semibold text-gray-900">课程管理</h2>
          <div class="flex items-center space-x-2">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索课程名称..."
              class="w-64"
              clearable
              @input="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <el-button @click="refreshCourses" :loading="loading">
            <el-icon class="w-4 h-4 mr-1"><Refresh /></el-icon>
            刷新
          </el-button>
          <el-button
            v-if="canAddCourse"
            @click="openAddCourseDialog"
            type="primary"
            class="inline-flex items-center"
          >
            <el-icon class="w-5 h-5 mr-2"><Plus /></el-icon>
            添加课程
          </el-button>
        </div>
      </div>
    </div>

    <!-- 课程列表 -->
    <div class="bg-white shadow rounded-lg">
      <el-table
        :data="filteredCourses"
        v-loading="loading"
        stripe
        class="w-full"
      >
        
        <el-table-column prop="name" label="课程名称" min-width="150">
          <template #default="{ row }">
            <div class="font-medium text-gray-900">{{ row.name }}</div>
          </template>
        </el-table-column>
        
        <el-table-column prop="description" label="课程描述" min-width="200" show-overflow-tooltip />
        
        <el-table-column prop="duration_minutes" label="时长" width="100" align="center">
          <template #default="{ row }">
            <el-tag type="info" size="small">{{ row.duration_minutes }}分钟</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="create_time" label="创建时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.create_time) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="remark" label="备注" min-width="120" show-overflow-tooltip />
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div class="flex items-center space-x-2">
              <el-button
                v-if="canEditCourse(row)"
                @click="editCourse(row)"
                type="primary"
                size="small"
                link
              >
                编辑
              </el-button>
              <el-button
                v-if="canDeleteCourse(row)"
                @click="deleteCourse(row)"
                type="danger"
                size="small"
                link
              >
                删除
              </el-button>
              <el-button
                v-if="row.is_deleted === 1"
                @click="restoreCourse(row)"
                type="success"
                size="small"
                link
              >
                恢复
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="p-4 border-t">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalCourses"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 课程表单对话框 -->
    <CourseFormDialog
      v-model="showCourseDialog"
      :is-edit="isEditMode"
      :course-data="editingCourse"
      @submit="handleCourseSubmit"
      @close="closeCourseDialog"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import Swal from "sweetalert2";
import { useAuth } from "@/composables/useAuth";
import { useAdminAuth } from "@/composables/useAdminAuth";
import { 
  getCourseList, 
  createCourse, 
  updateCourse, 
  deleteCourse as deleteCourseApi,
  restoreCourse as restoreCourseApi,
  generateMockCourses
} from "@/api/course";
import CourseFormDialog from "./CourseFormDialog.vue";

// 认证相关
const { isCoach, currentUser } = useAuth();
const { isAdmin } = useAdminAuth();

// 响应式数据
const courses = ref([]);
const loading = ref(false);
const searchKeyword = ref("");

// 分页相关
const currentPage = ref(1);
const pageSize = ref(20);
const totalCourses = ref(0);

// 模态框状态
const showCourseDialog = ref(false);
const isEditMode = ref(false);
const editingCourse = ref(null);

// 权限控制计算属性
const canAddCourse = computed(() => {
  return isAdmin.value || isCoach.value;
});

const canEditCourse = computed(() => {
  return (course) => {
    if (isAdmin.value) return true;
    if (isCoach.value) {
      // 教练可以编辑自己创建的课程
      return course.create_by === currentUser.value?.id;
    }
    return false;
  };
});

const canDeleteCourse = computed(() => {
  return (course) => {
    if (isAdmin.value) return true;
    if (isCoach.value) {
      // 教练可以删除自己创建的课程
      return course.create_by === currentUser.value?.id;
    }
    return false;
  };
});

// 过滤后的课程列表
const filteredCourses = computed(() => {
  if (!searchKeyword.value) {
    return courses.value;
  }
  
  const keyword = searchKeyword.value.toLowerCase();
  return courses.value.filter(course => 
    course.name.toLowerCase().includes(keyword) ||
    course.description?.toLowerCase().includes(keyword) ||
    course.course_code?.toLowerCase().includes(keyword)
  );
});

// 初始化
onMounted(() => {
  loadCourses();
});

// 加载课程列表
const loadCourses = async () => {
  try {
    loading.value = true;
    
    // 使用模拟数据，实际项目中应该调用API
    const mockCourses = generateMockCourses(50);
    courses.value = mockCourses;
    totalCourses.value = mockCourses.length;
    
    // 实际API调用示例：
    // const response = await getCourseList({
    //   page: currentPage.value,
    //   pageSize: pageSize.value,
    //   search: searchKeyword.value,
    //   is_deleted: 0
    // });
    // courses.value = response.rows;
    // totalCourses.value = response.total;
    
  } catch (error) {
    console.error("Failed to load courses:", error);
    await Swal.fire({
      title: "加载失败",
      text: "加载课程列表失败，请重试",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// 搜索处理
const handleSearch = () => {
  // 搜索逻辑已在 computed 中处理
};

// 刷新课程
const refreshCourses = () => {
  loadCourses();
};

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size;
  loadCourses();
};

const handleCurrentChange = (page) => {
  currentPage.value = page;
  loadCourses();
};

// 打开添加课程对话框
const openAddCourseDialog = () => {
  isEditMode.value = false;
  editingCourse.value = null;
  showCourseDialog.value = true;
};

// 关闭课程对话框
const closeCourseDialog = () => {
  showCourseDialog.value = false;
  isEditMode.value = false;
  editingCourse.value = null;
};

// 编辑课程
const editCourse = (course) => {
  // 检查权限
  if (!canEditCourse.value(course)) {
    Swal.fire({
      title: "权限不足",
      text: "您没有权限编辑此课程",
      icon: "warning",
    });
    return;
  }

  isEditMode.value = true;
  editingCourse.value = course;
  showCourseDialog.value = true;
};

// 处理课程提交
const handleCourseSubmit = async (formData) => {
  try {
    if (isEditMode.value && editingCourse.value) {
      // 更新课程
      const updateData = {
        ...formData,
        id: editingCourse.value.id,
        update_by: currentUser.value?.id || 'admin',
        update_time: new Date().toISOString()
      };
      
      // 实际API调用：
      // await updateCourse(updateData);
      
      // 更新本地数据
      const index = courses.value.findIndex(c => c.id === editingCourse.value.id);
      if (index !== -1) {
        courses.value[index] = { ...courses.value[index], ...updateData };
      }

      await Swal.fire({
        title: "更新成功",
        text: "课程信息更新成功！",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      // 添加课程
      const newCourse = {
        id: Date.now(),
        ...formData,
        create_by: currentUser.value?.id || 'admin',
        create_time: new Date().toISOString(),
        update_by: currentUser.value?.id || 'admin',
        update_time: new Date().toISOString(),
        remark: formData.remark || '',
        is_deleted: 0,
        delete_time: null
      };
      
      // 实际API调用：
      // await createCourse(formData);
      
      courses.value.unshift(newCourse);
      totalCourses.value++;

      await Swal.fire({
        title: "添加成功",
        text: "课程添加成功！",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }

    closeCourseDialog();
  } catch (error) {
    console.error("Failed to handle course:", error);
    await Swal.fire({
      title: isEditMode.value ? "更新失败" : "添加失败",
      text: isEditMode.value ? "更新课程信息失败，请重试" : "添加课程失败，请重试",
      icon: "error",
    });
  }
};

// 删除课程
const deleteCourse = async (course) => {
  const result = await Swal.fire({
    title: "确认删除",
    text: `确定要删除课程 "${course.name}" 吗？`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "删除",
    cancelButtonText: "取消",
  });

  if (result.isConfirmed) {
    try {
      // 实际API调用：
      // await deleteCourseApi(course.id);
      
      // 更新本地数据（软删除）
      const index = courses.value.findIndex(c => c.id === course.id);
      if (index !== -1) {
        courses.value[index] = {
          ...courses.value[index],
          is_deleted: 1,
          delete_time: new Date().toISOString()
        };
      }

      await Swal.fire({
        title: "删除成功",
        text: "课程删除成功！",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to delete course:", error);
      await Swal.fire({
        title: "删除失败",
        text: "删除课程失败，请重试",
        icon: "error",
      });
    }
  }
};

// 恢复课程
const restoreCourse = async (course) => {
  try {
    // 实际API调用：
    // await restoreCourseApi(course.id);
    
    // 更新本地数据
    const index = courses.value.findIndex(c => c.id === course.id);
    if (index !== -1) {
      courses.value[index] = {
        ...courses.value[index],
        is_deleted: 0,
        delete_time: null
      };
    }

    await Swal.fire({
      title: "恢复成功",
      text: "课程恢复成功！",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Failed to restore course:", error);
    await Swal.fire({
      title: "恢复失败",
      text: "恢复课程失败，请重试",
      icon: "error",
    });
  }
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>
