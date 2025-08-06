// export default function HomePage() {
//   return <h1>Home Page</h1>;
// }

import React from "react";
import "./HomePage.css";
import logo from "../HomePage/sc_logo.png";

const HomePage = () => {
  return (
    <div className="homepage">
      <img src={logo} alt="logo" />
      <p>
        Welcome to Social Capital - a modern networking platform where
        professionals connect, collaborate, and grow. Whether you're expanding
        your network, building a community, or exploring new opportunities,
        Social Capital is here to help you make every connection count.
      </p>
    </div>
  );
};

export default HomePage;
