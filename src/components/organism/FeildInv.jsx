"use client";

import React from "react";
import DataTE from "../atoms/tables/DataTE";
import { Badge } from "@/components/ui/badge";

const FeildInv = ({ data }) => {
  const columns = [
  { key: "applicationId", label: "Application ID", sortable: true, align: "center" },
  { key: "userName", label: "User Name", sortable: true, align: "left" },
  { key: "mobileNo", label: "Mobile No", align: "center" },
  { key: "applicationDate", label: "Date", sortable: true, align: "center" },
 {
    key: "userType",
    label: "User Type",
    sortable: true,
    align: "center",
    render: (item) => (
      <Badge variant={item.userType === "Retailer" ? "secondary" : "default"}>
        {item.userType}
      </Badge>
    ),
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    align: "center",
    render: (item) => (
      <Badge variant={item.status.includes("Pending") ? "secondary" : "default"}>
        {item.status}
      </Badge>
    ),
  },
  // {
  //   key: "fiDetails",
  //   label: "Verification Status",
  //   align: "center",
  //   render: (item) => item.fiDetails?.verificationStatus || "-",
  // },
  {
    key: "fiDetails",
    label: "Investigator",
    align: "left",
    render: (item) => item.fiDetails?.investigatorName || "-",
  },
  {
    key: "fiDetails",
    label: "Assigned Date",
    align: "center",
    render: (item) => item.fiDetails?.assignedDate || "-",
  },
  {
    key: "fiDetails",
    label: "Visit Date",
    align: "center",
    render: (item) => item.fiDetails?.visitDate || "-",
  },
];

  return (
    <div className="w-full sm:w-[600px] md:w-[750px] lg:w-[950px] xl:w-[1100px] mx-auto">
        <DataTE
      columns={columns}
      data={data}   
      itemsPerPage={10}
      enableSearch
      enableSelection
      actionBasePath="/dashboard/field_investigation"  
       actionParams={["id", "userType"]}
    />
    </div>
  );
};

export default FeildInv;
