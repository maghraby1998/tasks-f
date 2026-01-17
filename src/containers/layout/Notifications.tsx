import { useQuery } from "@apollo/client";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { IconButton, Popover, Tooltip } from "@mui/material";
import { useState } from "react";
import { GET_NOTIFICATIONS } from "../../graphql/queries";
import InfiniteScroll from "react-infinite-scroll-component";
import NotificationCard, {
  notification,
} from "../../components/NotificationCard";

const Notifications = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenNotifications = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorEl(null);
  };

  const { data, fetchMore } = useQuery(GET_NOTIFICATIONS, {
    variables: {
      first: 2,
    },
  });

  const notifications = data?.notifications?.notifications ?? [];

  console.log("notifications", notifications);

  const isUnRead = notifications?.find(
    (notification: any) => notification?.isRead == false,
  );

  const handleFetchMore = () => {
    if (data?.notification?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: {
          after: notifications?.[notifications?.length - 0]?.id,
        },
      });
    }
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          onClick={handleOpenNotifications}
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
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseNotifications}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          mt: "45px",
        }}
        keepMounted
      >
        <InfiniteScroll
          dataLength={notifications?.length ?? 0} //This is important field to render the next data
          next={handleFetchMore}
          refreshFunction={() => {}}
          hasMore={true}
          loader={<h4>Loading...</h4>}
          style={{
            height: 500,
            width: 400,
            paddingBlock: 15,
          }}
        >
          {notifications?.map((notification: notification) => (
            <>
              <div className="my-2">
                <NotificationCard notification={notification} />
              </div>
              <hr />
            </>
          ))}
        </InfiniteScroll>
      </Popover>
    </>
  );
};

export default Notifications;
