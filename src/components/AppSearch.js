import React, { useState } from "react";
import "../assets/styles/app-search.css";
import DefaultAvatar from "../assets/img/default-avatar.png";
import NoMatch from "../assets/img/no-match.png";
import WhereaboutsDetailsPopUp from "./WhereaboutsDetailsPopUp";

const AppSearch = ({ searchResults, token }) => {
    const [openWhereabouts, setOpenWhereabouts] = useState(false);
    const [id, setID] = useState("");

    const toggleOpenSearchResult = (id) => {
        setID(id);
        setOpenWhereabouts(!openWhereabouts);
    }



    return (
        <div className="app-search-container">
            <div className="search-result-container">
                <div className="search-result-items">
                    {
                        searchResults && searchResults.length > 0 ? (
                            searchResults.map((profile) => (
                                <div className="search-result-item" key={profile.id}>
                                    <div className="search-item-detail" onClick={() => toggleOpenSearchResult(profile.id)}>
                                        <h4>{profile.firstname} {profile.middlename.charAt(0).toUpperCase()}. {profile.lastname}</h4>
                                        <p>Status: {profile.status}</p>
                                    </div>
                                    <div className="search-item-img">
                                        {/*<img src={profile.avatar} alt={`Avatar of ${profile.firstname}`} />*/}
                                        <img src={DefaultAvatar} alt={`Avatar of ${profile.firstname}`} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-match">
                                <img src={NoMatch} alt="No Match Found" />
                                <p>No match found.</p>
                            </div>
                        )
                    }
                    {openWhereabouts && <WhereaboutsDetailsPopUp toggleOpenSearchResult={toggleOpenSearchResult} id={id} token={token} />}



                </div>
            </div>
        </div>
    );
};

export default AppSearch;
