# 🚀 Hướng dẫn Deploy Backend lên Render

## 📋 Yêu cầu trước khi deploy

1. **Tài khoản Render**: Đăng ký tại [render.com](https://render.com)
2. **Database**: Sử dụng Neon PostgreSQL (đã có sẵn)
3. **Cloudinary**: Để upload ảnh
4. **Git Repository**: Code đã được push lên GitHub

## 🔧 Bước 1: Chuẩn bị Backend

### 1.1 Cập nhật biến môi trường
Tạo file `.env` với các biến sau:

```env
# Database Configuration
DATABASE_URL=your_neon_database_url_here
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# Server Configuration
PORT=3000
NODE_ENV=production

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Client URL
CLIENT_URL=https://your-frontend-domain.com
```

### 1.2 Kiểm tra scripts trong package.json
```json
{
  "scripts": {
    "build": "tsc",
    "start:prod": "node dist/server.js",
    "postinstall": "npm run build"
  }
}
```

## 🌐 Bước 2: Deploy lên Render

### 2.1 Đăng nhập Render
- Truy cập [render.com](https://render.com)
- Đăng nhập bằng GitHub account

### 2.2 Tạo Web Service mới
1. Click **"New +"** → **"Web Service"**
2. Kết nối với GitHub repository
3. Chọn repository `chat_app-back-end`

### 2.3 Cấu hình Service

**Basic Settings:**
- **Name**: `chat-app-backend` (hoặc tên bạn muốn)
- **Environment**: `Node`
- **Region**: Chọn gần nhất với user của bạn
- **Branch**: `main` (hoặc branch chính)

**Build & Deploy:**
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm run start:prod`
- **Plan**: `Free` (để test) hoặc `Starter` ($7/tháng)

### 2.4 Cấu hình Environment Variables

Thêm các biến môi trường sau:

| Key | Value | Description |
|-----|-------|-------------|
| `NODE_ENV` | `production` | Môi trường production |
| `PORT` | `10000` | Port Render sử dụng |
| `DATABASE_URL` | `your_neon_url` | URL database Neon |
| `JWT_SECRET` | `your_secret` | Secret key cho JWT |
| `CLOUDINARY_CLOUD_NAME` | `your_cloud_name` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | `your_api_key` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | `your_api_secret` | Cloudinary API secret |
| `CLIENT_URL` | `https://your-frontend.com` | URL frontend |

### 2.5 Deploy
1. Click **"Create Web Service"**
2. Render sẽ tự động build và deploy
3. Chờ quá trình hoàn thành (khoảng 5-10 phút)

## 🔍 Bước 3: Kiểm tra và Test

### 3.1 Kiểm tra Health Check
- Truy cập URL Render được cung cấp
- Kiểm tra endpoint `/` có trả về `{"message": "Server đang hoạt động!"}`

### 3.2 Test API Endpoints
Sử dụng Postman hoặc curl để test:
```bash
# Test server
curl https://your-app.onrender.com/

# Test user endpoint
curl https://your-app.onrender.com/user
```

### 3.3 Kiểm tra Logs
- Vào **"Logs"** tab trong Render dashboard
- Kiểm tra có lỗi gì không

## 🚨 Xử lý lỗi thường gặp

### Lỗi Build
- Kiểm tra TypeScript compilation
- Đảm bảo tất cả dependencies đã được cài đặt

### Lỗi Database Connection
- Kiểm tra `DATABASE_URL` có đúng không
- Đảm bảo Neon database đang hoạt động

### Lỗi Port
- Render sử dụng port `10000` mặc định
- Đảm bảo `PORT` trong env được set đúng

## 🔄 Auto Deploy

Render sẽ tự động deploy mỗi khi bạn push code lên GitHub. Để tắt:
- Vào **"Settings"** → **"Build & Deploy"**
- Tắt **"Auto-Deploy"**

## 📱 Cập nhật Frontend

Sau khi deploy backend thành công, cập nhật frontend để sử dụng URL mới:

```typescript
// Thay đổi BASE_URL trong frontend
const BASE_URL = 'https://your-app.onrender.com';
```

## 🎉 Hoàn thành!

Backend của bạn đã được deploy thành công lên Render. URL sẽ có dạng:
`https://your-app-name.onrender.com`

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra logs trong Render dashboard
2. Kiểm tra biến môi trường
3. Test local trước khi deploy
4. Tham khảo [Render Documentation](https://render.com/docs) 