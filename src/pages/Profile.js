import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import supabase from "../config/supabaseClient";

import "../assets/styles/profile.css";

import DefaultAvatar from "../assets/img/default-avatar.png";

import { BsFillPersonFill } from "react-icons/bs";
import { HiMiniIdentification } from "react-icons/hi2";
import { RiUserSettingsFill } from "react-icons/ri";
import { HiClipboardList } from "react-icons/hi";



import PersonalInformation from "../components/PersonalInformation";
import EmploymentInformation from "../components/EmploymentInformation";
import AccountSettings from "../components/AccountSettings";
import Schedule from "../components/Schedule";

const Profile = ({ token }) => {
    const [userType, setUserType] = useState("");
    const [employeenum, setEmployeeNum] = useState("");
    const [idnum, setIDNum] = useState("");
    const [accountStatus, setAccountStatus] = useState("")
    const [account_confirmed_at, setAccountConfirmedAt] = useState("")
    

    /** Active Profile Navigation */
    const location = useLocation();
    const [activeRoute, setActiveRoute] = useState("");
    useEffect(() => {
        setActiveRoute(location.pathname);
    }, [location]);


    const navigate = useNavigate();

    const navigateToPersonalInfo = () => {
        navigate('/profile');
    }
    const navigateToEmploymentInfo = () => {
        navigate('/profile/employment-information');
    }
    const navigateToAccountSettings = () => {
        navigate('/profile/account-settings')
    }
    const navigateToSchedule = () => {
        navigate('/profile/schedule');
    }

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select()
                .eq('id', token.user.id)
                .single()

            if (error) {

            } else if (data) {
                setUserType(data.usertype)
                setEmployeeNum(data.employeenum)
                setIDNum(data.idnum)
                setAccountConfirmedAt(data.account_confirmed_at)
                setAccountStatus(data.accountStatus)
            }
        }
        fetchData()

    }, [token.user.id])

    /** Log Out */
    const handleLogout = async () => {
        navigate('/')
        window.location.reload()
        sessionStorage.removeItem('token')
    }

    return (
        <div className="profile-container">
            <div className="profile-left-container">
                <div className="profile-top-left-container">
                    <div className="profile-img-wrapper">
                        <img src={DefaultAvatar} alt="profile"/>
                    </div>
                </div>
                <div className="profile-middle-left-container">
                    <div className="identity-number">
                        {userType === "instructor" || userType === "chairperson" ? (
                            <h4>{employeenum}</h4>) : (<h4>{idnum}</h4>
                        )}
                    </div>
                    <div className="profile-navigation-wrapper">
                        <button 
                            className={`${activeRoute === "/profile" ? "active-nav" : ""}`}
                            onClick={navigateToPersonalInfo}>
                                <p>Personal Information</p>
                                <BsFillPersonFill className="profile-navigation-ic"/>
                            </button>
                        <button 
                            className={`${activeRoute === "/profile/employment-information" ? "active-nav" : ""}`}
                            onClick={navigateToEmploymentInfo}>
                                <p>Employment Profile</p>
                                <HiMiniIdentification className="profile-navigation-ic"/>
                        </button>
                        <button 
                            className={`${activeRoute === "/profile/account-settings" ? "active-nav" : ""}`}
                            onClick={navigateToAccountSettings}>
                                <p>Account Settings</p>
                                <RiUserSettingsFill className="profile-navigation-ic"/>
                        </button>

                        {userType === "instructor" || userType === "chairperson" ? (
                            <button
                                className={`${activeRoute === "/profile/schedule" ? "active-nav" : ""}`}
                                onClick={navigateToSchedule}>
                                    <p>Your Schedule</p>
                                    <HiClipboardList className="profile-navigation-ic"/>
                            </button>): null}
                    </div>
                </div>
                <div className="profile-bottom-left-container">
                    <button onClick={handleLogout}>
                        <p>LOG OUT</p>
                    </button>
                </div>
            </div>

            <div className="profile-right-container">
                <div className="profile-details-container">
                    <Routes>
                        <Route path="/*" element={<PersonalInformation token={token}/>}></Route>
                        <Route path="/profile/employment-information" element={<EmploymentInformation token={token}/>}></Route>
                        <Route path="/profile/account-settings" element={<AccountSettings token={token}/>}></Route>
                        <Route path="/profile/schedule" element={<Schedule token={token}/>}></Route>
                    </Routes>
                </div>
            </div>
        </div>
    )
}
export default Profile;