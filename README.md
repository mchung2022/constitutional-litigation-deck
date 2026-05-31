# ⚖️ 中華民國憲法訴訟法大師級素養簡報 (Constitutional Litigation Act SPA Deck)

本專案是一套專為高中公民科與大專院校法學教育設計的**互動式 HTML5 核心素養簡報**，共計 **50 頁 (Slides)**。
簡報以優雅的學術深海軍藍黑 (`#0B132B`) 磨砂玻璃（Glassmorphism）為核心主視覺美學，並整合了多種創新的網頁前端互動式學習元件。

---

## 🌟 核心特色

1. **50 頁完全無死角的素養 syllabus**：
   * 包含從「大法官會議到憲法法庭」法庭化、審判化變革、立委聲請釋憲門檻調降、核彈級新制 **「裁判憲法審查」** 專題、法庭言詞辯論攻防、 Amicus 法庭之友、以及違憲宣告表決門檻。
   * 特設 **模擬憲法法庭實戰**，提供三項核心時代爭議案件 (言論自由、科技偵查、居住尊嚴) 供學生體驗表決。
2. **🗳️ 實時大法官表決投票面板**：
   * 在模擬法庭單元中，學生可以直接按下「合憲」或「違憲」按鈕，網頁即時統計票數比例，並動態渲染彩色 bar-chart 與判定是否達到表決門檻！
3. **🧠 翻轉卡片、答題回饋與思辨天平**：
   * 所有憲政革新以懸停翻轉卡片展現；素養測驗題點擊即時高亮正確/錯誤答案並輸出詳細法律見解；模擬法庭座位物理分區引導角色扮演。
4. **🎓 互動式 Canvas 簽名與大師學習證書**：
   * 學生可輸入姓名，並在黑色簽名面板上直接使用滑鼠或觸控螢幕進行**親筆簽名**。系統會在一瞬間將學生姓名、簽名線條與黃金邊框證書範本合成為一張精美的 PNG 圖檔並自動觸發下載！

---

## 🛠️ 本地運行

直接點擊資料夾中的 `index.html`，即可使用任意主流網頁瀏覽器（Chrome, Edge, Firefox, Safari）流暢運行。
* **快捷鍵指引**：
  * 使用鍵盤 **向右方向鍵 (→) 或 空白鍵 (Space)**：前進至下一頁。
  * 使用鍵盤 **向左方向鍵 (←)**：返回至上一頁。
  * 點擊右上角 **☰ 課程地圖** 即可展開側邊欄選單，一鍵跨單元跳轉。

---

## 🚀 GitHub 一鍵部署與 GitHub Pages 全球發佈指引

為了將此 50 頁簡報發佈至互聯網，供您的學生或大眾隨時在線閱讀與互動，請按照以下步驟進行 GitHub 部署：

### 步驟 1：初始化本地 Git 倉庫
我們已經在您的資料夾中為您做好了 Git 的本地初始化與 commit。您只需在終端機中確認：
```bash
cd constitutional-litigation-deck
git init
git add .
git commit -m "feat: init Constitutional Litigation Act 50-slide interactive presentation"
```

### 步驟 2：在 GitHub 上創建新倉庫
1. 登入您的 [GitHub 帳號](https://github.com/)。
2. 點擊右上角的 **「+」** 按鈕，選擇 **「New repository」**。
3. 填入倉庫名稱為：`constitutional-litigation-deck`。
4. 將倉庫權限設定為 **「Public」** (公開，這是開啟 GitHub Pages 免費網頁服務的必要設定！)。
5. 點擊下方綠色的 **「Create repository」**，不要勾選初始化 Readme 或 .gitignore。

### 步驟 3：綁定遠端並推送代碼
在您的本地終端機（如 PowerShell 或 Bash）中執行以下指令（將 `<您的使用者名稱>` 替換為您的實際 GitHub 帳號）：
```bash
git remote add origin https://github.com/<您的使用者名稱>/constitutional-litigation-deck.git
git branch -M main
git push -u origin main
```

### 步驟 4：開啟 GitHub Pages 全球網頁發佈
1. 在 GitHub 網頁上進入您剛剛上傳的 `constitutional-litigation-deck` 倉庫頁面。
2. 點擊頂部導航欄的 **「Settings」** (設定) 按鈕。
3. 在左側選單中，點擊 **「Pages」** 板塊。
4. 在 **「Build and deployment」** 下方的 Build Source 選擇：`Deploy from a branch`。
5. 在 **「Branch」** 選擇下拉選單中，點擊 `main` 分支，並將目錄設定為 `/root`。
6. 點擊右側的 **「Save」** 保存。
7. **大功告成！** 約 30 秒至 1 分鐘後，刷新該頁面，您將會在頂部看到一個綠色的提示欄：
   > "Your site is live at `https://<您的使用者名稱>.github.io/constitutional-litigation-deck/`"
   直接點擊該連結，您的 50 頁高顏值釋憲素養簡報即已成功發佈到全球網絡！
