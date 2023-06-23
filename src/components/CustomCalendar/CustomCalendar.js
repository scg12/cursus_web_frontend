import React, { useState } from "react";
import Calendar from "react-calendar";
//import 'react-calendar/dist/Calendar.css';
import classes from './CustomCalendar.module.css'

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

function CustomCalendar(props) {
  const [value, onChange] = useState(new Date());
    return (
    <div className={classes.calendarStyle} >
        <Calendar value={value} onChange={onChange} />
    </div>
  );
};
export default CustomCalendar;