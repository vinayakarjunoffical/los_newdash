"use client";

import DataTE from "@/components/atoms/tables/DataTE";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react"; 
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
        useEffect(() => {
          const userId = localStorage.getItem("userId");
          if (!userId) router.replace("/login");
        }, [router]);
  return (
    <div className="">
      <PageBreadcrumb
        title="Credit Analysis"
        subtitle="Track all system activities and changes"
      />
      <div className="space-y-6">
        <ComponentCard title="Field Investigation">
          <DataTE
            columns={columns}
        data={integrationData}
        itemsPerPage={10}
        enableSearch
        enableSelection
        actionBasePath="/integrations"
        actionParams={["id"]}
          />
        </ComponentCard>
      </div>
    </div>
  );
}
