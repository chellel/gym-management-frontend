<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">财务管理</h1>
      <p class="mt-1 text-sm text-gray-600">
        管理健身房收入、支出和财务报表。
      </p>
    </div>

    <!-- 财务概览卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <el-icon class="h-6 w-6 text-green-500">
                <Money />
              </el-icon>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  本月收入
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    ¥{{ monthlyIncome.toLocaleString() }}
                  </div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <el-icon class="self-center flex-shrink-0 h-4 w-4">
                      <ArrowUp />
                    </el-icon>
                    <span class="sr-only">增长</span>
                    +{{ incomeGrowth }}%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <el-icon class="h-6 w-6 text-red-500">
                <CreditCard />
              </el-icon>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  本月支出
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    ¥{{ monthlyExpense.toLocaleString() }}
                  </div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                    <el-icon class="self-center flex-shrink-0 h-4 w-4">
                      <ArrowUp />
                    </el-icon>
                    <span class="sr-only">增长</span>
                    +{{ expenseGrowth }}%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <el-icon class="h-6 w-6 text-blue-500">
                <TrendCharts />
              </el-icon>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  净利润
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    ¥{{ netProfit.toLocaleString() }}
                  </div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-blue-600">
                    <el-icon class="self-center flex-shrink-0 h-4 w-4">
                      <ArrowUp />
                    </el-icon>
                    <span class="sr-only">增长</span>
                    +{{ profitGrowth }}%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <el-icon class="h-6 w-6 text-purple-500">
                <Wallet />
              </el-icon>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  现金流
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    ¥{{ cashFlow.toLocaleString() }}
                  </div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-purple-600">
                    <el-icon class="self-center flex-shrink-0 h-4 w-4">
                      <ArrowUp />
                    </el-icon>
                    <span class="sr-only">增长</span>
                    +{{ cashFlowGrowth }}%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 收入支出趋势 -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            收入支出趋势
          </h3>
        </div>
        <div class="p-6">
          <div class="h-64 sm:h-80">
            <IncomeExpenseChart :data="incomeExpenseData" />
          </div>
        </div>
      </div>

      <!-- 支出分类 -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900">支出分类</h3>
        </div>
        <div class="p-6">
          <div class="h-64 sm:h-80">
            <ExpenseCategoryChart :data="expenseCategoryData" />
          </div>
        </div>
      </div>
    </div>

    <!-- 财务操作区域 -->
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h3 class="text-lg font-medium text-gray-900">财务操作</h3>
          <p class="mt-1 text-sm text-gray-600">添加收入记录或支出记录。</p>
        </div>
        <div class="flex space-x-3">
          <el-button
            @click="showAddIncomeDialog = true"
            type="success"
            class="inline-flex items-center px-4 py-2 text-sm font-medium"
          >
            <el-icon class="w-4 h-4 mr-2">
              <Plus />
            </el-icon>
            添加收入
          </el-button>
          <el-button
            @click="showAddExpenseDialog = true"
            type="warning"
            class="inline-flex items-center px-4 py-2 text-sm font-medium"
          >
            <el-icon class="w-4 h-4 mr-2">
              <Minus />
            </el-icon>
            添加支出
          </el-button>
        </div>
      </div>
    </div>

    <!-- 财务记录表格 -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-6 py-4">
        <h3 class="text-lg leading-6 font-medium text-gray-900">财务记录</h3>
      </div>

      <!-- 筛选和搜索 -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div class="flex-1">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索记录..."
              class="w-full"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
          <div class="flex space-x-2">
            <el-select v-model="filterType" placeholder="类型" clearable>
              <el-option label="全部" value="" />
              <el-option label="收入" value="income" />
              <el-option label="支出" value="expense" />
            </el-select>
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </div>
        </div>
      </div>

      <!-- 表格 -->
      <div class="overflow-x-auto">
        <el-table :data="filteredRecords" style="width: 100%">
          <el-table-column prop="date" label="日期" width="120" />
          <el-table-column prop="type" label="类型" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.type === 'income' ? 'success' : 'danger'">
                {{ scope.row.type === 'income' ? '收入' : '支出' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="category" label="分类" width="120" />
          <el-table-column prop="description" label="描述" />
          <el-table-column prop="amount" label="金额" width="120">
            <template #default="scope">
              <span :class="scope.row.type === 'income' ? 'text-green-600' : 'text-red-600'">
                {{ scope.row.type === 'income' ? '+' : '-' }}¥{{ scope.row.amount.toLocaleString() }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="balance" label="余额" width="120">
            <template #default="scope">
              ¥{{ scope.row.balance.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button
                @click="editRecord(scope.row)"
                type="text"
                size="small"
              >
                编辑
              </el-button>
              <el-button
                @click="deleteRecord(scope.row)"
                type="text"
                size="small"
                class="text-red-600"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="px-6 py-4 border-t border-gray-200">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalRecords"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 添加收入对话框 -->
    <el-dialog
      v-model="showAddIncomeDialog"
      title="添加收入记录"
      width="500px"
    >
      <el-form :model="incomeForm" :rules="incomeRules" ref="incomeFormRef" label-width="80px">
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="incomeForm.date"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="incomeForm.category" placeholder="选择分类" class="w-full">
            <el-option label="会员费" value="membership" />
            <el-option label="私教费" value="personal_training" />
            <el-option label="商品销售" value="merchandise" />
            <el-option label="其他收入" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input-number
            v-model="incomeForm.amount"
            :min="0"
            :precision="2"
            placeholder="输入金额"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="incomeForm.description"
            type="textarea"
            :rows="3"
            placeholder="输入描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showAddIncomeDialog = false">取消</el-button>
          <el-button type="primary" @click="addIncome">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 添加支出对话框 -->
    <el-dialog
      v-model="showAddExpenseDialog"
      title="添加支出记录"
      width="500px"
    >
      <el-form :model="expenseForm" :rules="expenseRules" ref="expenseFormRef" label-width="80px">
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="expenseForm.date"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="expenseForm.category" placeholder="选择分类" class="w-full">
            <el-option label="租金" value="rent" />
            <el-option label="水电费" value="utilities" />
            <el-option label="员工工资" value="salary" />
            <el-option label="设备维护" value="equipment" />
            <el-option label="营销费用" value="marketing" />
            <el-option label="其他支出" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input-number
            v-model="expenseForm.amount"
            :min="0"
            :precision="2"
            placeholder="输入金额"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="expenseForm.description"
            type="textarea"
            :rows="3"
            placeholder="输入描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showAddExpenseDialog = false">取消</el-button>
          <el-button type="primary" @click="addExpense">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import IncomeExpenseChart from '@/components/charts/IncomeExpenseChart.vue'
import ExpenseCategoryChart from '@/components/charts/ExpenseCategoryChart.vue'

// 响应式数据
const searchKeyword = ref('')
const filterType = ref('')
const dateRange = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const showAddIncomeDialog = ref(false)
const showAddExpenseDialog = ref(false)

// 财务概览数据
const monthlyIncome = ref(158600)
const incomeGrowth = ref(8.3)
const monthlyExpense = ref(45600)
const expenseGrowth = ref(5.2)
const netProfit = ref(113000)
const profitGrowth = ref(12.1)
const cashFlow = ref(125000)
const cashFlowGrowth = ref(9.8)

// 图表数据
const incomeExpenseData = ref([
  { date: '1月', income: 120000, expense: 35000 },
  { date: '2月', income: 135000, expense: 38000 },
  { date: '3月', income: 142000, expense: 42000 },
  { date: '4月', income: 158600, expense: 45600 },
  { date: '5月', income: 165000, expense: 48000 },
  { date: '6月', income: 172000, expense: 50000 }
])

const expenseCategoryData = ref([
  { name: '租金', value: 18000, color: '#3b82f6' },
  { name: '员工工资', value: 15000, color: '#10b981' },
  { name: '水电费', value: 6000, color: '#f59e0b' },
  { name: '设备维护', value: 4000, color: '#ef4444' },
  { name: '营销费用', value: 2000, color: '#8b5cf6' },
  { name: '其他', value: 600, color: '#6b7280' }
])

// 财务记录数据
const financialRecords = ref([
  {
    id: 1,
    date: '2024-01-15',
    type: 'income',
    category: '会员费',
    description: '年度会员费收入',
    amount: 12000,
    balance: 12000
  },
  {
    id: 2,
    date: '2024-01-15',
    type: 'expense',
    category: '租金',
    description: '1月份场地租金',
    amount: 18000,
    balance: -6000
  },
  {
    id: 3,
    date: '2024-01-16',
    type: 'income',
    category: '私教费',
    description: '私教课程费用',
    amount: 5000,
    balance: -1000
  },
  {
    id: 4,
    date: '2024-01-17',
    type: 'expense',
    category: '员工工资',
    description: '1月份员工工资',
    amount: 15000,
    balance: -16000
  },
  {
    id: 5,
    date: '2024-01-18',
    type: 'income',
    category: '商品销售',
    description: '运动装备销售',
    amount: 3000,
    balance: -13000
  }
])

// 表单数据
const incomeForm = reactive({
  date: new Date().toISOString().split('T')[0],
  category: '',
  amount: 0,
  description: ''
})

const expenseForm = reactive({
  date: new Date().toISOString().split('T')[0],
  category: '',
  amount: 0,
  description: ''
})

// 表单验证规则
const incomeRules = {
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }]
}

const expenseRules = {
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }]
}

// 计算属性
const filteredRecords = computed(() => {
  let filtered = financialRecords.value

  // 搜索过滤
  if (searchKeyword.value) {
    filtered = filtered.filter(record =>
      record.description.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      record.category.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }

  // 类型过滤
  if (filterType.value) {
    filtered = filtered.filter(record => record.type === filterType.value)
  }

  // 日期范围过滤
  if (dateRange.value && dateRange.value.length === 2) {
    filtered = filtered.filter(record => {
      const recordDate = new Date(record.date)
      const startDate = new Date(dateRange.value[0])
      const endDate = new Date(dateRange.value[1])
      return recordDate >= startDate && recordDate <= endDate
    })
  }

  return filtered
})

const totalRecords = computed(() => filteredRecords.value.length)

// 方法
const addIncome = async () => {
  try {
    const newRecord = {
      id: Date.now(),
      date: incomeForm.date,
      type: 'income',
      category: incomeForm.category,
      description: incomeForm.description,
      amount: incomeForm.amount,
      balance: financialRecords.value[financialRecords.value.length - 1]?.balance + incomeForm.amount || incomeForm.amount
    }
    
    financialRecords.value.unshift(newRecord)
    showAddIncomeDialog.value = false
    
    // 重置表单
    Object.assign(incomeForm, {
      date: new Date().toISOString().split('T')[0],
      category: '',
      amount: 0,
      description: ''
    })

    await Swal.fire({
      title: '添加成功',
      text: '收入记录已添加',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    })
  } catch (error) {
    console.error('Failed to add income:', error)
    await Swal.fire({
      title: '添加失败',
      text: '请重试',
      icon: 'error'
    })
  }
}

const addExpense = async () => {
  try {
    const newRecord = {
      id: Date.now(),
      date: expenseForm.date,
      type: 'expense',
      category: expenseForm.category,
      description: expenseForm.description,
      amount: expenseForm.amount,
      balance: financialRecords.value[financialRecords.value.length - 1]?.balance - expenseForm.amount || -expenseForm.amount
    }
    
    financialRecords.value.unshift(newRecord)
    showAddExpenseDialog.value = false
    
    // 重置表单
    Object.assign(expenseForm, {
      date: new Date().toISOString().split('T')[0],
      category: '',
      amount: 0,
      description: ''
    })

    await Swal.fire({
      title: '添加成功',
      text: '支出记录已添加',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    })
  } catch (error) {
    console.error('Failed to add expense:', error)
    await Swal.fire({
      title: '添加失败',
      text: '请重试',
      icon: 'error'
    })
  }
}

const editRecord = (record) => {
  // 编辑记录逻辑
  console.log('Edit record:', record)
}

const deleteRecord = async (record) => {
  try {
    const result = await Swal.fire({
      title: '确认删除',
      text: '确定要删除这条记录吗？',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '删除',
      cancelButtonText: '取消'
    })

    if (result.isConfirmed) {
      const index = financialRecords.value.findIndex(r => r.id === record.id)
      if (index > -1) {
        financialRecords.value.splice(index, 1)
        await Swal.fire({
          title: '删除成功',
          text: '记录已删除',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        })
      }
    }
  } catch (error) {
    console.error('Failed to delete record:', error)
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 初始化
onMounted(() => {
  // 初始化数据
})
</script>
