import React, { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";

import "../assets/styles/notification.css";
import NotifItem from "./NotifItem";
import { useNavigate } from "react-router-dom";

const ViewNotifications = () => {

    const [notification, setNotification] = useState("");
    const currentDate = new Date();
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const seconds = currentDate.getSeconds().toString().padStart(2, "0");
    const time = `${hours}:${minutes}:${seconds}`;
    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear().toString();
    const date = `${year}-${month}-${day}`;

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from("chairperson_notification")
                .select()


            if (data) {
                setNotification(data);
            }
        };
        fetchData();

        const handleSubscription = supabase
            .channel("any")
            .on("postgres_changes", { event: "*", schema: "public", table: "chairperson_notification" }, payload => {
                console.log("Change received!", payload);
                fetchData();
            })
            .subscribe();
        return () => {
            handleSubscription.unsubscribe();
        };
    }, []);

    const handleAcceptAll = async () => {
        for (const item of notification) {
            const { id } = item;
            const { userID } = item;
            const { status_notification } = item;

            const { data, error } = await supabase
                .from("profiles")
                .update([{ accountStatus: id, account_confirmed_at: `${time} ${date}` }])
                .eq("id", item.userID)
                .select();
            if (data) {
                if (!status_notification) {
                    const { data: accepted, error: acceptedError } = await supabase
                        .from("chairperson_notification_accepted")
                        .insert([{ id, time, date }])
                        .select();

                    const { data: admin, error: adminError } = await supabase
                        .from("chairperson_notification")
                        .update([{ status_notification: "accepted" }])
                        .eq("id", id)
                        .select();
                    if (accepted) {
                        const { data, error } = await supabase
                            .from("whereabouts")
                            .insert([{ id: userID }])
                            .select();
                    }
                }
            }
        }
    };

    const handleRejectAll = async () => {
        for (const item of notification) {
            const { id } = item;
            const { userID } = item;
            const { status_notification } = item;

            if (!status_notification) {
                const { data: rejected, error: rejectedError } = await supabase
                    .from("chairperson_notification_rejected")
                    .insert([{ id, time, date }])
                    .select();

                const { data: admin, error: adminError } = await supabase
                    .from("chairperson_notification")
                    .update([{ status_notification: "rejected" }])
                    .eq("id", id)
                    .select();
            }
        }
    };

    /** see all notification */
    const navigate = useNavigate();
    const navigateToNotifications = () => {
        navigate('/notifications');
    };

    return (
        <div className="notification-container">
            <div className="notification-header-container">
                <div className="notification-header-texts">
                    <h2>Notifications</h2>
                    <p>Verify new accounts</p>
                </div>
                <div className="notification-header-btn">
                    <button>Accept All</button>
                    <button>Reject All</button>
                </div>
            </div>
            <div className="notification-body-container">
                {notification && (
                    <>
                        {notification.map((notification) => (
                            <NotifItem key={notification.id} notification={notification} />
                        ))}
                    </>
                )}
            </div>
            {/*<div className="notification-footer-container">
                <button onClick={navigateToNotifications}>See all notifications</button>
            </div>*/}
        </div>
    )
}
export default ViewNotifications;