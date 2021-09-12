import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import { useRate } from './RateContext';
import dayjs from 'dayjs';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles({
  error: {
    color: '#e44e4e',
  },
  depositContext: {
  },
});

export default function RobotSalary() {
  const classes = useStyles();
  const { getValue, shiftStart, shiftEnd } = useRate();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const startDate = dayjs(shiftStart, 'YYYY-MM-DDTHH:mm:ss')
    const endDate = dayjs(shiftEnd, 'YYYY-MM-DDTHH:mm:ss')
    if (startDate.isAfter(endDate)) {
      setHasError(true);
    }
  }, [shiftStart, shiftEnd])

  const getText = () => {
    const startDate = dayjs(shiftStart, 'YYYY-MM-DDTHH:mm:ss')
    const endDate = dayjs(shiftEnd, 'YYYY-MM-DDTHH:mm:ss')
    if (startDate.isAfter(endDate)) {
      return "Invalid Input"
    }
    return getValue();
  }
  return (
    <>
      <Title>Robot Salary:</Title>
      <Typography component="p" variant="h4">
        {getText()}
      </Typography>
      <Typography color="textSecondary" className={hasError ? classes.error : classes.depositContext}>
        From {new Date(shiftStart).toDateString()}
      </Typography>
      <Typography color="textSecondary" className={hasError ? classes.error : classes.depositContext}>
        to {new Date(shiftEnd).toDateString()}
      </Typography>
    </>
  );
}
