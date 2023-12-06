import { Context, Schema } from 'koishi'
import { DataService } from '@koishijs/plugin-console'
import { resolve } from 'path'

export const name = 'client'

declare module '@koishijs/plugin-console' {
  namespace Console {
    interface Services {
      client: Client
    }
  }
  interface Events {
    // 被动模式数据类型约束 Client.Data
    'client/data'(): Client.Data
  }
}
// 主动模式数据类型约束 DataService<Client.Data> 
class Client extends DataService<Client.Data> {
  constructor(ctx: Context, private config: Client.Config) {
    super(ctx, 'client')
    ctx.inject(['console'], (ctx) => {
      ctx.console.addEntry({
        dev: resolve(__dirname, '../client/index.ts'),
        prod: resolve(__dirname, '../dist'),
      })
    })
    if (config.passiveMode) {
      // 与前端进行数据交互的方法：被动模式
      ctx.console.addListener('client/data', () => {
        // 如果处于主动模式则返回
        if (!this.config.passiveMode) {
          return { selfId: this.config.selfId, type: "null" as const, content: "null" }
        }
        return this.getDate()
      })
    }

  }

  // 与前端进行数据交互的方法：主动模式
  async get() {
    // 如果处于被动模式则发送空数据
    if (this.config.passiveMode) {
      return { selfId: this.config.selfId, type: "null" as const, content: "null" }
    }
    return this.getDate()
  }

  getDate() {
    switch (this.config.injectType) {
      case 'button':
        return { selfId: this.config.selfId, type: this.config.injectType, content: this.config.alertText }
      case 'text':
        return { selfId: this.config.selfId, type: this.config.injectType, content: this.config.showText }
      case 'html':
        return { selfId: this.config.selfId, type: this.config.injectType, content: this.config.content }
      case 'iframe':
        return { selfId: this.config.selfId, type: this.config.injectType, content: this.config.showUrl }
      case 'markdown':
        return { selfId: this.config.selfId, type: this.config.injectType, content: this.config.content }
    }
  }
}
namespace Client {
  namespace Data {
    export type DataType = BaseConfig["injectType"]
  }

  export interface Data {
    selfId: Config["selfId"]
    type: Data.DataType
    content: string
  }

  export interface BaseConfig {
    selfId: string
    passiveMode: boolean
    injectType: "button" | "text" | "iframe" | "html" | "markdown" | "null"
  }

  export const BaseConfig: Schema<BaseConfig> = Schema.object({
    selfId: Schema.string().description("插件的唯一 ID 用于区分相同名称的插件，随便填即可").required(true),
    passiveMode: Schema.boolean().default(false).description("被动模式"),
    injectType: Schema.union(["button", "text", "iframe", "html", "markdown", "null"]),
  })


  export interface btConfig {
    injectType: "button"
    alertText: string
  }
  export const btConfig: Schema<btConfig> = Schema.object({
    injectType: Schema.const("button"),
    alertText: Schema.string().default("点击生效了！")
  })

  export interface textConfig {
    injectType: "text"
    showText: string
  }
  export const textConfig: Schema<textConfig> = Schema.object({
    injectType: Schema.const("text"),
    showText: Schema.string().role('textarea', { rows: [2, 4] }).default("注入了文本!")
  })

  export interface htmlConfig {
    injectType: "html"
    content: string
  }
  export const htmlConfig: Schema<htmlConfig> = Schema.object({
    injectType: Schema.const("html"),
    content: Schema.string().role('textarea', { rows: [2, 6] }).default(`<div data-v-3643fc79="" data-v-c7b1cbd5="" class="screen screen-cover">
    <h1 data-v-3643fc79=""><span data-v-3643fc79="" class="koi">Koi</span>shi.js</h1>
    <p data-v-3643fc79="" class="desc">创建跨平台、可扩展、高性能的机器人</p>
    <div data-v-3643fc79="" class="actions">
        <a data-v-3643fc79="" class="action-button primary" href="/zh-CN/manual/starter/">即刻起步</a><a data-v-3643fc79=""
            class="action-button secondary">了解更多</a>
    </div>
    <svg width="100" height="100" data-v-3643fc79="" aria-hidden="true" focusable="false" role="img" viewBox="0 0 320 512">
        <g data-v-3643fc79="">
            <path data-v-3643fc79="" fill="var(--vp-c-brand-alt)"
                d="M160 256.14l-56.51 56.47-96.44-96.15a23.77 23.77.0 01-.18-33.61l.18-.18 22.59-22.51a23.94 23.94.0 0133.85.0z">
            </path>
            <path data-v-3643fc79="" fill="var(--vp-c-brand-darker)"
                d="M313 182.57 290.21 160a23.94 23.94.0 00-33.85.0L103.47 312.61 143 352l.06.06a24 24 0 0033.93-.16L313 216.36l.18-.17a23.78 23.78.0 00-.18-33.62z">
            </path>
        </g>
    </svg>
</div>`)
  })

  export interface iframeConfig {
    injectType: "iframe"
    showUrl: string
  }
  export const iframeConfig: Schema<iframeConfig> = Schema.object({
    injectType: Schema.const("iframe"),
    showUrl: Schema.string().role("link").default("https://www.example.com")
  })

  export interface mdConfig {
    injectType: "markdown"
    content: string
  }
  export const mdConfig: Schema<mdConfig> = Schema.object({
    injectType: Schema.const("markdown"),
    content: Schema.string().role('textarea', { rows: [2, 4] }).default("水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水")
  })

  export type Config = BaseConfig & (btConfig | textConfig | htmlConfig | iframeConfig | mdConfig)
  export const Config: Schema<Config> = Schema.intersect([
    BaseConfig,
    Schema.union([
      btConfig,
      textConfig,
      htmlConfig,
      iframeConfig,
      mdConfig
    ])
  ])
}

export default Client