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


class Client extends DataService<string> {
  msg: string
  constructor(ctx: Context, private config: Client.Config) {
    super(ctx, 'client')
    this.msg = "来自后端的消息"
    ctx.using(['console'], (ctx) => {
      ctx.console.addEntry({
        dev: resolve(__dirname, '../client/index.ts'),
        prod: resolve(__dirname, '../dist'),
      })
    })
  }

  async get() {
    if(this.config.client){
      return this.msg
    }
  }
}
namespace Client{
  export interface Config {
    client: boolean
  }

  export const Config: Schema<Config> = Schema.object({
    client: Schema.boolean().default(true).description("是否开启客户端")
  })
}

export default Client