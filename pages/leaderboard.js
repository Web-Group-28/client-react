import React, { useState, useEffect } from 'react';
import 'dotenv/config';

const LeaderBoard = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/leaderboard?size=5`);
        const data = await response.json();
        console.log("Response: " + data.data[0].name)
        setUsers(data.data);
        setCurrentPage(data.meta.page);
        setPageSize(data.meta.size);
        setTotalUsers(data.meta.count);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(totalUsers / pageSize);

  const handlePageChange = async newPage => {
    if (newPage >= 0 && newPage <= totalPages - 1) {
      setCurrentPage(newPage);
      try {
        const response = await fetch(`http://localhost:8000/api/leaderboard?size=5&page=` + newPage);
        const data = await response.json();
        console.log("Page: " + newPage)
        setUsers(data.data);
        setPageSize(data.meta.size);
        setTotalUsers(data.meta.count);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">Leader Board</h1>
      <ul className="list-group mr-4 ml-4">
        <li className="list-group-item d-flex justify-content-between">
          <p>
            Name
          </p>
          <p>
            Week Score
          </p>
        </li>
        {users.map(user => (
          <li key={user._id} className="list-group-item d-flex justify-content-between">
            <p>
              {user.name}
            </p>
            <p>
              {user.weekScore}
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-4 mr-4 ml-4 mb-5 d-flex justify-content-between align-items-center">
        <button className="btn btn-primary" onClick={() => handlePageChange(currentPage - 1)}>Previous Page</button>
        <p>
          Page {currentPage + 1} of {totalPages}, Total Users: {totalUsers}
        </p>
        <button className="btn btn-primary ml-2" onClick={() => handlePageChange(currentPage + 1)}>Next Page</button>
      </div>
    </>
  );
};

export default LeaderBoard;