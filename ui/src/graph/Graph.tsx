import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useGraphState } from './graph-state';
import { io } from 'socket.io-client';
import { Typography } from '@mui/material';

function getOptions(data: Array<[number, number]>) {
  return {
    grid: {
      top: 30,
      left: 50,
      right: 0,
      bottom: 30,
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'BTC',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data,
      },
    ],
  };
}

function Graph() {
  const [options, setOptions] = useState(getOptions([]));

  const appendDataPointPerSec = useGraphState((s) => s.appendDataPointPerSec);
  const appendDataPointPerMin = useGraphState((s) => s.appendDataPointPerMin);

  const dataPerSec = useGraphState((s) => s.dataPerSec);
  const dataPerMin = useGraphState((s) => s.dataPerMin);

  const [timeSliceType, setTimeSliceType] = useState('seconds');

  useEffect(() => {
    const monitorUrl = import.meta.env.VITE_MONITOR_URL;

    // Connect to your Socket.IO server
    const socket = io(monitorUrl);

    // Listen for connection events
    socket.on('connect', () => {
      console.log(`Connected with id: ${socket.id}`);
    });

    // Listen for custom events
    socket.on('last-trade-price-per-sec-btc', (tradePrice) => {
      console.log('Last second trade price:', tradePrice);
      const dataPoint = [tradePrice.timestamp, tradePrice.price] as [
        number,
        number,
      ];
      appendDataPointPerSec(dataPoint);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.on('connect_error', (e) => {
      console.error(`SyntheticTradeSender connect_error: ${e}`);
      console.error(
        `SyntheticTradeSender will attempt to reconnect: ${socket.active}`,
      );
    });
  }, [appendDataPointPerSec]);

  useEffect(() => {
    if (timeSliceType === 'seconds') {
      console.log('---herexx');
      console.log(dataPerSec);
      setOptions(getOptions(dataPerSec));
    }
  }, [dataPerSec, dataPerMin, timeSliceType]);

  return (
    <div style={{ padding: '0px 20px' }}>
      <Typography variant="h3">BTC to USD price chart</Typography>
      <Typography
        variant="body1"
        align="right"
        style={{ padding: '30px 0 0 0' }}
      >
        Price of the last trade for every second/minute
      </Typography>
      <ReactECharts
        option={options}
        style={{ height: '400px', width: '100%' }}
      />
    </div>
  );
}

export default Graph;
