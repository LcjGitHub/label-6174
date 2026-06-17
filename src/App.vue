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
        <NSpace wrap :size="8">
          <NButton
            :type="currentRoute === 'sightings' ? 'primary' : 'default'"
            class="nav-btn"
            @click="router.push('/sightings')"
          >
            <template #icon>
              <NIcon><ListIcon /></NIcon>
            </template>
            <span class="nav-btn-text">时间线</span>
          </NButton>
          <NButton
            :type="currentRoute === 'guide' ? 'primary' : 'default'"
            class="nav-btn"
            @click="router.push('/guide')"
          >
            <template #icon>
              <NIcon><BookIcon /></NIcon>
            </template>
            <span class="nav-btn-text">图鉴</span>
          </NButton>
          <NButton
            :type="currentRoute === 'statistics' ? 'primary' : 'default'"
            class="nav-btn"
            @click="router.push('/statistics')"
          >
            <template #icon>
              <NIcon><ChartIcon /></NIcon>
            </template>
            <span class="nav-btn-text">统计</span>
          </NButton>
          <NButton
            :type="currentRoute === 'new' ? 'primary' : 'default'"
            class="nav-btn"
            @click="router.push('/new')"
          >
            <template #icon>
              <NIcon><BirdIcon /></NIcon>
            </template>
            <span class="nav-btn-text">新建记录</span>
          </NButton>
          <NButton
            :type="currentRoute === 'settings' ? 'primary' : 'default'"
            class="nav-btn"
            @click="router.push('/settings')"
          >
            <template #icon>
              <NIcon><SettingsIcon /></NIcon>
            </template>
            <span class="nav-btn-text">设置</span>
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
  padding: 12px 24px;
  min-height: 64px;
  height: auto;
  display: flex;
  align-items: center;
  background: #fff;
}

.header-inner {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  row-gap: 12px;
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
  white-space: nowrap;
}

.nav-btn {
  flex-shrink: 0;
}

.app-content {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 640px) {
  .app-header {
    padding: 12px 16px;
  }

  .header-inner {
    justify-content: center;
  }

  .brand {
    width: 100%;
    justify-content: center;
  }

  .nav-btn-text {
    display: none;
  }

  .nav-btn {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  .app-header {
    padding: 12px 20px;
  }

  .header-inner {
    justify-content: center;
  }

  .brand {
    width: 100%;
    justify-content: center;
  }
}
</style>
