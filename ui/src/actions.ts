
export const connect = () => {
    const monitorUrl = import.meta.env.VITE_MONITOR_URL;
    const ws = new WebSocket(monitorUrl);

    ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
      };
  
      ws.onmessage = (event) => {
        const messageData = JSON.parse(event.data);
        setData(messageData); // Update Zustand store with received data
      };
  
      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
      };
  
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
  
      return () => {
        ws.close(); // Clean up the connection on unmount
      };

}
