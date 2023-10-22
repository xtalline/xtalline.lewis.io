import React, { useState } from "react";
import supabase from "../config/supabaseClient";

import { BsCheck2 } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";

const NotifItem = ({ notification }) => {

    const [department_status, setDepartmentStatus] = useState(notification.id);
    const [id, setID] = useState(notification.userID)
    const currentDate = new Date();
    const formattedTimestamp = currentDate.toISOString();
    const [department_confirmed, setDepartmentConfirmed] = useState(formattedTimestamp);



    const handleAccept = async () => {

        const { data, error } = await supabase
            .from('profiles')
            .update([{ department_status, department_confirmed }])
            .eq('id', notification.userID)
            .select()
        if (data) {
            if (!notification.status_notification) {
                const { data: accepted, error: acceptedError } = await supabase
                    .from('chairperson_notification_accepted')
                    .insert([{ id: notification.id }])
                    .select()

                const { data: admin, error: adminError } = await supabase
                    .from('chairperson_notification')
                    .update([{ status_notification: "accepted" }])
                    .eq('id', notification.id)
                    .select()

                if (accepted) {
                    const { data, error } = await supabase
                        .from('whereabouts')
                        .insert([{ id }])
                        .select()
                }
            }
        }

    }

    const handleReject = async () => {
        if (!notification.status_notification) {
            const { data: rejected, error: rejectedError } = await supabase
                .from('chairperson_notification_rejected')
                .insert([{ id: notification.id }])
                .select()

            const { data: admin, error: adminError } = await supabase
                .from('chaiperson_notification')
                .update([{ status_notification: "rejected" }])
                .eq('id', notification.id)
                .select()
        }
    }

    return (
        <div className="notification-item">
            <div className="notification-new-account-preview-details">
                <h4 title={notification.firstName + " " + notification.middleName + " " + notification.lastName}>
                    {notification.firstName + " " + notification.middleName + " " + notification.lastName}
                </h4>
                <p>{notification.userType + ", " + notification.departmentName}</p>
                <p>{notification.time}</p>
                <p>{notification.date}</p>
            </div>
            <div className="notification-accept-reject-btn">
                {
                    notification.status_notification === "accepted" ? (
                        <>
                            <p className="verified">VERIFIED</p>
                        </>
                    ) : notification.status_notification === "rejected" ? (
                        <>
                            <p className="rejected">REJECTED</p>
                        </>
                    ) : (
                        <>
                            <button className="accept" title="Accept" onClick={handleAccept}><BsCheck2 size={16} /></button>
                            <button className="reject" title="Reject" onClick={handleReject}><RxCross2 size={16} /></button>
                        </>
                    )
                }
            </div>
        </div>
    )
}
export default NotifItem;