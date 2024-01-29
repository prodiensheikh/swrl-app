export interface Task {
  _id: string;
  message: string;
  time: Date;

  status: 'scheduled' | 'completed' | 'errored';
}