import * as signalR from "@microsoft/signalr";

let connection = null;

export function getNotificationConnection(accessToken) {
  if (connection) return connection;

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("VITE_API_BASE_URL is not defined");
  }

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${baseUrl}/hubs/notifications`, {
      accessTokenFactory: () => accessToken ?? "",
      withCredentials: true, // for SignalR + CORS
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000])
    .configureLogging(signalR.LogLevel.Information)
    .build();

  // lifecycle logs
  connection.onclose((error) => {
    console.warn("SignalR connection closed", error);
  });

  connection.onreconnecting((error) => {
    console.warn("SignalR reconnecting", error);
  });

  connection.onreconnected(() => {
    console.info("SignalR reconnected");
  });

  return connection;
}

export async function startNotificationConnection(accessToken) {
  const conn = getNotificationConnection(accessToken);

  // Do not call start() again if it's already connected or in the process
  if (
    conn.state === signalR.HubConnectionState.Connected ||
    conn.state === signalR.HubConnectionState.Connecting ||
    conn.state === signalR.HubConnectionState.Reconnecting
  ) {
    return conn;
  }

  try {
    await conn.start();
    console.log("✅ SignalR connected");
  } catch (err) {
    console.error("❌ SignalR connection error", err);
    throw err;
  }

  return conn;
}
