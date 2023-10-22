import React, { useEffect, useState } from "react";
import "../assets/styles/profile.css";
import supabase from "../config/supabaseClient";

import { HiPencil } from "react-icons/hi";
import { MdSave } from "react-icons/md";
import { IoChevronBackOutline } from "react-icons/io5";

const EmploymentInformation = ({token}) => {
    const [editMode, setEditMode] = useState(false);
    const [departmentname, setDepartmentName] = useState("");
    const [role, setRole] = useState("");
    const [academicrank, setAcademicRank] = useState("");
    const [employmentstatus, setEmploymentStatus] = useState("");
    const [office, setOffice] = useState("");
    const [officeRole, setOfficeRole] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select()
                .eq('id', token.user.id)
                .single()

            if (error) {

            } else if (data) {
                setDepartmentName(data.departmentname)
                setRole(data.role)
                setAcademicRank(data.academicrank)
                setEmploymentStatus(data.employmentstatus)
            }
        }
        fetchData()
    }, [token.user.id])

     /** Edit Mode On */
     const handleEditClick = () => {
        setEditMode(true);
    };

    /** Edit Mode Off */
    const handleCancelClick = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select()
            .eq('id', token.user.id)
            .single()

        if (error) {

        } else if (data) {
            setDepartmentName(data.departmentname)
            setRole(data.role)
            setAcademicRank(data.academicrank)
            setEmploymentStatus(data.employmentstatus)
        }
        setEditMode(false);

    }

    const handleInputChange = async (e) => {
        e.preventDefault()

        if (!role || !academicrank || !employmentstatus) {
            console.log("error")
        } else {
            const { data, error } = await supabase
                .from('profiles')
                .update([{ role, academicrank, employmentstatus }])
                .eq('id', token.user.id)
                .select()
            if (data) {
                window.location.reload()
            }
        }
    }

    

    return(
        <div className="profile-details-wrapper">
            <div className="profile-details-header">
                {editMode ? (
                        <>
                            <button
                                className="profile-edit-save-btn"
                                onClick={handleCancelClick}>
                                <IoChevronBackOutline/>
                            </button>
                            <h2>Edit Employment Profile</h2>
                            <button
                                className="profile-edit-save-btn"
                                /*onClick={handleInputChange}*/>
                                <MdSave/>
                            </button>
                        </>

                    ) : (
                        <>
                            <h2>Employment Profile</h2>
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
                    <form /*onSubmit={handleInputChange}*/>

                        <label>Department Role</label>
                        <input
                            name="role"
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        />

                        <label>Academic Ranking</label>
                        <input
                            name="academicRanking"
                            type="text"
                            value={academicrank}
                            onChange={(e) => setAcademicRank(e.target.value)}
                        />

                        <label>Status of Employment</label>
                        <input
                            name="employmentStatus"
                            type="text"
                            value={employmentstatus}
                            onChange={(e) => setEmploymentStatus(e.target.value)}
                        />

                        <label>Office</label>
                        <input
                            name="office"
                            type="text"
                            //value={inputValue}
                            onChange={(e) => setOffice(e.target.value)}
                        />

                        <label>Office Role</label>
                        <input
                            name="officeRole"
                            type="text"
                            //value={inputValue}
                            onChange={(e) => setOfficeRole(e.target.value)}
                        />

                    </form>
                ) : (
                    <div className="details">
                        <label>Department</label>
                        <input
                            type="text"
                            value={departmentname}
                            readOnly
                            disabled
                        />

                        <label>Department Role</label>
                        <input
                            type="text"
                            value={role}
                            readOnly
                            disabled
                        />

                        <label>Academic Ranking</label>
                        <input
                            type="text"
                            value={academicrank}
                            readOnly
                            disabled
                        />

                        <label>Status of Employment</label>
                        <input
                            type="text"
                            value={employmentstatus}
                            readOnly
                            disabled
                        />

                        <label>Office</label>
                        <input
                            type="text"
                            value={office}
                            readOnly
                            disabled
                        />

                        <label>Office Role</label>
                        <input
                            type="text"
                            value={officeRole}
                            readOnly
                            disabled
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
export default EmploymentInformation;