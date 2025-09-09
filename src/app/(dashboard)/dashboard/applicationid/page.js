"use client";

import React from "react";
import DataTE from "@/components/atoms/tables/DataTE";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Import central JSON
import { retailerData } from "@/utils/retailerData";

// export const metadata = {
//   title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
//   description:
//     "This is Next.js Basic Table page for TailAdmin Tailwind CSS Admin Dashboard Template",
// };

export default function Page() {
     const router = useRouter();
    useEffect(() => {
      const userId = localStorage.getItem("userId");
      if (!userId) router.replace("/login");
    }, [router]);
  return (
    <div>
      <PageBreadcrumb title="Application Data" />
      <div className="space-y-6">
        <ComponentCard title="Application data">
          <DataTE
            columns={[
              { key: "applicationId", label: "Application ID", sortable: true },
              { key: "userName", label: "User Name", sortable: true },
              { key: "address", label: "Address" },
              { key: "mobileNo", label: "Mobile No" },
              { key: "status", label: "Status", sortable: true },
              { key: "email", label: "Email" },
              {
                key: "applicationDate",
                label: "Application Date",
                sortable: true,
              },
            ]}
            data={retailerData}
            itemsPerPage={10}
            enableSearch
            enableSelection
            actionBasePath="/dashboard/applicationid"
            actionParams={["id"]}
          />
        </ComponentCard>
      </div>
    </div>
  );
}
