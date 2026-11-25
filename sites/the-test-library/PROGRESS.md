# The Test Library · 建站进度

> 创建时间：2026-11-24 17:23
> 最近更新：2026-11-25 12:26
> 总体进度：9/14 步已完成（64%）
> 当前步骤：第 12 步「变现申请与收款配置」· 未开始

## 基本信息

| 项目 | 内容 |
| --- | --- |
| 站点名称 | The Test Library |
| 站点标识 | the-test-library |
| 项目路径 | C:/Users/li/WorkBuddy/2026-11-24-15-18-06 |
| 站点链接 | https://thetestlibrary.app |
| 负责人 | lzb821-dev |
| 站点目标 | 欧美社交平台病毒式关系实测脚本库，承接 TikTok 热点词吃 SEO，靠 AdSense/流量变现 |

## 步骤跟踪

| # | 步骤 | 状态 | 完成日期 | 关键产出 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 1 | 选题与关键词验证 | 已完成 | 2026-11-24 | 完成两轮社交平台研究：中文平台四条主线 + 欧美实测型测试（Bird Theory 5600万播放、Aura 1.07亿帖、#personalitytest 19亿观看） | 定案 A 方向 The Test Library，用现成热点词吃 SEO |
| 2 | 变现目标测算 | 已跳过 |  |  | 用户决定跳过量化测算，看实际流量再判断；docs/变现目标测算.md 保留作参考 |
| 3 | 原型与页面结构 | 已完成 | 2026-11-24 | 题库从 3 扩到 8 个测试（新增 Green Line Theory / Tell Me Without Telling Me / Don't Laugh / Couple Telepathy / Put a Finger Down）；43 张 OG 图 + 40 个分享页 + 54 条 sitemap；全 46 页注入 WebSite/ItemList + WebPage/BreadcrumbList JSON-LD | 新增词来自欧美社媒热门研究，Green Line Theory 为 2026-11 刚 viral 且被专家 debunk 的词；scripts/README.md 记录生成顺序（生成类在前、注入类在后） |
| 4 | 域名与 DNS 接入 | 已完成 | 2026-11-24 | thetestlibrary.app 已在 Porkbun 注册并接入 Cloudflare | nslookup 验证 NS=liv.ns/aarav.ns.cloudflare.com |
| 5 | 部署配置四件套 | 已跳过 |  |  | 本项目用 Cloudflare Pages 连接 GitHub 自动部署（Framework=None、Build command 留空、output=/），不需要 wrangler.jsonc/worker.js/.assetsignore 四件套 |
| 6 | 代码仓库与部署密钥 | 已完成 | 2026-11-24 | https://github.com/lzb821-dev/thetestlibrary （PUBLIC）最新提交 ad1a428 | gh CLI 登录 lzb821-dev；SSH key 无权限、HTTPS 凭据弹窗被禁，用 gh auth token 临时嵌入 URL 推送后还原 |
| 7 | 部署上线与域名绑定 | 已完成 | 2026-11-24 | https://thetestlibrary.app 上线；单人/双人/Aura 全部页面、23 OG 图、20 分享页均 200 | Cloudflare 自动部署；4 种爬虫 UA 抓双人分享页均读到完整 OG 标签 |
| 8 | 内容、解释与合规页 | 已完成 | 2026-11-25 | about.html + privacy.html 上线；6 主页面与 20 分享页页脚全部接入 About/Privacy 导航 | 隐私页覆盖 localStorage、Cookie、AdSense、GDPR/CCPA 退出权、COPPA；About 页介绍三条产品线与研究背景；16 个锚点+26 页脚链接零断链 |
| 9 | 图标、PWA 与社交素材 | 已完成 | 2026-11-25 | favicon.ico + 16/32/48 PNG + apple-touch-icon + icon-192/512 + site.webmanifest 全部上线；26 个页面 head 注入图标/manifest 链接；23 张 OG 图仍保留 | 图标用 Python PIL 几何绘制 T 标志（#c4b5fd on #0c0d0f），4x 超采样；生成器脚本 inject-head-links.js 幂等，分享页生成器 head() 已内置链接避免重生成丢失 |
| 10 | 统计钩子与 ads.txt | 已完成 | 2026-11-25 | ads.txt 占位文件上线（根目录）+ Cloudflare Web Analytics 统计钩子接入全站 26 页 | 配置集中在 assets/js/site.config.js；未填 ID/token 时零外部请求、零假授权；填后跑 node scripts/generate-ads-txt.js 即生效 |
| 11 | 后端与数据（按需） | 已跳过 |  |  | 纯静态站，判定与统计全在浏览器端（localStorage），无需 D1/后端 |
| 12 | 变现申请与收款配置 | 未开始 |  |  | 广告变现尚未申请；域名成本已确认 Porkbun 首年$8.75/续费$14.93 |
| 13 | 冷启动推广 | 未开始 |  |  | 未开始推广；站点裂变机制（from 参数挑战链接）已内建，等有流量后再测试渠道 |
| 14 | 后续迭代计划 | 已完成 | 2026-11-24 | 明确 B 方向（双人实时判定）与 C 方向（Aura Score）为后续迭代 | 计划项已录入后续更新计划表 |

状态说明：未开始 / 进行中 / 已完成 / 阻塞 / 已跳过。步骤可增删，脚本以本表为准。

## 当前焦点与阻塞

- 正在做：内容扩充完成（判词 24 条 + About 页）；等 AdSense 3-4 周养站窗口，看 GSC 收录信号再申请
- 阻塞点：AdSense 需养站 3-4 周（站点年龄+收录信号）；Bing 导入需用户 Google 账号操作；冷启动推广需真实流量后再验证渠道

## 后续更新计划

| # | 优先级 | 事项 | 计划时间 | 状态 |
| --- | --- | --- | --- | --- |
| 1 | 中 | 补隐私页/About 页（欧美站合规） |  | 已完成 |
| 2 | 中 | 接 Cloudflare Web Analytics + 放 ads.txt |  | 已完成 |
| 3 | 高 | 申请 AdSense 并配置收款（W-8BEN/Payoneer） |  | 待办 |
| 4 | 高 | B 方向：双人实时判定测试开发 |  | 已完成 |
| 5 | 低 | C 方向：Aura Score 内容栏目 |  | 已完成 |
| 6 | 高 | 填 Cloudflare Web Analytics token 打开真实统计 |  | 已完成 |
| 7 | 高 | 补 sitemap.xml + robots.txt，验证 GSC/Bing 并提交 |  | 已完成 |
| 8 | 中 | favicon + PWA manifest 收尾（第9步） |  | 已完成 |
| 9 | 中 | 题库扩容到 8-10 个测试 + JSON-LD 结构化数据 |  | 已完成 |
| 10 | 高 | Reddit/TikTok 冷启动首批发帖 |  | 待办 |
| 11 | 中 | Bing Webmaster Tools 从 GSC 导入并确认 sitemap 收录 |  | 待办 |

## 变更记录

- 2026-11-24 17:24 新增后续计划「接 Cloudflare Web Analytics + 放 ads.txt」
- 2026-11-24 17:24 新增后续计划「申请 AdSense 并配置收款（W-8BEN/Payoneer）」
- 2026-11-24 17:24 新增后续计划「B 方向：双人实时判定测试开发」
- 2026-11-24 17:24 新增后续计划「C 方向：Aura Score 内容栏目」
- 2026-11-24 17:24 更新当前焦点与阻塞信息
- 2026-11-24 17:39 步骤 3「原型与页面结构」，更新关键产出，更新备注
- 2026-11-24 17:40 步骤 6「代码仓库与部署密钥」，更新关键产出
- 2026-11-24 17:40 步骤 7「部署上线与域名绑定」，更新关键产出，更新备注
- 2026-11-24 17:40 步骤 9「图标、PWA 与社交素材」，更新关键产出
- 2026-11-24 17:40 后续计划第 4 项标记为已完成
- 2026-11-24 17:40 更新当前焦点与阻塞信息
- 2026-11-25 09:20 步骤 3「原型与页面结构」，更新关键产出，更新备注
- 2026-11-25 09:20 步骤 6「代码仓库与部署密钥」，更新关键产出
- 2026-11-25 09:20 步骤 7「部署上线与域名绑定」，更新关键产出
- 2026-11-25 09:20 步骤 9「图标、PWA 与社交素材」，更新关键产出
- 2026-11-25 09:20 后续计划第 5 项标记为已完成
- 2026-11-25 09:20 更新当前焦点与阻塞信息
- 2026-11-25 09:29 步骤 8「内容、解释与合规页」，进行中 → 已完成，更新关键产出，更新备注
- 2026-11-25 09:29 后续计划第 1 项标记为已完成
- 2026-11-25 09:29 更新当前焦点与阻塞信息
- 2026-11-25 09:40 步骤 10「统计钩子与 ads.txt」，未开始 → 已完成，更新关键产出，更新备注
- 2026-11-25 09:40 后续计划第 1 项标记为已完成
- 2026-11-25 09:40 更新当前焦点与阻塞信息
- 2026-11-25 09:41 后续计划第 2 项标记为已完成
- 2026-11-25 09:48 新增后续计划「填 Cloudflare Web Analytics token 打开真实统计」
- 2026-11-25 09:48 新增后续计划「补 sitemap.xml + robots.txt，验证 GSC/Bing 并提交」
- 2026-11-25 09:48 新增后续计划「favicon + PWA manifest 收尾（第9步）」
- 2026-11-25 09:48 新增后续计划「题库扩容到 8-10 个测试 + JSON-LD 结构化数据」
- 2026-11-25 09:48 新增后续计划「Reddit/TikTok 冷启动首批发帖」
- 2026-11-25 09:49 用户反馈 AdSense 因站点刚上线需等约20天；等待期优先做统计通电、SEO收录、内容扩容与冷启动，收款材料(W-8BEN/Payoneer)同步准备
- 2026-11-25 09:49 更新当前焦点与阻塞信息
- 2026-11-25 10:08 步骤 9「图标、PWA 与社交素材」，进行中 → 已完成，更新关键产出，更新备注
- 2026-11-25 10:08 后续计划第 8 项标记为已完成
- 2026-11-25 10:08 新增 sitemap.xml(29 URL)+robots.txt 并上线；生成器 generate-sitemap.js 从 data.js 自动读页面清单；线上验证 10 个新文件全 200、MIME 正确、26 页 head 各 4 条图标链接、manifest JSON 合法
- 2026-11-25 10:19 步骤 3「原型与页面结构」，更新关键产出，更新备注
- 2026-11-25 10:19 后续计划第 9 项标记为已完成
- 2026-11-25 10:19 更新当前焦点与阻塞信息
- 2026-11-25 10:19 新增 docs/变现目标测算.md（00/00/000 三档 × RPM // 倒推表，域名成本 .24/月，盈亏平衡月 PV≈310）；docs/GSC-验证指南.md（DNS TXT 方式推荐，含 Cloudflare 加记录步骤与提交 sitemap 流程）。线上验证：5 新分享页+5 新 OG 全 200，sitemap 54 条，JSON-LD 46 页全合法
- 2026-11-25 10:53 后续计划第 6 项标记为已完成
- 2026-11-25 10:54 更新当前焦点与阻塞信息
- 2026-11-25 10:54 更正此前误判：Cloudflare Web Analytics 自动注入实际已生效。用浏览器 UA+缓存绕过实测 /、/index.html、/about、/test.html?id=green-line、/share/green-line-cover 五类页面，HTML 中均含 static.cloudflareinsights.com/beacon.min.js 与 data-cf-beacon token=142ee2df29244edb8169ee096bf0077b。此前 curl 默认 UA 命中未注入的缓存变体导致误报。结论：site.config.js 的 cfToken 保持留空即可（analytics.js 有 script[data-cf-beacon] 去重保护），无需手动填 token。
- 2026-11-25 10:58 后续计划第 7 项标记为已完成
- 2026-11-25 10:58 新增后续计划「Bing Webmaster Tools 从 GSC 导入并确认 sitemap 收录」
- 2026-11-25 10:58 更新当前焦点与阻塞信息
- 2026-11-25 10:58 用户完成 GSC 域名验证，sitemap.xml 提交成功：状态「成功」、已提交 54 网址、已发现网页 54、上次读取 2026-11-25。首页基础 SEO 链路（sitemap+robots+JSON-LD+GSC 提交）全部跑通。
- 2026-11-25 11:04 步骤 2「变现目标测算」，进行中 → 已跳过，更新备注
- 2026-11-25 11:05 更新当前焦点与阻塞信息
- 2026-11-25 11:05 用户决定跳过收入目标测算，看实际流量。新增 docs/Bing-导入指南.md（GSC 一键导入 5 步 + sitemap 确认 + IndexNow 可选项）与 docs/收款材料准备指南.md（W-8BEN 填写 9 步/预扣税 24%→10% + Payoneer 美国银行账号绑定 + 小额验证 + 付款节奏）。指南已备好，实际操作需用户登录各自账号完成。
- 2026-11-25 12:26 为降低 AdSense 低价值内容风险做内容扩充：8 测试 ×3 档共 24 条 science 判词从平均 30 词扩到 67 词（62-74 词，补具体研究/数字/反例）；about.html 从约 550 词扩到 1425 词，新增 How we pick tests / How we write verdicts / Who's behind this / FAQ 四节，共 9 节。headline/description/OG 文案未动，分享页与 OG 图无需重生成。线上验证新内容全部生效。
- 2026-11-25 12:26 更新当前焦点与阻塞信息
