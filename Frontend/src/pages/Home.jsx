import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <h1>This is The Main Home Page</h1>
      <Link to="/login">Login</Link>
    </>
  );
};

export default Home;