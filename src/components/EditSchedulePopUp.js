import React, { useState, useEffect } from "react";
import "../assets/styles/popup.css";
import dayjs from "dayjs";
import supabase from "../config/supabaseClient";
import ScheduleModifier from "./ScheduleModifier";

const EditSchedulePopUp = ({ handleEditSchedClick, token, scheduleID, id }) => {

    /** ensure one click for save button */
    const [openOverlay, setOpenOverlay]=useState(false);

    const [day, setDay] = useState([]);
    const [timeIn, setSchedFrom] = useState('');
    const [timeOut, setSchedTo] = useState('');
    /** */


    const [courseName, setCourseName] = useState('')
    const [description, setDescription] = useState('')
    const [roomNumber, setRoomNumber] = useState('')
    const [userID, setUserID] = useState(token.user.id)

    useEffect(() => {
        const fetchSchedule = async () => {
            const { data, error } = await supabase
                .from('schedule')
                .select()
                .eq('scheduleID', scheduleID)
                .single()

            if (error) {

            } else if (data) {
                setCourseName(data.courseName)
                setDescription(data.description)
                setRoomNumber(data.roomNumber)
                setSchedFrom(militaryTimeToDayjs(data.timeIn)); // Convert military time to dayjs
                setSchedTo(militaryTimeToDayjs(data.timeOut)); // Convert military time to dayjs
            }
        }

        const fetchData = async () => {
            const { data, error } = await supabase
                .from('daysofweek')
                .select()
                .single()
                .eq('id', id)

            if (data) {
                setDay(data.name)
            }
        };

        fetchData();
        fetchSchedule()
    }, [scheduleID])

    const militaryTimeToDayjs = (militaryTime) => {
        const [hours, minutes] = militaryTime.split(':').map(Number);
        return dayjs().hour(hours).minute(minutes).second(0);
    };

    const handleSave = async (e) => {
        setOpenOverlay(true);
        e.preventDefault()
        const militaryTimeIn = timeIn.format('HH:mm:ss');
        const militaryTimeOut = timeOut.format('HH:mm:ss');

        const { data, error } = await supabase
            .from('schedule')
            .update([{ day, courseName, roomNumber, description, timeIn: militaryTimeIn, timeOut: militaryTimeOut }])
            .eq('scheduleID', scheduleID)
            .select()

        if (data) {
            window.location.reload()
        }else{
            setOpenOverlay(false);
        }
    }
    return (
        <div className="popup-container-overlay">
            <div className="popup-container">
                <div className="popup-header">
                    <h2>Edit Schedule (for {day}s)</h2>
                </div>
                <ScheduleModifier
                    token={token}
                    timeIn={timeIn} setSchedFrom={setSchedFrom}
                    timeOut={timeOut} setSchedTo={setSchedTo}
                    courseName={courseName} setCourseName={setCourseName}
                    description={description} setDescription={setDescription}
                    roomNumber={roomNumber} setRoomNumber={setRoomNumber}
                />
                <div className="popup-btn">
                    <button onClick={handleSave}>SAVE</button>
                    <button
                        onClick={handleEditSchedClick}>
                        CANCEL
                    </button>
                </div>
            </div>
            {openOverlay && (
                <div className="one-click-overlay">
                    <p>Please wait...</p>
                </div>
            )}
        </div>
    )
}

export default EditSchedulePopUp;