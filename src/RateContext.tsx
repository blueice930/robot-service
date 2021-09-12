import React, {
  createContext, useCallback, useContext, useState
} from "react";
import { RoboRateType } from "./types";
import defaultInput from './defaultInput.json'

const RateContext = createContext<any>({});
export const useRate = () => useContext(RateContext);

const parseDefaultInput = () => {
  const [startHour, startMin] = defaultInput.roboRate.standardDay.start.split(':');
  const [endHour, endMin] = defaultInput.roboRate.standardDay.end.split(':');
  return {
    standardDayStart: parseInt(startHour) * 60 + parseInt(startMin),
    standardDayEnd: parseInt(endHour) * 60 + parseInt(endMin),
    standardDayRate: defaultInput.roboRate.standardDay.value,
    standardNightRate: defaultInput.roboRate.standardNight.value,
    extraDayRate: defaultInput.roboRate.extraDay.value,
    extraNightRate: defaultInput.roboRate.extraNight.value,
  }
}

export const RateProvider = ({ children }: any) => {
  // Basic Info
  const [shiftStart, setShiftStart] = useState(defaultInput.shift.start);
  const [shiftEnd, setShiftEnd] = useState(defaultInput.shift.end);

  const [roboRate, setRoboRate] = useState<RoboRateType>(parseDefaultInput());

  const calculateTime = (startTime: Date, endTime: Date, roboRate: RoboRateType) => {
    var value = 0;
    var s_dayofWeek = startTime.getDay();
    var s_minute = startTime.getMinutes() + 60 * startTime.getHours();

    var e_dayofWeek = endTime.getDay();
    var e_minute = endTime.getMinutes() + 60 * endTime.getHours();

    // whether it is weekday or weekend.
    var today_dayRate = ((s_dayofWeek === 0 || s_dayofWeek === 6)? roboRate.extraDayRate: roboRate.standardDayRate);
    var today_nightRate = ((s_dayofWeek === 0 || s_dayofWeek === 6)? roboRate.extraNightRate: roboRate.standardNightRate);
    var next_dayRate = ((e_dayofWeek === 0 || e_dayofWeek === 6)? roboRate.extraDayRate: roboRate.standardDayRate);
    var next_nightRate = ((e_dayofWeek === 0 || e_dayofWeek === 6)? roboRate.extraNightRate: roboRate.standardNightRate);

    if(s_dayofWeek === e_dayofWeek)
        if (s_minute <= roboRate.standardDayStart) // crossing 7 am.
            if (e_minute <= roboRate.standardDayStart)
                value += today_nightRate * (e_minute - s_minute);
            else
                value = value + today_nightRate*(roboRate.standardDayStart - s_minute) + today_dayRate * (e_minute - roboRate.standardDayStart);
        else if(e_minute > roboRate.standardDayEnd) // crossing 11pm.
            if (s_minute >= roboRate.standardDayEnd)
                value += today_nightRate * (e_minute - s_minute);
            else
                value = value + today_nightRate*(roboRate.standardDayEnd - e_minute) + today_dayRate * (roboRate.standardDayEnd - s_minute);
        else // all day time.
            value += today_dayRate * (e_minute - s_minute);
    else{ //crossing day
        value = ((s_minute > roboRate.standardDayEnd) ? (24*60 - s_minute) * today_nightRate : (roboRate.standardDayEnd - s_minute) * today_dayRate + (24*60 - roboRate.standardDayEnd) * today_nightRate) +
        ((e_minute > roboRate.standardDayStart) ? (e_minute - roboRate.standardDayStart) * next_dayRate + next_nightRate * roboRate.standardDayStart : next_nightRate * e_minute);
    }
    return value;
  }

  const getValue = useCallback(() => {
    const startTime = new Date(shiftStart);
    const endTime = new Date(shiftEnd);
    console.log(`Robot working start: ${startTime}, end: ${endTime}`);
    let result = 0;

    while(endTime.getTime() - startTime.getTime() > 8*60*60*1000){
        let newEndDate = new Date();
        newEndDate.setTime(startTime.getTime() + (8*60*60*1000));
        result += calculateTime(startTime, newEndDate, roboRate);
        startTime.setTime(startTime.getTime() + (9*60*60*1000));
    }
    result += calculateTime(startTime, endTime, roboRate);
    return result;
  }, [shiftStart, shiftEnd, roboRate]);

  const calcDailyValue = useCallback((sTime: string, eTime: string) => {
    const startTime = new Date(sTime);
    const endTime = new Date(eTime);
    let result = 0;

    while(endTime.getTime() - startTime.getTime() > 8*60*60*1000){
        let newEndDate = new Date();
        newEndDate.setTime(startTime.getTime() + (8*60*60*1000));
        result += calculateTime(startTime, newEndDate, roboRate);
        startTime.setTime(startTime.getTime() + (9*60*60*1000));
    }
    result += calculateTime(startTime, endTime, roboRate);
    return result;
  }, [])
  
  const value = {
    getValue,
    calcDailyValue,
    shiftStart,
    shiftEnd,
    roboRate,
    setShiftStart,
    setShiftEnd,
    setRoboRate,
  };

  return (
    <RateContext.Provider value={value}>
      {children}
    </RateContext.Provider>
  )
}
