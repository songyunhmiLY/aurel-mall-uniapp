/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  /** 演示站点闸密码的 SHA-256 十六进制，用户名为 root。不要写入明文密码。 */
  readonly VITE_DEMO_LOGIN_PASSWORD_SHA256?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}
