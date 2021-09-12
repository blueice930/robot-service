import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import { useRate } from './RateContext';

const useStyles = makeStyles({
  depositContext: {
  },
});

export default function RobotSalary() {
  const classes = useStyles();
  const { getValue, shiftStart, shiftEnd } = useRate();
  return (
    <>
      <Title>Robot Salary:</Title>
      <Typography component="p" variant="h4">
        {getValue()}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        From {new Date(shiftStart).toDateString()}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        to {new Date(shiftEnd).toDateString()}
      </Typography>
    </>
  );
}
