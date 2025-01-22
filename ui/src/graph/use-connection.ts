import { useEffect } from 'react';
import { useGraphState } from './graph-state';
import { io } from 'socket.io-client';

export const useConnection = () => {
  const appendDataPointsPerSec = useGraphState((s) => s.appendDataPointsPerSec);
  const appendDataPointsPerMin = useGraphState((s) => s.appendDataPointsPerMin);

  useEffect(() => {
    const monitorUrl = import.meta.env.VITE_MONITOR_URL;

    const socket = io(monitorUrl);

    socket.on('connect', () => {
      console.info(`Connected with id: ${socket.id}`);
    });
    const datapointsPerSecBuffer: [number, number][] = [];

    socket.on('last-trade-price-per-sec-btc', (tradePrice) => {
      console.log('Last second trade price:', tradePrice);
      const dataPoint = [tradePrice.timestamp, tradePrice.price] as [
        number,
        number,
      ];
      datapointsPerSecBuffer.push(dataPoint);
    });

    const datapointsPerMinBuffer: [number, number][] = [];

    socket.on('last-trade-price-per-min-btc', (tradePrice) => {
      const dataPoint = [tradePrice.timestamp, tradePrice.price] as [
        number,
        number,
      ];
      datapointsPerMinBuffer.push(dataPoint);
    });

    const batchInterval = setInterval(() => {
      if (datapointsPerSecBuffer.length > 0) {
        appendDataPointsPerSec(datapointsPerSecBuffer.splice(0));
      }
      if (datapointsPerMinBuffer.length > 0) {
        appendDataPointsPerMin(datapointsPerMinBuffer.splice(0));
      }
    }, 20);

    socket.on('disconnect', () => {
      console.info('Disconnected from server');
    });

    socket.on('connect_error', (e) => {
      console.error(`WS connect_error: ${e}`);
      console.error(
        `Will attempt to reconnect: ${socket.active}`,
      );
    });
    return () => {
      clearInterval(batchInterval);
      socket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
