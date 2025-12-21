import React from "react";
import PartnerNavbar from "./PartnerNavbar";

const PartnerNavWrapper = ({ children }) => {
  return (
    <>
      <PartnerNavbar />
      {children}
    </>
  );
};

export default PartnerNavWrapper;
