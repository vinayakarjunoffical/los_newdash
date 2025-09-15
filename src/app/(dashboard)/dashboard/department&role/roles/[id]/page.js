"use client"

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PermissionCode from "@/components/molecules/PermissionCode";


export default function Page() {
    const router = useRouter();
      useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) router.replace("/login");
      }, [router]);
  return (
    <div>
      <PageBreadcrumb showBackButton
      onBack={() => router.back()}  title="Premission"  />
      <div className="space-y-6">
        <ComponentCard title="Application data">
         <PermissionCode />
        </ComponentCard>
      </div>
    </div>
  );
}
