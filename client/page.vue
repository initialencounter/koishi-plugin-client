<template>
  <div v-if="data">{{ data }}</div>
</template>

<script lang="ts" setup>

import { inject, computed, toRaw } from 'vue'
import { store } from '@koishijs/client'

defineProps<{
  data: any
}>()
const current: any = inject('manager.settings.current')

const data = computed(() => {
  if (toRaw(current._value).label !== "client") return
  return toRaw(store.client)
})
</script>