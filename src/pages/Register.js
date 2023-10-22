import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "../assets/styles/login-register.css";
import { IoClose } from "react-icons/io5";
import supabase from "../config/supabaseClient";
import bcrypt from "bcryptjs"

const Register = () => {
    /** ensure one click for account creation button */
    const [openOverlay, setOpenOverlay] = useState(false);

    const handleGoBack = () => {
        window.history.back(); // This will go back to the previous page in the browser's history
    };


    /** Disabling scrolling and up and down buttons */
    const inputRef = useRef(null);

    const handleWheel = () => {
        inputRef.current.blur();
    };

    const navigate = useNavigate();
    const navigateToLogin = () => {
        navigate('/');
    }


    /** For choosing user type */
    const [userType, setUserType] = useState("");
    const handleUserTypeChange = (event) => {
        setUserType(event.target.value);
        setSelectedDepartment(null);
        setSelectedSalutation(null);
        setSelectedSalutation(null);
    };

    /** For choosing department */
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const handleDepartmentChange = (event) => {
        setSelectedDepartment(event.target.value);
    }

    const [addOffice, setAddOffice] = useState("");
    const handleOfficeChange = (event) => {
        setAddOffice(event.target.value);
    }

    /** For choosing salutation */
    const [selectedSalutation, setSelectedSalutation] = useState("");
    const handleSalutationChange = (event) => {
        setSelectedSalutation(event.target.value);
    }

    /** For choosing pronouns */
    const [selectedGender, setSelectedGender] = useState("");
    const handleGenderChange = (event) => {
        setSelectedGender(event.target.value);
    }

    /** For birthdate */


    /** Personal info & account credentials */
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    const [academicRank, setAcademicRank] = useState("");
    const [employmentStatus, setEmploymentStatus] = useState("");
    const [employeenum, setEmployeeNum] = useState("");
    const [birthday, setBirthday] = useState("");

    //
    const handleCreate = async (e) => {
        setOpenOverlay(true);

        e.preventDefault()

        if (!userType || !firstName || !lastName || !email || !password || !confirmPassword) {
            console.log("error")
            setOpenOverlay(false);
            return
        } else if (password !== confirmPassword) {
            console.log("Passwords do not match");
            setOpenOverlay(false);
            return;
        } else {
            const { data, error } = await supabase
                .from('profiles')
                .select('email')
                .eq('email', email)
                .single()

            if (data) {
                console.log('email is already registered')
                setOpenOverlay(false);
            } else {
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(password, salt);

                const capitalizeName = (name) => {
                    return name
                        .split(' ')
                        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                        .join(' ');
                };

                const capitalizedFirstName = capitalizeName(firstName);
                const capitalizedLastName = capitalizeName(lastName);
                const capitalizedMiddleName = capitalizeName(middleName);

                let departmentName;
                if (selectedDepartment === "DTE") {
                    departmentName = "Department of Teachers Education";
                } else if (selectedDepartment === "DAS") {
                    departmentName = "Department of Teachers Education";
                } else if (selectedDepartment === "DIIT") {
                    departmentName = "Department of Industrial and Information Technology";
                } else if (selectedDepartment === "DM") {
                    departmentName = "Department of Management";
                } else {
                    //nothing
                }


                const { data, error } = await supabase.auth.signUp(
                    {
                        email: email,
                        password: password,
                        options: {
                            data: {
                                userType: userType,
                                firstName: capitalizedFirstName,
                                middleName: capitalizedMiddleName,
                                lastName: capitalizedLastName,
                                gender: selectedGender,
                                birthday: birthday,
                                email: email,
                                password: hashedPassword,
                                departmentName: departmentName,
                                role: role,
                                academicRank: academicRank,
                                employmentStatus: employmentStatus,
                                employeenum: employeenum,
                                salutation: selectedSalutation,
                                departmentAcronym: selectedDepartment,
                            }
                        }
                    }
                )
                navigate('/')
            }
        }
    }


    return (
        <div className="register-wrapper">
            <div className="register-overlay">
                <div className="register-form-container">

                    <div className="register-header">
                        <h1>Sign Up</h1>
                        <IoClose size={25} onClick={handleGoBack} />
                    </div>

                    <div className="tagline">
                        <p>Tracking whereabouts made easy.</p>
                    </div>

                    {/** Most important part!! */}
                    <form className="register-field" onSubmit={handleCreate}>
                        {/** User type selector*/}
                        <label htmlFor="user-type">Sign up as:</label>
                        <div className="user-type-selection-wrapper">
                            <label>
                                Student
                                <input
                                    type="radio"
                                    name="user-type"
                                    value="student"
                                    onChange={handleUserTypeChange}
                                    checked={userType === "student"}
                                    required
                                />
                            </label>
                            <label>
                                Instructor
                                <input
                                    type="radio"
                                    name="user-type"
                                    value="instructor"
                                    onChange={handleUserTypeChange}
                                    checked={userType === "instructor"}
                                    required
                                />
                            </label>
                        </div>
                        {/** Universal fields: personal info and account credentials */}
                        <label className="unilabel">Full name</label>
                        <div className="name-field-wrapper">
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                placeholder="First name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                id="middleName"
                                name="middleName"
                                placeholder="Middle name"
                                value={middleName}
                                onChange={(e) => setMiddleName(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                placeholder="Last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                        {/** Gender Selector */}
                        <label htmlFor="genderGroup">Gender</label>
                        <div className="gender-selector-wrapper">
                            <label>
                                Male
                                <input
                                    type="radio"
                                    name="genderGroup"
                                    value="Male"
                                    checked={selectedGender === 'Male'}
                                    onChange={handleGenderChange}
                                    required
                                />
                            </label>
                            <label>
                                Female
                                <input
                                    type="radio"
                                    name="genderGroup"
                                    value="Female"
                                    checked={selectedGender === 'Female'}
                                    onChange={handleGenderChange}
                                    required
                                />
                            </label>
                            <label>
                                Transgender
                                <input
                                    type="radio"
                                    name="genderGroup"
                                    value="Transgender"
                                    checked={selectedGender === 'Transgender'}
                                    onChange={handleGenderChange}
                                    required
                                />
                            </label>
                            <label>
                                Non-binary
                                <input
                                    type="radio"
                                    name="genderGroup"
                                    value="Non-binary"
                                    checked={selectedGender === 'Non-binary'}
                                    onChange={handleGenderChange}
                                    required
                                />
                            </label>
                            <label>
                                Prefer not to say
                                <input
                                    type="radio"
                                    name="genderGroup"
                                    value="Prefer not to say"
                                    checked={selectedGender === 'Prefer not to say'}
                                    onChange={handleGenderChange}
                                    required
                                />
                            </label>
                            <label>
                                Others
                                <input
                                    type="radio"
                                    name="genderGroup"
                                    value="Others"
                                    checked={selectedGender === 'Others'}
                                    onChange={handleGenderChange}
                                    required
                                />
                            </label>
                        </div>
                        <div className="others-gender">
                            <input
                                type="text"
                                name="other-gender"
                                id="other-gender"
                                placeholder="Specify your gender identity"
                                value=""
                                hidden={selectedGender !== "Others"}
                                required={selectedGender === "Others"}
                            />
                        </div>

                        {/** Birthday picker */}
                        <label className="unilabel">Birthdate</label>
                        <div className="birthdate-picker">
                            <input
                                type="date"
                                id="birthDate"
                                name="birthDate"
                                value={birthday}
                                onChange={(e) => setBirthday(e.target.value)}
                                required
                            />
                        </div>
                        {userType === "student" && (
                            <>
                                <label className="unilabel">Student Number</label>
                                <input
                                    type="number"
                                    id=""
                                    name=""
                                    placeholder="Student Number"
                                    ref={inputRef}
                                    onWheel={handleWheel}
                                    //value={employeenum}
                                    //onChange={(e) => setEmployeeNum(e.target.value)}
                                    required
                                />
                            </>
                        )}

                        <label className="unilabel">Account credentials</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmpassword"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {/** */}
                        {/** exclusive for instrutors */}
                        {userType === "instructor" && (
                            <>
                                <label htmlFor="departmentGroup">Department</label>
                                <div className="department-selector-wrapper">
                                    <label>
                                        DAS
                                        <input
                                            type="radio"
                                            name="departmentGroup"
                                            value="DAS"
                                            checked={selectedDepartment === 'DAS'}
                                            onChange={handleDepartmentChange}
                                            required
                                        />
                                    </label>
                                    <label>
                                        DIIT
                                        <input
                                            type="radio"
                                            name="departmentGroup"
                                            value="DIIT"
                                            checked={selectedDepartment === 'DIIT'}
                                            onChange={handleDepartmentChange}
                                            required
                                        />
                                    </label>
                                    <label>
                                        DM
                                        <input
                                            type="radio"
                                            name="departmentGroup"
                                            value="DM"
                                            checked={selectedDepartment === 'DM'}
                                            onChange={handleDepartmentChange}
                                            required
                                        />
                                    </label>
                                    <label>
                                        DTE
                                        <input
                                            type="radio"
                                            name="departmentGroup"
                                            value="DTE"
                                            checked={selectedDepartment === 'DTE'}
                                            onChange={handleDepartmentChange}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Others
                                        <input
                                            type="radio"
                                            name="departmentGroup"
                                            value="Others"
                                            checked={selectedDepartment === 'Others'}
                                            onChange={handleDepartmentChange}
                                            required
                                        />
                                    </label>
                                </div>
                                <div className="others-department">
                                    <input
                                        type="text"
                                        name="other-department"
                                        id="other-department"
                                        placeholder="Specify Department"
                                        value=""
                                        hidden={selectedDepartment !== "Others"}
                                        required={selectedDepartment === "Others"}
                                    />
                                </div>

                                <input
                                    type="text"
                                    id="role"
                                    name="role"
                                    placeholder="Role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    id="acadRandking"
                                    name="acadRanking"
                                    placeholder="Academic Ranking"
                                    value={academicRank}
                                    onChange={(e) => setAcademicRank(e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    id="employmentStatus"
                                    name="employmentStatus"
                                    placeholder="Status of Employment"
                                    value={employmentStatus}
                                    onChange={(e) => setEmploymentStatus(e.target.value)}
                                    required
                                />

                                <input
                                    type="number"
                                    id=""
                                    name=""
                                    placeholder="Employee Number"
                                    value={employeenum}
                                    ref={inputRef}
                                    onWheel={handleWheel}
                                    onChange={(e) => setEmployeeNum(e.target.value)}
                                    required
                                />

                                {/** for members of the office */}
                                <label htmlFor="addOffice">
                                    Are you a member of an office?
                                    <span> e.g. OSAS, Research and Extension Services Office, etc. </span>
                                </label>
                                <div className="add-office-wrapper">
                                    <label>
                                        Yes
                                        <input
                                            type="radio"
                                            name="addOffice"
                                            value="yes"
                                            checked={addOffice === 'yes'}
                                            onChange={handleOfficeChange}
                                            required
                                        />
                                    </label>
                                    <label>
                                        No
                                        <input
                                            type="radio"
                                            name="addOffice"
                                            value="no"
                                            checked={addOffice === 'no'}
                                            onChange={handleOfficeChange}
                                            required
                                        />
                                    </label>
                                </div>
                                <div className="office-details">
                                    <input
                                        type="text"
                                        name="officeName"
                                        id="officeName"
                                        placeholder="Specify the office name"
                                        value=""
                                        hidden={addOffice !== "yes"}
                                        required={selectedDepartment === "yes"}
                                    />
                                    <input
                                        type="text"
                                        name="officeRole"
                                        id="officeRole"
                                        placeholder="Role or position in the office"
                                        value=""
                                        hidden={addOffice !== "yes"}
                                        required={selectedDepartment === "yes"}
                                    />
                                </div>

                                <label htmlFor="salutationGroup">Salutation</label>
                                <div className="salutation-status-wrapper">
                                    <label>
                                        Mr.
                                        <input
                                            type="radio"
                                            name="salutationGroup"
                                            value="Mr."
                                            checked={selectedSalutation === 'Mr.'}
                                            onChange={handleSalutationChange}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Ms.
                                        <input
                                            type="radio"
                                            name="salutationGroup"
                                            value="Ms."
                                            checked={selectedSalutation === 'Ms.'}
                                            onChange={handleSalutationChange}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Mrs.
                                        <input
                                            type="radio"
                                            name="salutationGroup"
                                            value="Mrs."
                                            checked={selectedSalutation === 'Mrs.'}
                                            onChange={handleSalutationChange}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Dr.
                                        <input
                                            type="radio"
                                            name="salutationGroup"
                                            value="Dr."
                                            checked={selectedSalutation === 'Dr.'}
                                            onChange={handleSalutationChange}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Prof.
                                        <input
                                            type="radio"
                                            name="salutationGroup"
                                            value="Prof."
                                            checked={selectedSalutation === 'Prof.'}
                                            onChange={handleSalutationChange}
                                            required
                                        />
                                    </label>
                                </div>
                            </>
                        )}
                        {/** */}

                        <div className="register-footer">
                            <p>By clicking Sign Up, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</p>
                        </div>
                        <button className="register-btn" onClick={handleCreate}>
                            <h3>Sign Up</h3>
                        </button>
                    </form>
                    {/** */}


                </div>
            </div>

            {openOverlay && (
                <div className="one-click-overlay">
                    <p>Please wait...</p>
                </div>
            )}

        </div>
    )
}
export default Register;