import React, { useEffect, useState } from "react";
import "../assets/styles/profile.css";
import supabase from "../config/supabaseClient";
import dayjs from "dayjs";

import { HiPencil, HiTrash } from "react-icons/hi";
import { MdSave } from "react-icons/md";
import { IoChevronBackOutline } from "react-icons/io5";
import AddSchedulePopUp from "./AddSchedulePopUp";
import EditSchedulePopUp from "./EditSchedulePopUp";
import MoveToTrash from "./MoveToTrash";

const Schedule = ({ token }) => {
    const [editMode, setEditMode] = useState(false);
    const [addSched, setAddSched] = useState(false);
    const [editSched, setEditSched] = useState(false);
    const [moveToTrash, setMoveToTrash] = useState(false);
    const [schedule, setSchedule] = useState([]);
    const [days, setDays] = useState([]);
    const [selectedDayOfWeekId, setSelectedDayOfWeekId] = useState(null);
    const [scheduleToDelete, setScheduleToDelete] = useState(null);

    const [timeIn, setSchedFrom] = React.useState(dayjs('2022-04-17T15:30'));
    const [timeOut, setSchedTo] = React.useState(dayjs('2022-04-17T15:30'));
    const [courseName, setCourseName] = useState('')
    const [description, setDescription] = useState('')
    const [roomNumber, setRoomNumber] = useState('')
    const [userID, setUserID] = useState(token.user.id)

    const handleEditClick = () => {
        setEditMode(true);
    };
    /** Edit Mode Off */
    const handleCancelClick = () => {
        setEditMode(false);

    }

    /**
     * const handleInputChange = async (e) => {
        
    }
     */

    /** Add and Modify Schedule Pop Up */
    const handleAddClick = (daysofweekId) => {
        setSelectedDayOfWeekId(daysofweekId);
        setAddSched(!addSched);
        setSchedFrom(dayjs('2022-04-17T15:30'))
        setSchedTo(dayjs('2022-04-17T15:30'))
        setCourseName("")
        setDescription("")
        setRoomNumber("")
        setRoomNumber("")
    }

    const handleEditSchedClick = (scheduleID, daysofweekId) => {
        setScheduleToDelete(scheduleID);
        setSelectedDayOfWeekId(daysofweekId);
        setEditSched(!editSched);
    }

    /** Move Schedule to Trash */
    const handleTrashClick = (scheduleID) => {
        setScheduleToDelete(scheduleID);
        setMoveToTrash(!moveToTrash);
    }

    useEffect(() => {
        const fetchSchedule = async () => {
            const { data, error } = await supabase
                .from('schedule')
                .select()
                .eq('userID', token.user.id)

            if (data) {
                setSchedule(data);
            }
        }
        const fetchDays = async () => {
            const { data, error } = await supabase
                .from("daysofweek")
                .select();

            if (data) {
                setDays(data);
            }
        };

        fetchSchedule();
        fetchDays();
    }, [token.user.id])

    return (
        <div className="profile-details-wrapper">
            <div className="profile-details-header">
                {editMode ? (
                    <>
                        <button
                            className="profile-edit-save-btn"
                            onClick={handleCancelClick}>
                            <IoChevronBackOutline />
                        </button>
                        <h2>Edit Daily Schedule</h2>
                        <button
                            className="profile-edit-save-btn"
                                    /*onClick={handleInputChange}*/>
                            <MdSave />
                        </button>
                    </>

                ) : (
                    <>
                        <h2>Your Daily Schedule</h2>
                        <button
                            className="profile-edit-save-btn"
                            onClick={handleEditClick}>
                            <HiPencil size={20} />
                        </button>
                    </>
                )}
            </div>

            {/** Details */}
            <div className="profile-details">
                {editMode ? (
                    <>
                        {days
                            .map((daysofweek) => (
                                <div key={daysofweek.id} className="schedule-container-item">
                                    <div className="schedule-details-header">
                                        <h3>{daysofweek.name}</h3>
                                        <button onClick={() => handleAddClick(daysofweek.id)}>Add +</button>
                                        {
                                            addSched && (
                                                <AddSchedulePopUp
                                                    handleAddClick={handleAddClick}
                                                    token={token}
                                                    id={selectedDayOfWeekId}
                                                    timeIn={timeIn} setSchedFrom={setSchedFrom}
                                                    timeOut={timeOut} setSchedTo={setSchedTo}
                                                    courseName={courseName} setCourseName={setCourseName}
                                                    description={description} setDescription={setDescription}
                                                    roomNumber={roomNumber} setRoomNumber={setRoomNumber}
                                                    userID={userID} setUserID={setUserID}
                                                />
                                            )
                                        }
                                    </div>
                                    <div className="schedule-details-body">
                                        {schedule
                                            .filter((scheduleItem) => scheduleItem.day === daysofweek.name)
                                            .map((filteredSchedule) => (
                                                <div
                                                    key={filteredSchedule.scheduleID}
                                                    className="schedule-detail-item"
                                                >
                                                    <div className="schedule-details">
                                                        <h6>{filteredSchedule.courseName}</h6>
                                                        {filteredSchedule.roomNumber && (
                                                            <p>Room {filteredSchedule.roomNumber}</p>
                                                        )}
                                                        {filteredSchedule.timeIn && filteredSchedule.timeOut && (
                                                            <p>
                                                                {filteredSchedule.timeIn} - {filteredSchedule.timeOut}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="schedule-edit-delete-btn">
                                                        <HiPencil className="schedule-edit-delete-btn-ic edit" onClick={() => handleEditSchedClick(filteredSchedule.scheduleID, daysofweek.id)} />
                                                        {
                                                            editSched && (
                                                                <EditSchedulePopUp
                                                                    handleEditSchedClick={handleEditSchedClick}
                                                                    token={token} // Make sure token is defined here
                                                                    scheduleID={scheduleToDelete}
                                                                    id={selectedDayOfWeekId}
                                                                />
                                                            )
                                                        }
                                                        <HiTrash className="schedule-edit-delete-btn-ic delete" onClick={() => handleTrashClick(filteredSchedule.scheduleID, daysofweek.id)} />
                                                        {
                                                            moveToTrash && (
                                                                <MoveToTrash
                                                                    handleDontMoveToTrash={handleTrashClick}
                                                                    scheduleID={scheduleToDelete}
                                                                    id={selectedDayOfWeekId}
                                                                />
                                                            )
                                                        }

                                                    </div>
                                                </div>
                                            ))}
                                        {schedule.filter((scheduleItem) => scheduleItem.day === daysofweek.name).length === 0 && (
                                            <div className="schedule-details">
                                                <p> Nothing to see here. </p>
                                            </div>

                                        )}
                                    </div>
                                </div>
                            ))
                        }

                        {/** entire block of a day's schedule */}

                        {/** */}
                    </>
                ) : (
                    <>
                        {/** entire block of a day's schedule */}

                        {days
                            .map((daysofweek) => (
                                <div key={daysofweek.id} className="schedule-container-item">
                                    <div className="schedule-details-header">
                                        <h3>{daysofweek.name}</h3>
                                    </div>
                                    <div className="schedule-details-body">
                                        {schedule
                                            .filter((scheduleItem) => scheduleItem.day === daysofweek.name)
                                            .map((filteredSchedule) => (
                                                <div
                                                    key={filteredSchedule.scheduleID}
                                                    className="schedule-detail-item"
                                                >
                                                    <div className="schedule-details">
                                                        <h6>{filteredSchedule.courseName}</h6>
                                                        {filteredSchedule.roomNumber && (
                                                            <p>Room {filteredSchedule.roomNumber}</p>
                                                        )}
                                                        {filteredSchedule.timeIn && filteredSchedule.timeOut && (
                                                            <p>
                                                                {filteredSchedule.timeIn} - {filteredSchedule.timeOut}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        {schedule.filter((scheduleItem) => scheduleItem.day === daysofweek.name).length === 0 && (
                                            <div className="schedule-details">
                                                <p> Nothing to see here. </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        }

                        {/** */}
                    </>
                )}

            </div>

        </div>
    )
}
export default Schedule;