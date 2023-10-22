import React, { useState, useEffect, useMemo } from "react";
import { useMedia } from 'react-use';

import "../assets/styles/whereabouts.css";
import "../assets/styles/popup.css";

import DataTable from "../components/DataTable";
import MockData from "../assets/mock-data/mock-whereabouts-data.json";

import FakeDeptLogo from "../assets/img/app-logo-trans.png";
import supabase from "../config/supabaseClient";

function Whereabouts({ token }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [userType, setUserType] = useState("");
  const [status, setStatus] = useState([]);
  const [department, setDepartment] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [accountStatus, setAccountStatus] = useState(null);
  const [account_confirmed_at, setAccountConfirmedAt] = useState(null);
  const [data, setData] = useState([]);
  const isSmallScreen = useMedia('(max-width: 930px)');
  const [images, setImages] = useState(null)
  const CDNURL = "https://cgnhfvymwwlhctrhqpbc.supabase.co/storage/v1/object/public/avatars/"
  //https://cgnhfvymwwlhctrhqpbc.supabase.co/storage/v1/object/public/avatars/admin/4591933b-7e62-472a-a485-2d085b191a2c


  /** whereabouts details popup */
  const handleRowClick = (row) => {
    setSelectedRow(row);
  };

  const handleClosePopup = () => {
    setSelectedRow(null);
  };

  const handleDepartmentChange = (departmentName) => {
    console.log("Selected department:", departmentName);
    setSelectedDepartment(departmentName);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select()
          .eq('id', token.user.id)
          .single();

        if (data) {
          setUserType(data.usertype);
          setAccountConfirmedAt(data.account_confirmed_at);
          setAccountStatus(data.accountStatus);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [token.user.id]);

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        const { data, error } = await supabase
          .from('status')
          .select('statusName, statusColor');
        setStatus(data);
      } catch (error) {
        console.error("Error fetching status data:", error);
      }
    };

    fetchStatusData();
  }, []);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const { data, error } = await supabase
          .from('department')
          .select();

        if (data) {
          setDepartment(data);
        }
      } catch (error) {
        console.error("Error fetching department data:", error);
      }
    };

    fetchDepartment();
    const fetchImages = async () => {
      const { data, error } = await supabase
        .storage
        .from("avatars")
        .list("admin/", {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });

      if (data) {
        setImages(data);
      }
    };

    fetchImages()
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let query = supabase
          .from('whereabouts')
          .select('*, profiles(*)');

        if (selectedDepartment) {
          query = query.eq('profiles.departmentname', selectedDepartment);
        }

        query = query.order('time', { ascending: false });

        const { data: instructorData, error } = await query;

        if (error) {
          throw new Error(error.message);
        }

        const formattedData = instructorData
          .filter((data) => data.profiles && data.profiles.accountStatus !== null)
          .map((data) => ({
            status: data.profiles.status,
            salutation: data.profiles.salutation,
            name: `${data.profiles.lastname + ','} ${data.profiles.firstname} ${data.profiles.middlename.charAt(0).toUpperCase() + '.'}`,
            roomName: data.roomName ?? null,
            roomNumber: data.roomNumber ?? null,
            activityName: data.activityName ?? null,
            departmentName: data.profiles.departmentname,
            departmentAcronym: data.profiles.departmentAcronym,
            name_popup: `${data.profiles.firstname} ${data.profiles.middlename.charAt(0).toUpperCase() + '.'} ${data.profiles.lastname}`,
          }));

        formattedData.sort((a, b) => {
          if (a.status === null && b.status === null) {
            if (a.roomName || a.roomNumber || a.activityName) return -1;
            if (b.roomName || b.roomNumber || b.activityName) return 1;
            return 0;
          }
          if (a.status === null) return 1;
          if (b.status === null) return -1;
          if (!a.roomName && !a.roomNumber && !a.activityName) return -1;
          if (!b.roomName && !b.roomNumber && !b.activityName) return 1;
          return 0;
        });

        setData(formattedData || []);
      } catch (error) {
        console.error("Error fetching instructor data:", error);
      }
    };

    fetchData();

    const handleSubscription = supabase
      .channel('any')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, payload => {
        fetchData();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'whereabouts' }, payload => {
        fetchData();
      })
      .subscribe();

    return () => {
      handleSubscription.unsubscribe();
    };
  }, [selectedDepartment]);

  const columns = useMemo(() => {
    if (userType === "student" || !accountStatus || !account_confirmed_at || !token.user.email_confirmed_at) {
      return [
        {
          Header: "Name",
          accessor: "name",
          Cell: ({ row }) => (
            <div
              className="name-cell"
              onClick={(e) => {
                if (e.target.classList.contains("name-cell")) {
                  handleRowClick(row);
                }
              }}
            >
              {row.original.name}
            </div>
          ),
        },
        {
          Header: "Department",
          accessor: "departmentName",
        },
        {
          Header: "Status",
          accessor: "status",
          /*Cell: ({ value }) => (
            <div
              title={value}
              className="status-circle"
              style={{
                backgroundColor: status.find((status) => status.statusName === value)?.statusColor || "none",
              }}
            >
              {value}
            </div>
          ),*/
        },
      ];
    } else {
      return [
        {
          Header: "Name",
          accessor: "name",
          Cell: ({ row }) => (
            <div
              className="name-cell"
              onClick={(e) => {
                if (e.target.classList.contains("name-cell")) {
                  handleRowClick(row);
                }
              }}
            >
              {row.original.name}
            </div>
          ),
        },
        {
          Header: "Department",
          accessor: "departmentName",
        },
        {
          Header: "Room Name/Location",
          accessor: "roomName",
        },
        {
          Header: "Room Number",
          accessor: "roomNumber",
        },
        {
          Header: "Activity",
          accessor: "activityName",
        },
        {
          Header: "Status",
          accessor: "status",
          /*Cell: ({ value }) => (
            <div
              title={value}
              className="status-circle"
              style={{
                backgroundColor: status.find((status) => status.statusName === value)?.statusColor || "none",
              }}
            >
              {value}
            </div>
          ),*/
        },
      ];
    }
  }, [userType, status]);

  const dynamicColumns = useMemo(() => {
    if (isSmallScreen) {
      return [
        columns[0], // First column
        columns[columns.length - 1], // Last column
      ];
    }
    return columns; // All columns
  }, [isSmallScreen, columns]);

  return (
    <div className="whereabouts-content">
      <div className="sorter-container">
        <div className="sorter-item" onClick={() => handleDepartmentChange(null)}>
          All
        </div>
        {department && (
          <>
            {department.map((department, index) => (
              <div className="sorter-item" key={index} onClick={() => handleDepartmentChange(department.departmentName)}>
                <div className="sorter-item-overlay" />
                <img src={CDNURL + "admin/" + department.departmentID} alt={department.departmentAcronym} />
                {/*{department.departmentName}*/}
              </div>
            ))}
          </>
        )}
      </div>
      <DataTable
        columns={dynamicColumns}
        data={data}
        onClick={handleRowClick}
        highlightedRowIndex={selectedRow && selectedRow.index} />
        {selectedRow && (
          <div className="popup-container-overlay">
            <div className="popup-container">
                <div className="department-logo-container">
                    <div className="department-logo">
                        <img src={FakeDeptLogo} />
                    </div>
                </div>
                <div className="whereabouts-details-container">
                    <h2>{selectedRow.original.name_popup}'s Whereabouts</h2>
                    <p>DIIT</p>
                    <div className="whereabouts-details">
                        <table className="whereabouts-details-table">
                            <tbody className="whereabouts-details-table-body">
                                <tr>
                                    <td>Room/Office name</td>
                                    <td>:</td>
                                    <td>{selectedRow.original.roomName}</td>
                                </tr>
                                <tr>
                                    <td>Room number</td>
                                    <td>:</td>
                                    <td>{selectedRow.original.roomNumber}</td>
                                </tr>
                                <tr>
                                    <td>Activity</td>
                                    <td>:</td>
                                    <td>{selectedRow.original.activityName}</td>
                                </tr>
                                <tr>
                                    <td>Status</td>
                                    <td>:</td>
                                    <td>{selectedRow.original.status}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="popup-btn">
                    <button onClick={handleClosePopup}>CLOSE</button>
                </div>

            </div>
        </div>
        )}
    </div>
  );
}

export default Whereabouts;
