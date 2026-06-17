<script setup lang="ts">
import { computed } from 'vue'
import {
  NCard,
  NSpace,
  NStatistic,
  NEmpty,
  NList,
  NListItem,
} from 'naive-ui'
import {
  FileText as FileTextIcon,
  Feather as BirdIcon,
  Tags as CategoryIcon,
} from '@vicons/tabler'
import { useSightingsStore } from '@/stores/sightings'
import {
  getTotalSightingsCount,
  getTotalBirdsCount,
  getUniqueSpeciesCount,
  getSpeciesStats,
} from '@/utils/sightingStats'

const store = useSightingsStore()

const totalSightings = computed(() => getTotalSightingsCount(store.sightings))
const totalBirds = computed(() => getTotalBirdsCount(store.sightings))
const uniqueSpecies = computed(() => getUniqueSpeciesCount(store.sightings))
const speciesStats = computed(() => getSpeciesStats(store.sightings, store.birds))
</script>

<template>
  <div class="statistics-page">
    <h2 class="page-title">统计概览</h2>

    <NSpace :size="16" class="stats-cards" justify="space-between">
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

    <NCard class="species-section" title="鸟种出现次数">
      <NEmpty
        v-if="speciesStats.length === 0"
        description="暂无统计数据，快去记录你的第一次观鸟吧"
        style="padding: 40px 0"
      />

      <NList v-else bordered>
        <NListItem v-for="item in speciesStats" :key="item.birdId">
          <div class="species-item">
            <span class="species-name">{{ item.name }}</span>
            <span class="species-count">{{ item.sightingCount }} 次</span>
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
  display: flex;
  width: 100%;
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
  justify-content: space-between;
  width: 100%;
}

.species-name {
  font-size: 15px;
  color: #333;
}

.species-count {
  font-size: 15px;
  font-weight: 500;
  color: #18a058;
}
</style>
