import React, { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";

import "../assets/styles/popup.css";

import FakeDeptLogo from "../assets/img/app-logo-trans.png";

const WhereaboutsDetailsPopUp = ({ toggleOpenSearchResult, handleClosePopup, id }) => {

    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [roomName, setRoomName] = useState("");
    const [roomNumber, setRoomNumber] = useState("");
    const [activity, setActivity] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('whereabouts')
                .select('*, profiles(*)')
                .single()
                .eq('id', id)

            if (data) {
                setFirstName(data.profiles.firstname)
                setMiddleName(data.profiles.middlename)
                setLastName(data.profiles.lastname)
                setRoomName(data.roomName)
                setRoomNumber(data.roomNumber)
                setActivity(data.activityName)
                setStatus(data.profiles.status)
            }
        };

        fetchData();
    }, [id]);

    return (
        <div className="popup-container-overlay">
            <div className="popup-container">
                <div className="department-logo-container">
                    <div className="department-logo">
                        <img src={FakeDeptLogo} />
                    </div>
                </div>
                <div className="whereabouts-details-container">
                    <h2>{firstName} {middleName} {lastName}'s Whereabouts</h2>
                    <p>DIIT</p>
                    <div className="whereabouts-details">
                        <table className="whereabouts-details-table">
                            <tbody className="whereabouts-details-table-body">
                                <tr>
                                    <td>Room/Office name</td>
                                    <td>:</td>
                                    <td>{roomName}{/*selectedRow.original.roomName*/}</td>
                                </tr>
                                <tr>
                                    <td>Room number</td>
                                    <td>:</td>
                                    <td>{roomNumber}</td>
                                </tr>
                                <tr>
                                    <td>Activity</td>
                                    <td>:</td>
                                    <td>{activity}</td>
                                </tr>
                                <tr>
                                    <td>Status</td>
                                    <td>:</td>
                                    <td>{status}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="popup-btn">
                    <button onClick={toggleOpenSearchResult || handleClosePopup}>CLOSE</button>
                </div>

            </div>
        </div>
    )
}
export default WhereaboutsDetailsPopUp;