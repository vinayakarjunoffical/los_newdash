"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DocProfileCar from "@/components/molecules/DocProfileCar";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { retailerData } from "@/utils/retailerData";

export default function Page() {
  const { id, did } = useParams();
  const [retailer, setRetailer] = useState(null);
  const [docInfo, setDocInfo] = useState(null);
    const router = useRouter();

  useEffect(() => {
    if (id && did) {
      const foundRetailer = retailerData.find((r) => r.id === Number(id));

      if (foundRetailer) {
        const document = foundRetailer.documentsInfo?.[did] || null;

        setRetailer(foundRetailer);
        setDocInfo(document);
      } else {
        setRetailer(null);
        setDocInfo(null);
      }
    }
  }, [id, did]);

  // console.log("Retailer Data =>", retailer);
  // console.log("Doc Info =>", docInfo);

  return (
    <div>
      <PageBreadcrumb showBackButton
      onBack={() => router.back()} title="Document Information"  />
      <div className="space-y-6">
        <ComponentCard title="Application data">
          {retailer ? (
            <DocProfileCar
              userName={retailer?.userName || retailer?.kyc?.personalDetails?.fullName}
              docInfo={docInfo} type={did}
            />
          ) : (
            <p className="text-gray-500">No retailer found</p>
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
