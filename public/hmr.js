// adapter from here: https://dev.to/craigmorten/how-to-code-live-browser-refresh-in-deno-309o

(() => {
  let socket = null;
  let reconnectionTimerId = null;

  // Construct the WebSocket url from the current
  // page origin.
  const requestUrl = `${globalThis.window.location.origin.replace(
    "http",
    "ws"
  )}/hmr`;

  // Kick off the connection code on load.
  connect();

  /**
   * Info message logger.
   */
  function log(message) {
    console.info("[refresh] ", message);
  }

  /**
   * Refresh the browser.
   */
  function refresh() {
    globalThis.window.location.reload();
  }

  /**
   * Create WebSocket, connect to the server and
   * listen for refresh events.
   */
  function connect(callback) {
    // Close any existing sockets.
    if (socket) {
      socket.close();
    }

    // Create a new WebSocket pointing to the server.
    socket = new WebSocket(requestUrl);

    // When the connection opens, execute the callback.
    if (callback) {
      socket.addEventListener("open", callback);
    }

    // Add a listener for messages from the server.
    socket.addEventListener("message", (event) => {
      // Check whether we should refresh the browser.
      if (event.data === "refresh") {
        log("refreshing...");
        refresh();
      }
    });

    // Handle when the WebSocket closes. We log
    // the loss of connection and set a timer to
    // start the connection again after a second.
    socket.addEventListener("close", () => {
      log("connection lost - reconnecting...");

      clearTimeout(reconnectionTimerId);

      reconnectionTimerId = globalThis.window.setTimeout(() => {
        // Try to connect again, and if successful
        // trigger a browser refresh.
        connect(refresh);
      }, 20);
    });
  }

  console.log("hmr running");
})();
