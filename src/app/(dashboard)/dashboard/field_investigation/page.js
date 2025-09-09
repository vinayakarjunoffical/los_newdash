"use client"
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import { applications } from "@/utils/applications";
import FeildInv from "@/components/organism/FeildInv";
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
      <PageBreadcrumb title="Field Investigation" subtitle="Track all system activities and changes" />
      <div className="space-y-6">
        <ComponentCard title="Field Investigation" >
        <FeildInv data={applications} />
        </ComponentCard>
      </div>
    </div>
  );
}
