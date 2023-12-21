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
        const response = await fetch(`http://localhost:8000/api/leaderboard`);
        const data = await response.json();
        console.log("Response: " + data.data[0].name)
        setUsers(data.data);
        setCurrentPage(data.meta.page + 1);
        setPageSize(data.meta.size);
        setTotalUsers(data.meta.count);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(totalUsers / pageSize);

  const handlePageChange = newPage => {
    // Kiểm tra xem trang mới có hợp lệ không
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">Leader Board</h1>
      <ul className="list-group">
        {users.map(user => (
            <li key={user._id} className="list-group-item">{user.name}, {user.weekScore}</li>
          ))}
      </ul>
      <div className="mt-4 d-flex justify-content-between align-items-center">
        <p>
          Page {currentPage} of {totalPages}, Total Users: {totalUsers}
        </p>
        <button className="btn btn-primary" onClick={() => handlePageChange(currentPage - 1)}>Previous Page</button>
        <button className="btn btn-primary ml-2" onClick={() => handlePageChange(currentPage + 1)}>Next Page</button>
      </div>
    </>
  );
};

export default LeaderBoard;