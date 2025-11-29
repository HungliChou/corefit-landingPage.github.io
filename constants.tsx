import { ContentData } from './types';

export const CONTENT: Record<'en' | 'zh', ContentData> = {
  zh: {
    nav: {
      features: "功能特點",
      download: "立即下載",
      langSwitch: "English",
    },
    hero: {
      slogan: "專業訓練，智能管理",
      headline: "你的 AI 健身夥伴",
      description: "CoreFit 結合先進 AI 技術與專業訓練科學，為你打造獨一無二的智能訓練體驗。無論是增肌、減脂還是提升運動表現，數據驅動你的每一次進步。",
      ctaPrimary: "立即免費下載",
      ctaSecondary: "了解更多",
      stats: "超過 10,000+ 專業用戶的選擇",
    },
    intro: {
      title: "什麼是 CoreFit？",
      description: "CoreFit 是一款全方位的健身訓練管理應用程式，結合 AI 智能助手、系統化訓練計劃管理、社交功能和專業數據分析，為健身愛好者、專業運動員和健身教練提供最強大的支援。",
      badges: ["AI 智能驅動", "300+ 動作庫", "訓練紀錄追蹤", "教練專用端"],
    },
    features: {
      title: "強大功能，一應俱全",
      subtitle: "從訓練計劃到數據分析，滿足你對健身管理的所有想像",
      categories: {
        ai: {
          title: "特化 AI 虛擬教練",
          items: [
            { iconName: "Bot", title: "AI 定製計劃", description: "根據目標與需求，即時定製個人專屬訓練計劃。" },
            { iconName: "BrainCircuit", title: "AI 智能填重", description: "依據用戶資料和歷史表現，智能建議重量與次數。" },
            { iconName: "Sparkles", title: "持續學習個人化", description: "AI 持續分析訓練數據，不斷優化個人化配適。" },
          ]
        },
        resources: {
          title: "豐富訓練資源",
          items: [
            { iconName: "Unlock", title: "官方計劃與課程全解鎖", description: "全面開啟 CoreFit 官方設計的多元訓練計劃與課程。" },
            { iconName: "Dumbbell", title: "300+ 豐富動作庫", description: "結構化資料庫提供分步教學要點與標準示範影片，動作教學一應俱全。" },
            { iconName: "Bookmark", title: "收藏功能", description: "收藏計劃與課程，快速建立你的訓練書籤庫。" },
          ]
        },
        management: {
          title: "強大訓練管理",
          items: [
            { iconName: "Calendar", title: "靈活訓練規劃", description: "隨時切換訓練，自由創建和編輯個人訓練計劃。" },
            { iconName: "ClipboardList", title: "詳細訓練紀錄", description: "精確記錄組數、重量、次數、休息時間等參數。" },
            { iconName: "WifiOff", title: "訓練不中斷", description: "強大的離線功能支持，網絡中斷也能訓練不中斷。" },
          ]
        },
        tracking: {
          title: "數據分析與追蹤",
          items: [
            { iconName: "History", title: "完整訓練記錄與追蹤", description: "保持紀錄離線可用、雲端同步，完整保留訓練歷史與每次進步軌跡。" },
            { iconName: "BarChart", title: "多維度數據統計", description: "實時統計歷史訓練量、完成率、PR 進展等指標。" },
            { iconName: "LineChart", title: "可視化數據指標", description: "直觀的圖表展示訓練進步，全面追蹤訓練數據和身體指標。" },
          ]
        },
        social: {
          title: "社交與分享",
          items: [
            { iconName: "Users", title: "好友同練", description: "即時分享計劃或課程給夥伴共同訓練。" },
            { iconName: "Heart", title: "建立社交圈", description: "輕鬆管理好友關係，添加好友互相激勵。" },
            { iconName: "Share2", title: "訓練成果分享", description: "展示個人訓練成就和進步。" },
          ]
        },
        coach: {
          title: "專業教練工具",
          items: [
            { iconName: "ClipboardList", title: "學員管理", description: "輕鬆管理學員名單，指派專屬訓練計劃。" },
            { iconName: "Eye", title: "進度追蹤", description: "即時查看學員完成率與訓練數據反饋。" },
            { iconName: "Briefcase", title: "模板系統", description: "建立常用課表模板，快速指派給多位學員。" },
          ]
        }
      }
    },
    advantages: {
      title: "為什麼選擇 CoreFit？",
      items: [
        { title: "科學化訓練體系", description: "基於運動科學與生理學原理，確保每一個動作和計劃都能帶來最大的訓練效益，避免無效訓練。" },
        { title: "AI 智能實時調整", description: "不同於固定課表，CoreFit 的 AI 會根據你當天的狀態、疲勞度和過往表現，動態調整訓練強度。" },
        { title: "全方位數據洞察", description: "從單次訓練的微觀數據到長期進步的宏觀趨勢，提供深度分析報告，讓你更了解自己的身體。" }
      ]
    },
    screenshots: {
      title: "精美直觀的操作介面",
      subtitle: "簡約而不簡單，讓你的專注力只在訓練本身",
      captions: ["個人化首頁", "智能訓練計劃", "詳細動作指導", "訓練數據分析", "社群互動"]
    },
    download: {
      title: "立即開始你的智能訓練之旅",
      subtitle: "加入 CoreFit，讓每一次流汗都更有價值",
      apple: "App Store 下載",
      google: "Google Play 下載"
    },
    footer: {
      contact: "聯繫我們",
      business: "商務合作",
      social: "關注我們",
      copyright: "© 2024 CoreFit. All Rights Reserved."
    }
  },
  en: {
    nav: {
      features: "Features",
      download: "Download",
      langSwitch: "繁體中文",
    },
    hero: {
      slogan: "Professional Training, Smart Management",
      headline: "Your AI Fitness Partner",
      description: "CoreFit combines advanced AI technology with sports science to create a unique smart training experience. Whether building muscle or burning fat, let data drive your progress.",
      ctaPrimary: "Get Started Free",
      ctaSecondary: "Learn More",
      stats: "Trusted by 10,000+ Professional Users",
    },
    intro: {
      title: "What is CoreFit?",
      description: "CoreFit is a comprehensive fitness management app combining an AI assistant, systematic planning, social features, and professional analytics to support enthusiasts, athletes, and coaches.",
      badges: ["AI Driven", "300+ Exercises", "Workout Tracking", "Coach Tools"],
    },
    features: {
      title: "Powerful Features",
      subtitle: "Everything you need for fitness management, from planning to analytics",
      categories: {
        ai: {
          title: "Specialized AI Virtual Coach",
          items: [
            { iconName: "Bot", title: "AI Tailored Plans", description: "Instantly customize personal training plans based on goals and needs." },
            { iconName: "BrainCircuit", title: "Smart Weight Suggestion", description: "Intelligently suggest weights and reps based on user profile and history." },
            { iconName: "Sparkles", title: "Continuous Personalized Learning", description: "AI continuously analyzes training data to optimize your personal fit." },
          ]
        },
        resources: {
          title: "Rich Training Resources",
          items: [
            { iconName: "Unlock", title: "Unlock All Official Plans", description: "Full access to diverse training plans and courses designed by CoreFit." },
            { iconName: "Dumbbell", title: "300+ Exercise Library", description: "Structured database with step-by-step guides and standard demo videos." },
            { iconName: "Bookmark", title: "Favorites", description: "Bookmark plans and courses to quickly build your training library." },
          ]
        },
        management: {
          title: "Powerful Management",
          items: [
            { iconName: "Calendar", title: "Flexible Planning", description: "Switch routines anytime, freely create and edit personal training plans." },
            { iconName: "ClipboardList", title: "Detailed Logging", description: "Accurately record sets, weights, reps, rest times, and other parameters." },
            { iconName: "WifiOff", title: "Uninterrupted Training", description: "Powerful offline support ensures your training continues even without network connection." },
          ]
        },
        tracking: {
          title: "Analytics & Tracking",
          items: [
            { iconName: "History", title: "Complete Records & Tracking", description: "Keep records available offline and synced to the cloud, preserving full training history and every progress track." },
            { iconName: "BarChart", title: "Multi-dimensional Statistics", description: "Real-time statistics on historical volume, completion rates, PR progress, and other metrics." },
            { iconName: "LineChart", title: "Visualized Data Metrics", description: "Intuitive charts display training progress, comprehensively tracking workout data and body metrics." },
          ]
        },
        social: {
          title: "Social & Sharing",
          items: [
            { iconName: "Users", title: "Train with Friends", description: "Instantly share plans or courses with partners to train together." },
            { iconName: "Heart", title: "Build Community", description: "Easily manage friendships and motivate each other." },
            { iconName: "Share2", title: "Share Achievements", description: "Showcase your personal training achievements and progress." },
          ]
        },
        coach: {
          title: "Pro Coach Tools",
          items: [
            { iconName: "ClipboardList", title: "Client Management", description: "Easily manage client lists and assign exclusive plans." },
            { iconName: "Eye", title: "Progress Tracking", description: "Real-time view of client completion rates and feedback." },
            { iconName: "Briefcase", title: "Template System", description: "Build routine templates and assign to multiple clients quickly." },
          ]
        }
      }
    },
    advantages: {
      title: "Why Choose CoreFit?",
      items: [
        { title: "Scientific Training System", description: "Based on sports science and physiology to ensure every move and plan delivers maximum efficiency." },
        { title: "Real-time AI Adjustment", description: "Unlike fixed schedules, CoreFit's AI dynamically adjusts intensity based on your daily state and fatigue." },
        { title: "Comprehensive Data Insights", description: "From micro-data of single sessions to macro-trends of long-term progress, providing deep analysis reports." }
      ]
    },
    screenshots: {
      title: "Intuitive Interface",
      subtitle: "Simple yet powerful, keeping your focus on the training itself",
      captions: ["Personalized Dashboard", "Smart Training Plan", "Detailed Exercise Guide", "Analytics & Progress", "Community"]
    },
    download: {
      title: "Start Your Smart Training Journey",
      subtitle: "Join CoreFit and make every drop of sweat count.",
      apple: "Download on App Store",
      google: "Get it on Google Play"
    },
    footer: {
      contact: "Contact Us",
      business: "Business",
      social: "Follow Us",
      copyright: "© 2024 CoreFit. All Rights Reserved."
    }
  }
};