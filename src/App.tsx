import React from "react";
import { Layout, Spin } from "antd";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import HandbooksPage from "./pages/HandbooksPage";
import LoginForm from "./pages/LoginPage";
import OrdersPage from "./pages/OrdersPage";
import PrivateRoute from "./PrivateRoute";
import { useAuth } from "./services/AuthService";
import HeaderMenu from "./components/HeaderMenu";
import NotFound from "./components/NotFound";

const { Content } = Layout;


function App() {
  const { isLogged } = useAuth();

  return (
    <div className="App">
      {isLogged !== null && (
        <Router>
          <Layout style={{ minWidth: '450px', width: 'auto', background: "white" }}>
            {isLogged && <HeaderMenu />}
            <Content style={{ marginTop: isLogged ? "64px" : "0px", textAlign: "start" }} >
              <Routes>
                <Route path="/login" element={isLogged === false ? <LoginForm /> : <Navigate to='/' />} />
                <Route path="/" element={<PrivateRoute component={OrdersPage} />} />
                {/* <Route path='/warehouse' element={<PrivateRoute component={WarehousePage} />} /> */}
                {/* <Route path='/report-vehicles' element={<PrivateRoute component={ReportVehiclesPage} />} /> */}
                <Route path='/handbooks' element={<PrivateRoute component={HandbooksPage} />} />
                <Route path='*' element={<NotFound />} />
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