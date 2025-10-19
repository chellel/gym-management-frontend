<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑课程' : '添加课程'"
    width="600px"
    :before-close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="space-y-4"
    >
      <el-form-item label="课程名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入课程名称"
          clearable
          maxlength="100"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="课程描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="请输入课程描述"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="课程时长" prop="duration_minutes">
        <el-select
          v-model="form.duration_minutes"
          placeholder="选择课程时长"
          class="w-full"
        >
          <el-option
            v-for="duration in durationOptions"
            :key="duration.value"
            :label="duration.label"
            :value="duration.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="3"
          placeholder="请输入备注信息"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
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
import { ref, reactive, computed, watch } from "vue";

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
  courseData: {
    type: Object,
    default: () => ({}),
  },
});

// Emits
const emit = defineEmits(["update:modelValue", "submit", "close"]);

// 响应式数据
const visible = ref(false);
const loading = ref(false);
const formRef = ref();

// 时长选项
const durationOptions = [
  { label: "30分钟", value: 30 },
  { label: "45分钟", value: 45 },
  { label: "60分钟", value: 60 },
  { label: "75分钟", value: 75 },
  { label: "90分钟", value: 90 },
  { label: "120分钟", value: 120 },
];

// 表单数据
const form = reactive({
  name: "",
  description: "",
  duration_minutes: 60,
  remark: "",
});

// 表单验证规则
const rules = {
  name: [
    { required: true, message: "请输入课程名称", trigger: "blur" },
    {
      min: 2,
      max: 100,
      message: "课程名称长度在 2 到 100 个字符",
      trigger: "blur",
    },
  ],
  description: [
    { max: 500, message: "课程描述长度不能超过 500 个字符", trigger: "blur" },
  ],
  duration_minutes: [
    { required: true, message: "请选择课程时长", trigger: "change" },
  ],
  remark: [
    { max: 500, message: "备注长度不能超过 500 个字符", trigger: "blur" },
  ],
};

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

// 初始化表单
const initForm = () => {
  if (props.isEdit && props.courseData) {
    // 编辑模式：填充现有数据
    Object.assign(form, {
      name: props.courseData.name || "",
      description: props.courseData.description || "",
      duration_minutes: props.courseData.duration_minutes || 60,
      remark: props.courseData.remark || "",
    });
  } else {
    // 添加模式：重置表单
    resetForm();
  }
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    name: "",
    description: "",
    duration_minutes: 60,
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

    // 准备提交数据
    const submitData = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      duration_minutes: form.duration_minutes,
      remark: form.remark.trim() || undefined,
    };

    // 发送提交事件
    emit("submit", submitData);
  } catch (error) {
    console.error("表单验证失败:", error);
  } finally {
    loading.value = false;
  }
};
</script>
