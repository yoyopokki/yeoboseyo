export type MessageAuthor = 'me' | 'them';

export interface Message {
  id: number;
  userId: number;
  text: string;
  time: string;
  from: MessageAuthor;
}
