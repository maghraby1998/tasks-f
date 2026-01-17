import { useQuery } from "@apollo/client";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { IconButton, Popover, Tooltip } from "@mui/material";
import { useState, useCallback } from "react";
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
      first: 5,
    },
  });

  const notifications = data?.notifications?.notifications ?? [];

  const isUnRead = notifications?.find(
    (notification: any) => notification?.isRead == false,
  );

  const handleFetchMore = useCallback(() => {
    if (data?.notifications?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: {
          after: notifications?.[notifications?.length - 1]?.id,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            notifications: {
              ...fetchMoreResult.notifications,
              notifications: [
                ...prev.notifications.notifications,
                ...fetchMoreResult.notifications.notifications,
              ],
            },
          };
        },
      });
    }
  }, [data?.notifications?.pageInfo?.hasNextPage, notifications, fetchMore]);

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
      >
        <div
          id="scrollableDiv"
          style={{ overflow: "auto", height: 400, width: 400 }}
        >
          <InfiniteScroll
            dataLength={notifications?.length ?? 0}
            next={handleFetchMore}
            hasMore={data?.notifications?.pageInfo?.hasNextPage ?? false}
            loader={<h4 style={{ textAlign: "center" }}>Loading...</h4>}
            scrollableTarget="scrollableDiv"
          >
            {notifications?.length ? (
              notifications?.map((notification: notification, i: number) => (
                <div key={notification.id}>
                  {i != 0 ? <hr /> : null}
                  <div className="my-2">
                    <NotificationCard notification={notification} />
                  </div>
                </div>
              ))
            ) : (
              <p>no notifications yet</p>
            )}
          </InfiniteScroll>
        </div>
      </Popover>
    </>
  );
};

export default Notifications;
