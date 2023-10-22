import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import supabase from "../config/supabaseClient";
import "../assets/styles/navigation.css";

import DefaultAvatar from "../assets/img/default-avatar.png";

import { RxCross1 } from "react-icons/rx";
import { BsFillPersonFill } from "react-icons/bs";
import { HiMiniIdentification } from "react-icons/hi2";
import { RiUserSettingsFill } from "react-icons/ri";
import { HiClipboardList } from "react-icons/hi";
import { IoChevronForwardOutline, IoLogOut } from "react-icons/io5";

const Navigation = ({ toggleOpenNav, token }) => {
    const navigate = useNavigate();

    const navigateToPersonalInfo = () => {
        navigate('/profile');
        setTimeout(() => {
            toggleOpenNav();
        }, 350);
    }
    const navigateToEmploymentInfo = () => {
        navigate('/profile/employment-information');
        setTimeout(() => {
            toggleOpenNav();
        }, 350);
    }
    const navigateToAccountSettings = () => {
        navigate('/profile/account-settings');
        setTimeout(() => {
            toggleOpenNav();
        }, 350);
    }
    const navigateToSchedule = () => {
        navigate('/profile/schedule');
        setTimeout(() => {
            toggleOpenNav();
        }, 350);
    }

    /** Active Profile Navigation */
    const location = useLocation();
    const [activeRoute, setActiveRoute] = useState("");
    useEffect(() => {
        setActiveRoute(location.pathname);
    }, [location]);


    const [userType, setUserType] = useState("");
    const [firstname, setFirstName] = useState("");
    const [middlename, setMiddleName] = useState("");
    const [lastname, setLastName] = useState("");
    const [idnum, setIDNum] = useState("");
    const [employeenum, setEmployeeNum] = useState("");

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
                setFirstName(data.firstname)
                setMiddleName(data.middlename)
                setLastName(data.lastname)
                setIDNum(data.idnum)
                setEmployeeNum(data.employeenum)
            }
        }
        fetchData()

    }, [token.user.id])




    
    /**Log Out */
    const handleLogout = async () => {
        navigate('/')
        window.location.reload()
        sessionStorage.removeItem('token')
    }



    return (
        <>
            <div className="navigation-container">
                <div className="navigation-profile-container" onClick={navigateToPersonalInfo}>
                    <div className="navigation-profile-image">
                        <img src={DefaultAvatar} alt="profile image" />
                    </div>
                    <div className="navigation-profile-details">
                        <h4>{firstname} {middlename} {lastname}</h4>
                        {userType === "instructor" || userType === "chairperson" ? (
                            <p>{employeenum}</p>) : (<p>{idnum}</p>
                        )}
                    </div>
                </div>
                <div className="navigation-buttons">
                    <button onClick={navigateToPersonalInfo} >
                            <BsFillPersonFill className="navigation-button-ic"/>
                            <p>Personal Information</p>
                            <IoChevronForwardOutline className="navigation-button-forward-ic" />
                    </button>

                    {userType === "instructor" || userType === "chairperson" ? (
                    <button onClick={navigateToEmploymentInfo} >
                            <HiMiniIdentification className="navigation-button-ic" />
                            <p>Employment Information</p>
                            <IoChevronForwardOutline className="navigation-button-forward-ic" />
                    </button>)
                    : null}

                    <button onClick={navigateToAccountSettings}>
                            <RiUserSettingsFill className="navigation-button-ic" />
                            <p>Account Settings</p>
                            <IoChevronForwardOutline className="navigation-button-forward-ic" />
                    </button>

                    {userType === "instructor" || userType === "chairperson" ? (
                        <button onClick={navigateToSchedule}>
                            <HiClipboardList className="navigation-button-ic" />
                            <p>Your Schedule</p>
                            <IoChevronForwardOutline className="navigation-button-forward-ic" />
                        </button>)
                    : null}
                    <button onClick={handleLogout}>
                        <IoLogOut className="navigation-button-ic" />
                        <p className="logout-p">Log Out</p>

                    </button>
                </div>
            </div>

            {/** for mobile */}
            <div className="navigation-overlay-mobile">
                <div className="navigation-container-mobile">
                    <div className="navigation-closer">
                        <RxCross1 className="navigation-closer-ic" onClick={toggleOpenNav} />
                    </div>
                    <div className="navigation-profile-container" onClick={navigateToPersonalInfo}>
                        <div className="navigation-profile-image">
                            <img src={DefaultAvatar} alt="profile image" />
                        </div>
                        <div className="navigation-profile-details">
                            <h4>{firstname} {middlename} {lastname}</h4>
                            {userType === "instructor" || userType === "chairperson" ? (
                                <p>{employeenum}</p>) : (<p>{idnum}</p>
                            )}
                        </div>
                    </div>
                    <div className="navigation-buttons">
                        <button
                            className={`${activeRoute === "/profile" ? "active-nav" : ""}`}
                            onClick={navigateToPersonalInfo}>
                                <BsFillPersonFill className="navigation-button-ic" />
                                <p>Personal Information</p>
                                <IoChevronForwardOutline className="navigation-button-forward-ic" />
                        </button>

                    {userType === "instructor" || userType === "chairperson" ? (
                        <button
                            className={`${activeRoute === "/profile/employment-information" ? "active-nav" : ""}`}
                            onClick={navigateToEmploymentInfo}>
                                <HiMiniIdentification className="navigation-button-ic" />
                                <p>Employment Information</p>
                                <IoChevronForwardOutline className="navigation-button-forward-ic" />
                        </button>)
                    : null}
                        
                        <button
                            className={`${activeRoute === "/profile/account-settings" ? "active-nav" : ""}`}
                            onClick={navigateToAccountSettings}>
                                <RiUserSettingsFill className="navigation-button-ic" />
                                <p>Account Settings</p>
                                <IoChevronForwardOutline className="navigation-button-forward-ic" />
                        </button>

                        {userType === "instructor" || userType === "chairperson" ? (
                            <button
                                className={`${activeRoute === "/profile/schedule" ? "active-nav" : ""}`}
                                onClick={navigateToSchedule}>
                                    <HiClipboardList className="navigation-button-ic" />
                                    <p>Your Schedule</p>
                                    <IoChevronForwardOutline className="navigation-button-forward-ic" />
                            </button>)
                        : null}
                        
                        <button onClick={handleLogout}>
                            <IoLogOut className="navigation-button-ic" />
                            <p className="logout-p">Log Out</p>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navigation; 