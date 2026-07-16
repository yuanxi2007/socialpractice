# 古韵新生 — 皇城相府社会实践展示网站

## 📖 使用说明（非技术向）

### 如何打开网站
双击 `index.html` 文件，浏览器就会自动打开网站。

### 网站结构一览

```
website/
├── index.html          ← 主页面（需要编辑的唯一文件）
├── css/
│   └── style.css       ← 样式文件（不用管）
├── js/
│   └── main.js         ← 交互脚本（不用管）
├── images/
│   ├── gallery/        ← 把建筑照片放这里
│   ├── details/        ← 把建筑细节特写放这里
│   ├── performance/    ← 把表演剧照放这里
│   └── team/           ← 把队员头像放这里
└── video/
    └── performance.mp4 ← 把人文表演视频放这里
```

### 如何编辑内容

#### 方法：搜索 `📝` 找到所有需要改的地方

用记事本或任何文本编辑器打开 `index.html`，按 `Ctrl+F` 搜索 `📝`，
所有带这个标记的地方都是你需要替换的内容。

---

### 各板块编辑指南

#### 板块 1：首屏（不用改）
网站打开第一眼看到的标题页，默认文字已经是"古韵新生"。
如果想换背景，找一张皇城相府全景照片，放到 `images/` 文件夹，
然后把照片命名为你想用的名字。

#### 板块 2：项目缘起（改文字）
搜索 `📝 内容槽：Gemini 生成的项目介绍文案`
把 `<p>...</p>` 里面的文字替换成 Gemini 帮你写好的文案。

#### 板块 3：建筑掠影（加照片 + 改文字）
每张照片卡片的结构：
```html
<div class="gallery-item" data-category="panorama">   ← 分类：panorama / carving / interior
    <div class="gallery-card">
        <div class="card-image">
            <!-- 把下面这行替换为 <img src="images/gallery/你的照片.jpg" alt="照片名"> -->
            <div class="placeholder-img">...</div>
        </div>
        <div class="card-info">
            <h3 class="card-title">照片标题</h3>           ← Gemini 起的名
            <p class="card-desc">一句话描述</p>           ← Gemini 写的描述
        </div>
    </div>
</div>
```

**添加新照片**：复制一整块 `<div class="gallery-item">...</div>`，
改里面的分类、图片路径、标题和描述。

**分类说明**：
- `panorama` = 全景/建筑群
- `carving` = 雕刻细节
- `interior` = 室内陈设

#### 板块 4：人文表演（改视频路径 + 文字）
1. 把视频文件放到 `video/` 文件夹
2. 搜索 `video/performance.mp4`，改成你的视频文件名
3. 搜索 `📝 内容槽：Gemini 生成的表演介绍文案`，替换文字

#### 板块 5：营造之美（改照片 + 解说）
每个建筑构件是一块 `<div class="detail-item">`，
交替左右排列（带 `reverse` 类的图片在右边）。

搜索 `📷 斗拱照片` 等标记，替换为实际图片路径和 Gemini 写的解说文字。

#### 板块 6：队员感悟（改名字 + 心得）
搜索 `📝 内容槽：Gemini 润色后的队员心得`
修改每个队员的姓氏、感悟文字。

要增加队员：复制一整块 `<div class="reflection-card">...</div>`。

#### 板块 7：关于我们（改团队信息）
搜索 `📝 内容槽：团队信息`
修改学校名称、团队成员名单、指导老师等。

---

### 图片注意事项

1. **照片尺寸**：建议先把照片压缩到宽度不超过 1600 像素，否则加载很慢
   - 在线压缩工具推荐：https://squoosh.app （免费，无需安装）
2. **文件命名**：不要用中文文件名（可能乱码），用拼音或英文
   - 好：`yushulou.jpg`、`gate-carving-01.jpg`
   - 不好：`御书楼.jpg`、`门楼雕刻 (1).jpg`
3. **放入对应文件夹**：
   - 建筑全景 → `images/gallery/`
   - 雕刻细节特写 → `images/details/`
   - 表演剧照 → `images/performance/`
   - 队员头像 → `images/team/`

---

### 如何让队友用手机看到网站

**方式一：部署到 GitHub Pages（免费，推荐）**
1. 注册 GitHub 账号（github.com）
2. 我会帮你把网站上传并生成一个链接
3. 链接格式：`https://你的用户名.github.io/guyun-xinsheng`
4. 发到微信群里，队友点开就能看

**方式二：压缩发文件**
把整个 `website` 文件夹压缩成 zip 发给队友，但对方也要解压后才能看。

---

### 常见问题

**Q: 双击 index.html 打开是白页？**
A: 检查 `css/style.css` 和 `js/main.js` 是否在正确的位置。

**Q: 照片显示不出来？**
A: 检查 `src="images/..."` 路径是否写对了，照片文件是否放在了对应文件夹里。

**Q: 手机上看布局乱了？**
A: 告诉我哪里不对，我帮你修。

**Q: 视频播不了？**
A: 视频文件可能太大。建议上传到 B 站（bilibili.com），把嵌入代码替换到视频区域。

---

### 协作流程总结

```
① 把照片发给 Gemini 分析
         ↓
② Gemini 产出：每张照片的名称 + 描述 + 建筑解说 + 表演介绍 + 队员心得
         ↓
③ 把照片放进对应文件夹（images/gallery/ 等）
         ↓
④ 打开 index.html，搜索 📝，把 Gemini 的文字填进去
         ↓
⑤ 双击 index.html 看效果 → 告诉我需要调整什么
         ↓
⑥ 定稿后我帮你部署到网上
```

---

有问题随时问我！
