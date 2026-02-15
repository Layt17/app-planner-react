export interface NotificationI {
  id: string;
  isDelivered: boolean;
  repetitionInterval: number;
  time: Date;
  text: string;
  status: string;
  ownerAccount: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
