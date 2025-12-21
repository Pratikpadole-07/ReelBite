import React from "react";
import { Outlet } from "react-router-dom";
import PartnerNavbar from "../components/partner/PartnerNavbar";

const PartnerLayout = () => {
  return (
    <>
      <PartnerNavbar />
      <div style={{ paddingTop: "20px" }}>
        <Outlet />
      </div>
    </>
  );
};

export default PartnerLayout;
