import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";
import UserNav from "../nav/UserNav";

const UserRoute = ({ children, showNav = true }) => {
  // state
  const [ok, setOk] = useState(false);
  // router
  const router = useRouter();

  useEffect(() => {
    //fetchUser();
  }, []);

  // const fetchUser = async () => {
  //   try {
  //     const data = window.localStorage.getItem(user);
  //     //   console.log(data);
  //     if (data) setOk(true);
  //   } catch (err) {
  //     console.log(err);
  //     setOk(false);
  //     router.push("/login");
  //   }
  // };

  return (
    <>
       (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2">{showNav && <UserNav />}</div>
            <div className="col-md-10">{children}</div>
          </div>
        </div>
      )
    </>
  );
};

export default UserRoute;