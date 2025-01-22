import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useGraphState } from './graph-state';
import { Box, MenuItem, Select, Typography } from '@mui/material';
import { getGraphOptions } from './get-graph-options';
import { useConnection } from './use-connection';

function Graph() {
  useConnection();

  const [options, setOptions] = useState(getGraphOptions([]));
  const dataPerSec = useGraphState((s) => s.dataPerSec);
  const dataPerMin = useGraphState((s) => s.dataPerMin);
  const [timeSliceType, setTimeSliceType] = useState<'second' | 'minute'>(
    'second',
  );

  useEffect(() => {
    if (timeSliceType === 'second') {
      setOptions(getGraphOptions(dataPerSec));
    }
    setOptions(getGraphOptions(dataPerMin));
  }, [dataPerSec, dataPerMin, timeSliceType]);

  return (
    <div style={{ padding: '0px 20px' }}>
      <Typography variant="h3">BTC to USD price chart</Typography>
      <Box
        style={{ padding: '30px 0 0 0' }}
        display={'flex'}
        alignItems="center"
        gap={2}
        justifyContent="flex-end"
      >
        <Typography variant="body1">
          Price of the last trade for every
        </Typography>
        <Select
          labelId="time-slice-select"
          value={timeSliceType}
          onChange={(e) =>
            setTimeSliceType(e.target.value as 'second' | 'minute')
          }
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
