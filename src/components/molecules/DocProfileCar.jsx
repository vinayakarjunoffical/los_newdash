"use client"
import React from 'react'
import UserMetaCard from '../atoms/docprofile/UserMetaCard'
import UserInfoCard from '../atoms/docprofile/UserInfoCard'
import { useSearchParams } from "next/navigation";
import { retailerData } from "@/utils/retailerData";
import { useParams } from "next/navigation";

const DocProfileCar = ({ userName, docInfo ,type }) => {
   console.log("User Name1 =>", userName);
  console.log("Doc Info1 =>", docInfo);
  return (
    <>
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-white/[0.03] lg:p-1">
        <div className="space-y-6">
          <UserMetaCard userName={userName} type={type} />
          <UserInfoCard doc={docInfo} type={type} />
          {/* <UserAddressCard /> */}
        </div>
      </div>
    </div>
    </>
  )
}

export default DocProfileCar