import { useContext, useEffect, useState } from "react";
import { Context } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import axios from "axios";
import { SyncOutlined, PlayCircleOutlined } from "@ant-design/icons";

const UserIndex = () => {
  const {
    state: { user },
  } = useContext(Context);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);


  const loadUserData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/profile/userData");
      setUserData(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };


  return (
    <UserRoute>
      {loading && (
        <SyncOutlined
          spin
          className="d-flex justify-content-center display-1 text-danger p-5"
        />
      )}
      <h1 className="jumbotron text-center square">User profile</h1>

      <div className="container">
        <div className="row">
        <div className="col-md-8">
            <h2 className="font-weight-bold mb-4" style={{ fontSize: '24px' }}>
              {userData.name}
            </h2>
            <p className="font-weight-bold" style={{ fontSize: '18px' }}>
              Email: {userData.email}
            </p>
            <p className="font-weight-bold" style={{ fontSize: '18px' }}>
              Week Score: {userData.weekScore}
            </p>
          </div>
        </div>
      </div>

    </UserRoute>
  );
};

export default UserIndex;