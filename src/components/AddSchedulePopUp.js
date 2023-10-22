import React, { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";
import "../assets/styles/popup.css";
import ScheduleModifier from "./ScheduleModifier";

const AddSchedulePopUp = ({ id, handleAddClick, token, courseName, setCourseName,
    roomNumber, setRoomNumber,
    description, setDescription,
    timeIn, setSchedFrom,
    timeOut, setSchedTo, userID, setUserID }) => {

    /** ensure one click for save button */
    const [openOverlay, setOpenOverlay]=useState(false);    

    const [day, setDay] = useState([]);
    useEffect(() => {
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
    }, [id]);

    const handleSave = async (e) => {
        setOpenOverlay(true);
        e.preventDefault()
        const militaryTimeIn = timeIn.format('HH:mm:ss');
        const militaryTimeOut = timeOut.format('HH:mm:ss');

        const { data, error } = await supabase
            .from('schedule')
            .insert([{ courseName, description, roomNumber, timeIn: militaryTimeIn, timeOut: militaryTimeOut, userID, day }])
            .single()
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
                    <h2>Add Schedule for {day}s</h2>
                </div>
                <ScheduleModifier day={day} token={token}
                    timeIn={timeIn} setSchedFrom={setSchedFrom}
                    timeOut={timeOut} setSchedTo={setSchedTo}
                    courseName={courseName} setCourseName={setCourseName}
                    description={description} setDescription={setDescription}
                    roomNumber={roomNumber} setRoomNumber={setRoomNumber}
                    userID={userID} setUserID={setUserID}
                />
                <div className="popup-btn">
                    <button onClick={handleSave}>SAVE</button>
                    <button
                        onClick={handleAddClick}>
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

export default AddSchedulePopUp;