import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import App from './App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#6366f1',
          borderRadius: 10,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          colorBgContainer: '#ffffff',
          colorBorder: '#f3f4f6',
          colorBorderSecondary: '#e5e7eb',
          colorText: '#1f2937',
          colorTextSecondary: '#6b7280',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          boxShadowSecondary: '0 6px 16px rgba(0,0,0,0.06)',
        },
        components: {
          Layout: {
            siderBg: '#1e1b4b',
            headerBg: '#ffffff',
          },
          Menu: {
            darkItemBg: '#1e1b4b',
            darkSubMenuItemBg: '#1e1b4b',
          },

          /* ====== Button ====== */
          Button: {
            contentFontSizeLG: 16,
            fontWeight: 600,
            controlHeight: 38,
            controlHeightLG: 48,
            controlHeightSM: 30,
            defaultBorderColor: '#d1d5db',
            defaultHoverBorderColor: '#6366f1',
            defaultHoverColor: '#6366f1',
            primaryShadow: '0 2px 8px rgba(99,102,241,0.3)',
          },

          /* ====== Card ====== */
          Card: {
            paddingLG: 24,
            borderRadiusLG: 14,
          },

          /* ====== Tag ====== */
          Tag: {
            borderRadiusSM: 8,
            defaultBg: '#f3f4f6',
          },

          /* ====== Input ====== */
          Input: {
            borderRadius: 10,
            activeBorderColor: '#6366f1',
            activeShadow: '0 0 0 3px rgba(99,102,241,0.1)',
            hoverBorderColor: '#a5b4fc',
          },

          /* ====== Select ====== */
          Select: {
            borderRadius: 10,
            optionSelectedBg: '#eef2ff',
            optionActiveBg: '#f5f3ff',
          },

          /* ====== Progress ====== */
          Progress: {
            remainingColor: '#f3f4f6',
          },

          /* ====== List ====== */
          List: {
            itemPadding: '14px 16px',
          },

          /* ====== Slider ====== */
          Slider: {
            handleColor: '#6366f1',
            handleActiveColor: '#4f46e5',
            trackBg: '#6366f1',
            trackHoverBg: '#4f46e5',
          },

          /* ====== Upload ====== */
          Upload: {
            borderRadiusLG: 14,
          },

          /* ====== Tooltip ====== */
          Tooltip: {
            borderRadius: 10,
          },

          /* ====== Drawer ====== */
          Drawer: {
            borderRadiusLG: 16,
          },

          /* ====== Badge ====== */
          Badge: {
            dotSize: 8,
          },
        },
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>,
);
