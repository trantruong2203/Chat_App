export  interface UserResponse {
  id: number;
  email: string;
  avatar: string;
  password: string;
  confirm: string;
  username: string;
  phone: string;
  gender: string;
  birthday: string;
  agreement: boolean;
  status: number;
};
export interface LoginResponse {
  username: string;
  avatar: string;
  gender: string;
  birthday: string;
  phone: string;
  agreement: boolean;
  email: string;
  password: string;
  confirm: string;
  status: number;
};

export interface LoginRequest {
  email: string;
  password: string;
};

export interface FriendShip {
  id: number;
  userid: number;
  sentat: number;
  status: number;
};

export interface Message {
  id: number;
  senderid: number;
  groupid: number | null;
  receiverid: number | null;
  content: string;
  sentat: string;
  status: number;
  messageid: number;
};

export interface ChatGroup {
  id: number;
  name: string;
  avatar: string;
  creatorid: number;
  createdat: string;
  status: number;
};

export interface GroupMember {
  id: number;
  groupid: number;
  userid: number;
  joinedat: string;
  roleid: number;
};

export interface Post {
  id: number;
  userid: number;
  content: string;
  createdat: string;
  status: number;
};

export interface FavoritePost {
  id: number;
  userid: number;
  postid: number;
  createdat: string;
  iconid: number | null;
};

export interface PostImage {
  id: number;
  postid: number;
  imgurl: string;
};