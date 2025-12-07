import Chart from 'react-apexcharts';
import { designTheme } from '../styles/theme';
import { formatTime } from '../shared/timeUtils';
import { TagColorName } from '../styles/emotion';
import { useRef, useState } from 'react';
import { useIsMobile } from '../hooks';

interface IRankingChartProps {
  options: string[];
  series: number[];
  color?: TagColorName;
  isMobile?: boolean;
}
export function RankingChart({
  options,
  series,
  color,
  isMobile,
}: IRankingChartProps) {
  const chartRef = useRef<Chart>(null);
  return (
    <Chart
      ref={chartRef}
      options={{
        xaxis: {
          categories: options,
          tickPlacement: 'on',
          axisBorder: {
            show: true,
            color: color
              ? designTheme.color.tag[color]
              : designTheme.color.primary.primary2,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: isMobile ? false : true,
            style: {
              colors: color
                ? designTheme.color.tag[color]
                : designTheme.color.primary.primary2,
              fontSize: designTheme.fontSize.b2.size,
              fontFamily: 'Pretendard',
            },
          },
        },
        colors: [
          color
            ? designTheme.color.tag[color]
            : designTheme.color.primary.primary2,
        ],
        yaxis: {
          show: isMobile ? true : false,
          axisBorder: {
            show: false,
            width: 1,
            color: color
              ? designTheme.color.tag[color]
              : designTheme.color.primary.primary2,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            style: {
              colors: color
                ? designTheme.color.tag[color]
                : designTheme.color.primary.primary2,
              fontSize: designTheme.fontSize.b2.size,
              fontFamily: 'Pretendard',
            },
          },
        },
        grid: {
          position: 'back',
          padding: {
            top: -20,
            right: 0,
            bottom: 0,
            left: 10,
          },
          show: false,
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
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
          selection: {
            enabled: false,
          },
        },
        stroke: {
          show: false,
        },
        plotOptions: {
          bar: {
            distributed: true,
            borderRadius: 2,
            borderRadiusApplication: 'end',
            columnWidth: '60%',
            horizontal: isMobile ? true : false,
          },
        },
        tooltip: {
          enabled: true,
          theme: 'dark',
          style: {
            fontSize: designTheme.fontSize.b2.size,
            fontFamily: 'Pretendard',
          },
          x: {
            show: false,
          },
          y: {
            title: {
              formatter: (seriesName: string) => {
                return '';
              },
            },
            formatter: (val: number) => {
              return formatTime(Math.floor(val / 60000));
            },
          },
          marker: {
            show: false,
          },
          fixed: {
            enabled: false,
            position: 'topRight',
            offsetX: 0,
            offsetY: 0,
          },
        },
        dataLabels: {
          offsetY: 10,
          enabled: false,
        },
        legend: {
          show: false,
        },
        states: {
          normal: {
            filter: {
              type: 'none',
            },
          },
          hover: {
            filter: {
              type: 'none',
            },
          },
          active: {
            allowMultipleDataPointsSelection: false,
            filter: {
              type: 'none',
            },
          },
        },
        series: [
          {
            data: series,
          },
        ],
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
