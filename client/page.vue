<template>
  <template v-if="data.type === 'button'">
    <k-button type="primary" @click="alert()">点我</k-button>
  </template>
  <template v-if="data.type === 'text'">
    <p>{{ data.content }}</p>
  </template>
  <template v-if="data.type === 'html'">
    <div v-html="data.content"></div>
  </template>
  <template v-if="data.type === 'iframe'">
    <iframe :src="data.content" height="258" width="700"></iframe>
  </template>
  <template v-if="data.type === 'markdown'">
    <Markdown :source="data.content" class="markdown-inject"></Markdown>
  </template>
  <template v-else>
    <p></p>
    <p>注入了文本!</p>
    <p></p>
  </template>
</template>

<script lang="ts" setup>


import Markdown from 'marked-vue'
import { store, message, send } from '@koishijs/client'
import { inject, toRaw, ref } from 'vue'


namespace Data {
  export type DataType = "button" | "text" | "iframe" | "html" | "markdown" | "null"

}

export interface Data {
  type: Data.DataType
  content: string
}

defineProps<{
  data: any
}>()

const local: any = inject('manager.settings.local')
const config: any = inject('manager.settings.config')
const data = ref<Data>()
data.value = (() => {
  // 判断插件配置页面的逻辑
  // 将 koishi-plugin-client 改为你想要显示的插件的包名
  if (local.value.name !== 'koishi-plugin-console-inject') return
  const _data = toRaw(store.client)
  // 根据 selfId 区分相同名字的插件
  if (config.value?.selfId !== _data.selfId) return
  return _data
})()

// 小弹窗的方法
const alert = () => {
  message.success(data.value.content)
}

// 被动模式的按钮绑定的方法
const refresh = () => {
  send('client/data').then((res) => {
    if (local.value.name !== 'koishi-plugin-console-inject') return
    if (config.value?.selfId !== res.selfId) return
    data.value = res
  })
}
refresh()
</script>

<style>
.markdown-inject {
  background-color: rgb(51, 124, 50);
  border-radius: 0.5rem 0.5rem 0.5rem 0.5rem;
}
</style>