# Google Search Console（GSC）验证与提交指南

> 建立日期：2026-11-25
> 目标域名：thetestlibrary.app
> 说明：GSC 验证必须用你自己的 Google 账号登录操作，无法代做。以下是精确步骤；站点侧（sitemap / robots）已备好。

---

## 为什么现在做

GSC 是唯一能告诉你「Google 有没有收录你的页面、用户搜什么词找到你、哪些页面被点开」的免费工具。没有它，SEO 就是盲猜。而且**新站验证越早，历史数据越完整**——虽然 GSC 不追溯过去的数据，但从现在开始积累，20 天后正好能看到 AdSense 申请期的真实表现。

---

## 第一步：选择验证方式（推荐 DNS TXT）

GSC 提供 5 种验证方式，本站推荐 **DNS 记录验证**，原因：
- 域名 DNS 已经在 Cloudflare 管理，改一条 TXT 记录 1 分钟搞定
- 不用往站点根目录放文件，也不用改代码
- 验证后自动覆盖 `thetestlibrary.app` 和 `www.thetestlibrary.app`（如果用「网域」资源类型）

---

## 第二步：操作步骤（DNS 方式）

### 2.1 在 GSC 添加资源

1. 打开 <https://search.google.com/search-console>
2. 用你的 Google 账号登录
3. 点左上角「添加资源」（Add a property）
4. 会看到两个选项：**网域（Domain）** 和 **网址前缀（URL prefix）**
   - **选「网域」**，输入 `thetestlibrary.app`（不要带 https://）
   - 网域资源能同时覆盖 www 和非 www、http 和 https，长期最省事
5. 点「继续」，会弹出 DNS 验证对话框，里面有一段 **TXT 记录值**，类似：
   ```
   google-site-verification=AbCdEf...（一长串随机字符）
   ```
   **先不要关闭这个窗口**，复制那串值。

### 2.2 在 Cloudflare 添加 TXT 记录

1. 打开 <https://dash.cloudflare.com>，登录并选中 `thetestlibrary.app`
2. 左侧菜单点 **DNS** → **记录（Records）**
3. 点 **添加记录（Add record）**
4. 填写：
   - **类型**：TXT
   - **名称**：`@`（代表根域 thetestlibrary.app）
   - **TTL**：自动（Auto）
   - **值**：粘贴刚才从 GSC 复制的那串 `google-site-verification=...`
5. 保存。

### 2.3 回到 GSC 完成验证

1. 回到刚才的 GSC 验证窗口，点 **「验证」（Verify）**
2. DNS 生效通常需要几分钟到几小时。如果提示「验证失败」，**等 5–10 分钟再点一次验证**，不用改任何东西
3. 看到「已验证」（Verified）就成功了

> 小技巧：可以在 Windows 命令行执行 `nslookup -type=TXT thetestlibrary.app` 确认 TXT 记录已生效，再回 GSC 点验证。

---

## 第三步：提交 sitemap（验证成功后）

1. 在 GSC 左侧菜单找到 **站点地图（Sitemaps）**
2. 在「添加新站点地图」输入框填：`sitemap.xml`
3. 点提交。

站点侧已备好 `https://thetestlibrary.app/sitemap.xml`（当前 54 条 URL，包含全部测试页、40 个分享页、双人、Aura、About、Privacy），并且 `robots.txt` 里已声明 Sitemap 地址。提交后 GSC 会显示「成功」和已发现的网址数量。

---

## 第四步：验证后该看什么

| 想看什么 | GSC 位置 |
| --- | --- |
| 页面有没有被收录 | 左侧「网页」(Pages) → 已编入索引的页面数 |
| 用户搜什么词找到你 | 「效果」(Performance) → 查询(Queries) |
| 哪些页面表现最好 | 「效果」→ 网页(Pages) |
| 抓取有没有报错 | 「抓取统计信息」/「网址检查」 |

**建议节奏**：验证后前两周每周看一次，重点看「查询」里出现了哪些你没预料到的长尾词——这些是下一批题库扩容的方向。

---

## 备选方案：HTML 文件验证（如果 DNS 方式不方便）

1. GSC 验证对话框里选「HTML 文件」标签
2. 下载它提供的 `googleXXXXXXXXXX.html` 文件
3. 把文件放到网站根目录（与 index.html 同级）
4. 推送到 GitHub，等 Cloudflare 部署完成（约 40 秒）
5. 在 GSC 点「验证」
6. 验证通过后**保留该文件**（不要删，Google 会定期复查；删了可能导致验证失效）

> 如果你选这种方式，把 GSC 给你的 HTML 文件内容发给我，我可以直接帮你放到项目里并推送部署。

---

## 常见问题

**Q：验证后多久能看到数据？**
A：GSC 数据有 2–3 天延迟。提交 sitemap 后，Google 抓取和收录通常需要几天到几周。新站前 2–4 周数据很少是正常的。

**Q：网域验证和网址前缀验证选哪个？**
A：本站强烈建议「网域」。如果选了「网址前缀」，需要单独再验证一个 www 版本，否则带 www 的流量不统计。

**Q：可以同时绑定 Bing 吗？**
A：可以。Bing Webmaster Tools 支持「从 GSC 导入」，验证完成后一键导入，不用重复操作。建议 GSC 搞定后顺手做。
