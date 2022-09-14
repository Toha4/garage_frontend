import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import AuthService from "../services/AuthService";
import { openNotification } from "../helpers/openNotification";
import logo from "../assets/img/login_image.png";

interface LocationState {
  from: {
    pathname: string;
  };
}

type CredentialsTypes = {
  username: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleFinish = (values: CredentialsTypes) => {
    AuthService.login({
      username: values.username,
      password: values.password
    })
      .then(onLoginFinished)
      .catch(onLoginError);
  }

  const onLoginFinished = () => {
    const { from } = location.state as LocationState || { from: { pathname: "/" } };
    navigate(from, { replace: true, state: { from: 'login' } });
  }

  const onLoginError = (error: any) => {
    openNotification(
      error.detail,
      "error",
      "Ошибка входа"
    );
  }

  return (
    <>
      <div className="limiter">
        <div className="container-login">
          <div className="wrap-login">
            <div className="login-pic">
              <img src={logo} alt="IMG" />
            </div>
            <Form className="login-form" onFinish={handleFinish}>
              <span className="login-form-title">
                Вход
              </span>

              <Form.Item className="wrap-input" name="username" rules={[{ required: true, message: 'Введите имя пользователя!', }]}>
                <Input
                  className="txt1 aliceblue-input"
                  placeholder="Имя пользователя"
                  prefix={
                    <i className="icon text-primary lnr-user" />
                  }
                />
              </Form.Item>

              <Form.Item className="wrap-input" name="password" rules={[{ required: true, message: 'Введите пароль!' }]}>
                <Input.Password
                  className="txt1 aliceblue-input"
                  placeholder="Пароль"
                  prefix={
                    <i className="icon text-primary lnr-lock" />
                  }
                />
              </Form.Item>

              <div className="container-login-form-btn">
                <Button className="login-form-btn" type="primary" htmlType="submit">
                  Войти
                </Button>
              </div>

              <div style={{ paddingTop: "136px" }}>
                <span />
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginForm