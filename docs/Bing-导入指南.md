# The Test Library · Bing 导入指南

> 建立日期：2026-11-25
> 前置条件：GSC 已完成域名验证，sitemap 已提交（本站 2026-11-25 完成，54 个网址全部已发现）
> 预计耗时：5–10 分钟，零成本

---

## 一、为什么值得做

Bing 的直接搜索份额虽然只有约 7%，但它的索引是多个 AI 搜索入口的底层：

- Microsoft Copilot
- ChatGPT Search（实时查询走 Bing）
- DuckDuckGo
- Yahoo

也就是说，站点进了 Bing 索引，才有资格出现在这些 AI 回答里。而 Bing Webmaster Tools 从 GSC 导入是**免验证、免改 DNS、免上传文件**的——GSC 那一步已经做完了，这里几乎是白捡。

---

## 二、从 GSC 导入（最短路径）

1. 打开 **bing.com/webmasters**，点 **Get Started** 登录。
   可以用 Microsoft、Google 或 Facebook 账号；建议用 Google 账号登录，跟 GSC 保持一致，授权时少一步切换。

2. 首页出现两个选项，选 **Import from Google Search Console**（从 Google Search Console 导入）→ **Continue**。

3. 弹出 Google 登录窗口，**务必用验证了 `thetestlibrary.app` 的那个 Google 账号**登录（如果账号多，这里最容易选错）。

4. Bing 请求读取 GSC 数据的权限，点 **Allow**（允许）。

5. 出现该账号下的站点列表，每个旁边标着 sitemap 数量。勾选 **thetestlibrary.app** → 点 **Import**。

6. 完成。导入的站点**自动处于已验证状态**，sitemap 一并带过来，不需要上传 BingSiteAuth.xml、不需要改 DNS。

> 两个上限：一次最多导入 100 个站点，一个账号最多 1000 个。本站只有 1 个，无影响。

---

## 三、确认 sitemap 真的进来了

导入偶尔会带站点、但漏掉 sitemap，所以要做一次确认：

- 左侧菜单 → **Sitemaps**
- 列表里应该能看到 `https://thetestlibrary.app/sitemap.xml`
- 没有的话点 **Submit sitemap**，把完整地址贴进去提交

注意：**导入后的数据最多需要 48 小时填充**。刚导完界面是空的属于正常，第二天再看，不要重复导入。

---

## 四、可选：IndexNow

Bing 一般几小时到几天开始抓 sitemap。IndexNow 可以主动推送新页面，让 Bing 立刻知道内容变了。

本站是纯静态站、更新频率低（加新测试才会变），**现在可以不做**。等哪天一次加了多个测试，再在 Bing Webmaster Tools 里开 IndexNow、生成 API key 并托管 key 文件，手动推一次即可。

---

## 五、验收清单

- [ ] `thetestlibrary.app` 出现在 Bing Webmaster 站点列表，状态为已验证
- [ ] Sitemaps 页面能看到 `https://thetestlibrary.app/sitemap.xml`
- [ ] 2–3 天后，左侧 **URL Inspection** 输入首页能查到已收录

---

## 六、两个注意点

1. **导入是"委托验证"，不是永久豁免。** Bing 会定期回到 GSC 重新确认所有权。以后如果取消了 Bing 对 Google 账号的访问权限，就得重新连接，或改用 meta 标签 / DNS 方式验证。

2. **保持 sitemap 自动更新。** 本站的 `scripts/generate-sitemap.js` 会从 `data.js` 读取测试清单自动生成，加新测试后跑一次生成脚本并推送即可，Bing 会自己发现变化。
