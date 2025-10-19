<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑教练' : '添加教练'"
    width="800px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="space-y-4"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 基本信息 -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900 border-b pb-2">
            基本信息
          </h3>

          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入教练姓名" />
          </el-form-item>

          <el-form-item label="工号" prop="userId">
            <el-input v-model="form.userId" placeholder="请输入工号" />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱地址" />
          </el-form-item>

          <el-form-item label="电话" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入电话号码" />
          </el-form-item>

          <el-form-item v-if="!isEdit" label="密码" prop="password">
            <el-input 
              v-model="form.password" 
              type="password" 
              placeholder="请输入密码" 
              show-password
            />
          </el-form-item>

          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="form.gender">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="出生日期" prop="birthDate">
            <el-date-picker
              v-model="form.birthDate"
              type="date"
              placeholder="选择出生日期"
              class="w-full"
            />
          </el-form-item>

          <el-form-item label="经验年限" prop="experience">
            <el-input v-model="form.experience" placeholder="如：5年" />
          </el-form-item>

          <el-form-item label="入职日期" prop="hireDate">
            <el-date-picker
              v-model="form.hireDate"
              type="date"
              placeholder="选择入职日期"
              class="w-full"
            />
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio label="active">在职</el-radio>
              <el-radio label="inactive">离职</el-radio>
              <el-radio label="suspended">暂停</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>
      <!-- 详细信息 -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 border-b pb-2">
          详细信息
        </h3>

        <el-form-item label="个人简介" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入个人简介，包括专业领域、认证证书、教学经验等信息"
          />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          {{ isEdit ? "更新" : "创建" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from "vue";
import { ElMessage } from "element-plus";
import {
  createCoach,
  updateCoach,
  getCoachDetail,
  type Coach,
} from "@/api/coach";
import {cloneDeep} from 'lodash-es';

// 获取当前日期字符串
const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Props
const props = defineProps<{
  visible: boolean;
  id?: number | null;
}>();

// Emits
const emit = defineEmits<{
  "update:visible": [value: boolean];
  success: [];
}>();

// 响应式数据
const formRef = ref();
const loading = ref(false);

const defaultForm = {
  name: "",
  userId: "",
  email: "",
  phone: "",
  password: "",
  gender: 1,
  birthDate: "",
  experience: "",
  description: "",
  hireDate: getCurrentDate(),
  status: "active",
  remark: "",
  role: "coach",
};  
const form = reactive(cloneDeep(defaultForm));

// 表单验证规则
const rules = {
  name: [
    { required: true, message: "请输入教练姓名", trigger: "blur" },
    { min: 2, max: 20, message: "姓名长度在 2 到 20 个字符", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入邮箱地址", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
  ],
  userId: [
    { required: true, message: "请输入教练工号", trigger: "blur" },
  ],
  phone: [
    { required: true, message: "请输入电话号码", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度在 6 到 20 个字符", trigger: "blur" },
  ],
  gender: [
    { required: true, message: "请选择性别", trigger: "change" },
  ],
  birthDate: [
    { required: true, message: "请选择出生日期", trigger: "change" },
  ],
  experience: [{ required: true, message: "请输入经验年限", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }],
};

// 计算属性
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value),
});

const isEdit = computed(() => !!props.id);
// 重置表单
const resetForm = () => {
  Object.assign(form, cloneDeep(defaultForm));
  formRef.value?.clearValidate();
};
// 监听id变化，加载教练数据
watch(
  () => props.id,
  async (newId) => {
    if (newId) {
      // 编辑模式：加载教练数据
      try {
        loading.value = true;
        const response = await getCoachDetail(newId);
        if (response.data) {
          const coachData = response.data;
          Object.assign(form, {
            name: coachData.name || "",
            userId: coachData.userId || "",
            email: coachData.email || "",
            phone: coachData.phone || "",
            gender: coachData.gender || 1,
            birthDate: coachData.birthDate || "",
            experience: coachData.experience || "",
            description: coachData.description || "",
            hireDate: coachData.hireDate || "",
            status: coachData.status || "active",
            remark: coachData.remark || "",
          });
        }
      } catch (error) {
        console.error("加载教练数据失败:", error);
        ElMessage.error("加载教练数据失败");
      } finally {
        loading.value = false;
      }
    } else {
      // 新增模式：重置表单
      resetForm();
    }
  },
  { immediate: true }
);

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    loading.value = true;

    const params = {
      ...form,
      id: props.id,
    };

    if (isEdit.value && props.id) {
      // 更新教练
      await updateCoach(params);
      ElMessage.success("更新成功");
    } else {
      // 创建教练
      await createCoach(params);
      ElMessage.success("创建成功");
    }

    emit("success");
    handleClose();
  } catch (error) {
    console.error("提交失败:", error);
    ElMessage.error("操作失败");
  } finally {
    loading.value = false;
  }
};

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false;
  resetForm();
};
</script>

<style scoped>
.el-form-item {
  margin-bottom: 16px;
}

.el-upload {
  display: inline-block;
}
</style>
