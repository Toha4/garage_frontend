import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Menu, MenuProps } from "antd";
import {
  AppstoreAddOutlined,
  FileTextOutlined,
  HomeOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import User from "./User";
import { IUser } from "../services/AuthService";

const { Header } = Layout;

interface IHeaderMenu {
  user: IUser | null;
}

const HeaderMenu: React.FC<IHeaderMenu> = ({ user }) => {
  const { pathname } = useLocation();

  const menuItems: MenuProps["items"] = [
    {
      key: "/",
      icon: <ToolOutlined />,
      label: <Link to="/"> Заказ-наряды </Link>,
    },
    {
      key: "/warehouse",
      icon: <HomeOutlined />,
      label: <Link to="/warehouse"> Склад </Link>,
      disabled: true,
    },
    {
      key: "3",
      icon: <FileTextOutlined />,
      label: "Отчеты",
      disabled: true,
      children: [
        {
          key: "/report-vehicles",
          label: <Link to="/report-vehicles"> По ТС </Link>,
        },
        {
          key: "/report-2",
          label: <Link to="/report-2"> По ТС подробно </Link>,
        },
        {
          key: "/report-3",
          label: <Link to="/report-3"> По работникам </Link>,
        },
        {
          key: "/report-4",
          label: <Link to="/report-4"> По материалам </Link>,
        },
      ],
    },
    {
      key: "/handbooks",
      icon: <AppstoreAddOutlined />,
      label: <Link to="/handbooks"> Справочник </Link>,
    },
  ];

  return (
    <Header className="header">
      <div className="wrap-header">
        <div style={{ flex: 1 }}>
          <Menu
            className="menu"
            mode="horizontal"
            items={menuItems}
            defaultSelectedKeys={["1"]}
            selectedKeys={[pathname]}
          />
        </div>
        <User user={user} />
      </div>
    </Header>
  );
};

export default HeaderMenu;
