import React, { useEffect, useState, useRef } from "react";
import "../assets/styles/profile.css";
import supabase from "../config/supabaseClient";

import bcrypt from "bcryptjs";

import { MdCancel } from "react-icons/md";
import { IoKeyOutline } from "react-icons/io5";
import { AiOutlineDownSquare, AiOutlineUpSquare } from "react-icons/ai";
import { TbDiscountCheckFilled } from "react-icons/tb";
import { RiInformationLine } from "react-icons/ri";
import { RxCopy } from "react-icons/rx";

const AccountSettings = ({ token }) => {
    const verificationNumRef = useRef(null);

    const [userID, setUserID] = useState("");
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userType, setUserType] = useState("");
    const [departmentName, setDepartmentName] = useState("");
    const [role, setRole] = useState("");
    const [accountStatus, setAccountStatus] = useState("");
    const [account_confirmed_at, setAccountConfirmedAt] = useState("");
    const currentDate = new Date();
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
    const time = `${hours}:${minutes}:${seconds}`;
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear().toString();
    const date = `${year}-${month}-${day}`;

    const [openDropdown, setOpenDropdown] = useState(false);
    const handleDropDown = () => {
        setOpenDropdown(!openDropdown);
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select()
                .eq('id', token.user.id)
                .single()

            if (error) {

            } else if (data) {
                setEmail(data.email)
                setUserID(data.id)
                setFirstName(data.firstname)
                setMiddleName(data.middlename)
                setLastName(data.lastname)
                setUserType(data.usertype)
                setDepartmentName(data.departmentname)
                setRole(data.role)
                setAccountStatus(data.accountStatus)
                setAccountConfirmedAt(`${time} ${date}`)
                setPassword(data.password)
            }
        }
        fetchData()

        const handleSubscription = supabase
            .channel('any')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, payload => {
                console.log('Change received!', payload);
                fetchData();
            })
            .subscribe();
        return () => {
            handleSubscription.unsubscribe();
        };
    }, [token.user.id])


    const handleInputChange = async (e) => {
        e.preventDefault()
        if (!currentPassword || !newPassword || !confirmPassword) {
            console.log("error")
        } else {
            const isPasswordValid = bcrypt.compareSync(currentPassword, password);
            if (isPasswordValid) {
                console.log("password matched")
                if (newPassword === confirmPassword) {
                    const { data, error } = await supabase.auth.updateUser({
                        //email: "new@email.com",
                        password: newPassword,
                        //data: { hello: 'world' }
                    })
                    const salt = bcrypt.genSaltSync(10);
                    const hashedPassword = bcrypt.hashSync(newPassword, salt);
                    if (data) {
                        const { data, error } = await supabase
                            .from('profiles')
                            .update([{ password: hashedPassword }])
                            .eq('id', token.user.id)
                            .select()
                    }
                    window.location.reload()
                } else {
                    console.log("password is not matched")
                }



            } else {
                console.log("password is not match")
            }
        }
    }
    const handleRequestButton = async (e) => {
        e.preventDefault()

        const { data, error } = await supabase
            .from('admin_notification')
            .select()
            .eq('userID', token.user.id)
            .single()
        if (data) {
            const { data, error } = await supabase
                .from('admin_notification')
                .delete()
                .eq('userID', token.user.id)
                .select()

            if (data) {
                const { data, error } = await supabase
                    .from('admin_notification')
                    .insert([{ firstName, middleName, lastName, userType, departmentName, role, userID, time, date }])
                    .select()
            }
        } else {
            const { data, error } = await supabase
                .from('admin_notification')
                .insert([{ firstName, middleName, lastName, userType, departmentName, role, userID, time, date }])
                .select()
        }
    }

    const [openInfo, setOpenInfo] = useState(false);

    const handleInfoClick = () => {
        setOpenInfo(!openInfo)
    }

    return (
        <div className="profile-details-wrapper">
            <div className="profile-details-header">
                <h2 className="acc-settings-header">Account Credentials</h2>
            </div>
            <div className="profile-details">
                <div className="details">
                    <label>Email {!token.user.email_confirmed_at && (<span>(not yet verified)</span>)}</label>
                    <div className="email-wrapper">
                        <input
                            type="email"
                            value={email}
                            readOnly
                            disabled
                        />
                        {!token.user.email_confirmed_at ? (
                            <div className="email-verification-badge not-verified">
                                <MdCancel size={22} title="Email not yet verified" />
                            </div>
                        ) : (
                            <div className="email-verification-badge verified">
                                <TbDiscountCheckFilled size={22} title="Verified Email" />
                            </div>
                        )}
                    </div>

                    <button className="ch-pw">
                        <p>
                            Change Password
                            <IoKeyOutline size={15} className="key-ic" />
                        </p>
                        {openDropdown ? (<AiOutlineUpSquare
                            size={22}
                            className="ch-pw-ic"
                            onClick={handleDropDown}
                        />)
                            : (<AiOutlineDownSquare
                                size={22}
                                className="ch-pw-ic"
                                onClick={handleDropDown}
                            />)}
                    </button>

                    {openDropdown && (
                        <div className="ch-pw-dropdown">
                            <form onSubmit={handleInputChange}>
                                <label>Current Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />

                                <label>New Password</label>
                                <input
                                    name="newPassword"
                                    type="password"
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />

                                <label>Confirm New Password</label>
                                <input
                                    name="confirmNewPassword"
                                    type="password"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </form>
                            <button onClick={handleInputChange}>SAVE CHANGES</button>
                        </div>
                    )}

                    {(userType === "instructor" || userType === "chairperson") &&
                        (
                            <>
                                <label className="account-status">Account Status {accountStatus && (<span>(Account was verified on {account_confirmed_at})</span>)}</label>
                                <div className="request-wrapper">
                                    {!accountStatus ? (
                                        <>
                                            <button onClick={handleRequestButton}>Request Account Approval</button>
                                            <p>Why do you need to do this?
                                                <button onClick={handleInfoClick}>
                                                    <RiInformationLine size={18}
                                                        title="You need to request approval of your account from the HR
                                                        and your Department Chairperson to confirm that you are an instructor."/>
                                                </button>
                                            </p>
                                        </>
                                    ) : (
                                        <div className="verification-details">
                                            <p>Verification number:</p>
                                            <h4 className="verification-id">
                                                {accountStatus}
                                            </h4>
                                        </div>
                                    )}
                                </div>
                                {openInfo && (
                                    <div className="request-verification-info">
                                        <p>
                                            You need to request approval of your account from the HR
                                            and your Department Chairperson to confirm that you are an instructor.
                                        </p>
                                    </div>
                                )}

                            </>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
export default AccountSettings;