import React, {useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import classes from "./DateRange.module.css";
import "react-datepicker/dist/react-datepicker.css";
import {logDOM} from "@testing-library/react";


const DateRange = ({startDate, endDate, setEndDate, setStartDate, excludedDate, setExcludedDate}) => {
    return (
        <div className={classes.container}>
            <DatePicker
                minDate={new Date("11-28-2019")}
                maxDate={Date.now()}
                calendarStartDay={1}
                dateFormat={'dd/MM/yyyy'}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
            />
            <DatePicker
                maxDate={Date.now()}
                calendarStartDay={1}
                dateFormat={'dd/MM/yyyy'}
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
            />
        </div>
    );
};

export default DateRange
