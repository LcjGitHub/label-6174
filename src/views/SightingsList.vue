<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import {
  NCard,
  NTimeline,
  NTimelineItem,
  NEmpty,
  NButton,
  NPopconfirm,
  NSpace,
  NTag,
  NImage,
  NText,
  NSelect,
  NInput,
} from 'naive-ui'
import {
  FileText as FileTextIcon,
  Feather as BirdIcon,
  Tags as CategoryIcon,
} from '@vicons/tabler'
import { useSightingsStore } from '@/stores/sightings'
import { getSummaryStats, getFilteredSightings } from '@/utils/sightingStats'

const router = useRouter()
const store = useSightingsStore()

const selectedBirdId = ref('')
const locationKeyword = ref('')

const summary = computed(() => getSummaryStats(store.sightings))

const birdOptions = computed(() => {
  const sightingBirdIds = new Set(store.sightings.map((s) => s.birdId))
  const birdsWithSightings = store.birds.filter((bird) => sightingBirdIds.has(bird.id))
  return [
    { label: '全部鸟种', value: '' },
    ...birdsWithSightings.map((bird) => ({
      label: bird.name,
      value: bird.id,
    })),
  ]
})

const sightings = computed(() =>
  getFilteredSightings(store.sightings, selectedBirdId.value, locationKeyword.value)
)

function handleClearFilters(): void {
  selectedBirdId.value = ''
  locationKeyword.value = ''
}

/**
 * 格式化日期显示
 */
function formatDate(date: string): string {
  return dayjs(date).format('YYYY年MM月DD日')
}

/**
 * 编辑记录
 */
function handleEdit(id: string): void {
  router.push(`/edit/${id}`)
}

/**
 * 删除记录
 */
function handleDelete(id: string): void {
  store.removeSighting(id)
}
</script>

<template>
  <div class="sightings-page">
    <h2 class="page-title">目击时间线</h2>

    <div class="summary-cards">
      <div class="summary-card" style="--card-color: #2e7d32; --card-bg: #e8f5e9">
        <div class="summary-icon-wrapper">
          <FileTextIcon class="summary-icon" />
        </div>
        <div class="summary-text">
          <div class="summary-value">{{ summary.totalSightings }}</div>
          <div class="summary-label">记录总条数</div>
        </div>
      </div>

      <div class="summary-card" style="--card-color: #1565c0; --card-bg: #e3f2fd">
        <div class="summary-icon-wrapper">
          <BirdIcon class="summary-icon" />
        </div>
        <div class="summary-text">
          <div class="summary-value">{{ summary.totalBirds }}</div>
          <div class="summary-label">观测鸟只合计数</div>
        </div>
      </div>

      <div class="summary-card" style="--card-color: #e65100; --card-bg: #fff3e0">
        <div class="summary-icon-wrapper">
          <CategoryIcon class="summary-icon" />
        </div>
        <div class="summary-text">
          <div class="summary-value">{{ summary.uniqueSpecies }}</div>
          <div class="summary-label">涉及鸟种数</div>
        </div>
      </div>
    </div>

    <div class="filter-bar">
      <div class="filter-row">
        <NSelect
          v-model:value="selectedBirdId"
          :options="birdOptions"
          placeholder="选择鸟种"
          clearable
          :dropdown-props="{ to: false, placement: 'bottom-start' }"
          class="filter-select"
        />
        <NInput
          v-model:value="locationKeyword"
          placeholder="输入地点关键词"
          clearable
          class="filter-input"
        />
        <NButton
          v-if="selectedBirdId || locationKeyword"
          size="small"
          @click="handleClearFilters"
          class="filter-button"
        >
          清空筛选
        </NButton>
      </div>
    </div>

    <NEmpty
      v-if="sightings.length === 0 && !selectedBirdId && !locationKeyword"
      description="暂无目击记录，点击「新建记录」开始观鸟吧"
      style="margin-top: 60px"
    />
    <NEmpty
      v-else-if="sightings.length === 0"
      description="没有符合筛选条件的记录"
      style="margin-top: 60px"
    />

    <NTimeline v-else>
      <NTimelineItem
        v-for="item in sightings"
        :key="item.id"
        :title="formatDate(item.date)"
        type="success"
      >
        <NCard size="small" class="sighting-card">
          <div class="card-body">
            <router-link
              v-if="store.getBirdById(item.birdId)"
              :to="`/bird/${item.birdId}`"
              class="bird-image-link"
            >
              <NImage
                :src="store.getBirdById(item.birdId)?.imageUrl"
                width="80"
                height="80"
                object-fit="cover"
                class="bird-image"
                fallback-src="https://placehold.co/80x80/cccccc/666666?text=Bird"
              />
            </router-link>
            <NImage
              v-else
              src="https://placehold.co/80x80/cccccc/666666?text=Bird"
              width="80"
              height="80"
              object-fit="cover"
              class="bird-image"
            />
            <div class="card-info">
              <div class="bird-name">
                <router-link
                  v-if="store.getBirdById(item.birdId)"
                  :to="`/bird/${item.birdId}`"
                  class="bird-name-link"
                >
                  {{ store.getBirdById(item.birdId)?.name }}
                </router-link>
                <span v-else>未知鸟种</span>
              </div>
              <div v-if="store.getBirdById(item.birdId)?.scientificName" class="bird-scientific">
                <NText depth="3" style="font-size: 13px; font-style: italic">
                  {{ store.getBirdById(item.birdId)?.scientificName }}
                </NText>
              </div>
              <NSpace :size="12" style="margin-top: 8px">
                <NTag type="info" size="small">
                  📍 {{ item.location || '未填写地点' }}
                </NTag>
                <NTag type="warning" size="small">
                  数量：{{ item.count }}
                </NTag>
              </NSpace>
              <p v-if="item.note" class="note">{{ item.note }}</p>
            </div>
            <NSpace vertical size="small" class="card-actions">
              <NButton size="small" type="primary" @click="handleEdit(item.id)">编辑</NButton>
              <NPopconfirm @positive-click="handleDelete(item.id)">
                <template #trigger>
                  <NButton size="small" type="error" ghost>删除</NButton>
                </template>
                确定删除这条目击记录吗？
              </NPopconfirm>
            </NSpace>
          </div>
        </NCard>
      </NTimelineItem>
    </NTimeline>
  </div>
</template>

<style scoped>
.sightings-page {
  padding-bottom: 40px;
}

.page-title {
  margin: 0 0 16px;
  font-size: 22px;
  font-weight: 600;
  color: #333;
}

.summary-cards {
  margin-bottom: 20px;
  display: flex;
  width: 100%;
  gap: 10px;
}

.summary-card {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 10px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.summary-icon-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--card-bg);
}

.summary-icon {
  width: 18px;
  height: 18px;
  color: var(--card-color);
}

.summary-text {
  min-width: 0;
  flex: 1;
}

.summary-value {
  font-size: 20px;
  font-weight: 600;
  color: var(--card-color);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.summary-label {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 360px) {
  .summary-cards {
    gap: 8px;
  }

  .summary-card {
    padding: 10px 8px;
    gap: 8px;
  }

  .summary-icon-wrapper {
    width: 30px;
    height: 30px;
    border-radius: 6px;
  }

  .summary-icon {
    width: 15px;
    height: 15px;
  }

  .summary-value {
    font-size: 17px;
  }

  .summary-label {
    font-size: 11px;
  }
}

.filter-bar {
  margin-bottom: 24px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
  position: relative;
  z-index: 1;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: nowrap;
  min-width: 0;
}

.filter-select {
  width: 180px;
  flex-shrink: 0;
}

.filter-input {
  width: 220px;
  flex-shrink: 0;
}

.filter-button {
  flex-shrink: 0;
}

.sighting-card {
  margin-top: 4px;
}

.card-body {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.bird-image {
  border-radius: 8px;
  flex-shrink: 0;
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-actions {
  flex-shrink: 0;
  align-self: center;
}

.bird-name {
  font-size: 16px;
  font-weight: 500;
}

.note {
  margin: 8px 0 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.bird-image-link {
  display: block;
  flex-shrink: 0;
  transition: opacity 0.2s ease;
}

.bird-image-link:hover {
  opacity: 0.85;
}

.bird-scientific {
  margin-top: 4px;
}

.bird-name-link {
  color: #18a058;
  text-decoration: underline;
  transition: opacity 0.2s ease;
}

.bird-name-link:hover {
  opacity: 0.75;
}
</style>
