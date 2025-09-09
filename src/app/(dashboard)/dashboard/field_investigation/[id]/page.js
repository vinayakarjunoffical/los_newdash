"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UploaddocFI from "@/components/molecules/UploaddocFI";
import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

// ✅ Client Component
export default function Page() {
   const router = useRouter();
   const params = useParams();              
  const searchParams = useSearchParams();   

  const id = params.id;                 
  const userType = searchParams.get("userType"); 

  console.log("Page params:", id, userType);

  return (
    <div>
      <PageBreadcrumb  onBack={() => router.back()} title="Field Investigation" showBackButton />
      <div className="space-y-6">
        <ComponentCard title="Application data">
          <UploaddocFI userId={id} userType={userType} />
        </ComponentCard>
      </div>
    </div>
  );
}
