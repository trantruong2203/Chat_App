import './App.css'
import './components/ResponsiveLayout.css'
import './components/MobileComponents.css'
import './components/DarkMode.css'
import { useContext } from 'react';
import { ContextAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './hooks/useTheme';
import AuthRouter from './routers/AuthRouter';
import Home from './pages/Home.js';
import { ConfigProvider, theme } from 'antd';
import 'antd/dist/reset.css';
import Loading from './components/Loading';

// Theme Yahoo với màu tím đặc trưng
const yahooTheme = {
  token: {
    colorPrimary: '#7206f7',
    colorPrimaryHover: '#5a05c7',
    colorPrimaryActive: '#4a04a7',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#f8f9fa',
    colorBorder: '#e1e5e9',
    colorText: '#1a1a1a',
    colorTextSecondary: '#666666',
    borderRadius: 8,
    fontSize: 14,
  },
  components: {
    Layout: {
      colorBgHeader: '#7206f7',
      colorBgSider: '#7206f7',
    },
    Menu: {
      colorItemBg: 'transparent',
      colorItemBgSelected: '#ffffff',
      colorItemText: '#ffffff',
      colorItemTextSelected: '#7206f7',
    },
    Button: {
      borderRadius: 6,
    },
    Input: {
      borderRadius: 6,
    },
  },
};

// Dark theme
const yahooDarkTheme = {
  token: {
    colorPrimary: '#7206f7',
    colorPrimaryHover: '#5a05c7',
    colorPrimaryActive: '#4a04a7',
    colorBgContainer: '#0f0f0f',
    colorBgElevated: '#1a1a1a',
    colorBgLayout: '#0f0f0f',
    colorBorder: '#404040',
    colorBorderSecondary: '#2a2a2a',
    colorText: '#ffffff',
    colorTextSecondary: '#b0b0b0',
    colorTextTertiary: '#808080',
    colorBgTextHover: '#2d2d2d',
    colorBgTextActive: '#2d2d2d',
    borderRadius: 8,
    fontSize: 14,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    boxShadowSecondary: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  components: {
    Layout: {
      colorBgHeader: '#7206f7',
      colorBgSider: '#7206f7',
      colorBgTrigger: '#7206f7',
    },
    Menu: {
      colorItemBg: 'transparent',
      colorItemBgSelected: '#ffffff',
      colorItemText: '#ffffff',
      colorItemTextSelected: '#7206f7',
      colorSubItemBg: 'transparent',
    },
    Button: {
      borderRadius: 6,
      colorBgContainer: '#2a2a2a',
      colorBorder: '#404040',
      colorText: '#ffffff',
    },
    Input: {
      borderRadius: 6,
      colorBgContainer: '#2a2a2a',
      colorBorder: '#404040',
      colorText: '#ffffff',
    },
    Card: {
      colorBgContainer: '#1f1f1f',
      colorBorder: '#404040',
    },
    Modal: {
      colorBgElevated: '#1f1f1f',
      colorBgMask: 'rgba(0, 0, 0, 0.7)',
    },
    Tooltip: {
      colorBgSpotlight: '#1f1f1f',
      colorTextLightSolid: '#ffffff',
    },
  },
  algorithm: theme.darkAlgorithm,
};

function AppContent() {
  const { accountLogin, isLoading } = useContext(ContextAuth);
  const { themeMode } = useTheme();
  
  // Hiển thị loading khi đang kiểm tra authentication
  if (isLoading) {
    return (
      <ConfigProvider theme={themeMode === 'dark' ? yahooDarkTheme : yahooTheme}>
        <Loading message="Đang kiểm tra đăng nhập..." fullScreen={true} />
      </ConfigProvider>
    );
  }
  
  return (
    <ConfigProvider theme={themeMode === 'dark' ? yahooDarkTheme : yahooTheme}>
      {accountLogin ? <Home/> : <AuthRouter />}
    </ConfigProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
