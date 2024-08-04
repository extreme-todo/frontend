import Chart from 'react-apexcharts';

interface IRankingChartProps {
  options: string[];
  series: number[];
}
function RankingChart({ options, series }: IRankingChartProps) {
  return (
    <Chart
      options={{
        xaxis: {
          categories: options,
          tickPlacement: 'on',
        },
        grid: {
          position: 'back',
          padding: {
            top: 10,
          },
        },
        chart: {
          type: 'bar',
          dropShadow: {
            enabled: true,
            top: 0,
            left: 0,
            blur: 5,
            opacity: 0.05,
          },
        },
        theme: {
          palette: 'palette4',
        },
        plotOptions: {
          bar: {
            distributed: true,
            borderRadius: 10,
            borderRadiusApplication: 'end',
            columnWidth: '60%',
            dataLabels: {
              position: 'top',
            },
          },
        },
        dataLabels: {
          offsetY: 10,
        },
        stroke: {
          width: 2,
        },
        legend: {
          show: false,
        },
      }}
      series={[
        {
          data: series,
        },
      ]}
      type="bar"
      height={'100%'}
      width={'100%'}
    />
  );
}

export default RankingChart;
