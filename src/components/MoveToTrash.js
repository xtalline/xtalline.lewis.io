import React, { useState } from "react";
import "../assets/styles/popup.css";
import supabase from "../config/supabaseClient";

const MoveToTrash = ({ handleDontMoveToTrash, scheduleID, id }) => {
    const handleDelete = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from("schedule")
            .delete()
            .eq("scheduleID", scheduleID)
            .select();

        if (data) {
            window.location.reload();
        }
    };
    return (
        <div className="popup-container-overlay">
            <div className="popup-container">
                <div className="popup-header">
                    <h2>Move schedule to trash?</h2>
                </div>
                <div className="popup-btn">
                    <button onClick={handleDelete}>YES</button>
                    <button onClick={handleDontMoveToTrash}>NO</button>
                </div>
            </div>
        </div>
    )
}
export default MoveToTrash;