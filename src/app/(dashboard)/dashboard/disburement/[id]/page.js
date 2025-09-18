"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { riskData } from "@/utils/risk";
import RiskAllData from "@/components/organism/RiskAllData";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) router.replace("/login");
  }, [router]);


  return (
    <div>
      <PageBreadcrumb
        showBackButton
        onBack={() => router.back()}
        title="Risk Assessment"
      />
      <div className="space-y-6">
        <ComponentCard >
          <RiskAllData />
        </ComponentCard>
      </div>
    </div>
  );
}



//******************************************************************** */


