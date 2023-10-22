import React, { useState } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import "../assets/styles/popup.css";

const ScheduleModifier = ({ day, courseName, setCourseName,
    roomNumber, setRoomNumber,
    description, setDescription,
    timeIn, setSchedFrom,
    timeOut, setSchedTo,
    userID, setUserID }) => {



    return (
        <div className="schedule-modifier-container">
            <div className="schedule-modifier">
                <label>Title</label>
                <input
                    className="schedule-title"
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    required
                />
                <label>Location/Room Number</label>
                <input
                    className="location"
                    type="number"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    required
                />
                <label>Description</label>
                <textarea
                    className="schedule-notes"
                    rows="5"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />


                <label>Time</label>
                <div className="schedule-time-picker">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div className="timepicker">
                            <TimePicker
                                label="From"
                                value={timeIn}
                                onChange={(newValue) => setSchedFrom(newValue)}
                            />
                        </div>
                        <div className="timepicker">
                            <TimePicker
                                label="To"
                                value={timeOut}
                                onChange={(newValue) => setSchedTo(newValue)}
                            />
                        </div>
                    </LocalizationProvider>
                </div>
            </div>
        </div>
    )

}
export default ScheduleModifier;
