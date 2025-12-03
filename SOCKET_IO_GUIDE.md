# Socket.IO Guide - Friend Request System

## Tổng quan
Hệ thống sử dụng Socket.IO để xử lý realtime cho việc gửi, chấp nhận, từ chối và hủy lời mời kết bạn.

## Events được hỗ trợ

### 1. Gửi lời mời kết bạn
**Event:** `sendFriendRequest`
**Data:** `FriendShip` object
**Response:** `friendRequestSent` event

```typescript
// Client gửi
socket.emit("sendFriendRequest", {
  id: 1,
  userid: 123,        // ID người gửi
  sentat: 456,        // ID người nhận
  status: 0           // Trạng thái: 0 = pending
});

// Client nhận response
socket.on("friendRequestSent", (response: FriendRequestResponse) => {
  console.log(response.message); // "Đã gửi lời mời kết bạn thành công"
});

// Tất cả client nhận thông báo
socket.on("receiveFriendRequest", (eventData: FriendRequestSocketEvent) => {
  if (eventData.type === "new_request") {
    console.log("Có lời mời kết bạn mới từ:", eventData.senderUser?.username);
  }
});
```

### 2. Chấp nhận lời mời kết bạn
**Event:** `acceptFriendRequest`
**Data:** `FriendShip` object
**Response:** `friendRequestAccepted` event

```typescript
// Client gửi
socket.emit("acceptFriendRequest", {
  id: 1,
  userid: 123,        // ID người gửi lời mời
  sentat: 456,        // ID người chấp nhận
  status: 1           // Trạng thái: 1 = accepted
});

// Client nhận response
socket.on("friendRequestAccepted", (response: FriendRequestResponse) => {
  console.log(response.message); // "Đã chấp nhận lời mời kết bạn thành công"
});

// Tất cả client nhận thông báo
socket.on("friendRequestAccepted", (eventData: FriendRequestSocketEvent) => {
  if (eventData.type === "accepted") {
    console.log("Lời mời kết bạn đã được chấp nhận bởi:", eventData.accepterUser?.username);
  }
});
```

### 3. Từ chối lời mời kết bạn
**Event:** `rejectFriendRequest`
**Data:** `FriendShip` object
**Response:** `friendRequestRejected` event

```typescript
// Client gửi
socket.emit("rejectFriendRequest", {
  id: 1,
  userid: 123,        // ID người gửi lời mời
  sentat: 456,        // ID người từ chối
  status: 2           // Trạng thái: 2 = rejected
});

// Client nhận response
socket.on("friendRequestRejected", (response: FriendRequestResponse) => {
  console.log(response.message); // "Đã từ chối lời mời kết bạn"
});

// Tất cả client nhận thông báo
socket.on("friendRequestRejected", (eventData: FriendRequestSocketEvent) => {
  if (eventData.type === "rejected") {
    console.log("Lời mời kết bạn đã bị từ chối bởi:", eventData.rejecterUser?.username);
  }
});
```

### 4. Hủy lời mời kết bạn
**Event:** `cancelFriendRequest`
**Data:** `FriendShip` object
**Response:** `friendRequestCancelled` event

```typescript
// Client gửi
socket.emit("cancelFriendRequest", {
  id: 1,
  userid: 123,        // ID người gửi (người hủy)
  sentat: 456,        // ID người nhận
  status: 3           // Trạng thái: 3 = cancelled
});

// Client nhận response
socket.on("friendRequestCancelled", (response: FriendRequestResponse) => {
  console.log(response.message); // "Đã hủy lời mời kết bạn"
});

// Tất cả client nhận thông báo
socket.on("friendRequestCancelled", (eventData: FriendRequestSocketEvent) => {
  if (eventData.type === "cancelled") {
    console.log("Lời mời kết bạn đã bị hủy bởi:", eventData.senderUser?.username);
  }
});
```

## Data Structures

### FriendRequestSocketEvent
```typescript
interface FriendRequestSocketEvent {
  type: "new_request" | "accepted" | "rejected" | "cancelled";
  requestId: number;
  senderId: number;
  senderUser?: User;
  receiverId?: number;
  accepterId?: number;
  accepterUser?: User;
  rejecterId?: number;
  rejecterUser?: User;
  sentat: number;
  status: number;
  timestamp: Date;
}
```

### FriendRequestResponse
```typescript
interface FriendRequestResponse {
  success: boolean;
  message: string;
  requestId: number;
}
```

## Trạng thái Friend Request
- `0`: Pending (Chờ phản hồi)
- `1`: Accepted (Đã chấp nhận)
- `2`: Rejected (Đã từ chối)
- `3`: Cancelled (Đã hủy)

## Lưu ý
1. Tất cả events đều emit ra `io.emit()` để tất cả client đều nhận được thông báo
2. Mỗi action đều có response riêng cho người thực hiện
3. Hệ thống tự động lấy thông tin user từ `onlineUsers` map
4. Timestamp được tự động tạo khi xử lý event 