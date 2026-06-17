<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  NCard,
  NForm,
  NFormItem,
  NSelect,
  NDatePicker,
  NInput,
  NAutoComplete,
  NInputNumber,
  NButton,
  NSpace,
  NImage,
  NSpin,
  useMessage,
  type FormInst,
  type FormRules,
} from 'naive-ui'
import dayjs from 'dayjs'
import { useSightingsStore } from '@/stores/sightings'
import type { SightingForm } from '@/types'

const router = useRouter()
const route = useRoute()
const message = useMessage()
const store = useSightingsStore()

const formRef = ref<FormInst | null>(null)
const dataLoaded = ref(false)

const isEditMode = computed(() => !!route.params.id)
const sightingId = computed(() => route.params.id as string)
const pageTitle = computed(() => (isEditMode.value ? '编辑目击记录' : '新建目击记录'))
const submitButtonText = computed(() => (isEditMode.value ? '保存修改' : '保存记录'))

const formModel = ref<SightingForm>({
  birdId: null,
  date: dayjs().valueOf(),
  location: '',
  count: 1,
  note: '',
})

const birdOptions = computed(() =>
  store.birds.map((bird) => ({
    label: `${bird.name}（${bird.scientificName}）`,
    value: bird.id,
  }))
)

const selectedBird = computed(() =>
  formModel.value.birdId ? store.getBirdById(formModel.value.birdId) : undefined
)

const locationOptions = computed(() => {
  const keyword = formModel.value.location.trim().toLowerCase()
  const recent = store.recentLocations
  if (!keyword) {
    return recent.map((loc) => ({ label: loc, value: loc }))
  }
  return recent
    .filter((loc) => loc.toLowerCase().includes(keyword))
    .map((loc) => ({ label: loc, value: loc }))
})

const rules: FormRules = {
  birdId: [{ required: true, message: '请选择鸟种', trigger: ['blur', 'change'] }],
  date: [
    {
      required: true,
      type: 'number',
      message: '请选择日期',
      trigger: ['blur', 'change'],
    },
  ],
  location: [{ required: true, message: '请填写地点', trigger: 'blur' }],
  count: [
    {
      required: true,
      type: 'number',
      min: 1,
      message: '数量至少为 1',
      trigger: ['blur', 'change'],
    },
  ],
}

onMounted(() => {
  if (isEditMode.value) {
    const sighting = store.getSightingById(sightingId.value)
    if (!sighting) {
      dataLoaded.value = true
      message.warning('未找到该目击记录')
      router.push('/sightings')
      return
    }
    formModel.value = {
      birdId: sighting.birdId,
      date: dayjs(sighting.date).valueOf(),
      location: sighting.location,
      count: sighting.count,
      note: sighting.note,
    }
  }
  dataLoaded.value = true
})

/**
 * 提交表单
 */
async function handleSubmit(): Promise<void> {
  try {
    await formRef.value?.validate()
    if (isEditMode.value) {
      store.updateSighting(sightingId.value, formModel.value)
      message.success('保存成功')
    } else {
      store.addSighting(formModel.value)
      message.success('记录已保存')
    }
    router.push('/sightings')
  } catch {
    message.warning('请完善表单信息')
  }
}

/**
 * 重置表单
 */
function handleReset(): void {
  if (isEditMode.value) {
    const sighting = store.getSightingById(sightingId.value)
    if (sighting) {
      formModel.value = {
        birdId: sighting.birdId,
        date: dayjs(sighting.date).valueOf(),
        location: sighting.location,
        count: sighting.count,
        note: sighting.note,
      }
    }
  } else {
    formModel.value = {
      birdId: null,
      date: dayjs().valueOf(),
      location: '',
      count: 1,
      note: '',
    }
  }
}
</script>

<template>
  <div class="new-page">
    <h2 class="page-title">{{ pageTitle }}</h2>

    <NSpin v-if="!dataLoaded" class="page-loading" />
    <NCard v-else>
      <NForm
        ref="formRef"
        :model="formModel"
        :rules="rules"
        label-placement="left"
        label-width="80"
        require-mark-placement="right-hanging"
      >
        <NFormItem label="鸟种" path="birdId">
          <NSelect
            v-model:value="formModel.birdId"
            :options="birdOptions"
            placeholder="搜索并选择鸟种"
            filterable
            clearable
          />
        </NFormItem>

        <div v-if="selectedBird" class="bird-preview">
          <NImage
            :src="selectedBird.imageUrl"
            width="100"
            height="100"
            object-fit="cover"
            class="preview-image"
            fallback-src="https://placehold.co/100x100/cccccc/666666?text=Bird"
          />
          <div>
            <div class="preview-name">{{ selectedBird.name }}</div>
            <div class="preview-scientific">{{ selectedBird.scientificName }}</div>
          </div>
        </div>

        <NFormItem label="日期" path="date">
          <NDatePicker
            v-model:value="formModel.date"
            type="date"
            style="width: 100%"
            clearable
          />
        </NFormItem>

        <NFormItem label="地点" path="location">
          <NAutoComplete
            v-model:value="formModel.location"
            :options="locationOptions"
            placeholder="如：颐和园、奥森公园"
            :input-props="{ maxlength: 100 }"
          />
        </NFormItem>

        <NFormItem label="数量" path="count">
          <NInputNumber
            v-model:value="formModel.count"
            :min="1"
            :max="9999"
            style="width: 100%"
          />
        </NFormItem>

        <NFormItem label="备注" path="note">
          <NInput
            v-model:value="formModel.note"
            type="textarea"
            placeholder="观察行为、天气、同伴等信息（选填）"
            :rows="3"
            maxlength="500"
            show-count
          />
        </NFormItem>

        <NFormItem>
          <NSpace>
            <NButton type="primary" @click="handleSubmit">{{ submitButtonText }}</NButton>
            <NButton @click="handleReset">重置</NButton>
            <NButton quaternary @click="router.push('/sightings')">取消</NButton>
          </NSpace>
        </NFormItem>
      </NForm>
    </NCard>
  </div>
</template>

<style scoped>
.new-page {
  padding-bottom: 40px;
}

.page-loading {
  display: flex;
  justify-content: center;
  padding: 80px 0;
}

.page-title {
  margin: 0 0 24px;
  font-size: 22px;
  font-weight: 600;
  color: #333;
}

.bird-preview {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 0 0 16px 80px;
  padding: 12px;
  background: #f6f8fa;
  border-radius: 8px;
}

.preview-image {
  border-radius: 8px;
}

.preview-name {
  font-size: 16px;
  font-weight: 500;
}

.preview-scientific {
  font-size: 13px;
  color: #888;
  margin-top: 4px;
  font-style: italic;
}
</style>
