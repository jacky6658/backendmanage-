# AIJob ReelMind 後台管理系統

## 📋 專案說明

這是 **AIJob ReelMind 短影音智能體** 的**後台管理系統**，用於查看和管理所有用戶數據。

## 🔗 與前端使用介面的關係

### 兩個獨立的介面

1. **前端使用者介面** (`/Users/jackychen/Downloads/Ai--main/index.html`)
   - 一般使用者使用的介面
   - 部署網址：`https://aivideonew.zeabur.app`
   - 用戶可在此進行對話、生成腳本等操作

2. **後台管理系統** (`/Users/jackychen/Downloads/20251014aivideobackend-main/admin_dashboard/index.html`)
   - 管理員使用的後台
   - 可查看所有用戶數據、對話記錄、生成內容等
   - 目前可直接以 HTML 檔案開啟或部署到伺服器

### 共用後端 API

兩個介面都連接到同一個後端：

```
後端 API: https://aivideobackend.zeabur.app
```

- 前端用戶介面：用戶進行操作，數據寫入資料庫
- 後台管理系統：讀取資料庫數據，提供管理和分析功能

## 🎯 功能特色

### 1. 數據概覽 📊
- **統計卡片**：總用戶數、對話總數、生成腳本數、帳號定位數
- **用戶增長趨勢圖**：折線圖顯示用戶增長情況
- **模式使用分布圖**：圓餅圖顯示各模式使用比例
- **最近活動**：即時顯示系統最近活動

### 2. 用戶管理 👥
- **用戶列表**：顯示所有註冊用戶資訊
- **搜尋功能**：支援用戶搜尋和篩選
- **用戶詳情**：查看單個用戶完整資訊
- **數據統計**：顯示用戶對話數、腳本數等統計

### 3. 模式分析 🎯
- **模式統計**：三種模式的使用數據
  - 🎯 一鍵生成模式：使用次數、成功率
  - 💬 AI顧問模式：對話數、平均對話輪數
  - 🎭 IP人設規劃模式：使用次數、生成Profile數
- **時間分布圖**：柱狀圖顯示各時段使用情況

### 4. 對話記錄 💬
- **對話列表**：顯示所有AI對話記錄
- **模式篩選**：按模式篩選對話
- **對話詳情**：彈窗查看完整對話內容
- **數據統計**：消息數量統計

### 5. 腳本管理 📝
- **腳本列表**：顯示所有生成的腳本
- **篩選功能**：按用戶、平台篩選
- **腳本詳情**：查看完整腳本內容
- **管理操作**：查看、刪除腳本

### 6. 生成記錄 ✨
- **生成歷史**：顯示所有生成記錄
- **類型分類**：帳號定位、選題、腳本等
- **時間排序**：按時間排序顯示

### 7. 數據分析 📈
- **平台使用分布**：圓餅圖顯示各平台使用比例
- **時間段分析**：柱狀圖顯示時間段使用情況
- **用戶活躍度**：折線圖顯示用戶活躍趨勢
- **內容類型分布**：圓餅圖顯示內容類型分布

## 🛠️ 技術架構

### 前端技術
- **HTML5**：語義化標籤
- **CSS3**：現代CSS特性
- **JavaScript (ES6+)**：原生JavaScript
- **Chart.js**：數據圖表庫

### 設計特色
- **響應式設計**：支援桌面和手機版
- **現代UI**：卡片式設計、漸層背景
- **即時更新**：自動更新時間和數據
- **互動體驗**：流暢的切換動畫

## 📁 檔案結構

```
20251014aivideobackend-main/
├── admin_dashboard/          ← 後台管理系統資料夾
│   ├── index.html           ← 主頁面
│   ├── styles.css           ← 樣式檔案
│   ├── app.js              ← JavaScript邏輯
│   └── README.md           ← 說明文件
├── app.py                   ← 後端主程式
├── data/                    ← 資料庫資料夾
│   └── chatbot.db          ← SQLite 資料庫
└── 其他檔案...
```

## 🚀 使用方法

### 方法一：本地開啟（推薦測試用）
1. 直接開啟 `admin_dashboard/index.html` 檔案
2. 使用瀏覽器打開（建議使用 Chrome 或 Edge）
3. 系統會自動連接後端API

### 方法二：部署到伺服器
1. 將 `admin_dashboard` 資料夾上傳到伺服器
2. 透過網址訪問：`https://your-domain.com/admin_dashboard/index.html`
3. 確保後端 API 可以正常訪問

## 🔌 API 整合

系統會自動連接後端API：

```javascript
const API_BASE_URL = 'https://aivideobackend.zeabur.app/api';
```

### 使用的 API 端點

#### 數據概覽
- `GET /api/admin/statistics` - 獲取統計數據

#### 用戶管理
- `GET /api/admin/users` - 獲取所有用戶
- `GET /api/admin/user/{user_id}/data` - 獲取用戶詳情

#### 對話記錄
- `GET /api/user/conversations/{user_id}` - 獲取對話記錄

#### 腳本管理
- `GET /api/scripts/my` - 獲取腳本列表
- `DELETE /api/scripts/{script_id}` - 刪除腳本

#### 生成記錄
- `GET /api/user/generations/{user_id}` - 獲取生成記錄

## 📊 數據來源

所有數據來自後端資料庫，與前端用戶介面共用：

### 資料庫表格
- `user_auth` - 用戶認證資料
- `user_profiles` - 用戶個人資料
- `conversation_summaries` - 對話摘要
- `user_scripts` - 用戶腳本
- `generations` - 生成記錄
- `positioning_records` - 帳號定位記錄

**重要說明**：後台管理系統**不會修改**用戶數據，只進行**讀取和顯示**。

## 📱 手機版支援

- ✅ 手機網頁版完美支援
- ✅ 響應式設計自動調整
- ✅ 點擊左上角「☰」開啟側邊欄
- ✅ 無左右滑動問題，所有數據正常顯示

## 🎨 設計說明

### 色彩系統
- **主色**：`#3b82f6` (藍色)
- **次要色**：`#8b5cf6` (紫色)
- **成功色**：`#10b981` (綠色)
- **警告色**：`#f59e0b` (橙色)
- **危險色**：`#ef4444` (紅色)

### 字體系統
- **字體族**：-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto

## 🔒 安全性

- 使用 HTTPS 連線
- API 可能需要認證token（依後端設定）
- 所有敏感數據加密傳輸

## 📝 更新日誌

### v1.0.0 (2025-01-XX)
- ✅ 初始版本發布
- ✅ 數據概覽功能
- ✅ 用戶管理功能
- ✅ 模式分析功能
- ✅ 對話記錄功能（含彈窗詳情）
- ✅ 腳本管理功能
- ✅ 生成記錄功能
- ✅ 數據分析功能
- ✅ 手機版完全支援
- ✅ 真實數據整合（無模擬數據）
- ✅ **訂閱管理功能**：查看和設定用戶訂閱狀態
- ✅ **CSV 匯出功能**：所有頁面支援匯出 CSV
- ✅ **即時數據顯示**：所有圖表使用真實資料庫數據

#### 新增功能詳情

**1. 訂閱管理**
- 查看每個用戶的訂閱狀態（已訂閱/未訂閱）
- 手動啟用或取消用戶訂閱
- 即時更新 UI 顯示
- 支援桌面版和手機版

**2. CSV 匯出**
- 用戶管理：匯出用戶列表 CSV
- 腳本管理：匯出腳本列表 CSV
- 對話記錄：匯出對話記錄 CSV
- 生成記錄：匯出生成記錄 CSV
- 點擊按鈕自動下載檔案

**3. 真實數據整合**
- 模式分析：使用真實統計數據
- 生成記錄：顯示真實生成記錄
- 數據分析：所有圖表使用真實數據
- 用戶活動：顯示真實活動記錄
- 完全移除假數據，所有數據來自 PostgreSQL

## 🐛 已知問題

無

## 📊 資料對應說明

### 後台管理系統數據來源

所有數據都從 PostgreSQL 資料庫中讀取，以下是各頁面的數據對應表：

---

#### 1. 數據概覽頁面 📊

**統計卡片**：
| 顯示欄位 | 資料表 | 欄位 | 說明 |
|---------|--------|------|------|
| 總用戶數 | user_auth | COUNT(*) | 所有註冊用戶總數 |
| 今日新增用戶 | user_auth | COUNT(*) WHERE created_at = 今天 | 今天註冊的用戶數 |
| 對話總數 | conversation_summaries | COUNT(*) | 所有對話記錄總數 |
| 生成腳本總數 | user_scripts | COUNT(*) | 所有生成的腳本總數 |
| 帳號定位數 | conversation_summaries | COUNT(*) WHERE conversation_type = 'account_positioning' | 帳號定位對話數 |
| 生成記錄數 | generations | COUNT(*) | 所有生成記錄總數 |
| 7天活躍用戶 | user_scripts | COUNT(DISTINCT user_id) WHERE created_at >= 7天前 | 最近7天有生成腳本的用戶 |

**圖表數據**：
| 圖表 | 資料表 | 計算方式 |
|------|--------|----------|
| 用戶增長趨勢 | user_auth | 每天的新用戶數 |
| 模式使用分布 | conversation_summaries | 按 conversation_type 分組統計 |
| 最近活動 | user_auth, user_scripts, conversation_summaries | 最近10個活動記錄 |

---

#### 2. 用戶管理頁面 👥

| 顯示欄位 | 資料表 | 欄位 | 說明 |
|---------|--------|------|------|
| 用戶ID | user_auth | user_id | 唯一標識符 |
| Email | user_auth | email | 用戶郵箱 |
| 姓名 | user_auth | name | 用戶姓名 |
| 訂閱狀態 | user_auth | is_subscribed | 0=未訂閱, 1=已訂閱 |
| 註冊時間 | user_auth | created_at | 帳號創建時間 |
| **對話數** | conversation_summaries | COUNT(*) WHERE user_id = ? | **該用戶的對話總數** |
| **腳本數** | user_scripts | COUNT(*) WHERE user_id = ? | **該用戶的腳本總數** |

**資料來源**：`GET /api/admin/users`

---

#### 3. 模式分析頁面 🎯

| 顯示欄位 | 資料表 | 計算方式 |
|---------|--------|----------|
| 一鍵生成模式使用次數 | conversation_summaries | COUNT(*) WHERE conversation_type = 'account_positioning' |
| AI顧問對話數 | conversation_summaries | COUNT(*) WHERE conversation_type IN ('topic_selection', 'script_generation', 'general_consultation') |
| IP人設規劃使用次數 | conversation_summaries | COUNT(*) WHERE conversation_type = 'ip_planning' |
| 時間分布 | conversation_summaries | 按小時統計對話分布 |

**資料來源**：`GET /api/admin/mode-statistics`

---

#### 4. 對話記錄頁面 💬

| 顯示欄位 | 資料表 | 欄位 | 說明 |
|---------|--------|------|------|
| 用戶ID | conversation_summaries | user_id | 用戶唯一標識符 |
| 模式 | conversation_summaries | conversation_type | 對話類型 |
| 摘要 | conversation_summaries | summary | 對話摘要 |
| 消息數 | conversation_summaries | message_count | 該對話的消息數量 |
| 時間 | conversation_summaries | created_at | 對話創建時間 |

**資料來源**：`GET /api/admin/users` + `GET /api/user/conversations/{user_id}`

---

#### 5. 腳本管理頁面 📝

| 顯示欄位 | 資料表 | 欄位 | 說明 |
|---------|--------|------|------|
| 腳本ID | user_scripts | id | 腳本唯一標識符 |
| 用戶ID | user_scripts | user_id | 用戶唯一標識符 |
| 標題 | user_scripts | title | 腳本標題 |
| 平台 | user_scripts | platform | 目標平台（抖音、小紅書等） |
| 主題 | user_scripts | topic | 腳本主題 |
| 創建時間 | user_scripts | created_at | 腳本創建時間 |

**資料來源**：`GET /api/admin/users` + `GET /api/scripts/my?user_id={user_id}`

---

#### 6. 生成記錄頁面 ✨

| 顯示欄位 | 資料表 | 欄位 | 說明 |
|---------|--------|------|------|
| 生成ID | generations | id | 生成記錄唯一標識符 |
| 用戶名稱 | user_auth | name | 用戶姓名 |
| 平台 | generations | platform | 目標平台 |
| 主題 | generations | topic | 生成主題 |
| 內容 | generations | content | 生成內容（前100字） |
| 創建時間 | generations | created_at | 生成時間 |

**資料來源**：`GET /api/admin/generations`

---

#### 7. 數據分析頁面 📈

| 圖表 | 資料表 | 計算方式 |
|------|--------|----------|
| 平台使用分布 | user_scripts | 按 platform 分組統計 |
| 時間段使用分析 | user_scripts | 按星期統計每天的使用量 |
| 用戶活躍度 | user_scripts | 按週統計活躍用戶數 |
| 內容類型分布 | user_scripts | 按 topic 分組統計 |

**資料來源**：`GET /api/admin/analytics-data`

---

## 📞 支援

如有問題或建議，請聯繫開發團隊。

---

© 2025 AI Video. All rights reserved.
