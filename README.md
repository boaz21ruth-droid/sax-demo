# 萨克斯手个人网站 Demo

单页长滚动的艺人网站：Hero、简介、乐器、视频、相册、专辑、演出日程、预约表单。
Astro 静态生成 + Tailwind CSS，English / 中文 / ខ្មែរ（高棉语）三语，部署到 Cloudflare Pages。

> 现在站内的名字（Vann Rivers）、文案、图片、专辑、演出全部是占位内容，
> 图片由 `scripts/make-placeholders.mjs` 程序绘制，没有使用任何第三方素材。

## 本地运行

```bash
npm install
npm run dev        # http://localhost:4321 ，按浏览器语言自动跳到 /en/、/zh/ 或 /km/
npm run build      # 输出到 dist/
npm run preview    # 本地预览构建结果
```

需要 Node 22.12 以上。

## 三个视觉方向（可在页面上切换）

Demo 里同时放了三套方向，给客户挑。页面顶部有一个小的切换条（A / B / C），点一下整站换肤；
选择会记在浏览器里，换语言、刷新都不丢。也可以直接发带参数的链接给客户：

| | 链接 | 气质 | 配色 | 标题字体 |
| --- | --- | --- | --- | --- |
| **A 唱片封套** `cover` | `/km/?theme=cover` | 50–60 年代爵士黑胶封面：双色调照片、超大窄体字压图、不对称色块 | 靛蓝 `#10182B`、钴蓝 `#2F4BA0`、旧纸白 `#E9E2D0`、铜橙 `#E8A33D` | Archivo 最窄字宽 + 最粗 |
| **B 黄铜与丝绒** `brass` | `/km/?theme=brass` | 乐器材质：丝绒黑红底、哑光黄铜、喇叭口雕花细线，居中对称，圆形「贝母按键」控件 | 丝绒黑 `#1A0F12`、酒红 `#4A1524`、象牙 `#EFE6D2`、黄铜 `#B8923A` | Bodoni Moda 斜体（中文宋体，高棉文 Noto Serif Khmer） |
| **C 聚光灯** `spotlight` | `/km/?theme=spotlight` | 演出现场：纯黑舞台、全屏黑白照片，加载时一束钨丝暖光打下来，地面是洋红 / 青色纸的烟雾 | 黑 `#000000`、钨丝琥珀 `#FFB458`、青 `#17595A`、洋红 `#C2356B` | Archivo 最宽字宽 |

三套共用同一份内容、同一套组件和 HTML，区别全部在 `src/styles/themes.css`：

- 组件里只用六个颜色名（ink / ink-deep / cobalt / paper / brass / mist）和两个标题类（`.display` / `.display-sm`），
  每个主题重新定义它们的含义，再各自重排 Hero
- **照片的色调是 CSS 滤镜实时加的**（`src/layouts/Base.astro` 里的 SVG filter：A 蓝 / 橙，B 酒红 / 金，C 黑白 / 洋红），
  所以客户给什么照片都行，彩色、黑白都会被统一成当前主题的调性，不需要预先修图
- 每个主题只有一处主动动效，都在 Hero 加载时：A 封面拼合，B 淡入，C 灯光亮起。系统开了「减少动态效果」时全部关闭
- 字体都是自托管的可变字体，**用到才下载**：A / C 只有 Archivo（约 90 KB）；B 额外下载 Bodoni Moda（约 100 KB）；
  高棉语页面额外下载 Noto Sans Khmer（约 100 KB），B 主题下再加 Noto Serif Khmer（约 85 KB）。中文走系统字体，不下载
- 高棉文上下有叠加符号，行距比其他语言大，规则在 `global.css` / `themes.css` 里带 `:lang(km)` 的几段

### 客户选定之后

改 `src/site.config.ts` 两行：

```ts
theme: 'brass',        // 客户选的那个：'cover' | 'brass' | 'spotlight'
themeSwitcher: false,  // 关掉切换条
```

字体预加载会自动跟着 `theme` 走。想彻底瘦身，可以再删掉 `themes.css` 里另外两个主题的区块、
`Base.astro` 里用不到的 filter 和字体、以及 `ThemeSwitcher.astro`（不删也不影响访客，没用到的字体不会被下载）。

Lighthouse（移动端，本地预览）：A、C 四项 100；B 性能 98；高棉语 + B 在「默认主题仍是 A」时性能 90
（B 的字体没被预加载，LCP 3.4s），把 `theme` 设为 `brass` 后预加载会补上。

## 如何替换内容

所有内容都在 `src/content/` 和 `src/assets/`，改完保存即可，不需要动组件代码。

### 名字、邮箱、社交链接、表单

`src/site.config.ts`：艺名、联系邮箱、社交媒体链接、Telegram / WhatsApp 账号。

预约表单和 Telegram / WhatsApp 按钮的设置见下面的「预约表单」一节。

### 文字（简介、学历、获奖）

`src/content/profile/en.md`、`zh.md`、`km.md`，一种语言一个文件。

- 文件头部（`---` 之间）：一句话定位 `tagline`、常驻地 `basedIn`、SEO 描述 `description`、学历 `education`、获奖 `awards`
- 正文：个人简介，普通 Markdown，第一段会自动放大显示

### 图片

| 位置 | 文件 | 建议尺寸 |
| --- | --- | --- |
| 首屏大图 | `src/assets/photos/hero.jpg` | 竖图，1600×2000 以上，人物偏中上 |
| 简介照片 | `src/assets/photos/about.jpg` | 竖图 4:5 |
| 乐器 | `src/assets/gear/*.jpg` | 任意 |
| 视频封面 | `src/assets/videos/*.jpg` | 16:9 |
| 相册 | `src/assets/gallery/*.jpg` | 横竖都可以，版式会按比例自动排 |
| 专辑封面 | `src/assets/albums/*.jpg` | 正方形（专辑封面保留原色，不加双色调） |
| 分享预览图 | `public/og.jpg` | 1200×630 |

直接用同名文件覆盖最省事。放原图就行，构建时 Astro 会自动压缩、转 WebP、生成多种尺寸。
文件名不同的话，到对应的 JSON / Markdown 里改一下路径。

### 乐器

`src/content/gear/` 里一支乐器一个 JSON。`order` 决定顺序，排第一的会显示成大卡片。
增加乐器就复制一个文件。

### 视频

`src/content/data/videos.json`。`youtubeId` 是 YouTube 链接里 `v=` 后面那一串。
页面顺序就是文件里的顺序，第一个是大图。`poster` 可以删掉，删掉后自动用 YouTube 的缩略图。

视频是点击后才加载的（用的是 youtube-nocookie 域名），不影响首屏速度。
**现在三个视频的 ID 都是占位用的公开示例视频，交付前要换成客户的。**

### 相册

`src/content/data/gallery.json`，顺序即页面顺序。`alt` 是给搜索引擎和读屏软件的照片描述，每种语言都要写。

### 专辑

`src/content/data/albums.json`，按年份自动倒序。`link` 可选，填了才显示「试听」。

### 演出日程

`src/content/data/events.json`：

```json
{
  "id": "2026-10-03-riverfront",
  "date": "2026-10-03",
  "time": "20:30",
  "title": { "en": "Vann Rivers Quartet", "zh": "Vann Rivers 四重奏", "km": "ក្រុមបួននាក់ Vann Rivers" },
  "venue": "Riverfront Jazz Club",
  "city": { "en": "Phnom Penh", "zh": "金边", "km": "ភ្នំពេញ" },
  "entry": "tickets",
  "link": "https://example.com/tickets"
}
```

- `id` 每条不能重复；`date` 必须是 `YYYY-MM-DD`；`time`、`link` 可选
- `entry`：`tickets`（配合 `link` 显示购票按钮）、`free`（免费入场）、`private`（私人活动）
- 「即将到来 / 已结束」按日期自动划分，不用手动移动。构建时分一次，
  访客打开页面时浏览器会再核对一次，所以就算很久没重新部署，过期的演出也会自动归到「已结束」

### 界面文字（导航、按钮、表单标签）

`src/i18n/ui.ts`。

## 语言

现有高棉语（`/km/`，默认）、English（`/en/`）、中文（`/zh/`）。

> 高棉语文案（界面文字 + 占位内容）是机器翻译水平的初稿，**上线前请客户本人或母语者通读校对一遍**，
> 重点看音乐术语（សាក់សូហ្វូន、អាល់តូ、តេន័រ、មាត់ផ្លុំ、អណ្តាត 等）是否符合当地乐手的习惯叫法。
> 界面文字在 `src/i18n/ui.ts` 的 `km` 段，内容在各文件的 `"km"` 字段和 `profile/km.md`。

### 再加一种语言

以泰语为例：

1. `astro.config.mjs`：`i18n.locales` 加 `'th'`，sitemap 的 `locales` 加 `th: 'th'`
2. `src/i18n/ui.ts`：`locales` 加 `'th'`，补 `localeNames` / `htmlLang` / `ogLocale`，复制一份 `en` 的文案翻译成 `th`
3. 新建 `src/content/profile/th.md`
4. 各 JSON 里的 `{ "en": …, "zh": …, "km": … }` 加上 `"th"`。没加的字段会自动显示英文，可以慢慢补
5. 泰文需要在 `src/styles/global.css` 的 `--font-sans` 里补字体（如 `'Noto Sans Thai'`），做法参考 `Base.astro` 里高棉语字体的按语言加载

路由 `/th/`、语言切换、hreflang、sitemap 都会自动生成。

## 预约表单

网站是纯静态的，没有自己的后端。唯一需要服务端的是「把预约表单发到邮箱」，由一个
Cloudflare Pages Function 完成：`functions/api/booking.ts`，和网站同仓库、同一次部署，不用另外运维。

流程：表单 POST 到 `/api/booking` → 函数校验字段、拦截机器人 → 通过 [Resend](https://resend.com) 发邮件到艺人邮箱，
邮件的「回复」地址就是填表人的邮箱，直接回信即可。

### 上线设置

1. 注册 Resend（免费额度每月 3000 封），在 Domains 里验证客户的域名（按提示到 Cloudflare DNS 加几条记录），建一个 API Key
2. Cloudflare Pages 项目 → Settings → Variables and Secrets，添加：

   | 名称 | 类型 | 值 |
   | --- | --- | --- |
   | `RESEND_API_KEY` | Secret | Resend 的 API Key |
   | `BOOKING_TO` | 文本 | 收预约的邮箱 |
   | `BOOKING_FROM` | 文本 | 发件人，必须是已验证域名下的地址，如 `Website <website@artist.com>` |

3. 重新部署一次让变量生效

没配置这三个变量时，函数返回 503，页面提示「发送失败，请直接发邮件到 …」，不会丢数据也不会报错白屏。

### 防垃圾

- 蜜罐字段（隐藏的 `website` 输入框，机器人会填，真人看不到）和字段长度 / 格式校验，默认开启
- 可选 Cloudflare Turnstile 人机验证：在 Cloudflare 建一个 Turnstile widget，把 site key 填到
  `src/site.config.ts` 的 `turnstileSiteKey`，secret 加到 Pages 变量 `TURNSTILE_SECRET`。
  验证脚本只在访客点进表单时才加载，不影响首屏速度。先不开也行，垃圾邮件多了再开

### 本地测试

`npm run dev` 不会运行 Pages Function（提交会显示「发送失败」，属正常）。要连函数一起测：

```bash
cp .dev.vars.example .dev.vars   # 填入真实的 Resend key 和邮箱；该文件已在 .gitignore 里
npm run build
npx wrangler pages dev dist      # http://localhost:8788
```

### Telegram / WhatsApp 按钮

`src/site.config.ts` 的 `chat`：`telegram` 填用户名（不带 @），`whatsapp` 填带国家区号的纯数字号码（柬埔寨是 855 开头）。
删掉某一行，对应按钮就不显示。WhatsApp 会带上一句预填的问候语（`src/i18n/ui.ts` 的 `contact.chatMessage`）。
手机上这两个按钮排在表单前面。

## 部署到 Cloudflare Pages

1. 推到 GitHub：

   ```bash
   git init && git add -A && git commit -m "Initial demo"
   git remote add origin git@github.com:<user>/<repo>.git
   git push -u origin main
   ```

2. Cloudflare Dashboard → Workers & Pages → Create → Pages → 连接这个仓库
   - Framework preset：Astro
   - Build command：`npm run build`
   - Output directory：`dist`
   - 环境变量：`NODE_VERSION` = `22`，以及「预约表单」一节里的三个邮件变量
   - `functions/` 目录会被 Pages 自动识别并部署，不需要额外配置
3. 域名：把域名的 NS 转到 Cloudflare，然后在 Pages 项目的 Custom domains 里加根域名和 `www`。
   再到 Rules → Redirect Rules 建一条，把 `www` 301 到根域名（或者反过来，统一一个就行）。
4. 上线前把 `astro.config.mjs` 里的 `site` 和 `public/robots.txt` 里的域名换成正式域名，
   canonical、Open Graph、hreflang、sitemap 都依赖它。

根路径 `/` 由 `src/pages/index.astro` 处理：按访客浏览器语言跳到 `/km/`、`/en/` 或 `/zh/`，都不匹配时去默认语言 `/km/`。
默认语言在 `src/i18n/ui.ts` 的 `defaultLocale` 和 `astro.config.mjs` 的两处 `defaultLocale`，三处要一致。
`fallbackLocale`（现在是英文）是另一回事：某个字段还没翻译时，用哪种语言顶上。

## SEO

每个语言页都有独立的 title / description、canonical、hreflang、Open Graph、Twitter Card，
以及 JSON-LD 结构化数据（`Person` + `MusicGroup`、专辑 `MusicAlbum`、公开演出 `MusicEvent`）。
构建时自动生成 `sitemap-index.xml`。

## 后续接 CMS

内容已经是 Markdown / JSON 文件，和 Decap CMS 的 Git 工作流直接兼容：
加一个 `public/admin/`，在 `config.yml` 里把 collections 指到 `src/content/` 下这几个文件即可。
换 Sanity 的话，只需要改 `src/content.config.ts` 里的 loader，组件不用动。

## 目录

```
functions/api/booking.ts   预约表单的服务端函数（Cloudflare Pages Function）
src/
  site.config.ts        艺名、邮箱、社交链接、聊天账号、Turnstile、默认主题和切换条开关
  content.config.ts     内容字段定义（写错字段构建时会报错并指出位置）
  content/              文字内容（Markdown / JSON）
  assets/               图片原图
  i18n/ui.ts            界面文字
  components/           每个模块一个组件；ThemeSwitcher 是演示用的方向切换条
  layouts/Base.astro    <head>、SEO、双色调滤镜
  pages/[lang]/         /en/、/zh/、/km/
  styles/global.css     颜色、字体、排版（也是 A 方向的基础样式）
  styles/themes.css     三个视觉方向的差异：配色、标题字体、Hero 布局、动效
scripts/make-placeholders.mjs   重新生成占位图：npm run placeholders
```
