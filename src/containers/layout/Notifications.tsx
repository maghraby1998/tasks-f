import { useQuery } from "@apollo/client";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import { GET_NOTIFICATIONS } from "../../graphql/queries";

const Notifications = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const { data, loading } = useQuery(GET_NOTIFICATIONS);

  const isUnRead = data?.notifications?.find(
    (notification: any) => notification?.isRead == false,
  );

  return (
    <Tooltip title="Notifications">
      <IconButton
        onClick={handleOpenUserMenu}
        style={{
          padding: 0,
          height: 30,
          backgroundColor: "#1F2937",
          width: 30,
          position: "relative",
        }}
      >
        {isUnRead ? (
          <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded" />
        ) : null}
        <NotificationsActiveIcon
          style={{
            borderRadius: 9999,
            color: "white",
          }}
          fontSize="small"
        />
      </IconButton>
    </Tooltip>
  );
};

export default Notifications;
