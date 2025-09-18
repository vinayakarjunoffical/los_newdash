"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { riskData } from "@/utils/risk2";
import DataTE from "@/components/atoms/tables/DataTE";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) router.replace("/login");
  }, [router]);

  const renderStatus = (value) => {
    switch (value) {
      case "approved":
        return (
          <span className="flex items-center gap-1 text-green-600 font-medium">
            <CheckCircle className="w-4 h-4" />
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 text-red-600 font-medium">
            <XCircle className="w-4 h-4" />
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center gap-1 text-yellow-600 font-medium">
            <Clock className="w-4 h-4" />
          </span>
        );
      default:
        return value;
    }
  };

  const columns = [
    { key: "id", label: "Risk ID", sortable: true },
    { key: "application_id", label: "Application Id", sortable: true },
    { key: "name", label: "User Name", sortable: true },
    { key: "phone_number", label: "Phone", sortable: true },
    { key: "user_type", label: "Type", sortable: true },
    { key: "business_type", label: "Business Type", sortable: true },
    {
      key: "status.application",
      label: "AS",
      sortable: true,
      render: (item) => renderStatus(item.status.application),
    },
    {
      key: "status.fi",
      label: "FS",
      sortable: true,
      render: (item) => renderStatus(item.status.fi),
    },
    {
      key: "status.credit",
      label: "CS",
      sortable: true,
      render: (item) => renderStatus(item.status.credit),
    },
    {
      key: "status.pdi",
      label: "PS",
      sortable: true,
      render: (item) => renderStatus(item.status.pdi),
    },
    { key: "application_date", label: "Created At", sortable: true },
  ];
  return (
    <div>
      <PageBreadcrumb
        showBackButton
        onBack={() => router.back()}
        title="Pre-Disbursement Inspection"
        subtitle="Reviewing financial and personal details prior to loan release"
      />
      <div className="space-y-6">
        <ComponentCard title="Application data">
          <div className="w-full sm:w-[600px] md:w-[750px] lg:w-[950px] xl:w-[1100px] mx-auto scroll-smooth">
            <DataTE
              columns={columns}
              data={riskData}
              itemsPerPage={10}
              enableSearch
              enableSelection
              actionBasePath="/dashboard/disburement"
              actionParams={["id"]}
            />
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
