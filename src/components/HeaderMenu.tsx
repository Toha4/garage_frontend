import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Menu, MenuProps } from "antd";
import { AppstoreAddOutlined, FileTextOutlined, HomeOutlined, ToolOutlined, UnorderedListOutlined } from "@ant-design/icons";
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
      key: "/cars-tasks",
      icon: <UnorderedListOutlined />,
      label: <Link to="/cars-tasks"> Задачи </Link>,
    },
    {
      key: "/warehouse",
      icon: <HomeOutlined />,
      label: "Склад",
      children: [
        {
          key: "/warehouse-remains",
          label: <Link to="/warehouse-remains"> Материалы </Link>,
        },
        {
          key: "/warehouse-entrance",
          label: <Link to="warehouse-entrance"> Поступления </Link>,
        },
      ],
    },
    {
      key: "3",
      icon: <FileTextOutlined />,
      label: "Отчеты",
      children: [
        {
          key: "/report-cars",
          label: <Link to="/report-cars"> По ремонту ТС </Link>,
        },
        {
          key: "/report-mechanics",
          label: <Link to="/report-mechanics"> По работникам </Link>,
        },
        {
          key: "/report-materials",
          label: <Link to="/report-materials"> По материалам </Link>,
        },
        {
          key: "/report-car-detail",
          label: <Link to="/report-car-detail"> По ТС подробный </Link>,
        },
      ],
    },
    {
      key: "/handbooks",
      icon: <AppstoreAddOutlined />,
      label: <Link to="/handbooks"> Справочники </Link>,
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
