const state = {
  liveData: {
      x: (new Date()).getTime(),
      y: null
  },
  linesData: {
      xAxis: [],
      legend: [],
      series: []
  },
  linesxAxisLength: 0,
  testJobCirclesData: [],
  SUTAmountData: [],
  SUTAmountColors: ["#46b8e0", "#ffca52", "#34314b"],
  jobAmountData: [],
  jobAmountColors: ["#cae76e", "#e94e75"],
  jobAmountClickText: ["DONE", "FAILED"],
  testEnvAmountData: [],
  testEnvAmountColors: ["#ea9e9f", "#f9ebc9", "#a89c8e"],
};

export default state