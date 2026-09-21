export interface Notification {
  _id: string;
  type: 'application' | 'consent' | 'verification' | 'document';
  title: string;
  message: string;
  applicationId?: string;
  read: boolean;
  createdAt: string;
}
