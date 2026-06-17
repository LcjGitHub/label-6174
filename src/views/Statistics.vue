<script setup lang="ts">
import { computed } from 'vue'
import {
  NCard,
  NSpace,
  NStatistic,
  NEmpty,
  NList,
  NListItem,
  NImage,
  NText,
  NTag,
} from 'naive-ui'
import {
  FileText as FileTextIcon,
  Feather as BirdIcon,
  Tags as CategoryIcon,
} from '@vicons/tabler'
import { useSightingsStore } from '@/stores/sightings'

const store = useSightingsStore()

const totalSightings = computed(() => store.totalSightingsCount)
const totalBirds = computed(() => store.totalBirdsCount)
const uniqueSpecies = computed(() => store.uniqueSpeciesCount)
const speciesStats = computed(() => store.speciesStats)
</script>

<template>
  <div class="statistics-page">
    <h2 class="page-title">统计概览</h2>

    <NSpace :size="16" class="stats-cards">
      <NCard class="stat-card" hoverable>
        <div class="stat-card-content">
          <div class="stat-icon-wrapper" style="background: #e8f5e9">
            <FileTextIcon class="stat-icon" style="color: #2e7d32" />
          </div>
          <NStatistic
            :value="totalSightings"
            label="目击记录总条数"
            :value-style="{ color: '#2e7d32' }"
          />
        </div>
      </NCard>

      <NCard class="stat-card" hoverable>
        <div class="stat-card-content">
          <div class="stat-icon-wrapper" style="background: #e3f2fd">
            <BirdIcon class="stat-icon" style="color: #1565c0" />
          </div>
          <NStatistic
            :value="totalBirds"
            label="累计观测鸟只数量"
            :value-style="{ color: '#1565c0' }"
          />
        </div>
      </NCard>

      <NCard class="stat-card" hoverable>
        <div class="stat-card-content">
          <div class="stat-icon-wrapper" style="background: #fff3e0">
            <CategoryIcon class="stat-icon" style="color: #e65100" />
          </div>
          <NStatistic
            :value="uniqueSpecies"
            label="已观测鸟种数量"
            :value-style="{ color: '#e65100' }"
          />
        </div>
      </NCard>
    </NSpace>

    <NCard class="species-section" title="鸟种观测排名">
      <NEmpty
        v-if="speciesStats.length === 0"
        description="暂无统计数据，快去记录你的第一次观鸟吧"
        style="padding: 40px 0"
      />

      <NList v-else bordered>
        <NListItem v-for="(item, index) in speciesStats" :key="item.birdId">
          <div class="species-item">
            <div class="rank-badge" :class="'rank-' + (index + 1)">
              {{ index + 1 }}
            </div>
            <NImage
              :src="item.imageUrl"
              width="56"
              height="56"
              object-fit="cover"
              class="species-image"
              fallback-src="https://placehold.co/56x56/cccccc/666666?text=鸟"
            />
            <div class="species-info">
              <div class="species-name">
                {{ item.name }}
                <NText depth="3" style="font-size: 12px; margin-left: 6px">
                  {{ item.scientificName }}
                </NText>
              </div>
              <NSpace :size="10" style="margin-top: 6px">
                <NTag type="info" size="small">
                  观测 {{ item.sightingCount }} 次
                </NTag>
                <NTag type="warning" size="small">
                  累计 {{ item.count }} 只
                </NTag>
              </NSpace>
            </div>
            <div class="species-count">
              <span class="count-number">{{ item.count }}</span>
              <span class="count-unit">只</span>
            </div>
          </div>
        </NListItem>
      </NList>
    </NCard>
  </div>
</template>

<style scoped>
.statistics-page {
  padding-bottom: 40px;
}

.page-title {
  margin: 0 0 24px;
  font-size: 22px;
  font-weight: 600;
  color: #333;
}

.stats-cards {
  margin-bottom: 24px;
}

.stat-card {
  flex: 1;
  min-width: 0;
}

.stat-card-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon {
  width: 28px;
  height: 28px;
}

.species-section {
  margin-top: 8px;
}

.species-item {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
}

.rank-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  color: #fff;
  background: #999;
  flex-shrink: 0;
}

.rank-1 {
  background: linear-gradient(135deg, #ffd700, #ffb300);
  box-shadow: 0 2px 8px rgba(255, 179, 0, 0.4);
}

.rank-2 {
  background: linear-gradient(135deg, #c0c0c0, #9e9e9e);
  box-shadow: 0 2px 8px rgba(158, 158, 158, 0.4);
}

.rank-3 {
  background: linear-gradient(135deg, #cd7f32, #a0522d);
  box-shadow: 0 2px 8px rgba(160, 82, 45, 0.4);
}

.species-image {
  border-radius: 8px;
  flex-shrink: 0;
}

.species-info {
  flex: 1;
  min-width: 0;
}

.species-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.species-count {
  display: flex;
  align-items: baseline;
  gap: 4px;
  flex-shrink: 0;
}

.count-number {
  font-size: 24px;
  font-weight: 600;
  color: #18a058;
}

.count-unit {
  font-size: 14px;
  color: #666;
}
</style>
