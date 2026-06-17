<script setup lang="ts">
import { ref } from 'vue'
import {
  NCard,
  NSpace,
  NButton,
  NIcon,
  NUpload,
  useMessage,
  type UploadCustomRequestOptions,
} from 'naive-ui'
import {
  Download as DownloadIcon,
  Upload as UploadIcon,
  Settings as SettingsIcon,
} from '@vicons/tabler'
import { useSightingsStore } from '@/stores/sightings'
import { exportSightingsToFile, parseSightingsFromFile } from '@/utils/backup'
import { getSortedSightings } from '@/utils/sightingStats'

const store = useSightingsStore()
const message = useMessage()
const importing = ref(false)

function handleExport() {
  if (store.sightings.length === 0) {
    message.warning('暂无目击记录可导出')
    return
  }
  exportSightingsToFile(getSortedSightings(store.sightings))
  message.success(`已导出 ${store.sightings.length} 条目击记录`)
}

async function handleImport(options: UploadCustomRequestOptions) {
  const rawFile = options.file.file
  if (!rawFile) {
    message.error('无法读取文件')
    return
  }
  importing.value = true
  try {
    const records = await parseSightingsFromFile(rawFile)
    const count = store.mergeSightings(records)
    if (count === 0) {
      message.info('导入完成，所有记录均已存在，无新增')
    } else {
      message.success(`导入成功，新增 ${count} 条目击记录`)
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : '导入失败'
    message.error(msg)
  } finally {
    importing.value = false
  }
}
</script>

<template>
  <div class="settings-page">
    <h2 class="page-title">
      <NIcon :size="26" style="vertical-align: text-bottom; margin-right: 6px">
        <SettingsIcon />
      </NIcon>
      数据备份与恢复
    </h2>

    <NSpace :size="16" vertical>
      <NCard title="导出记录" hoverable>
        <p class="card-desc">将当前全部目击记录导出为文本文件，保存至本地用于备份。</p>
        <NButton type="primary" @click="handleExport">
          <template #icon>
            <NIcon><DownloadIcon /></NIcon>
          </template>
          导出全部记录
        </NButton>
      </NCard>

      <NCard title="导入记录" hoverable>
        <p class="card-desc">选择之前导出的备份文件，导入记录将与现有数据合并，自动跳过重复编号的记录。</p>
        <NUpload
          :max="1"
          accept=".txt,.json"
          :show-file-list="false"
          :custom-request="handleImport"
          :disabled="importing"
        >
          <NButton type="primary" :loading="importing">
            <template #icon>
              <NIcon><UploadIcon /></NIcon>
            </template>
            选择文件并导入
          </NButton>
        </NUpload>
      </NCard>
    </NSpace>
  </div>
</template>

<style scoped>
.settings-page {
  padding-bottom: 40px;
}

.page-title {
  margin: 0 0 24px;
  font-size: 22px;
  font-weight: 600;
  color: #333;
}

.card-desc {
  margin: 0 0 16px;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}
</style>
