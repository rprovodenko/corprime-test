

export function getGraphOptions(data: Array<[number, number]>) {
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
        large: true,
        largeThreshold: 2000,
        data,
      },
    ],
  };
}
