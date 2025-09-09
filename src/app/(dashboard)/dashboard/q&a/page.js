"use client"

import Questions from "@/components/atoms/Questions";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import { useRouter} from "next/navigation";
import { useEffect } from "react";

export default function Page() {
const router = useRouter();
          useEffect(() => {
            const userId = localStorage.getItem("userId");
            if (!userId) router.replace("/login");
          }, [router]);
  return (
    <div>
      <PageBreadcrumb showBackButton
      onBack={() => router.back()} title="Questionnaire Setup"  />
      <div className="space-y-6">
        <ComponentCard title="Application data">
          <Questions />
        </ComponentCard>
      </div>
    </div>
  );
}
