/**
 * 用户端请求的 API 根地址。
 *
 * 解析顺序：
 * 1. 环境变量 VITE_API_BASE_URL（把 .env.example 复制为 .env 后修改）
 * 2. 下面的 FALLBACK_API_BASE_URL
 *
 * 接口和数据库部署在远程 Linux，用 Docker 运行，不在 Windows 开发机上。
 * HBuilder X 和命令行 H5 都应把根地址指到那台服务器。
 * HBuilder X 若没有注入 Vite 环境变量，直接改 FALLBACK_API_BASE_URL。
 */
export const FALLBACK_API_BASE_URL = 'http://localhost:3000/api/v1'

export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL
  const picked = typeof raw === 'string' && raw.trim() ? raw.trim() : FALLBACK_API_BASE_URL
  return picked.replace(/\/+$/, '')
}
