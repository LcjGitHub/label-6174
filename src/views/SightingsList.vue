<script setup lang="ts">
import { computed } from 'vue'
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
} from 'naive-ui'
import { useSightingsStore } from '@/stores/sightings'

const router = useRouter()
const store = useSightingsStore()

const sightings = computed(() => store.sortedSightings)

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

    <NEmpty
      v-if="sightings.length === 0"
      description="暂无目击记录，点击「新建记录」开始观鸟吧"
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
  margin: 0 0 24px;
  font-size: 22px;
  font-weight: 600;
  color: #333;
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
