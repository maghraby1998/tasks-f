self.addEventListener("push", (event) => {
  const data = event.data; // Assuming the payload is in JSON format

  const options = {
    body: data.body,
    // icon: '/path/to/your/icon.png',
    data: {
      url: data.link, // Customize the link to open when the notification is clicked
    },
  };

  event.waitUntil(
    self.registration.showNotification(JSON.stringify(event), options)
  );
});

self.addEventListener("notificationclick", (event) => {
  console.log("notify clicked");

  const notificationData = event.notification.data;

  if (notificationData.url) {
    clients.openWindow(notificationData.url);
  }

  event.notification.close();
});
