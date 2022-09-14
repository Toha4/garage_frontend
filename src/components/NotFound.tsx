import React from "react";
import logo from "../assets/img/not_found.png"


const NotFound: React.FC = () => {
  return (
    <div className="not-found">
      <img src={logo} alt="Not found"/>
    </div>
  );
};

export default NotFound;