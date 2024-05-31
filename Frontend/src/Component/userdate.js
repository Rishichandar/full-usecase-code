import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDataSearch = () => {
  const [userData, setUserData] = useState([]);
  const [filteredUserData, setFilteredUserData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    axios
      .get("http://localhost:4023/alldatas")
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setError("Error fetching user data. Please try again later.");
      });
  };

  const handleSearch1 = () => {
    const filteredData = userData.filter((user) => {
      const userDate = new Date(user.Date);
      const searchDate = selectedDate ? new Date(selectedDate) : null;

      return (
        searchDate && userDate.toDateString() === searchDate.toDateString()
      );
    });

    setFilteredUserData(filteredData);
  };

  return (
    <div>
      <h2>User Data Search</h2>
      <div>
        <label htmlFor="selectedDate">Select Date:</label>
        <input
          type="date"
          id="selectedDate"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      <button onClick={handleSearch1}>Search</button>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Date</th>
            <th>Time</th>
            <th>Activity Type</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {filteredUserData.map((user) => (
            <tr key={user.id}>
              <td>{user.Userid}</td>
              <td>{user.Date}</td>
              <td>{user.Time}</td>
              <td>{user.Activity_type}</td>
              <td>{user.Comments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDataSearch;
