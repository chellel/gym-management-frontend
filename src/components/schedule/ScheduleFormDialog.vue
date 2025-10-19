<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑排班' : '添加排班'"
    width="800px"
    :before-close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="space-y-4"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <el-form-item label="课程" prop="course_id">
          <el-select
            v-model="form.course_id"
            placeholder="选择课程"
            class="w-full"
            @change="onCourseChange"
          >
            <el-option
              v-for="course in courses"
              :key="course.id"
              :label="course.name"
              :value="course.id"
            >
              <div class="flex justify-between items-center">
                <span>{{ course.name }}</span>
                <span class="text-xs text-gray-500"
                  >{{ course.durationMinutes }}分钟</span
                >
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="教练" prop="coach_id">
          <el-select
            v-model="form.coach_id"
            placeholder="选择教练"
            class="w-full"
            :disabled="isCoach"
          >
            <el-option
              v-for="coach in availableCoachs"
              :key="coach.id"
              :label="coach.name"
              :value="coach.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="开始时间" prop="start_time">
          <el-date-picker
            v-model="form.start_time"
            type="datetime"
            placeholder="选择开始时间"
            class="w-full"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            @change="onStartTimeChange"
          />
        </el-form-item>

        <el-form-item label="结束时间" prop="end_time">
          <template #label>
            <el-tooltip
              content="结束时间将根据开始时间和课程时长自动计算"
              placement="top"
            >
              <div class="flex items-center">
                <span>结束时间</span>
                <el-icon><InfoFilled /></el-icon>
              </div>
            </el-tooltip>
          </template>
          <el-date-picker
            v-model="form.end_time"
            type="datetime"
            placeholder="自动计算"
            class="w-full"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            :disabled="true"
          />
        </el-form-item>

        <el-form-item label="上课地点" prop="location">
          <el-input
            v-model="form.location"
            placeholder="请输入上课地点"
            clearable
          />
        </el-form-item>

        <el-form-item label="最大容量" prop="max_capacity">
          <el-input-number
            v-model="form.max_capacity"
            :min="1"
            :max="50"
            placeholder="最大容量"
            class="w-full"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select
            v-model="form.status"
            placeholder="选择状态"
            class="w-full"
          >
            <el-option label="待开始" value="waiting" />
            <el-option label="已取消" value="cancelled" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>

        <el-form-item label="备注" class="md:col-span-2">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          {{ isEdit ? "保存" : "添加" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useAuth } from "@/composables/useAuth";
import {
  getCourseList,
} from "@/api/course";
// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  scheduleData: {
    type: Object,
    default: () => ({}),
  },
 
  coachs: {
    type: Array,
    required: true,
  },
  currentUser: {
    type: Object,
    default: null,
  },
});

// Emits
const emit = defineEmits(["update:modelValue", "submit", "close"]);

// 认证相关
const { isCoach } = useAuth();

// 响应式数据
const visible = ref(false);
const loading = ref(false);
const formRef = ref();

// 表单数据
const form = reactive({
  course_id: "",
  coach_id: "",
  start_time: "",
  end_time: "",
  location: "",
  max_capacity: 20,
  status: "waiting",
  remark: "",
});

// 表单验证规则
const rules = {
  course_id: [{ required: true, message: "请选择课程", trigger: "change" }],
  coach_id: [{ required: true, message: "请选择教练", trigger: "change" }],
  start_time: [
    { required: true, message: "请选择开始时间", trigger: "change" },
  ],
  location: [{ required: true, message: "请输入上课地点", trigger: "blur" }],
  max_capacity: [
    { required: true, message: "请输入最大容量", trigger: "blur" },
    {
      type: "number",
      min: 1,
      max: 50,
      message: "容量必须在1-50之间",
      trigger: "blur",
    },
  ],
  status: [{ required: true, message: "请选择状态", trigger: "change" }],
};
const courses = ref([]);
const getCourses = async () => {
  const response = await getCourseList({
    page: 1,
    pageSize: 10,
  });
  courses.value = response.rows;
};
onMounted(() => {
  getCourses();
});
// 计算属性
const availableCoachs = computed(() => {
  // 这里可以根据权限逻辑返回可用的教练列表
  return props.coachs;
});

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (newVal) => {
    visible.value = newVal;
    if (newVal) {
      initForm();
    }
  }
);

// 监听 visible 变化
watch(visible, (newVal) => {
  emit("update:modelValue", newVal);
});

// 课程选择变化处理
const onCourseChange = (courseId) => {
  const selectedCourse = courses.value.find((course) => course.id === courseId);
  if (selectedCourse && form.start_time) {
    // 根据课程时长自动设置结束时间
    const startDate = new Date(form.start_time);
    const endDate = new Date(
      startDate.getTime() + selectedCourse.durationMinutes * 60000
    );
    form.end_time = endDate.toISOString().slice(0, 16);
  }
};

// 开始时间变化处理
const onStartTimeChange = () => {
  if (form.course_id && form.start_time) {
    const selectedCourse = courses.value.find(
      (course) => course.id === form.course_id
    );
    if (selectedCourse) {
      // 根据课程时长自动设置结束时间
      const startDate = new Date(form.start_time);
      const endDate = new Date(
          startDate.getTime() + selectedCourse.durationMinutes * 60000
      );
      form.end_time = endDate.toISOString().slice(0, 16);
    }
  }
};

// 初始化表单
const initForm = () => {
  if (props.isEdit && props.scheduleData) {
    // 编辑模式：填充现有数据
    Object.assign(form, {
      course_id: props.scheduleData.course_id || "",
      coach_id: props.scheduleData.coach_id || "",
      start_time: props.scheduleData.start_time || "",
      end_time: props.scheduleData.end_time || "",
      location: props.scheduleData.location || "",
      max_capacity: props.scheduleData.max_capacity || 20,
      status: props.scheduleData.status || "waiting",
      remark: props.scheduleData.remark || "",
    });
  } else {
    // 添加模式：重置表单
    resetForm();
  }
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    course_id: "",
    coach_id: isCoach.value && props.currentUser ? props.currentUser.id : "",
    start_time: "",
    end_time: "",
    location: "",
    max_capacity: 20,
    status: "waiting",
    remark: "",
  });

  // 清除验证
  if (formRef.value) {
    formRef.value.clearValidate();
  }
};

// 关闭对话框
const handleClose = () => {
  visible.value = false;
  emit("close");
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    const valid = await formRef.value.validate();
    if (!valid) return;

    loading.value = true;

    // 发送提交事件
    emit("submit", { ...form });
  } catch (error) {
    console.error("表单验证失败:", error);
  } finally {
    loading.value = false;
  }
};
</script>
