import React, { Fragment } from "react";
import { Avatar, Button } from "antd";
import { SettingOutlined, UserOutlined } from "@ant-design/icons";
import AuthService, { IUser as User_ } from "../services/AuthService";
import logout from "../assets/img/logout.png";


interface IUser {
  user: User_ | null
};

const User: React.FC<IUser> = ({user}) => {
  const onLogout = () => {
    AuthService.logout()
      .catch((error) => (
        alert(error)
      ));
  }

  return (
    <Fragment>
      <div className="header-control">
        {user?.is_superuser &&
          <Button href="/admin/" shape="circle" icon={<SettingOutlined />} />
        }
        <div className="user-block">
          <Avatar
            style={{
              backgroundColor: "#87d068"
            }}
            icon={<UserOutlined />}
            size="large"
          />
          <div className="user-username">
            {user && user.full_name}
          </div>
        </div>
        <div className="logout-block">
          <button onClick={onLogout} style={{
            padding: "0",
            border: "none",
            background: "none",
            cursor: "pointer"
          }}>
            <img src={logout} alt="logo" />
          </button>
        </div>
      </div>
    </Fragment>
  );
}

export default User;