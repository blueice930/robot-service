class RoboRate {
    //For constructing a new robot rate, which can be used for different kinds of Robots
    constructor(standardDay_start, standardDay_end, standardDay_rate, standardNight_rate, extraDay_rate, extraNight_rate) {
        var a = standardDay_start.split(':'); 
        var b = standardDay_end.split(':'); 
        this.standardDay_start = parseInt(a[0]) * 60 + parseInt(a[1]);
        this.standardDay_end = parseInt(b[0]) * 60 + parseInt(b[1]);
        //Rate:
        this.standardDay_rate = standardDay_rate;
        this.standardNight_rate = standardNight_rate;
        this.extraDay_rate = extraDay_rate;
        this.extraNight_rate = extraNight_rate;
    };

    update(standardDay_start, standardDay_end, standardDay_rate, standardNight_rate, extraDay_rate, extraNight_rate) {
        var a = standardDay_start.split(':'); 
        var b = standardDay_end.split(':'); 
        this.standardDay_start = parseInt(a[0]) * 60 + parseInt(a[1]);
        this.standardDay_end = parseInt(b[0]) * 60 + parseInt(b[1]);
        //Rate:
        this.standardDay_rate = standardDay_rate;
        this.standardNight_rate = standardNight_rate;
        this.extraDay_rate = extraDay_rate;
        this.extraNight_rate = extraNight_rate;
    }
};

var input = { 
    "shift": {
        "start": "2038-01-11T07:00:00", 
        "end": "2038-01-17T19:00:00" 
    }, 
    "roboRate": { 
        "standardDay": { 
            "start": "07:00:00", 
            "end": "23:00:00", 
            "value": 20 
        }, 
        "standardNight": { 
            "start": "23:00:00", 
            "end": "07:00:00", 
            "value": 25 
        }, 
        "extraDay": { 
            "start": "07:00:00", 
            "end": "23:00:00", 
            "value": 30 
        }, 
        "extraNight": { 
            "start": "23:00:00", 
            "end": "07:00:00", 
            "value": 35 
        } 
    }
}

function process_shift(input, roboRate){
    var shift = input['shift'];
    const start_time = new Date(shift['start']);
    const end_time = new Date(shift['end']);
    console.log(`Robot working start_time: ${start_time}, end_time: ${end_time}`);
    var value = 0;

    while(end_time - start_time > 8*60*60*1000){
        new_end_date = new Date();
        new_end_date.setTime(start_time.getTime() + (8*60*60*1000));
        value += calculate_time(start_time, new_end_date, roboRate);
        start_time.setTime(start_time.getTime() + (9*60*60*1000));
    }
    value += calculate_time(start_time, end_time, roboRate);
    return value;
}

function initialize_roboRate(input){
    rate = input['roboRate'];
    roboRate = new RoboRate(
        rate["standardDay"]["start"],
        rate["standardDay"]["end"],
        rate["standardDay"]["value"],
        rate["standardNight"]["value"],
        rate["extraDay"]["value"],
        rate["extraNight"]["value"]
    );
    console.log("Robot Rate initialized", roboRate)
    return roboRate;
}

function calculate_time(start_time, end_time, roboRate){
    var value = 0;
    var s_dayofWeek = start_time.getDay();
    var s_minute = start_time.getMinutes() + 60 * start_time.getHours();

    var e_dayofWeek = end_time.getDay();
    var e_minute = end_time.getMinutes() + 60 * end_time.getHours();

    

    // whether it is weekday or weekend.
    var today_day_rate = ((s_dayofWeek == 0 || s_dayofWeek == 6)? roboRate.extraDay_rate: roboRate.standardDay_rate);
    var today_night_rate = ((s_dayofWeek == 0 || s_dayofWeek == 6)? roboRate.extraNight_rate: roboRate.standardNight_rate);
    var next_day_rate = ((e_dayofWeek == 0 || e_dayofWeek == 6)? roboRate.extraDay_rate: roboRate.standardDay_rate);
    var next_night_rate = ((e_dayofWeek == 0 || e_dayofWeek == 6)? roboRate.extraNight_rate: roboRate.standardNight_rate);

    if(s_dayofWeek == e_dayofWeek)
        if (s_minute <= roboRate.standardDay_start) // crossing 7 am.
            if (e_minute <= roboRate.standardDay_start)
                value += today_night_rate * (e_minute - s_minute);
            else
                value = value + today_night_rate*(roboRate.standardDay_start - s_minute) + today_day_rate * (e_minute - roboRate.standardDay_start);
        else if(e_minute > roboRate.standardDay_end) // crossing 11pm.
            if (s_minute >= roboRate.standardDay_end)
                value += today_night_rate * (e_minute - s_minute);
            else
                value = value + today_night_rate*(roboRate.standardDay_end - e_minute) + today_day_rate * (roboRate.standardDay_end - s_minute);
        else // all day time.
            value += today_day_rate * (e_minute - s_minute);
    else{ //crossing day
        value = ((s_minute > roboRate.standardDay_end) ? (24*60 - s_minute) * today_night_rate : (roboRate.standardDay_end - s_minute) * today_day_rate + (24*60 - roboRate.standardDay_end) * today_night_rate) +
        ((e_minute > roboRate.standardDay_start) ? (e_minute - roboRate.standardDay_start) * next_day_rate + next_night_rate * roboRate.standardDay_start : next_night_rate * e_minute);
    }
    return value;
}

var roboRate = initialize_roboRate(input);
console.log(`Final Values is ${process_shift(input, roboRate)}`);


