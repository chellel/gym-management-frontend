<template>
  <div class="space-y-6">
    <!-- 课程管理头部 -->
    <div class="bg-white shadow rounded-lg p-6">
      <div
        class="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0"
      >
        <div class="flex items-center space-x-4">
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

        <el-table-column
          prop="description"
          label="课程描述"
          min-width="200"
          show-overflow-tooltip
        />

        <el-table-column
          prop="duration_minutes"
          label="时长"
          width="100"
          align="center"
        >
          <template #default="{ row }">
            <el-tag type="info" size="small"
              >{{ row.duration_minutes }}分钟</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column prop="create_time" label="创建时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.create_time) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="remark"
          label="备注"
          min-width="120"
          show-overflow-tooltip
        />

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div class="flex items-center space-x-2">
              <el-button
                @click="editCourse(row)"
                type="primary"
                size="small"
                link
              >
                编辑
              </el-button>
              <el-button
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
      <div class="px-6 py-4">
        <Pagination
          :total="pagination.total"
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          @page-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 课程表单对话框 -->
    <CourseFormDialog
      v-model="showCourseDialog"
      :is-edit="isEditMode"
      :course-data="editingCourse"
      @success="handleCourseSuccess"
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
  deleteCourse as deleteCourseApi,
  restoreCourse as restoreCourseApi,
} from "@/api/course";
import CourseFormDialog from "./CourseFormDialog.vue";
import Pagination from "@/admin/components/Pagination.vue";

// 认证相关
const { currentUser } = useAuth();

// 响应式数据
const courses = ref([]);
const loading = ref(false);
const searchKeyword = ref("");
const pagination = reactive({
  total: 0,
  pageSize: 10,
  currentPage: 1,
});

// 分页相关
const currentPage = ref(1);
const pageSize = ref(20);
const totalCourses = ref(0);

// 模态框状态
const showCourseDialog = ref(false);
const isEditMode = ref(false);
const editingCourse = ref(null);

// 过滤后的课程列表
const filteredCourses = computed(() => {
  if (!searchKeyword.value) {
    return courses.value;
  }

  const keyword = searchKeyword.value.toLowerCase();
  return courses.value.filter(
    (course) =>
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
    const response = await getCourseList({
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      search: searchKeyword.value,
    });
    courses.value = response.rows;
    totalCourses.value = response.total;
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
  isEditMode.value = true;
  editingCourse.value = course;
  showCourseDialog.value = true;
};

// 处理课程操作成功
const handleCourseSuccess = () => {
  // 重新加载课程列表
  loadCourses();
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
      // 调用API删除课程
      await deleteCourseApi(course.id);

      // 重新加载课程列表
      await loadCourses();

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
    // 调用API恢复课程
    await restoreCourseApi(course.id);

    // 重新加载课程列表
    await loadCourses();

    await Swal.fire({
      title: "恢复成功",
      text: "课程恢复成功！",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    await Swal.fire({
      title: "恢复失败",
      text: "恢复课程失败，请重试",
      icon: "error",
    });
  }
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
