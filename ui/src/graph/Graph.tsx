import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useGraphState } from './graph-state';
import { io } from 'socket.io-client';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { getGraphOptions } from './get-graph-options';


function Graph() {
  const [options, setOptions] = useState(getGraphOptions([]));

  const appendDataPointPerSec = useGraphState((s) => s.appendDataPointPerSec);
  const appendDataPointPerMin = useGraphState((s) => s.appendDataPointPerMin);

  const dataPerSec = useGraphState((s) => s.dataPerSec);
  const dataPerMin = useGraphState((s) => s.dataPerMin);

  const [timeSliceType, setTimeSliceType] = useState<'second' | 'minute'>('second');

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

  useEffect(() => {
    if (timeSliceType === 'second') {
      setOptions(getGraphOptions(dataPerSec));
    }
    setOptions(getGraphOptions(dataPerMin))
  }, [dataPerSec, dataPerMin, timeSliceType]);

  return (
    <div style={{ padding: '0px 20px' }}>
      <Typography variant="h3">BTC to USD price chart</Typography>
      <Box         style={{ padding: '30px 0 0 0' }} display={'flex'}  alignItems="center" gap={2} justifyContent="flex-end">
      <Typography
        variant="body1"
      >
        Price of the last trade for every
      </Typography>
      <Select
          labelId="time-slice-select"
          value={timeSliceType}
          onChange={(e) => setTimeSliceType(e.target.value as 'second' | 'minute')}
        >
          <MenuItem value={'second'}>Second</MenuItem>
          <MenuItem value={'minute'}>Minute</MenuItem>
        </Select>
      </Box>

      <ReactECharts
        option={options}
        style={{ height: '400px', width: '100%' }}
      />
    </div>
  );
}

export default Graph;
