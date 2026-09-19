# 项目：萨克斯手个人网站 Demo

## 背景
- 这是给一位萨克斯手客户做的个人网站 demo，用于报价前展示效果。
- 参考页面：https://www.pmauriatmusic.com/en/artists/koh-saxman/
  （P. Mauriat 品牌官网的艺人介绍页：简介、使用的乐器型号、演出视频）
- 只参考信息结构和风格，**不要复制 P. Mauriat 的图片、Logo、版面素材**。所有图片用占位图，文案用占位内容，客户素材后续替换。

## 技术选型（已确定）
- 框架：Astro（静态站点生成 SSG）
- 样式：Tailwind CSS
- 内容：Markdown / JSON 放在 `src/content/`，方便后期接 Headless CMS（Decap CMS 或 Sanity）
- 部署：Cloudflare Pages，自定义域名（NS 转到 Cloudflare，根域名 + www 统一跳转）
- 纯静态，无后端；联系表单先用第三方服务（Formspree 或 Cloudflare Pages Functions）占位

## 页面 / 模块
单页长滚动 + 锚点导航即可（demo 阶段）：
1. Hero：大图 + 艺名 + 一句话定位 + 「商演预约」按钮
2. About：个人简介、学历、获奖经历
3. Instruments / Gear：使用的萨克斯型号（卡片展示）
4. Videos：YouTube 嵌入（懒加载，点击后再加载 iframe）
5. Gallery：演出照片网格 + 灯箱
6. Discography：专辑列表
7. Events：演出日程（数据来自 JSON，区分即将到来 / 已结束）
8. Contact：商演/教学预约表单 + 社交媒体链接

## 要求
- 响应式，移动端优先
- 多语言：先做 English + 中文，结构上支持后续加泰语/高棉语（Astro i18n 路由 `/en/`、`/zh/`）
- 风格：深色、偏爵士/舞台感，有质感但不花哨
- 性能：Lighthouse 90+，图片用 Astro Image 优化
- SEO：每页 meta、Open Graph、结构化数据（Person / MusicGroup）

## 交付
- 本地可运行：`npm install && npm run dev`
- 能直接推到 GitHub 并连接 Cloudflare Pages 部署
- README 写清楚如何替换内容（文字、图片、视频、演出日程）
