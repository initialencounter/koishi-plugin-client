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
}


class Client extends DataService<Client.Data> {
  payload: Client.Data = Object.create(null)
  constructor(ctx: Context, private config: Client.Config) {
    super(ctx, 'client')
    this.payload = { type: "md" as const, content: `
# 这个一个标题
## 这也是一个标题
    ` }
    ctx.using(['console'], (ctx) => {
      ctx.console.addEntry({
        dev: resolve(__dirname, '../client/index.ts'),
        prod: resolve(__dirname, '../dist'),
      })
    })
  }

  // 与前端进行数据交互的方法
  async get() {
    if (this.config.client) {
      return this.payload
    }
  }
}
namespace Client {
  namespace Data {
    export type DataType = 'str' | 'bool' | 'md'
  }
  
  export interface Data {
    type: Data.DataType
    content: string
  }

  export interface Config {
    client: boolean
  }

  export const Config: Schema<Config> = Schema.object({
    client: Schema.boolean().default(true).description("是否注入 usage")
  })
}

export default Client