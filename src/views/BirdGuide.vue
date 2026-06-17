<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  NInput,
  NGrid,
  NGi,
  NCard,
  NImage,
  NText,
  NEmpty,
  NModal,
  NButton,
  NIcon,
  NSpace,
} from 'naive-ui'
import { Search } from '@vicons/tabler'
import { useSightingsStore } from '@/stores/sightings'
import type { Bird } from '@/types'

const store = useSightingsStore()
const searchKeyword = ref('')
const selectedBird = ref<Bird | null>(null)
const showModal = ref(false)

const filteredBirds = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) return store.birds
  return store.birds.filter(
    (bird) => bird.name.toLowerCase().includes(keyword)
  )
})

watch(filteredBirds, (birds) => {
  if (selectedBird.value && !birds.some((b) => b.id === selectedBird.value!.id)) {
    showModal.value = false
    selectedBird.value = null
  }
})

function handleCardClick(bird: Bird): void {
  selectedBird.value = bird
  showModal.value = true
}

function handleCloseModal(): void {
  showModal.value = false
  selectedBird.value = null
}
</script>

<template>
  <div class="guide-page">
    <h2 class="page-title">鸟种图鉴</h2>

    <NInput
      v-model:value="searchKeyword"
      placeholder="按名称搜索鸟种…"
      clearable
      class="search-input"
    >
      <template #prefix>
        <NIcon :component="Search" />
      </template>
    </NInput>

    <NEmpty
      v-if="filteredBirds.length === 0"
      description="未找到匹配的鸟种"
      style="margin-top: 60px"
    />

    <NGrid v-else :x-gap="16" :y-gap="16" :cols="3" responsive="screen" item-responsive>
      <NGi v-for="bird in filteredBirds" :key="bird.id" span="3 m:1">
        <NCard
          hoverable
          class="bird-card"
          tabindex="0"
          role="button"
          :aria-label="`查看${bird.name}详情`"
          @click="handleCardClick(bird)"
          @keydown.enter="handleCardClick(bird)"
        >
          <div class="card-content">
            <NImage
              :src="bird.imageUrl"
              width="100"
              height="100"
              object-fit="cover"
              class="card-image"
              fallback-src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silhouette%20of%20a%20small%20bird%2C%20minimalist%20icon&image_size=square"
              preview-disabled
            />
            <div class="card-text">
              <div class="bird-name">{{ bird.name }}</div>
              <NText depth="3" class="bird-scientific">{{ bird.scientificName }}</NText>
            </div>
          </div>
        </NCard>
      </NGi>
    </NGrid>

    <NModal
      v-model:show="showModal"
      preset="card"
      :title="selectedBird?.name ?? ''"
      class="detail-modal"
      :bordered="true"
      :mask-closable="true"
      style="max-width: 480px"
    >
      <template v-if="selectedBird">
        <div class="modal-body">
          <NImage
            :src="selectedBird.imageUrl"
            width="140"
            height="140"
            object-fit="cover"
            class="modal-image"
            fallback-src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silhouette%20of%20a%20small%20bird%2C%20minimalist%20icon&image_size=square"
            preview-disabled
          />
          <div class="modal-info">
            <div class="modal-scientific">
              <NText depth="3" style="font-style: italic">{{ selectedBird.scientificName }}</NText>
            </div>
            <p class="modal-desc">{{ selectedBird.description }}</p>
          </div>
        </div>
      </template>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="handleCloseModal">关闭</NButton>
        </NSpace>
      </template>
    </NModal>
  </div>
</template>

<style scoped>
.guide-page {
  padding-bottom: 40px;
}

.page-title {
  margin: 0 0 24px;
  font-size: 22px;
  font-weight: 600;
  color: #333;
}

.search-input {
  margin-bottom: 20px;
}

.bird-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.bird-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.bird-card:focus-visible {
  outline: 2px solid #18a058;
  outline-offset: 2px;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.card-image {
  border-radius: 8px;
  flex-shrink: 0;
}

.card-text {
  text-align: center;
}

.bird-name {
  font-size: 16px;
  font-weight: 500;
}

.bird-scientific {
  font-size: 13px;
  font-style: italic;
  margin-top: 4px;
  display: block;
}

.modal-body {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.modal-image {
  border-radius: 8px;
  flex-shrink: 0;
}

.modal-info {
  flex: 1;
  min-width: 0;
}

.modal-scientific {
  margin-bottom: 12px;
}

.modal-desc {
  margin: 0;
  font-size: 14px;
  line-height: 1.8;
  color: #555;
}
</style>
