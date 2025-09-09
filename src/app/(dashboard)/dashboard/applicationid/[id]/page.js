"use client"
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import KycProfileCard from "@/components/molecules/KycProfileCard";
import React from "react";
import { useRouter, useParams } from "next/navigation";



export default function Page({ params }) {
  const { id } = useParams();
  const router = useRouter();

  return (
    <div className="">
      <PageBreadcrumb showBackButton
      onBack={() => router.back()} title="Application Data" />
      <div className="space-y-6">
        <ComponentCard title="Application data">
          <KycProfileCard id={id} />
        </ComponentCard>
      </div>
    </div>
  );
}
