<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NSpace,
  NButton,
  NIcon,
  NMessageProvider,
  NConfigProvider,
  zhCN,
  dateZhCN,
} from 'naive-ui'
import { Feather as BirdIcon, List as ListIcon, Book as BookIcon, ChartBar as ChartIcon, Settings as SettingsIcon } from '@vicons/tabler'

const router = useRouter()

const currentRoute = computed(() => router.currentRoute.value.name as string)
</script>

<template>
  <NConfigProvider :locale="zhCN" :date-locale="dateZhCN">
    <NMessageProvider>
      <NLayout class="app-layout">
    <NLayoutHeader bordered class="app-header">
      <div class="header-inner">
        <div class="brand" @click="router.push('/sightings')">
          <NIcon :size="28" color="#18a058">
            <BirdIcon />
          </NIcon>
          <span class="brand-title">观鸟目击记录</span>
        </div>
        <NSpace>
          <NButton
            :type="currentRoute === 'sightings' ? 'primary' : 'default'"
            @click="router.push('/sightings')"
          >
            <template #icon>
              <NIcon><ListIcon /></NIcon>
            </template>
            时间线
          </NButton>
          <NButton
            :type="currentRoute === 'guide' ? 'primary' : 'default'"
            @click="router.push('/guide')"
          >
            <template #icon>
              <NIcon><BookIcon /></NIcon>
            </template>
            图鉴
          </NButton>
          <NButton
            :type="currentRoute === 'statistics' ? 'primary' : 'default'"
            @click="router.push('/statistics')"
          >
            <template #icon>
              <NIcon><ChartIcon /></NIcon>
            </template>
            统计
          </NButton>
          <NButton
            :type="currentRoute === 'new' ? 'primary' : 'default'"
            @click="router.push('/new')"
          >
            <template #icon>
              <NIcon><BirdIcon /></NIcon>
            </template>
            新建记录
          </NButton>
          <NButton
            :type="currentRoute === 'settings' ? 'primary' : 'default'"
            @click="router.push('/settings')"
          >
            <template #icon>
              <NIcon><SettingsIcon /></NIcon>
            </template>
            设置
          </NButton>
        </NSpace>
      </div>
    </NLayoutHeader>
    <NLayoutContent class="app-content">
      <router-view />
    </NLayoutContent>
      </NLayout>
    </NMessageProvider>
  </NConfigProvider>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
}

.app-header {
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  background: #fff;
}

.header-inner {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.brand-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.app-content {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}
</style>
