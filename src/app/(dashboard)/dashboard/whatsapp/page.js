"use client"

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PDIPage from "@/components/molecules/PDIPage";
import WhatsAppIntegration from "@/components/organism/WhatsAppIntegration";

export default function Page() {
    const router = useRouter();
      useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) router.replace("/login");
      }, [router]);
  return (
    <div>
      <PageBreadcrumb showBackButton
      onBack={() => router.back()}  title="Pre-Disbursement Inspection" subtitle="Reviewing financial and personal details prior to loan release"  />
      <div className="space-y-6">
        <ComponentCard title="Application data">
           <WhatsAppIntegration />
        </ComponentCard>
      </div>
    </div>
  );
}
