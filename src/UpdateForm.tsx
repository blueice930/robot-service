import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { useRate } from './RateContext';

const UpdateForm = () => {
  const {
    shiftStart, setShiftStart, shiftEnd, setShiftEnd,
    roboRate, setRoboRate,
  } = useRate();
  const [dayStartH, setDayStartH] = useState(Math.floor(roboRate.standardDayStart/60))
  const [dayStartM, setDayStartM] = useState(Math.floor(roboRate.standardDayStart%60))
  const [dayEndH, setDayEndH] = useState(Math.floor(roboRate.standardDayEnd/60))
  const [dayEndM, setDayEndM] = useState(Math.floor(roboRate.standardDayEnd%60))

  const updateRoboRate = (value: any, key: string) => {
    const result = {...roboRate};
    result[key] = value;
    setRoboRate(result);
  }

  useEffect(() => {
    updateRoboRate(dayStartH * 60 + dayStartM, 'standardDayStart');
    updateRoboRate(dayEndH * 60 + dayEndM, 'standardDayEnd');
  }, [dayEndH, dayEndM, dayStartH, dayStartM])

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Change Robot Rate Info
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            id="shiftStart"
            name="shiftStart"
            label="Shift start time"
            placeholder="Format: yyyy-mm-ddThh:mm:ss"
            fullWidth
            defaultValue={shiftStart}
            onChange={(e) => setShiftStart(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="shiftEnd"
            name="shiftEnd"
            label="Shift end time"
            placeholder="Format: yyyy-mm-ddThh:mm:ss"
            fullWidth
            defaultValue={shiftEnd}
            onChange={(e) => setShiftEnd(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="standardDayStartHour"
            name="standardDayStartHour"
            label="Day start time Hour"
            type="number"
            fullWidth
            defaultValue={dayStartH}
            onChange={(e) => setDayStartH(parseInt(e.target.value))}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="standardDayStartMin"
            name="standardDayStartMin"
            label="Day start time Minute"
            type="number"
            fullWidth
            defaultValue={dayStartM}
            onChange={(e) => setDayStartM(parseInt(e.target.value))}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="standardDayEnHour"
            name="standardDayEnHour"
            label="Day end time Hour"
            type="number"
            fullWidth
            defaultValue={dayEndH}
            onChange={(e) => setDayEndH(parseInt(e.target.value))}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="standardDayEndMin"
            name="standardDayEndMin"
            label="Day end time Minute"
            type="number"
            fullWidth
            defaultValue={dayEndM}
            onChange={(e) => setDayEndM(parseInt(e.target.value))}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="standardDayRate"
            name="standardDayRate"
            label="Standard day rate"
            type="number"
            fullWidth
            defaultValue={roboRate.standardDayRate}
            onChange={(e) => updateRoboRate(e.target.value, 'standardDayRate')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="standardNightRate"
            name="standardNightRate"
            label="Standard Night rate"
            type="number"
            fullWidth
            defaultValue={roboRate.standardNightRate}
            onChange={(e) => updateRoboRate(e.target.value, 'standardNightRate')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="extraDayRate"
            name="extraDayRate"
            label="Extra day rate"
            type="number"
            fullWidth
            defaultValue={roboRate.extraDayRate}
            onChange={(e) => updateRoboRate(e.target.value, 'extraDayRate')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="extraNightRate"
            name="extraNightRate"
            label="Extra night rate"
            type="number"
            fullWidth
            defaultValue={roboRate.extraNightRate}
            onChange={(e) => updateRoboRate(e.target.value, 'extraNightRate')}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default UpdateForm;