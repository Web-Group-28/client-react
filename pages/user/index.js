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
  var userD;

  useEffect( () => {
     loadUserData();
  }, []);


  const loadUserData = 
   async () => {
    try {
      setLoading(true);
      userD = window.localStorage.getItem(user);
      console.log(user, userD);
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
            {/* <h2 className="font-weight-bold mb-4" style={{ fontSize: '24px' }}>
            {user && user.data.name}
            </h2>
            <p className="font-weight-bold" style={{ fontSize: '18px' }}>
              Email: {user && user.data.email}
            </p>
            <p className="font-weight-bold" style={{ fontSize: '18px' }}>
              Week Score: {user && user.data.weekScore}
            </p> */}
            <div class="card">
              <img src="https://lh3.googleusercontent.com/oUUiPB9sq3ACq4bUaRmo8pgvC4FUpRRrQKcGIBSOsafawZfRpF1vruFeYt6uCfL6wGDQyvOi6Ez9Bpf1Fb7APKjIyVsft7FLGR6QqdRFTiceNQBm1In9aZyrXp33cZi9pUNqjHASdA=s170-no" alt="Person" class="card__image" />
              <p class="card__name"> {user && user.data.name}</p>
              <div class="grid-container">

                <div class="grid-child-posts">
                  Email: {user && user.data.email}
                </div>

                <div class="grid-child-followers">
                  Week Score: {user && user.data.weekScore}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </UserRoute>
  );
};

export default UserIndex;