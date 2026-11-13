# 奥瑞尔经销商城用户端

uni-app（Vue 3 + TypeScript）用户端。正式交付是微信小程序。H5 只作为开发预览：保留预览口令闸和宽屏手机框，不提供微信网页授权，也不发公众号模板消息。

对接 `aurel-mall-api` 的 `/api/v1`。成功响应是 `{ code: 0, message, data }`，失败时 HTTP 状态与 `code` 相同。

- 小程序登录：`wx.login` 后 `POST /api/v1/auth/mini/login`，body `{ "code": "<wx.login 的 code>" }`。之后的用户接口带 `Authorization: Bearer`。已有会话时，手机号按钮调用 `POST /api/v1/auth/mini/phone`，body `{ "code": "<手机号快速验证的 code>" }`。手机号不是登录键。停用账号返回 401「账号已停用」，不保存令牌。
- H5 预览：口令闸通过后 `POST /api/v1/auth/preview/login`，body `{ "subject": "preview-member" }` 或 `{ "subject": "preview-nonmember" }`。`subject` 只含字母、数字、点、下划线和中划线。会员标识用返回的 `user.member`，不按 subject 名称推断。`ALLOW_PREVIEW_AUTH` 关闭时返回 403，文案含「已忽略」，页面展示该原因并保持未登录。这不是微信网页授权。
- 实名：`GET` / `POST /api/v1/me/kyc`。提交 `{ "realName", "idNumber", "mobile" }`，读取 `realName`、`idNumber`、`mobile`、`verified`。
- 地址：`GET` / `POST /api/v1/me/addresses`，`PUT` / `DELETE /api/v1/me/addresses/:id`。写入 `contactName`、`contactPhone`、`province`、`city`、`district`、`detail`、`isDefault`。设为默认是 `POST /api/v1/me/addresses/:id/default`。
- 商品：登录后 `GET /api/v1/catalog/products?zone=startup|mall` 和 `GET /api/v1/catalog/products/:id`。使用 `priceFen`、`pvFen`、`freightFen`、`stockQuantity`、`subtitle`、`coverUrl`、`category`。金额是分，商城 `pvFen` 的 100 等于 1 PV，不是售价。非会员看会员商城得到 403「非会员不能浏览会员商城」；创业专区仍可浏览。未上架或不存在是 404。
- 邀请码：登录不传 `inviteCode`。登录后单独 `POST /api/v1/me/inviter`，body `{ "inviteCode": "000000" }`。成功 `data` 为 `{ inviteCode, inviterId }`。不会自动绑定根账户。没有邀请关系时，创业专区下单返回 400「缺少邀请关系」。会员的邀请二维码只编码本人的 6 位邀请码；非会员没有可分享的邀请码。H5 扫码地址带 `?inviteCode=`，小程序读页面查询或 `scene`。注册必须等这次绑定成功才算完成。
- 钱包：`GET /api/v1/me/wallets`。`points`、`withdrawable`、`consumption` 各自有 `balanceFen`、`frozenFen`、`availableFen`，都是十进制字符串。
- 订单：`POST /api/v1/orders`，body `{ zone, addressId, items: [{ productId, quantity }] }`。列表 `GET /api/v1/orders?page=&pageSize=`，详情 `GET /api/v1/orders/:id`。金额字段是 JSON 数字，单位是分。状态是 `pending_payment`、`paid`、`shipped`、`closed`。
- 支付：`POST /api/v1/orders/:id/pay`。来源顺序由服务端固定。账户够付时 `wechat` 为 `null` 且订单为 `paid`；否则 `wechat.amountFen` 是微信部分。H5 预览在商户证书未配置时用 `POST /api/v1/payments/wechat/sandbox/succeed|fail`，body `{ payNo }`。不实现微信网页授权。`POST /api/v1/orders/:id/cancel` 与 `POST /api/v1/orders/:id/timeout` 只用于仍待支付的订单，本阶段不自动关单。

不做商城退款、提现、转账、报单或奖励结算。当前用户自己的邀请码只读登录响应里的 `user.inviteCode`。

## 技术栈

- uni-app Vue 3 + TypeScript，官方 Vite CLI 工程（`@dcloudio/vite-plugin-uni`）
- Pinia
- 可用 HBuilder X 直接打开，也可以用命令行跑 H5

源码在 `src/`。请打开**仓库根目录**（能看到 `package.json` 和 `index.html` 的那一层），不要只打开 `src`。HBuilder X 3.6.7 及以上支持这种 CLI 工程。

## 用 HBuilder X 打开（Windows）

1. 安装 [HBuilder X](https://www.dcloud.io/hbuilderx.html) 正式版（建议 4.x，不要低于 3.6.7）和 Node.js 22。
2. 用仓库自带的依赖，不要让 HBuilder X 再套一层旧编译器。菜单 **工具 → 设置 → 运行配置**，把 **node 路径** 指到 Node 22，然后完全退出并重启 HBuilder X。
3. **文件 → 导入 → 从本地目录导入**，选择本仓库根目录。
4. 在项目根目录执行一次 `npm install`（HBuilder X 内置终端或系统终端都可以）。CLI 工程的编译器在 `node_modules` 里，不安装无法运行。
5. 按下一节把 API 根地址改成远程 Linux 主机，再点 **运行 → 运行到浏览器 → Chrome**。

H5 开发服务端口是 `5173`（`src/manifest.json` 的 `h5.devServer.port` 与 `vite.config.ts` 一致）。

## 命令行跑 H5

```bash
nvm use
npm install
cp .env.example .env
npm run dev:h5
```

Windows 命令提示符复制环境文件：

```bat
copy .env.example .env
```

浏览器打开 <http://localhost:5173>。宽屏会把页面收进居中的手机框里；窄屏铺满，不再套外框。路由仍是 hash。

其他脚本：

| 命令                      | 作用                                          |
| ------------------------- | --------------------------------------------- |
| `npm run dev:h5`          | H5 开发                                       |
| `npm run build:h5`        | H5 生产构建，输出 `dist/build/h5`             |
| `npm run dev:mp-weixin`   | 微信小程序开发编译，输出 `dist/dev/mp-weixin` |
| `npm run build:mp-weixin` | 微信小程序生产构建                            |
| `npm run type-check`      | `vue-tsc`                                     |
| `npm run lint`            | ESLint                                        |

Node 版本见 `.nvmrc`（22）。`package.json` 的 `engines` 要求 Node 20 及以上，是为了给 HBuilder X 自带的较新 Node 留余地；本机开发请用 22。

## 稍后用微信开发者工具

1. 安装微信开发者工具，并在 HBuilder X **工具 → 设置 → 运行配置** 里填好安装路径。
2. 在 `src/manifest.json` 的 `mp-weixin.appid` 填入小程序 AppID。
3. HBuilder X：**运行 → 运行到小程序模拟器 → 微信开发者工具**。  
   或命令行 `npm run dev:mp-weixin`，再用微信开发者工具导入 `dist/dev/mp-weixin`。
4. 开发阶段 `mp-weixin.setting.urlCheck` 已设为 `false`。工具里也可以勾选「不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书」。
5. 上线前把远程 API 的 **HTTPS 域名** 配进小程序后台的 request 合法域名。

## API 根地址（远程 Linux）

接口和数据库部署在**远程 Linux 主机的 Docker** 里，不在你的 Windows 电脑上启动。用户端只配置「请求打到哪台机器」，不要在本机起数据库。

默认示例是 `http://localhost:3000/api/v1`，只表示路径形状（`/api/v1`）。开发时请改成那台服务器实际公布的地址，例如：

```text
http://10.0.0.8:3000/api/v1
https://api.example.com/api/v1
```

两种改法，任选其一，改完后停掉再重新运行：

1. **环境变量（命令行，以及会读取 Vite env 的 HBuilder X 运行）**  
   复制 `.env.example` 为项目根目录的 `.env`，修改 `VITE_API_BASE_URL`。`.env` 已在 `.gitignore` 中，不要提交。  
   若配置了 `VITE_DEMO_LOGIN_PASSWORD_SHA256`（密码的 SHA-256 小写十六进制），H5 会先要求用户名 `root` 通过预览闸。不配置则不拦截，源码里也不写明文密码。通过闸门之后才会申请预览测试会话。
2. **小配置文件（HBuilder X 没注入环境变量时用这个）**  
   直接改 `src/config/api.ts` 里的 `FALLBACK_API_BASE_URL`。解析顺序是：环境变量有值就用环境变量，否则用这个常量。

请求封装在 `src/api/http.ts`，各业务模块只写自己的路径，页面里不要直接调用 `uni.request`。

浏览器里跑 H5 时，页面源（如 `http://localhost:5173`）和远程 API 不同源，需要 API 允许该来源跨域。微信小程序不走浏览器 CORS，走上面的合法域名。

## 目录约定

```text
src/pages/        页面，按功能分目录，路由只登记在 src/pages.json
src/components/   组件，按功能分目录
src/api/          接口模块。新增接口放这里，不要写进页面
src/stores/       Pinia
src/config/       API 根地址
src/platform/     仅微信小程序可用的能力占位
src/navigation/   路由表。底部四个 Tab 用 reLaunch，其余页面用 navigateTo
src/types/        按功能分的类型
src/static/       静态资源（含 Tab 图标）
```

页面保持薄。单个源文件尽量不要堆成大文件。不要加一个什么都往里放的 `utils`。

H5 资讯详情对应常见的 `#/article/:id`，在 uni-app 里是：

```text
/#/pages/article/detail?id=文章ID
```

商品、订单详情同样用 `?id=`。

## 页面骨架

底部 Tab：首页、商城、钱包、我的。创业专区从首页进入，不占 Tab。购物车从商城导航进入。

首页有轮播图、滚动字幕、资讯知识，以及创业专区、福利专场、联合创始人入口。问候语不展示职位。

「我的」里有订单状态、会员码、邀请好友海报和创业团队。设置是头像旁的齿轮。收款账户、收货地址、用户协议、隐私政策、支付密码都在设置下面。

创业团队页展示「我的市场」（单位是「个」）、「总业绩」（只表示本月合计）和「市场情况」（最多 3 个市场，每项含本月 / 最近7天 / 当日）。没有数据时显示「暂无市场」。

用户能看见的文案不要出现「市场树」「节点」，也不要出现「本月职位」「我的职位」「幸运返还」「奖励明细」。

## 配套仓库

本仓库只做用户端。另外两个仓库：

- `aurel-mall-api`：后端 API，部署在远程 Linux，使用 Docker
- `aurel-mall-admin`：管理端

三者分开维护，不要把管理端或数据库脚本放进这个仓库。
