export interface User {
  _id: string;
  
  number: string;
  chatId: string;
  isVerified: boolean;
  name?: string;
  email?: string;
}