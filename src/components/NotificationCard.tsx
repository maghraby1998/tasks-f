import moment from "moment";
import React from "react";

export interface notification {
  id: number;
  title: string;
  message: string;
  created_at: string;
  isRead: boolean;
}

interface Props {
  notification: notification;
}

const NotificationCard: React.FC<Props> = ({ notification }) => {
  return (
    <div
      style={{
        backgroundColor: notification.isRead ? "#ebebeb" : "unset",
        padding: 10,
      }}
    >
      <p className="font-bold">{notification.title}</p>
      <p className="text-sm text-gray-600">{notification.message}</p>
      <p>{moment(notification.created_at).fromNow()}</p>
    </div>
  );
};

export default NotificationCard;
