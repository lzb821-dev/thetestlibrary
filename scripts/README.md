# Build scripts

所有生成脚本都是幂等的（重复运行不产生重复内容）。**加新测试后按下面顺序跑一遍即可**。

```bash
# 1. 数据层：assets/js/data.js 里加测试对象（这是唯一数据源）

# 2. 生成 OG 图（需要 @napi-rs/canvas）
npm install --no-save @napi-rs/canvas
node scripts/generate-og.js

# 3. 生成分享页（会重写 share/*.html，因此会抹掉它们头部的注入标记）
node scripts/generate-share-pages.js

# 4. 注入类：重新给所有 HTML 补 head 标记（顺序不能颠倒）
node scripts/inject-head-links.js    # favicon + PWA manifest 链接
node scripts/generate-jsonld.js      # JSON-LD 结构化数据

# 5. sitemap 与 ads.txt（从 data.js 自动读清单）
node scripts/generate-sitemap.js
node scripts/generate-ads-txt.js

# 6. 图标只在改了设计时重跑（Python + Pillow）
python scripts/generate-icons.py
```

## 关键点

- **顺序**：生成类（2、3、5）在前，注入类（4）在后。因为分享页生成器会整页重写文件，任何手工注入到分享页 head 的内容都会丢失——所以图标链接是直接写进 `generate-share-pages.js` 的 `head()` 里的，JSON-LD 则由 `generate-jsonld.js` 在生成后补上。
- **唯一数据源**：`assets/js/data.js`。TESTS / VERDICTS / DUO / AURA_TIERS 都从这里读，OG、分享页、sitemap、JSON-LD 的 ItemList 全部自动同步。
- **图标**：`generate-icons.py` 用 PIL 几何绘制 T 标志，无字体依赖，4x 超采样。生成 7 个文件（favicon.ico + 4 PNG + 2 PWA icon）。
- **JSON-LD**：首页 WebSite+ItemList，其他页 WebPage+BreadcrumbList。全部 46 页已验证可解析。
- **统计与广告 ID**：集中在 `assets/js/site.config.js`，填写后无需重新生成页面（analytics.js 运行时读取）。填 AdSense ID 后需重跑 `generate-ads-txt.js`。
