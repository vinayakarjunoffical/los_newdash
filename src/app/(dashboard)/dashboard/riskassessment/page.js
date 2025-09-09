"use client";

import DataTE from "@/components/atoms/tables/DataTE";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import { credit } from "@/utils/credit";
import { Badge } from "@/components/ui/badge"; 
import { CheckCircle, XCircle, Clock } from "lucide-react"; 
import { useRouter} from "next/navigation";
import { useEffect } from "react";

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
            columns={[
              { key: "applicationId", label: "Application ID", sortable: true },
              { key: "userType", label: "User Type", sortable: true },
              { key: "applicationDate", label: "Application Date", sortable: true },
              { key: "fiDate", label: "FI Date", sortable: true },
              { key: "creditAnalysisDate", label: "Credit Analysis Date", sortable: true },
              {
                key: "creditAnalysisStatus",
                label: "Credit Status",
                sortable: true,
                render: (row) => {
                  const status = row.creditAnalysisStatus;

                  if (status === "verified") {
                    return (
                      <Badge variant="outline" className="flex items-center p-2 gap-1">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        Verified
                      </Badge>
                    );
                  }

                  if (status === "pending") {
                    return (
                      <Badge variant="outline" className="flex items-center p-2 gap-1">
                        <Clock className="w-6 h-6 text-yellow-600" />
                        Pending
                      </Badge>
                    );
                  }

                  if (status === "rejected") {
                    return (
                      <Badge variant="outline" className="flex items-center gap-1 p-2">
                        <XCircle className="w-6 h-6 text-red-600" />
                        Rejected
                      </Badge>
                    );
                  }

                  return (
                    <Badge variant="secondary" className="capitalize">
                      {status}
                    </Badge>
                  );
                },
              },
            ]}
            data={credit}
            itemsPerPage={5}
            enableSearch
            enableSelection
            actionBasePath="/dashboard/riskassessment"
            actionParams={["id"]}
          />
        </ComponentCard>
      </div>
    </div>
  );
}
