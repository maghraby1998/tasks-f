self.addEventListener("push", (event) => {
  console.log("push");
  const data = event.data.json(); // Assuming the payload is in JSON format

  const options = {
    body: data.body,
    // icon: '/path/to/your/icon.png',
    data: {
      url: data.link, // Customize the link to open when the notification is clicked
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  console.log("notify clicked");

  const notificationData = event.notification.data;

  if (notificationData.url) {
    clients.openWindow(notificationData.url);
  }

  event.notification.close();
});
