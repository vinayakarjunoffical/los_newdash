"use client"
import AuditTable from "@/components/atoms/tables/AuditTable";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";





export default function BasicTables() {
    const router = useRouter();
      useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) router.replace("/login");
      }, [router]);
  return (
    <div>
      <PageBreadcrumb title="Audit Logs" subtitle="Track all system activities and changes" />
      <div className="space-y-6">
        <ComponentCard title="Application data">
          <AuditTable />
        </ComponentCard>
      </div>
    </div>
  );
}
