import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';
import { useRate } from './RateContext';
import dayjs from 'dayjs';

// Generate Sales Data
function createData(time: any, amount: any) {
  return { time, amount };
}

const Chart = () => {
  const theme = useTheme();

  const { shiftStart, shiftEnd, calcDailyValue } = useRate();

  const getData = () => {
    const data = []
    const start = dayjs(shiftStart, 'YYYY-MM-DDTHH:mm:ss');
    const end = dayjs(shiftEnd, 'YYYY-MM-DDTHH:mm:ss');
    const startTemp = dayjs(start.format('YYYY-MM-DD'), 'YYYY-MM-DD');
    const endTemp = dayjs(end.format('YYYY-MM-DD'), 'YYYY-MM-DD');
    let initStart = shiftStart;
    let initEnd = shiftEnd;
    if (startTemp.format('YYYY-MM-DD') === endTemp.format('YYYY-MM-DD')) {
      data.push(createData(start.format('YYYY-MM-DD'), calcDailyValue(initStart, initEnd)));
      return data;
    }
    for (let i = 0; i < endTemp.diff(startTemp, 'd'); i++) {
      initEnd = start.add(i, 'day').format('YYYY-MM-DDT23:59:00')
      data.push(createData(start.add(i, 'day').format('YYYY-MM-DD'), calcDailyValue(initStart, initEnd)))
      initStart = start.add(i+1, 'day').format('YYYY-MM-DDT00:00:00')
    }
    data.push(createData(end.format('YYYY-MM-DD'), calcDailyValue(initStart, shiftEnd)));
    return data;
  };

  return (
    <>
      <Title>Daily Salary</Title>
      <ResponsiveContainer>
        <LineChart
          data={getData()}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Salary ($)
            </Label>
          </YAxis>
          <Line type="monotone" dataKey="amount" stroke={theme.palette.primary.main} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

export default Chart;
