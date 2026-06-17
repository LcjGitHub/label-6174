<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import {
  NCard,
  NList,
  NListItem,
  NEmpty,
  NButton,
  NImage,
  NText,
} from 'naive-ui'
import {
  ArrowLeft as ArrowLeftIcon,
} from '@vicons/tabler'
import { useSightingsStore } from '@/stores/sightings'

const route = useRoute()
const router = useRouter()
const store = useSightingsStore()

const birdId = computed(() => route.params.id as string)
const bird = computed(() => store.getBirdById(birdId.value))
const sightings = computed(() => store.getSightingsByBirdId(birdId.value))

function formatDate(date: string): string {
  return dayjs(date).format('YYYY年MM月DD日')
}

function handleBack(): void {
  router.back()
}
</script>

<template>
  <div class="bird-detail-page">
    <NButton
      text
      :icon="ArrowLeftIcon"
      class="back-btn"
      @click="handleBack"
    >
      返回
    </NButton>

    <NCard v-if="bird" class="bird-header" :bordered="false">
      <div class="header-content">
        <NImage
          :src="bird.imageUrl"
          width="120"
          height="120"
          object-fit="cover"
          class="bird-image"
          fallback-src="https://placehold.co/120x120/cccccc/666666?text=Bird"
          preview-disabled
        />
        <div class="bird-info">
          <h1 class="bird-name">{{ bird.name }}</h1>
          <NText depth="3" class="bird-scientific" style="font-style: italic">
            {{ bird.scientificName }}
          </NText>
        </div>
      </div>
    </NCard>

    <NEmpty
      v-else
      description="未找到该鸟种信息"
      style="margin-top: 60px"
    />

    <NCard v-if="bird" class="sightings-section" title="历史目击记录">
      <NEmpty
        v-if="sightings.length === 0"
        description="暂无该鸟种的目击记录"
        style="padding: 40px 0"
      />

      <NList v-else bordered>
        <NListItem v-for="item in sightings" :key="item.id">
          <div class="sighting-item">
            <div class="sighting-date">{{ formatDate(item.date) }}</div>
            <div class="sighting-details">
              <NSpace :size="12" wrap>
                <NTag type="info" size="small">
                  📍 {{ item.location || '未填写地点' }}
                </NTag>
                <NTag type="warning" size="small">
                  数量：{{ item.count }}
                </NTag>
              </NSpace>
              <p v-if="item.note" class="sighting-note">{{ item.note }}</p>
            </div>
          </div>
        </NListItem>
      </NList>
    </NCard>
  </div>
</template>

<style scoped>
.bird-detail-page {
  padding-bottom: 40px;
}

.back-btn {
  margin-bottom: 16px;
  padding-left: 0;
}

.bird-header {
  margin-bottom: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%);
  border-radius: 12px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 24px;
}

.bird-image {
  border-radius: 12px;
  flex-shrink: 0;
}

.bird-info {
  flex: 1;
  min-width: 0;
}

.bird-name {
  margin: 0 0 4px;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.bird-scientific {
  font-size: 15px;
}

.sightings-section {
  border-radius: 12px;
}

.sighting-item {
  width: 100%;
}

.sighting-date {
  font-size: 15px;
  font-weight: 600;
  color: #18a058;
  margin-bottom: 8px;
}

.sighting-details {
  width: 100%;
}

.sighting-note {
  margin: 10px 0 0;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}
</style>
