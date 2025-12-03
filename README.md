# Chat App Frontend

Ứng dụng chat với giao diện hiện đại và hỗ trợ Dark Mode.

## Tính năng

- **Dark Mode**: Hỗ trợ chuyển đổi giữa Light và Dark theme
- **Responsive Design**: Giao diện thích ứng với mọi thiết bị
- **Real-time Chat**: Chat real-time với Socket.IO
- **Authentication**: Hệ thống đăng nhập/đăng ký
- **Modern UI**: Sử dụng Ant Design với theme tùy chỉnh

## Dark Mode

### Cách sử dụng

1. **Chuyển đổi theme**: Click vào nút theme toggle (☀️/🌙) trên navbar
2. **Lưu trữ**: Theme được lưu vào localStorage và tự động áp dụng khi reload
3. **System preference**: Tự động detect theme của hệ thống nếu chưa có lựa chọn

### CSS Variables

Dark mode sử dụng CSS variables để quản lý màu sắc:

```css
:root {
  /* Light mode variables */
  --yahoo-bg: #ffffff;
  --yahoo-bg-secondary: #f8f9fa;
  --yahoo-text: #1a1a1a;
  --yahoo-border: #e1e5e9;
  /* ... */
}

.dark {
  /* Dark mode variables */
  --yahoo-bg: #0f0f0f;
  --yahoo-bg-secondary: #1a1a1a;
  --yahoo-text: #ffffff;
  --yahoo-border: #404040;
  /* ... */
}
```

### Components hỗ trợ

- ✅ Navbar
- ✅ Main chat area
- ✅ Cards và modals
- ✅ Input fields
- ✅ Buttons
- ✅ Menu items
- ✅ Tooltips

## Cài đặt

```bash
npm install
```

## Chạy ứng dụng

```bash
npm run dev
```

## Cấu trúc dự án

```
src/
├── components/          # UI components
│   ├── ThemeToggle.tsx  # Nút chuyển đổi theme
│   └── DarkMode.css    # CSS cho dark mode
├── contexts/
│   └── ThemeContext.tsx # Context quản lý theme
├── hooks/
│   └── useTheme.ts     # Hook sử dụng theme
└── index.css           # CSS chính với variables
```

## Theme System

### Light Mode
- Background: Trắng (#ffffff)
- Text: Đen (#1a1a1a)
- Borders: Xám nhạt (#e1e5e9)
- Shadows: Nhẹ với độ trong suốt thấp

### Dark Mode
- Background: Đen sẫm (#0f0f0f)
- Text: Trắng (#ffffff)
- Borders: Xám đậm (#404040)
- Shadows: Đậm với độ trong suốt cao

## Tùy chỉnh

Để thay đổi màu sắc, chỉnh sửa CSS variables trong `src/index.css` và `src/components/DarkMode.css`.

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+
