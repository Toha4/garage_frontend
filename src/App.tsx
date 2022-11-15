import React from "react";
import { Layout, Spin } from "antd";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import HandbooksPage from "./pages/HandbooksPage";
import LoginForm from "./pages/LoginPage";
import OrdersPage from "./pages/OrdersPage";
import WarehouseEntrancePage from "./pages/WarehouseEntrancePage";
import WarehouseRemainsPage from "./pages/WarehouseRemainsPage";
import PrivateRoute from "./PrivateRoute";
import { useAuth } from "./services/AuthService";
import HeaderMenu from "./components/HeaderMenu";
import NotFound from "./components/NotFound";
import ReportCarsPage from "./pages/ReportCarsPage";
import ReportMechanicsPage from "./pages/ReportMechanicPage";
import ReportMaterialsPage from "./pages/ReportMaterialsPage";

const { Content } = Layout;


function App() {
  const { isLogged, user } = useAuth();

  return (
    <div className="App">
      {isLogged !== null && (
        <Router>
          <Layout style={{ minWidth: "450px", width: "auto", background: "white" }}>
            {isLogged && <HeaderMenu user={user} />}
            <Content style={{ marginTop: isLogged ? "56px" : "0px", textAlign: "start" }} >
              <Routes>
                <Route path="/login" element={isLogged === false ? <LoginForm /> : <Navigate to="/" />} />
                <Route path="/" element={<PrivateRoute user={user} component={OrdersPage} title="Заказ-наряды"/>} />
                <Route path="/warehouse-remains" element={<PrivateRoute user={user} component={WarehouseRemainsPage} title="Материалы"/>} />
                <Route path="/warehouse-entrance" element={<PrivateRoute user={user} component={WarehouseEntrancePage} title="Поступления"/>} />
                <Route path="/report-cars" element={<PrivateRoute user={user} component={ReportCarsPage} title="Отчет по ремонту ТС"/>} />
                <Route path="/report-mechanics" element={<PrivateRoute user={user} component={ReportMechanicsPage} title="Отчет по работникам"/>} />
                <Route path="/report-materials" element={<PrivateRoute user={user} component={ReportMaterialsPage} title="Отчет по материалам"/>} />
                <Route path="/handbooks" element={<PrivateRoute user={user} component={HandbooksPage} title="Справочники"/>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Content>
          </Layout>
        </Router>
      )}
      {isLogged === null && (
        <div className="loading-app">
          <Spin />
        </div>
      )}
    </div >
  );
}

export default App;