import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import "../assets/styles/header.css";
import AppLogo from "../assets/img/app-logo.png";
import DefaultAvatar from "../assets/img/default-avatar.png";
import SearchIC from "../assets/img/search-ic.gif";
import NotifIC from "../assets/img/notif-ic.png";
import { FaSearch } from "react-icons/fa";
import SearchBarMobilePopUp from "./SearchBarMobilePopUp";
import Navigation from "./Navigation";
import AppSearch from "./AppSearch";
import ViewNotifications from "./ViewNotifications";

const Header = ({ token }) => {
    const [profiles, setProfiles] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();
    const [openSearch, setOpenSearch] = useState(false);
    const [popupSearch, setPopupSearch] = useState(false);
    const [openNav, setOpenNav] = useState(false);
    const [openNotif, setOpenNotif] = useState(false);
    const [userType, setUserType] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select()
                .eq("id", token.user.id)
                .single();

            if (error) {
                // Handle the error
            } else if (data) {
                setUserType(data.usertype);
            }
        }
        fetchData();

        const fetchProfile = async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select()
                .eq("usertype", "instructor");

            if (data) {
                setProfiles(data);
            }
        }
        fetchProfile();
    }, [token.user.id]);

    const searchProfiles = async (query) => {
        const { data, error } = await supabase
            .from("profiles")
            .select()
            .in("usertype", ["instructor", "chairperson"]) // Filter by usertypes
            .not("accountStatus", "is", null) // Exclude data with null accountStatus
            .not("account_confirmed_at", "is", null) // Exclude data with null account_confirmed_at
            .ilike("firstname", `%${query}%`)


        if (error) {
            // Handle the error
        } else if (data) {
            setProfiles(data);
        }
    };

    const navigateToHome = () => {
        navigate('/');
    };

    const toggleOpenSearch = () => {
        setOpenSearch(true);
    }

    const searchRef = useRef();

    useEffect(() => {
        let searchHandler = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setOpenSearch(false);
            }
        };

        document.addEventListener("mousedown", searchHandler);

        return () => {
            document.removeEventListener("mousedown", searchHandler);
        }
    }, []);

    const togglePopupSearch = () => {
        setPopupSearch(!popupSearch);
    }

    const handleClearInput = () => {
        setSearchValue('');
    }

    const toggleOpenNav = () => {
        setOpenNav(!openNav);
    }

    let navRef = useRef();

    useEffect(() => {
        let handler = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setOpenNav(false);
            }
        };

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        }
    }, []);

    const toggleOpenNotif = () => {
        setOpenNotif(!openNotif);
    }

    let notifRef = useRef();

    useEffect(() => {
        let notifHandler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setOpenNotif(false);
            }
        };

        document.addEventListener("mousedown", notifHandler);

        return () => {
            document.removeEventListener("mousedown", notifHandler);
        }
    }, []);

    return (
        <div className="header-content">
            <div className="header-left-content">
                <img src={AppLogo} alt="Application Logo" onClick={navigateToHome} />
            </div>
            <div className="header-middle-content" ref={searchRef}>
                <div className="search-bar" >
                    <FaSearch className="search-ic" />
                    <input
                        type="search"
                        className="search"
                        name="search"
                        placeholder="Search here"
                        autoComplete="off"
                        value={searchValue}
                        onClick={toggleOpenSearch}
                        onInput={toggleOpenSearch}
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                            searchProfiles(e.target.value);
                        }}
                    />
                    {searchValue.length > 0 && openSearch && <AppSearch searchResults={profiles} token={token} />}
                </div>
                {/** for mobile*/}
                <h1>LEWIS</h1>
            </div>
            <div className="header-right-content">
                <div className="search-ic-mobile">
                    <img src={SearchIC} alt="search icon" onClick={togglePopupSearch} />
                </div>

                {userType === "chairperson" ? (
                    <div className="notification-icon" ref={notifRef}>
                        <img src={NotifIC} alt="notification bell" onClick={toggleOpenNotif} />
                        {openNotif && (<ViewNotifications />)}
                    </div>)
                    : null}

                <div className="profile-avatar" ref={navRef}>
                    <img src={DefaultAvatar} alt="profile image" onClick={toggleOpenNav} />
                    {openNav && (<Navigation toggleOpenNav={toggleOpenNav} token={token} />)}
                </div>
            </div>

            {popupSearch && (
                <SearchBarMobilePopUp
                    togglePopupSearch={togglePopupSearch}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    searchProfiles={searchProfiles}
                    toggleOpenSearch={toggleOpenSearch}
                    openSearch={openSearch}
                    profiles={profiles}
                    token={token}
                    handleClearInput={handleClearInput} />
            )}
        </div>
    );
};

export default Header;
