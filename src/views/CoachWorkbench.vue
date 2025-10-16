<template>
  <div class="space-y-6">
    <!-- 页面标题和欢迎信息 -->
    <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold">教练工作台</h1>
          <p class="mt-2 text-blue-100">欢迎回来，{{ coachInfo.name }}！今天是 {{ currentDate }}</p>
          <p class="text-sm text-blue-200">{{ coachInfo.specialty }}</p>
        </div>
        <div class="text-right">
          <div class="text-2xl font-bold">{{ todayClasses.length }}</div>
          <div class="text-sm text-blue-200">今日课程</div>
        </div>
      </div>
    </div>

    <!-- 功能导航卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div 
        v-for="feature in features" 
        :key="feature.key"
        @click="activeTab = feature.key"
        class="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4"
        :class="{
          'border-blue-500 bg-blue-50': activeTab === feature.key,
          'border-gray-200': activeTab !== feature.key
        }"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <el-icon class="h-8 w-8 text-gray-600" :class="{ 'text-blue-600': activeTab === feature.key }">
              <component :is="feature.icon" />
            </el-icon>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">{{ feature.name }}</h3>
            <p class="text-sm text-gray-500">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="bg-white rounded-lg shadow-md">
      <!-- 我的课表 -->
      <div v-if="activeTab === 'schedule'" class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">我的课表</h2>
          <div class="flex items-center space-x-4">
            <el-button-group>
              <el-button 
                :type="viewMode === 'week' ? 'primary' : 'default'"
                @click="viewMode = 'week'"
                size="small"
              >
                周视图
              </el-button>
              <el-button 
                :type="viewMode === 'month' ? 'primary' : 'default'"
                @click="viewMode = 'month'"
                size="small"
              >
                月视图
              </el-button>
            </el-button-group>
            <el-button @click="refreshSchedule" type="default" size="small">
              <el-icon class="w-4 h-4 mr-1">
                <Refresh />
              </el-icon>
              刷新
            </el-button>
          </div>
        </div>
        
        <!-- 周视图 -->
        <div v-if="viewMode === 'week'" class="space-y-4">
          <div class="flex items-center justify-between">
            <el-button @click="previousWeek" type="text" class="p-2">
              <el-icon class="h-5 w-5">
                <ArrowLeft />
              </el-icon>
            </el-button>
            <h3 class="text-lg font-medium">{{ formatWeekRange(currentWeek) }}</h3>
            <el-button @click="nextWeek" type="text" class="p-2">
              <el-icon class="h-5 w-5">
                <ArrowRight />
              </el-icon>
            </el-button>
          </div>
          
          <div class="grid grid-cols-7 gap-2">
            <div 
              v-for="day in weekDays" 
              :key="day.date"
              class="border rounded-lg p-3"
              :class="{ 'bg-blue-50 border-blue-200': isToday(day.date) }"
            >
              <div class="text-center">
                <div class="text-sm font-medium text-gray-900">{{ day.name }}</div>
                <div class="text-xs text-gray-500">{{ formatDate(day.date) }}</div>
              </div>
              <div class="mt-2 space-y-1">
                <div 
                  v-for="classItem in getDayClasses(day.date)"
                  :key="classItem.id"
                  class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs cursor-pointer hover:bg-blue-200"
                  @click="viewClassDetails(classItem)"
                >
                  <div class="font-medium">{{ classItem.start_time }}</div>
                  <div class="truncate">{{ classItem.activity }}</div>
                  <div class="text-blue-600">{{ classItem.location }}</div>
                  <div class="text-xs text-blue-500">{{ classItem.current_bookings }}/{{ classItem.max_capacity }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 月视图 -->
        <div v-else class="space-y-4">
          <div class="flex items-center justify-between">
            <el-button @click="previousMonth" type="text" class="p-2">
              <el-icon class="h-5 w-5">
                <ArrowLeft />
              </el-icon>
            </el-button>
            <h3 class="text-lg font-medium">{{ formatMonth(currentMonth) }}</h3>
            <el-button @click="nextMonth" type="text" class="p-2">
              <el-icon class="h-5 w-5">
                <ArrowRight />
              </el-icon>
            </el-button>
          </div>
          
          <div class="grid grid-cols-7 gap-1 text-center">
            <div class="p-2 text-sm font-medium text-gray-500">日</div>
            <div class="p-2 text-sm font-medium text-gray-500">一</div>
            <div class="p-2 text-sm font-medium text-gray-500">二</div>
            <div class="p-2 text-sm font-medium text-gray-500">三</div>
            <div class="p-2 text-sm font-medium text-gray-500">四</div>
            <div class="p-2 text-sm font-medium text-gray-500">五</div>
            <div class="p-2 text-sm font-medium text-gray-500">六</div>
            
            <div 
              v-for="day in monthDays" 
              :key="day.date"
              class="p-2 min-h-[80px] border border-gray-200"
              :class="{ 
                'bg-blue-50': isToday(day.date),
                'text-gray-400': !day.isCurrentMonth
              }"
            >
              <div class="text-sm font-medium">{{ day.day }}</div>
              <div class="mt-1 space-y-1">
                <div 
                  v-for="classItem in getDayClasses(day.date)"
                  :key="classItem.id"
                  class="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs cursor-pointer hover:bg-blue-200"
                  @click="viewClassDetails(classItem)"
                >
                  {{ classItem.start_time }} {{ classItem.activity }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 课堂管理 -->
      <div v-if="activeTab === 'management'" class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">课堂管理</h2>
          <el-button @click="refreshClasses" type="default" size="small">
            <el-icon class="w-4 h-4 mr-1">
              <Refresh />
            </el-icon>
            刷新
          </el-button>
        </div>

        <div class="space-y-4">
          <div 
            v-for="classItem in upcomingClasses" 
            :key="classItem.id"
            class="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-4">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900">{{ classItem.activity }}</h3>
                    <p class="text-sm text-gray-500">{{ classItem.location }}</p>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium text-gray-900">{{ classItem.date }}</div>
                    <div class="text-sm text-gray-500">{{ classItem.start_time }} - {{ classItem.end_time }}</div>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <el-button 
                  @click="viewClassMembers(classItem)"
                  type="primary" 
                  size="small"
                >
                  查看学员
                </el-button>
                <el-button 
                  @click="startAttendance(classItem)"
                  type="success" 
                  size="small"
                  :disabled="!canStartAttendance(classItem)"
                >
                  开始签到
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 学员管理 -->
      <div v-if="activeTab === 'members'" class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">学员管理</h2>
          <div class="flex items-center space-x-4">
            <el-input
              v-model="memberSearchQuery"
              placeholder="搜索学员姓名或电话"
              class="w-64"
              clearable
            >
              <template #prefix>
                <el-icon class="text-gray-400">
                  <Search />
                </el-icon>
              </template>
            </el-input>
            <el-button @click="refreshMembers" type="default" size="small">
              <el-icon class="w-4 h-4 mr-1">
                <Refresh />
              </el-icon>
              刷新
            </el-button>
          </div>
        </div>

        <!-- 学员统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-blue-50 rounded-lg p-4">
            <div class="flex items-center">
              <el-icon class="h-8 w-8 text-blue-600">
                <User />
              </el-icon>
              <div class="ml-3">
                <p class="text-sm font-medium text-blue-600">总学员数</p>
                <p class="text-2xl font-bold text-blue-900">{{ totalMembers }}</p>
              </div>
            </div>
          </div>
          <div class="bg-green-50 rounded-lg p-4">
            <div class="flex items-center">
              <el-icon class="h-8 w-8 text-green-600">
                <Check />
              </el-icon>
              <div class="ml-3">
                <p class="text-sm font-medium text-green-600">活跃学员</p>
                <p class="text-2xl font-bold text-green-900">{{ activeMembers }}</p>
              </div>
            </div>
          </div>
          <div class="bg-yellow-50 rounded-lg p-4">
            <div class="flex items-center">
              <el-icon class="h-8 w-8 text-yellow-600">
                <Warning />
              </el-icon>
              <div class="ml-3">
                <p class="text-sm font-medium text-yellow-600">新学员</p>
                <p class="text-2xl font-bold text-yellow-900">{{ newMembers }}</p>
              </div>
            </div>
          </div>
          <div class="bg-purple-50 rounded-lg p-4">
            <div class="flex items-center">
              <el-icon class="h-8 w-8 text-purple-600">
                <Star />
              </el-icon>
              <div class="ml-3">
                <p class="text-sm font-medium text-purple-600">VIP学员</p>
                <p class="text-2xl font-bold text-purple-900">{{ vipMembers }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 学员列表 -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">学员列表</h3>
              <div class="flex items-center space-x-2">
                <el-select v-model="memberFilter" placeholder="筛选类型" size="small" class="w-32">
                  <el-option label="全部" value="all" />
                  <el-option label="VIP" value="vip" />
                  <el-option label="普通" value="normal" />
                  <el-option label="新学员" value="new" />
                </el-select>
                <el-select v-model="memberSortBy" placeholder="排序方式" size="small" class="w-32">
                  <el-option label="姓名" value="name" />
                  <el-option label="加入时间" value="joinDate" />
                  <el-option label="最后上课" value="lastClass" />
                </el-select>
              </div>
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    学员信息
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    会员类型
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    加入时间
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最后上课
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    上课次数
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="member in filteredMembers" 
                  :key="member.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span class="text-sm font-medium text-gray-600">{{ member.name.charAt(0) }}</span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ member.name }}</div>
                        <div class="text-sm text-gray-500">{{ member.phone }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <el-tag :type="member.membership_type === 'VIP' ? 'warning' : 'default'">
                      {{ member.membership_type }}
                    </el-tag>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDate(member.join_date) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ member.last_class_date ? formatDate(member.last_class_date) : '未上课' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ member.class_count }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <el-tag :type="member.status === 'active' ? 'success' : 'danger'">
                      {{ member.status === 'active' ? '活跃' : '非活跃' }}
                    </el-tag>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center space-x-2">
                      <el-button 
                        @click="viewMemberDetails(member)"
                        type="primary" 
                        size="small"
                      >
                        详情
                      </el-button>
                      <el-button 
                        @click="viewMemberHistory(member)"
                        type="default" 
                        size="small"
                      >
                        历史
                      </el-button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 可用时间管理 -->
      <div v-if="activeTab === 'availability'" class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">可用时间管理</h2>
          <el-button @click="showAddAvailabilityModal = true" type="primary">
            <el-icon class="w-4 h-4 mr-1">
              <Plus />
            </el-icon>
            添加可用时间
          </el-button>
        </div>

        <div class="space-y-4">
          <div 
            v-for="availability in coachAvailability" 
            :key="availability.id"
            class="border rounded-lg p-4"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ availability.date }}</h3>
                <p class="text-sm text-gray-500">{{ availability.start_time }} - {{ availability.end_time }}</p>
                <p class="text-sm text-gray-500">{{ availability.notes || '无备注' }}</p>
              </div>
              <div class="flex items-center space-x-2">
                <el-tag :type="availability.status === 'available' ? 'success' : 'warning'">
                  {{ availability.status === 'available' ? '可用' : '已占用' }}
                </el-tag>
                <el-button @click="editAvailability(availability)" type="text" size="small">
                  编辑
                </el-button>
                <el-button @click="deleteAvailability(availability)" type="text" size="small" class="text-red-600">
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 全局课表视图 -->
      <div v-if="activeTab === 'global'" class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">全局课表视图</h2>
          <div class="flex items-center space-x-4">
            <el-date-picker
              v-model="globalScheduleDate"
              type="date"
              placeholder="选择日期"
              size="small"
            />
            <el-button @click="refreshGlobalSchedule" type="default" size="small">
              <el-icon class="w-4 h-4 mr-1">
                <Refresh />
              </el-icon>
              刷新
            </el-button>
          </div>
        </div>

        <div class="space-y-4">
          <div 
            v-for="schedule in globalSchedules" 
            :key="schedule.id"
            class="border rounded-lg p-4"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-4">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900">{{ schedule.activity }}</h3>
                    <p class="text-sm text-gray-500">{{ schedule.location }}</p>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium text-gray-900">{{ schedule.trainer_name }}</div>
                    <div class="text-sm text-gray-500">{{ schedule.start_time }} - {{ schedule.end_time }}</div>
                  </div>
                </div>
              </div>
              <el-tag :type="schedule.trainer_id === coachInfo.id ? 'primary' : 'default'">
                {{ schedule.trainer_id === coachInfo.id ? '我的课程' : '其他教练' }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加可用时间模态框 -->
    <el-dialog
      v-model="showAddAvailabilityModal"
      title="添加可用时间"
      width="500px"
    >
      <el-form :model="availabilityForm" label-width="100px">
        <el-form-item label="日期" required>
          <el-date-picker
            v-model="availabilityForm.date"
            type="date"
            placeholder="选择日期"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="开始时间" required>
          <el-time-picker
            v-model="availabilityForm.start_time"
            placeholder="选择开始时间"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="结束时间" required>
          <el-time-picker
            v-model="availabilityForm.end_time"
            placeholder="选择结束时间"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="availabilityForm.notes"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showAddAvailabilityModal = false">取消</el-button>
          <el-button type="primary" @click="addAvailability">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 课程详情模态框 -->
    <el-dialog
      v-model="showClassDetailsModal"
      title="课程详情"
      width="600px"
    >
      <div v-if="selectedClass" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-500">课程名称</label>
            <p class="text-lg font-medium text-gray-900">{{ selectedClass.activity }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">地点</label>
            <p class="text-lg font-medium text-gray-900">{{ selectedClass.location }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">日期</label>
            <p class="text-lg font-medium text-gray-900">{{ selectedClass.date }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">时间</label>
            <p class="text-lg font-medium text-gray-900">{{ selectedClass.start_time }} - {{ selectedClass.end_time }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">容量</label>
            <p class="text-lg font-medium text-gray-900">{{ selectedClass.current_bookings }}/{{ selectedClass.max_capacity }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">状态</label>
            <el-tag :type="selectedClass.status === 'confirmed' ? 'success' : 'warning'">
              {{ selectedClass.status === 'confirmed' ? '已确认' : '待确认' }}
            </el-tag>
          </div>
        </div>
        <div v-if="selectedClass.notes">
          <label class="text-sm font-medium text-gray-500">备注</label>
          <p class="text-gray-900">{{ selectedClass.notes }}</p>
        </div>
      </div>
    </el-dialog>

    <!-- 学员名单模态框 -->
    <el-dialog
      v-model="showMembersModal"
      title="学员名单"
      width="800px"
    >
      <div v-if="selectedClass" class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium">{{ selectedClass.activity }} - 学员名单</h3>
          <el-button @click="exportMembers" type="primary" size="small">
            <el-icon class="w-4 h-4 mr-1">
              <Download />
            </el-icon>
            导出名单
          </el-button>
        </div>
        
        <div class="space-y-2">
          <div 
            v-for="member in classMembers" 
            :key="member.id"
            class="flex items-center justify-between p-3 border rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span class="text-sm font-medium text-gray-600">{{ member.name.charAt(0) }}</span>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ member.name }}</p>
                <p class="text-sm text-gray-500">{{ member.phone }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <el-tag :type="member.attendance_status === 'present' ? 'success' : 'default'">
                {{ member.attendance_status === 'present' ? '已签到' : '未签到' }}
              </el-tag>
              <el-button 
                v-if="member.attendance_status !== 'present'"
                @click="markAttendance(member)"
                type="primary" 
                size="small"
              >
                签到
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 学员详情模态框 -->
    <el-dialog
      v-model="showMemberDetailsModal"
      title="学员详情"
      width="700px"
    >
      <div v-if="selectedMember" class="space-y-6">
        <!-- 基本信息 -->
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <span class="text-2xl font-medium text-gray-600">{{ selectedMember.name.charAt(0) }}</span>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-gray-900">{{ selectedMember.name }}</h3>
            <p class="text-gray-500">{{ selectedMember.phone }} • {{ selectedMember.email }}</p>
            <div class="flex items-center space-x-2 mt-1">
              <el-tag :type="selectedMember.membership_type === 'VIP' ? 'warning' : 'default'">
                {{ selectedMember.membership_type }}
              </el-tag>
              <el-tag :type="selectedMember.status === 'active' ? 'success' : 'danger'">
                {{ selectedMember.status === 'active' ? '活跃' : '非活跃' }}
              </el-tag>
            </div>
          </div>
        </div>

        <!-- 详细信息 -->
        <div class="grid grid-cols-2 gap-6">
          <div>
            <h4 class="text-lg font-medium text-gray-900 mb-3">基本信息</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-500">加入时间:</span>
                <span class="text-gray-900">{{ formatDate(selectedMember.join_date) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">最后上课:</span>
                <span class="text-gray-900">{{ selectedMember.last_class_date ? formatDate(selectedMember.last_class_date) : '未上课' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">总上课次数:</span>
                <span class="text-gray-900">{{ selectedMember.class_count }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">本月上课:</span>
                <span class="text-gray-900">{{ selectedMember.monthly_class_count }}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="text-lg font-medium text-gray-900 mb-3">课程偏好</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-500">最常上课类型:</span>
                <span class="text-gray-900">{{ selectedMember.preferred_class_type || '无' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">偏好时间:</span>
                <span class="text-gray-900">{{ selectedMember.preferred_time || '无' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">健身目标:</span>
                <span class="text-gray-900">{{ selectedMember.fitness_goal || '无' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 备注 -->
        <div v-if="selectedMember.notes">
          <h4 class="text-lg font-medium text-gray-900 mb-2">备注</h4>
          <p class="text-gray-700 bg-gray-50 p-3 rounded-lg">{{ selectedMember.notes }}</p>
        </div>
      </div>
    </el-dialog>

    <!-- 学员历史记录模态框 -->
    <el-dialog
      v-model="showMemberHistoryModal"
      title="学员历史记录"
      width="900px"
    >
      <div v-if="selectedMember" class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium">{{ selectedMember.name }} - 上课历史</h3>
          <div class="flex items-center space-x-2">
            <el-date-picker
              v-model="historyDateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
            />
            <el-button @click="refreshMemberHistory" type="default" size="small">
              <el-icon class="w-4 h-4 mr-1">
                <Refresh />
              </el-icon>
              刷新
            </el-button>
          </div>
        </div>

        <div class="space-y-3">
          <div 
            v-for="record in memberHistoryData" 
            :key="record.id"
            class="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-4">
                  <div>
                    <h4 class="text-lg font-medium text-gray-900">{{ record.class_name }}</h4>
                    <p class="text-sm text-gray-500">{{ record.location }}</p>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium text-gray-900">{{ record.date }}</div>
                    <div class="text-sm text-gray-500">{{ record.start_time }} - {{ record.end_time }}</div>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <el-tag :type="record.attendance_status === 'present' ? 'success' : 'danger'">
                  {{ record.attendance_status === 'present' ? '已签到' : '未签到' }}
                </el-tag>
                <el-tag :type="record.rating ? 'warning' : 'default'">
                  {{ record.rating ? `${record.rating}星` : '未评价' }}
                </el-tag>
              </div>
            </div>
            <div v-if="record.feedback" class="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
              <strong>反馈:</strong> {{ record.feedback }}
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useCoachService } from '../composables/useCoachService'
import Swal from 'sweetalert2'

const { user } = useAuth()
const {
  coachInfo,
  coachClasses,
  coachAvailability,
  globalSchedules,
  classMembers,
  allMembers: allMembersData,
  memberHistory: memberHistoryData,
  getCoachClasses,
  getCoachAvailability,
  addAvailability: addAvailabilityService,
  updateAvailability,
  deleteAvailability: deleteAvailabilityService,
  getGlobalSchedules,
  getClassMembers,
  markAttendance: markAttendanceService,
  exportClassMembers,
  getCoachMembers,
  getMemberHistory
} = useCoachService()

// 响应式数据
const activeTab = ref('schedule')
const viewMode = ref('week')
const currentWeek = ref(new Date())
const currentMonth = ref(new Date())
const globalScheduleDate = ref(new Date())

// 模态框状态
const showAddAvailabilityModal = ref(false)
const showClassDetailsModal = ref(false)
const showMembersModal = ref(false)
const showMemberDetailsModal = ref(false)
const showMemberHistoryModal = ref(false)

// 选中的课程和学员
const selectedClass = ref(null)
const selectedMember = ref(null)

// 学员管理相关数据
const memberSearchQuery = ref('')
const memberFilter = ref('all')
const memberSortBy = ref('name')
const historyDateRange = ref([])
const allMembers = ref([])
const memberHistory = ref([])

// 功能导航
const features = [
  {
    key: 'schedule',
    name: '我的课表',
    description: '查看个人课程安排',
    icon: 'Calendar'
  },
  {
    key: 'management',
    name: '课堂管理',
    description: '管理课程和学员',
    icon: 'UserFilled'
  },
  {
    key: 'members',
    name: '学员管理',
    description: '管理学员信息和状态',
    icon: 'User'
  },
  {
    key: 'availability',
    name: '可用时间管理',
    description: '标记可授课时间',
    icon: 'Clock'
  },
  {
    key: 'global',
    name: '全局课表视图',
    description: '查看全健身房课程',
    icon: 'DataAnalysis'
  }
]

// 表单数据
const availabilityForm = reactive({
  date: '',
  start_time: '',
  end_time: '',
  notes: ''
})

// 数据现在从服务中获取

// 计算属性
const currentDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
})

const todayClasses = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return coachClasses.value.filter(cls => cls.date === today)
})

const upcomingClasses = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return coachClasses.value.filter(cls => cls.date >= today).slice(0, 5)
})

// 学员管理计算属性
const totalMembers = computed(() => allMembersData.value.length)

const activeMembers = computed(() => 
  allMembersData.value.filter(member => member.status === 'active').length
)

const newMembers = computed(() => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  return allMembersData.value.filter(member => 
    new Date(member.join_date) >= thirtyDaysAgo
  ).length
})

const vipMembers = computed(() => 
  allMembersData.value.filter(member => member.membership_type === 'VIP').length
)

const filteredMembers = computed(() => {
  let filtered = allMembersData.value

  // 搜索过滤
  if (memberSearchQuery.value) {
    const query = memberSearchQuery.value.toLowerCase()
    filtered = filtered.filter(member => 
      member.name.toLowerCase().includes(query) ||
      member.phone.includes(query)
    )
  }

  // 类型过滤
  if (memberFilter.value !== 'all') {
    if (memberFilter.value === 'vip') {
      filtered = filtered.filter(member => member.membership_type === 'VIP')
    } else if (memberFilter.value === 'normal') {
      filtered = filtered.filter(member => member.membership_type === '普通')
    } else if (memberFilter.value === 'new') {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      filtered = filtered.filter(member => 
        new Date(member.join_date) >= thirtyDaysAgo
      )
    }
  }

  // 排序
  if (memberSortBy.value === 'name') {
    filtered = filtered.sort((a, b) => a.name.localeCompare(b.name))
  } else if (memberSortBy.value === 'joinDate') {
    filtered = filtered.sort((a, b) => new Date(b.join_date) - new Date(a.join_date))
  } else if (memberSortBy.value === 'lastClass') {
    filtered = filtered.sort((a, b) => {
      if (!a.last_class_date && !b.last_class_date) return 0
      if (!a.last_class_date) return 1
      if (!b.last_class_date) return -1
      return new Date(b.last_class_date) - new Date(a.last_class_date)
    })
  }

  return filtered
})

const weekDays = computed(() => {
  const days = []
  const startOfWeek = new Date(currentWeek.value)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    days.push({
      name: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][i],
      date: day.toISOString().split('T')[0]
    })
  }
  return days
})

const monthDays = computed(() => {
  const days = []
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  for (let i = 0; i < 42; i++) {
    const day = new Date(startDate)
    day.setDate(startDate.getDate() + i)
    days.push({
      date: day.toISOString().split('T')[0],
      day: day.getDate(),
      isCurrentMonth: day.getMonth() === month
    })
  }
  return days
})

// 初始化
onMounted(async () => {
  await initializeData()
})

// 初始化数据
const initializeData = async () => {
  try {
    await Promise.all([
      getCoachClasses(coachInfo.value.id),
      getCoachAvailability(coachInfo.value.id),
      getGlobalSchedules(),
      getCoachMembers(coachInfo.value.id)
    ])
  } catch (error) {
    console.error('初始化数据失败:', error)
    Swal.fire({
      title: '错误',
      text: '初始化数据失败，请刷新页面重试',
      icon: 'error'
    })
  }
}

// 工具函数
const formatWeekRange = (date) => {
  const startOfWeek = new Date(date)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`
}

const formatMonth = (date) => {
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })
}

const formatDate = (date) => {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
}

const isToday = (date) => {
  const today = new Date().toISOString().split('T')[0]
  return date === today
}

const getDayClasses = (date) => {
  return coachClasses.value.filter(cls => cls.date === date)
}

// 事件处理函数
const refreshSchedule = async () => {
  try {
    await getCoachClasses(coachInfo.value.id)
    Swal.fire({
      title: '刷新成功',
      text: '课程数据已更新',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    })
  } catch (error) {
    console.error('刷新课程数据失败:', error)
    Swal.fire({
      title: '刷新失败',
      text: '刷新课程数据失败，请重试',
      icon: 'error'
    })
  }
}

const refreshClasses = async () => {
  try {
    await getCoachClasses(coachInfo.value.id)
    Swal.fire({
      title: '刷新成功',
      text: '课程管理数据已更新',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    })
  } catch (error) {
    console.error('刷新课程管理数据失败:', error)
    Swal.fire({
      title: '刷新失败',
      text: '刷新课程管理数据失败，请重试',
      icon: 'error'
    })
  }
}

const refreshGlobalSchedule = async () => {
  try {
    await getGlobalSchedules(globalScheduleDate.value)
    Swal.fire({
      title: '刷新成功',
      text: '全局课程数据已更新',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    })
  } catch (error) {
    console.error('刷新全局课程数据失败:', error)
    Swal.fire({
      title: '刷新失败',
      text: '刷新全局课程数据失败，请重试',
      icon: 'error'
    })
  }
}

// 学员管理相关函数
const refreshMembers = async () => {
  try {
    await getCoachMembers(coachInfo.value.id)
    Swal.fire({
      title: '刷新成功',
      text: '学员数据已更新',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    })
  } catch (error) {
    console.error('刷新学员数据失败:', error)
    Swal.fire({
      title: '刷新失败',
      text: '刷新学员数据失败，请重试',
      icon: 'error'
    })
  }
}

const viewMemberDetails = (member) => {
  selectedMember.value = member
  showMemberDetailsModal.value = true
}

const viewMemberHistory = async (member) => {
  try {
    selectedMember.value = member
    await getMemberHistory(member.id)
    showMemberHistoryModal.value = true
  } catch (error) {
    console.error('获取学员历史记录失败:', error)
    Swal.fire({
      title: '错误',
      text: '获取学员历史记录失败，请重试',
      icon: 'error'
    })
  }
}

const refreshMemberHistory = async () => {
  if (selectedMember.value) {
    try {
      await getMemberHistory(selectedMember.value.id, historyDateRange.value)
      Swal.fire({
        title: '刷新成功',
        text: '历史记录已更新',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      })
    } catch (error) {
      console.error('刷新历史记录失败:', error)
      Swal.fire({
        title: '刷新失败',
        text: '刷新历史记录失败，请重试',
        icon: 'error'
      })
    }
  }
}

const viewClassDetails = (classItem) => {
  selectedClass.value = classItem
  showClassDetailsModal.value = true
}

const viewClassMembers = async (classItem) => {
  try {
    selectedClass.value = classItem
    await getClassMembers(classItem.id)
    showMembersModal.value = true
  } catch (error) {
    console.error('获取学员名单失败:', error)
    Swal.fire({
      title: '错误',
      text: '获取学员名单失败，请重试',
      icon: 'error'
    })
  }
}

const startAttendance = (classItem) => {
  Swal.fire({
    title: '开始签到',
    text: `确定要开始 ${classItem.activity} 的签到吗？`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: '开始',
    cancelButtonText: '取消'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: '签到已开始',
        text: '学员可以开始签到了',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    }
  })
}

const canStartAttendance = (classItem) => {
  const now = new Date()
  const classTime = new Date(`${classItem.date} ${classItem.start_time}`)
  const timeDiff = classTime.getTime() - now.getTime()
  return timeDiff <= 30 * 60 * 1000 // 课程开始前30分钟内可以开始签到
}

const markAttendance = async (member) => {
  try {
    await markAttendanceService(selectedClass.value.id, member.id, 'present')
    Swal.fire({
      title: '签到成功',
      text: `${member.name} 已签到`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    })
  } catch (error) {
    console.error('签到失败:', error)
    Swal.fire({
      title: '签到失败',
      text: '签到失败，请重试',
      icon: 'error'
    })
  }
}

const exportMembers = async () => {
  try {
    await exportClassMembers(selectedClass.value.id)
    Swal.fire({
      title: '导出成功',
      text: '学员名单已导出',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
  } catch (error) {
    console.error('导出失败:', error)
    Swal.fire({
      title: '导出失败',
      text: '导出学员名单失败，请重试',
      icon: 'error'
    })
  }
}

const addAvailability = async () => {
  try {
    await addAvailabilityService(availabilityForm)
    showAddAvailabilityModal.value = false
    
    // 重置表单
    Object.assign(availabilityForm, {
      date: '',
      start_time: '',
      end_time: '',
      notes: ''
    })
    
    Swal.fire({
      title: '添加成功',
      text: '可用时间已添加',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
  } catch (error) {
    console.error('添加可用时间失败:', error)
    Swal.fire({
      title: '添加失败',
      text: '添加可用时间失败，请重试',
      icon: 'error'
    })
  }
}

const editAvailability = (availability) => {
  Object.assign(availabilityForm, {
    date: availability.date,
    start_time: availability.start_time,
    end_time: availability.end_time,
    notes: availability.notes
  })
  showAddAvailabilityModal.value = true
}

const deleteAvailability = async (availability) => {
  const result = await Swal.fire({
    title: '确认删除',
    text: '确定要删除这个可用时间吗？',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '删除',
    cancelButtonText: '取消'
  })
  
  if (result.isConfirmed) {
    try {
      await deleteAvailabilityService(availability.id)
      Swal.fire({
        title: '删除成功',
        text: '可用时间已删除',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    } catch (error) {
      console.error('删除可用时间失败:', error)
      Swal.fire({
        title: '删除失败',
        text: '删除可用时间失败，请重试',
        icon: 'error'
      })
    }
  }
}

// 周/月导航
const previousWeek = () => {
  const newWeek = new Date(currentWeek.value)
  newWeek.setDate(newWeek.getDate() - 7)
  currentWeek.value = newWeek
}

const nextWeek = () => {
  const newWeek = new Date(currentWeek.value)
  newWeek.setDate(newWeek.getDate() + 7)
  currentWeek.value = newWeek
}

const previousMonth = () => {
  const newMonth = new Date(currentMonth.value)
  newMonth.setMonth(newMonth.getMonth() - 1)
  currentMonth.value = newMonth
}

const nextMonth = () => {
  const newMonth = new Date(currentMonth.value)
  newMonth.setMonth(newMonth.getMonth() + 1)
  currentMonth.value = newMonth
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
