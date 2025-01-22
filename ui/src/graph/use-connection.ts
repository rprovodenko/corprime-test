import { useEffect, useState } from 'react';
import { useGraphState } from './graph-state';
import { io } from 'socket.io-client';

export const useConnection = () => {
  const appendDataPointPerSec = useGraphState((s) => s.appendDataPointPerSec);
  const appendDataPointPerMin = useGraphState((s) => s.appendDataPointPerMin);

  useEffect(() => {
    const monitorUrl = import.meta.env.VITE_MONITOR_URL;

    // Connect to your Socket.IO server
    const socket = io(monitorUrl);

    // Listen for connection events
    socket.on('connect', () => {
      console.info(`Connected with id: ${socket.id}`);
    });

    // Listen for custom events
    socket.on('last-trade-price-per-sec-btc', (tradePrice) => {
      // console.log('Last second trade price:', tradePrice);
      const dataPoint = [tradePrice.timestamp, tradePrice.price] as [
        number,
        number,
      ];
      appendDataPointPerSec(dataPoint);
    });

    socket.on('last-trade-price-per-min-btc', (tradePrice) => {
      // console.log('Last second trade price:', tradePrice);
      const dataPoint = [tradePrice.timestamp, tradePrice.price] as [
        number,
        number,
      ];
      appendDataPointPerMin(dataPoint);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.info('Disconnected from server');
    });

    socket.on('connect_error', (e) => {
      console.error(`SyntheticTradeSender connect_error: ${e}`);
      console.error(
        `SyntheticTradeSender will attempt to reconnect: ${socket.active}`,
      );
    });
  }, [appendDataPointPerSec, appendDataPointPerMin]);
};
