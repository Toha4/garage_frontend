import React, { Fragment } from "react";
import { Avatar, Button, Tooltip } from "antd";
import { SettingOutlined, UserOutlined } from "@ant-design/icons";
import AuthService, { IUser as User_ } from "../services/AuthService";
import logout from "../assets/img/logout.png";

interface IUser {
  user: User_ | null;
}

const User: React.FC<IUser> = ({ user }) => {
  const onLogout = () => {
    AuthService.logout().catch((error) => alert(error));
  };

  return (
    <Fragment>
      <div className="header-control">
        {user?.is_superuser && <Button href="/admin/" shape="circle" icon={<SettingOutlined />} />}
        <div className="user-block">
          <Avatar
            style={{
              backgroundColor: user?.edit_access ? "#87d068" : "#D3D3D3",
            }}
            icon={<UserOutlined />}
            size="large"
          />
          <Tooltip title={user?.edit_access ? "Редактирование разрешено" : "Редактирование запрещено"}>
            <div className="user-username">{user && user.full_name}</div>
          </Tooltip>
        </div>
        <div className="logout-block">
          <button
            onClick={onLogout}
            style={{
              padding: "0",
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
          >
            <img src={logout} alt="logo" />
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default User;
