# 🐾 動物收養平台

一個現代化的動物收養平台，讓使用者能夠瀏覽、收藏和了解待收養的動物資訊。使用 React 19 + Vite 6 構建，具備響應式設計、離線功能和進階效能優化。

## ✨ 主要功能

- 🏠 **首頁展示**：每日推薦動物與領養流程介紹
- 🔍 **動物瀏覽**：完整的動物資料庫，支援即時篩選和搜尋
- ❤️ **收藏功能**：登入用戶可收藏喜愛的動物，支援雲端同步
- 👤 **用戶系統**：支援 Google 和 Facebook OAuth 登入
- 📱 **響應式設計**：適配各種設備螢幕，觸控友好
- 💾 **智慧快取**：使用 IndexedDB 提供離線瀏覽體驗
- 🎨 **主題切換**：支援明暗主題模式，跟隨系統設定
- 🔔 **即時通知**：使用 react-hot-toast 提供優雅的操作反饋
- ⚡ **效能優化**：懶載入、記憶化組件、智慧快取策略

## 🛠 技術棧

### 前端核心

- **React 19** - 最新版本用戶界面庫，支援並發特性
- **Vite 6** - 極速構建工具和開發服務器
- **React Router 7** - 現代化路由管理

### UI/UX 設計

- **Tailwind CSS 3** - 原子化 CSS 框架
- **DaisyUI 4** - 精美的 Tailwind CSS 組件庫
- **React Hot Toast** - 優雅的通知系統

### 狀態管理與資料處理

- **Zustand 5** - 輕量級狀態管理解決方案
- **IndexedDB (idb 8)** - 瀏覽器本地資料庫，24 小時智慧快取
- **自定義 Hooks** - 可重用的業務邏輯封裝

### 雲端服務整合

- **Firebase 11** - 完整的後端即服務解決方案
  - **Firebase Auth** - OAuth 認證（Google、Facebook）
  - **Firebase Realtime Database** - 即時資料同步
  - **Firebase Functions** - 無服務器 API 端點
- **政府開放資料 API** - 農業部動物保護資訊網整合

### 圖片與媒體優化

- **圖片懶載入** - 滾動到視窗才載入圖片，提升效能
- **圖片容錯處理** - 載入失敗時自動顯示預設圖片
- **WebP 格式支援** - 使用現代圖片格式減少檔案大小
- **響應式圖片** - 適應不同螢幕尺寸的圖片顯示

### 開發工具與品質保證

- **ESLint 9** - 最新代碼品質檢查
- **PostCSS 8** - CSS 後處理器
- **Autoprefixer** - CSS 自動前綴
- **CORS 處理** - 跨域請求支援

## 📁 專案架構

```
src/
├── components/              # React 組件庫
│   ├── AnimalCard.jsx      # 動物卡片組件（收藏、詳情、圖片處理）
│   ├── AnimalFilterMenu.jsx & AnimalFilterMenu_fixed.jsx # 動物篩選介面
│   ├── AnimalSkeleton.jsx  # 載入骨架屏，提升用戶體驗
│   ├── Dock.jsx           # 底部導航欄（手機端友好）
│   ├── Hero.jsx           # 首頁橫幅展示區域
│   ├── Layout.jsx         # 全域布局包裝器
│   ├── Navbar.jsx         # 頂部導航欄（響應式）
│   ├── ProtectedRoute.jsx # 路由保護組件
│   ├── ScrollToTop.jsx    # 路由切換自動回頂部
│   └── ThemeToggle.jsx    # 明暗主題切換器
│
├── hooks/                  # 自定義 React Hooks
│   ├── useFavorite.js     # 收藏功能邏輯（本地+雲端同步）
│   ├── useFetchAnimals.js # 動物資料獲取（API+快取策略）
│   ├── usePagination.js   # 分頁邏輯處理
│   ├── useSyncFavoritesWithAPI.js # 收藏清單雲端同步
│   └── useUserCollects.js # 用戶收藏管理
│
├── pages/                  # 路由頁面組件
│   ├── Collect.jsx        # 個人收藏頁面
│   ├── Data.jsx           # 動物列表瀏覽頁（篩選、搜尋）
│   ├── DataItem.jsx       # 動物詳細資料頁面
│   ├── Home.jsx           # 首頁（推薦動物、流程介紹）
│   ├── Login.jsx          # 登入頁面（OAuth整合）
│   └── Profile.jsx        # 個人資料管理頁面
│
├── stores/                 # Zustand 狀態管理
│   ├── useAuthStore.js    # 使用者認證狀態（IndexedDB持久化）
│   ├── useThemeStore.js   # 主題設定狀態
│   └── useToastStore.js   # 通知訊息管理（react-hot-toast整合）
│
└── utils/                  # 工具函數庫
    └── filterAnimals.js    # 動物資料篩選與搜尋邏輯

functions/                  # Firebase Cloud Functions
├── index.js               # API 端點（動物資料、CORS、快取）
├── package.json           # 後端依賴管理
└── test-import.js         # API 測試腳本

public/                     # 靜態資源
├── Cat.webp              # 預設動物圖片
├── default.webp          # 圖片載入失敗備用圖
├── favicon.webp          # 網站圖標
└── PetIcon.webp          # 應用程式圖標

docs/                      # 專案文件
配置檔案/
├── eslint.config.js      # ESLint 規則設定
├── firebase.js           # Firebase 初始化與設定
├── firebase.json         # Firebase 專案配置
├── postcss.config.js     # PostCSS 配置
├── tailwind.config.mjs   # Tailwind CSS 自訂設定
└── vite.config.js        # Vite 建置配置
```
