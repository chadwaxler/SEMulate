export const DEFAULT_OPTIONS: Highcharts.Options = {
  chart: {
    animation: false,
    spacingTop: 0,
    spacingRight: 0,
    spacingBottom: 0,
    spacingLeft: 0,
  },
  credits: {
    enabled: false,
  },
  title: {
    text: undefined,
  },
  yAxis: {
    labels: {
      enabled: false,
    },
    title: {
      text: undefined,
    },
  },
  xAxis: {
    labels: {
      enabled: false,
    },
    title: {
      text: undefined,
    },
  },
  legend: {
    enabled: false,
  },
  series: [
    {
      type: 'line',
      data: [],
    },
  ],
};
