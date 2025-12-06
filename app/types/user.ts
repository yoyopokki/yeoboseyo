export type UserStatus = 'online' | 'offline';

export interface User {
  id: number;
  name: string;
  email?: string;
  status?: UserStatus;
}

export interface CallRoomUser {
  id: string | number;
  name: string | null;
  email?: string | null;
  picture?: string | null;
  status?: UserStatus;
}
