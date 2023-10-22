import React, {useEffect, useRef, useState} from "react";

import "../assets/styles/mobile-search-bar-popup.css";

import { FaSearch } from "react-icons/fa";
import { BiArrowBack } from "react-icons/bi";
import { RxCrossCircled } from "react-icons/rx";
import AppSearch from "./AppSearch"; 

const SearchBarMobilePopUp = ({togglePopupSearch,
                               searchValue,
                               setSearchValue,
                               searchProfiles,
                               profiles,
                               token,
                               handleClearInput}) => {
    /*const [searchValue, setSearchValue] = useState('');

    // Function to handle input change
    const handleInputChange = (event) => {
        setSearchValue(event.target.value);
    };

    // Function to clear the input
    const handleClearInput = () => {
        setSearchValue('');
    };*/

    const [openSearch, setOpenSearch] = useState(false);
    const toggleOpenSearch = (event) => {
        setOpenSearch(true);
        setSearchValue(event.target.value);
    }

    /** Search closes == outside clicks (for Mobile) */
    let mobileSearchRef = useRef();

    useEffect(() => {
        let mobileSearchHandler = (e) => {
            if (!mobileSearchRef.current.contains(e.target)) {
                setOpenSearch(false);
            }
        };

        document.addEventListener("mousedown", mobileSearchHandler);

        return () => {
            document.removeEventListener("mousedown", mobileSearchHandler);
        }
    });

    return(
        <div className="mobile-search" ref={mobileSearchRef}>
            <div className="mobile-search-bar-container" >
                <div className="back-button-container">
                    <button>
                        <BiArrowBack onClick={togglePopupSearch} className="back-button-ic"/>
                    </button>
                </div>
                <div className="mobile-search-bar">
                    <FaSearch className="mobile-search-ic" />
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
                </div>
                <div className="clear-button-container">
                    <button>
                        <RxCrossCircled className="clear-button-ic" onClick={handleClearInput}/>
                    </button>
                </div>
                
            </div>
            {searchValue.length > 0 && openSearch && <AppSearch searchResults={profiles} token={token} />}
        
        </div>
    )
}
export default SearchBarMobilePopUp;