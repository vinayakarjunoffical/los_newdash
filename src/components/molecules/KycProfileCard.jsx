"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  XCircle,
  FileText,
  Store,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { retailerData } from "@/utils/retailerData";

export default function KycProfileCard({ id }) {
  const [openDialog, setOpenDialog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifiedDocs, setVerifiedDocs] = useState([]);
  const [sdkResponse, setSdkResponse] = useState(null);

  const router = useRouter();

  const application = retailerData.find((app) => String(app.id) === String(id));
  if (!application) {
    return (
      <div className="p-6 text-red-500">
         No application found for ID {id}
      </div>
    );
  }

  const retailer = application.kyc;
  const documents = application.documentsInfo;
  const kycStatus = application.status || "pending";

  const handleFetch = async (index) => {
    setOpenDialog(index);
    setLoading(true);

    const docType = Object.keys(documents)[index];

    if (docType === "bank_statement") {
      try {
        const res = await fetch("/api/generate-url", { method: "POST" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "SDK request failed");

        if (data.finalUrl) {
          window.open(data.finalUrl, "_blank");
          toast.success("Bank statement SDK opened!");
        } else {
          toast.error("No SDK URL received");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch bank statement from SDK");
      } finally {
        setLoading(false);
      }
    } else {
      setTimeout(() => setLoading(false), 1500);
    }
  };

  const handleVerify = (index) => {
    setVerifiedDocs((prev) => [...prev, index]);
    setOpenDialog(null);
  };

  const handleApprove = () => {
    toast.success(
      `${retailer.personalDetails.fullName}'s KYC has been approved successfully.`
    );
  };

  const handleReject = () => {
    toast.error(`${retailer.personalDetails.fullName}'s KYC has been rejected.`);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
      in_review: { label: "In Review", className: "bg-blue-100 text-blue-800" },
      approved: { label: "Approved", className: "bg-green-100 text-green-800" },
      rejected: { label: "Rejected", className: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="p-2">
  {/* Header */}
  <div className="mb-4 flex justify-between items-start">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Admin Review - {retailer.personalDetails.fullName}
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Review all KYC data and documents for approval
      </p>
    </div>
    <div className="flex items-center space-x-3 pt-2">
      {getStatusBadge(kycStatus)}
      <div className="flex space-x-2">
        <Button onClick={handleApprove}>
          <CheckCircle className="h-4 w-4 mr-2" />
          Approve
        </Button>
        <Button variant="destructive" onClick={handleReject}>
          <XCircle className="h-4 w-4 mr-2" />
          Reject
        </Button>
      </div>
    </div>
  </div>

  {/* Grid Layout */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Company Information */}
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center text-xl text-gray-800 dark:text-gray-100">
          <Store className="h-5 w-5 mr-2" />
          Company Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Business Type
          </label>
          <p className="text-gray-800 dark:text-gray-200">
            {application.businessType}
          </p>
        </div>
      </CardContent>
    </Card>

    {/* Contact Info */}
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center text-xl text-gray-800 dark:text-gray-100">
          <User className="h-5 w-5 mr-2" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium flex items-center text-gray-800 dark:text-gray-200">
            <User className="h-5 w-5 mr-2" />
            <p>{retailer.personalDetails.fullName}</p>
          </label>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <Mail className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
          <p>{retailer.personalDetails.emailAddress}</p>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <Phone className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
          <p>{retailer.personalDetails.mobileNumber}</p>
        </div>
      </CardContent>
    </Card>

    {/* Addresses */}
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl text-gray-800 dark:text-gray-100">
          Addresses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Current Address
          </label>
          <p className="text-gray-800 dark:text-gray-200">
            {retailer.addressInformation.currentAddress}
          </p>
        </div>
        <Separator className="dark:bg-gray-700" />
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Permanent Address
          </label>
          <p className="text-gray-800 dark:text-gray-200">
            {retailer.addressInformation.permanentAddress}
          </p>
        </div>
      </CardContent>
    </Card>

    {/* Bank Details */}
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl text-gray-800 dark:text-gray-100">
          Bank Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Personal Bank
          </label>
          <div className="text-gray-800 dark:text-gray-200">
            <p>Account: {retailer.bankDetails.personal.accountNumber}</p>
            <p>Holder: {retailer.bankDetails.personal.accountHolderName}</p>
            <p>IFSC: {retailer.bankDetails.personal.ifscCode}</p>
            <p>Bank: {retailer.bankDetails.personal.bankName}</p>
          </div>
        </div>
        {retailer.bankDetails.company && (
          <>
            <Separator className="dark:bg-gray-700" />
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Company Bank
              </label>
              <div className="text-gray-800 dark:text-gray-200">
                <p>
                  Account: {retailer.bankDetails.company.accountNumber}
                </p>
                <p>
                  Holder: {retailer.bankDetails.company.accountHolderName}
                </p>
                <p>IFSC: {retailer.bankDetails.company.ifscCode}</p>
                <p>Bank: {retailer.bankDetails.company.bankName}</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  </div>

  {/* Uploaded Documents (already styled) */}
  <Card className="mt-6 shadow-lg rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
    <CardHeader>
      <CardTitle className="flex items-center text-xl font-semibold text-gray-800 dark:text-gray-100">
        <FileText className="h-6 w-6 mr-2 text-primary" />
        Uploaded Documents
      </CardTitle>
    </CardHeader>

    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(documents).map(([docType, docData], index) => (
          <div
            key={index}
            className="flex flex-col justify-between p-5 border rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 pb-4">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-100">
                  {docType}
                </h4>
                <Badge
                  variant="outline"
                  className="mt-1 dark:border-gray-600 dark:text-gray-300"
                >
                  {docData?.["Holder Name"] ||
                    docData?.["Company Name"] ||
                    "Document"}
                </Badge>
              </div>
            </div>

            {verifiedDocs.includes(index) ? (
              <div className="flex items-center justify-between mt-4">
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  Verified
                </Badge>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    router.push(`/dashboard/applicationid/${id}/${docType}`)
                  }
                >
                  Review
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                className="w-full"
                onClick={() => handleFetch(index)}
              >
                Fetch
              </Button>
            )}

            {/* Dialog Popup */}
            <Dialog open={openDialog === index} onOpenChange={setOpenDialog}>
              <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <DialogHeader>
                  <DialogTitle className="dark:text-gray-100">
                    Document Preview
                  </DialogTitle>
                </DialogHeader>

                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-40 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : (
                  <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-sm dark:text-gray-200">
                    {Object.entries(docData).map(([key, value], i) => (
                      <p key={i}>
                        <b>{key}:</b> {value}
                      </p>
                    ))}
                    {docType === "bank_statement" && sdkResponse && (
                      <pre className="mt-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-xs overflow-x-auto text-gray-800 dark:text-gray-200">
                        {JSON.stringify(sdkResponse, null, 2)}
                      </pre>
                    )}
                  </div>
                )}

                {!loading && (
                  <DialogFooter>
                    <Button onClick={() => handleVerify(index)}>Verify</Button>
                  </DialogFooter>
                )}
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
</div>

  );
}



//******************************28-08-25 5:25******************************** */


// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import {
//   CheckCircle,
//   XCircle,
//   FileText,
//   Store,
//   User,
//   Phone,
//   Mail,
//   ArrowLeft,
// } from "lucide-react";
// import Link from "next/link";
// import { toast } from "sonner";
// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useRouter, useParams } from "next/navigation";
// import { retailerData } from "@/utils/retailerData";

// // const retailerData = {
// //   retailerKYC: {
// //     personalDetails: {
// //       fullName: "Rajesh Kumar",
// //       mobileNumber: "9876543210",
// //       emailAddress: "rajesh@example.com",
// //     },
// //     addressInformation: {
// //       currentAddress: "123 MG Road, Bangalore",
// //       permanentAddress: "45 Residency Road, Bangalore",
// //       liveSelfie: "",
// //     },
// //     bankDetails: {
// //       ifscCode: "HDFC0001234",
// //       bankName: "HDFC Bank",
// //       accountNumber: "1234567890",
// //       accountHolderName: "Rajesh Kumar",
// //     },
// //     shopKYC: {
// //       businessInformation: {
// //         businessType: "retailer",
// //         gstNumber: "29ABCDE1234F1Z5",
// //       },
// //       companyBankDetails: {
// //         ifscCode: "ICIC0004567",
// //         accountNumber: "9876543210",
// //         bankName: "ICICI Bank",
// //         accountHolderName: "Rajesh Enterprises Pvt Ltd",
// //       },
// //       documentUpload: {
// //         businessDocuments: [
// //           { documentType: "aadhaar_card", file: "aadhaar_rajesh.pdf" },
// //           { documentType: "pan_card", file: "pan_rajesh.pdf" },
// //           { documentType: "gst_certificate", file: "gst_cert.pdf" },
// //           { documentType: "shop_licence", file: "licence.pdf" },
// //           { documentType: "bank_statement", file: "statement.pdf" },
// //           { documentType: "shop_photo", file: "shop_photo.jpg" },
// //         ],
// //         shopPhotos: {
// //           inside: "inside.jpg",
// //           outside: "outside.jpg",
// //           signboard: "signboard.jpg",
// //         },
// //       },
// //     },
// //     directors: [
// //       {
// //         name: "Suresh Kumar",
// //         email: "suresh@example.com",
// //         mobileNumber: "9123456789",
// //       },
// //     ],
// //   },
// // };

// // const documentDetailsMap = {
// //   aadhaar_card: {
// //     "Holder Name": "Rajesh Kumar",
// //     "Aadhaar Number": "1234 5678 9012",
// //     "Mobile Number": "9876543210",
// //     Address: "123 MG Road, Bangalore",
// //     VID: "1234-5678-9012-3456",
// //     "Created By": "Admin User",
// //     "Created At": "2025-08-15 10:30 AM",
// //     "Updated At": "2025-08-18 04:45 PM",
// //   },
// //   pan_card: {
// //     "Holder Name": "Rajesh Kumar",
// //     "PAN Number": "ABCDE1234F",
// //     "Father's Name": "Suresh Kumar",
// //     DOB: "15-08-1980",
// //     "Created By": "Admin User",
// //     "Created At": "2025-08-10 09:15 AM",
// //     "Updated At": "2025-08-19 02:00 PM",
// //   },
// //   gst_certificate: {
// //     "Legal Name / Trade Name": "ABC Traders Pvt Ltd",
// //     "Address of Business": "123 Market Street, Mumbai, India",
// //     "PAN / Aadhaar of Proprietor": "ABCDE1234F",
// //     "Date of Incorporation / Registration of Business": "12-05-2018",
// //     "Constitution of Business": "Private Limited",
// //     "GSTIN / UIN Status": "Active",
// //     "Taxpayer Type": "Regular",
// //     "Aadhaar Authenticated?": "Yes (15-06-2020)",
// //     "e-KYC Verified": "Applicable",
// //     "Additional Trade Name (If Any)": "ABC Mart",
// //   },
// //   shop_licence: {
// //     "Licence Number": "LIC1234567",
// //     "Issued By": "BBMP",
// //     "Valid Till": "31-12-2025",
// //     "Created By": "Rajesh Kumar",
// //     "Created At": "2025-08-05 08:45 AM",
// //     "Updated At": "2025-08-18 05:30 PM",
// //   },
// //   bank_statement: {
// //     "Account Holder": "Rajesh Kumar",
// //     "Account Number": "1234567890",
// //     "IFSC Code": "HDFC0001234",
// //     Bank: "HDFC Bank",
// //     "Created By": "Bank Upload Bot",
// //     "Created At": "2025-08-11 11:20 AM",
// //     "Updated At": "2025-08-17 03:40 PM",
// //   },
// //   shop_photo: {
// //     "Photo Type": "Shop Front",
// //     "Uploaded File": "shop_photo.jpg",
// //     "Created By": "Rajesh Kumar",
// //     "Created At": "2025-08-14 07:50 AM",
// //     "Updated At": "2025-08-19 01:15 PM",
// //   },
// // };

// export default function KycProfileCard({id}) {
//   const [openDialog, setOpenDialog] = useState(null);
//   const [reviewDialog, setReviewDialog] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [verifiedDocs, setVerifiedDocs] = useState([]);
//   const [sdkResponse, setSdkResponse] = useState(null);
//   // const retailer = retailerData.retailerKYC;
//   // const documents = retailer.shopKYC.documentUpload.businessDocuments;
//   const router = useRouter();

//   // const kycStatus = "pending";
//   const application = retailerData.find((app) => String(app.id) === String(id));

//   if (!application) {
//     return (
//       <div className="p-6 text-red-500">
//         ❌ No application found for ID {id}
//       </div>
//     );
//   }
// const retailer = application.kyc;
//   const documents = application.documentsInfo;
//   const kycStatus = application.status || "pending";
//   const handleFetch = async (index) => {
//     const doc = documents[index];
//     setOpenDialog(index);
//     setLoading(true);

//     if (doc.documentType === "bank_statement") {
//       try {
//         // 🔹 Call your Next.js API route
//         const res = await fetch("/api/generate-url", { method: "POST" });
//         const data = await res.json();

//         if (!res.ok) throw new Error(data.error || "SDK request failed");

//         if (data.finalUrl) {
//           window.open(data.finalUrl, "_blank"); // open SDK in new tab
//           toast.success("Bank statement SDK opened!");
//         } else {
//           toast.error("No SDK URL received");
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("Failed to fetch bank statement from SDK");
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       // fallback existing 1.5 sec loader
//       setTimeout(() => setLoading(false), 1500);
//     }
//   };

//   const handleVerify = (index) => {
//     setVerifiedDocs((prev) => [...prev, index]);
//     setOpenDialog(null);
//   };

//   const handleApprove = () => {
//     toast.success(
//       `${retailer.personalDetails.fullName}'s KYC has been approved successfully.`
//     );
//   };

//   const handleReject = () => {
//     toast.error(
//       `${retailer.personalDetails.fullName}'s KYC has been rejected.`
//     );
//   };

//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
//       in_review: { label: "In Review", className: "bg-blue-100 text-blue-800" },
//       approved: { label: "Approved", className: "bg-green-100 text-green-800" },
//       rejected: { label: "Rejected", className: "bg-red-100 text-red-800" },
//     };

//     const config = statusConfig[status] || statusConfig.pending;
//     return <Badge className={config.className}>{config.label}</Badge>;
//   };

//   return (
//     <div className="p-6">
//       <div className="mb-6">
//         {/* <div className="flex items-center space-x-4 mb-4">
//           <Link href="/dashboard/applicationid">
//             <Button variant="outline" size="sm">
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back to Applications
//             </Button>
//           </Link>
//         </div> */}
//         <div className="flex justify-between items-start">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//               Admin Review - {retailer.personalDetails.fullName}
//             </h1>
//             <p className="text-gray-600 dark:text-gray-400">
//               Review all KYC data and documents for approval
//             </p>
//           </div>
//           <div className="flex items-center space-x-3">
//             {getStatusBadge(kycStatus)}
//             <div className="flex space-x-2">
//               <Button onClick={handleApprove}>
//                 <CheckCircle className="h-4 w-4 mr-2" />
//                 Approve
//               </Button>
//               <Button variant="destructive" onClick={handleReject}>
//                 <XCircle className="h-4 w-4 mr-2" />
//                 Reject
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Grid Layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Company Information */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <Store className="h-5 w-5 mr-2" />
//               Company Information
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div>
//               <label className="text-sm font-medium">Business Type</label>
//               <p>{retailer.shopKYC.businessInformation.businessType}</p>
//             </div>
//             <div>
//               <label className="text-sm font-medium">GST Number</label>
//               <p>{retailer.shopKYC.businessInformation.gstNumber}</p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <User className="h-5 w-5 mr-2" />
//               Contact Information
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div>
//               <label className="text-sm font-medium">Contact Person</label>
//               <p>{retailer.personalDetails.fullName}</p>
//             </div>
//             <div className="flex items-center">
//               <Mail className="h-4 w-4 mr-2 text-gray-500" />
//               <p>{retailer.personalDetails.emailAddress}</p>
//             </div>
//             <div className="flex items-center">
//               <Phone className="h-4 w-4 mr-2 text-gray-500" />
//               <p>{retailer.personalDetails.mobileNumber}</p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Addresses</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div>
//               <label className="text-sm font-medium">Current Address</label>
//               <p>{retailer.addressInformation.currentAddress}</p>
//             </div>
//             <Separator />
//             <div>
//               <label className="text-sm font-medium">Permanent Address</label>
//               <p>{retailer.addressInformation.permanentAddress}</p>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Bank Details */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Bank Details</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div>
//               <label className="text-sm font-medium">Personal Bank</label>
//               <div>
//                 <p>Account: {retailer.bankDetails.accountNumber}</p>
//                 <p>Holder: {retailer.bankDetails.accountHolderName}</p>
//                 <p>IFSC: {retailer.bankDetails.ifscCode}</p>
//                 <p>Bank: {retailer.bankDetails.bankName}</p>
//               </div>
//             </div>
//             <Separator />
//             <div>
//               <label className="text-sm font-medium">Company Bank</label>
//               <div>
//                 <p>
//                   Account: {retailer.shopKYC.companyBankDetails.accountNumber}
//                 </p>
//                 <p>
//                   Holder:{" "}
//                   {retailer.shopKYC.companyBankDetails.accountHolderName}
//                 </p>
//                 <p>IFSC: {retailer.shopKYC.companyBankDetails.ifscCode}</p>
//                 <p>Bank: {retailer.shopKYC.companyBankDetails.bankName}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Documents */}
//       <Card className="mt-6 shadow-lg rounded-2xl">
//         <CardHeader>
//           <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
//             <FileText className="h-6 w-6 mr-2 text-primary" />
//             Uploaded Documents
//           </CardTitle>
//         </CardHeader>

//         <CardContent>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {documents.map((document, index) => (
//               <div
//                 key={index}
//                 className="flex flex-col justify-between p-5 border rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 bg-white"
//               >
//                 {/* File Info */}
//                 <div className="flex items-center gap-3 pb-4">
//                   <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
//                     <FileText className="h-6 w-6 text-primary" />
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-gray-800">
//                       {document.file}
//                     </h4>
//                     <Badge variant="outline" className="mt-1">
//                       {document.documentType}
//                     </Badge>
//                   </div>
//                 </div>

//                 {/* Status & Actions */}
//                 {verifiedDocs.includes(index) ? (
//                   <div className="flex items-center justify-between mt-4">
//                     <Badge className="bg-green-100 text-green-700">
//                       Verified
//                     </Badge>
//                     <Button
//                       size="sm"
//                       variant="secondary"
//                       onClick={() =>
//                         router.push(`/dashboard/applicationid/${id}/${index}`)
//                       }
//                     >
//                       Review
//                     </Button>
//                   </div>
//                 ) : (
//                   <Button
//                     size="sm"
//                     className="w-full"
//                     onClick={() => handleFetch(index)}
//                   >
//                     Fetch
//                   </Button>
//                 )}

//                 {/* Dialog Popup for Fetch */}
//                 <Dialog
//                   open={openDialog === index}
//                   onOpenChange={setOpenDialog}
//                 >
//                   <DialogContent className="sm:max-w-md">
//                     <DialogHeader>
//                       <DialogTitle>Document Preview</DialogTitle>
//                     </DialogHeader>

//                     {loading ? (
//                       <div className="space-y-3">
//                         <Skeleton className="h-40 w-full rounded-lg" />
//                         <Skeleton className="h-4 w-3/4" />
//                       </div>
//                     ) : (
//                       <div className="p-4 border rounded-lg bg-gray-50">
//                         <p className="text-sm text-gray-600">
//                           Document: <b>{document.file}</b>
//                         </p>
//                         <p className="text-sm">Type: {document.documentType}</p>

//                         {/* ✅ Show SDK response only for bank statement */}
//                         {document.documentType === "bank_statement" &&
//                           sdkResponse && (
//                             <pre className="mt-3 bg-gray-100 p-3 rounded-lg text-xs overflow-x-auto">
//                               {JSON.stringify(sdkResponse, null, 2)}
//                             </pre>
//                           )}
//                       </div>
//                     )}

//                     {!loading && (
//                       <DialogFooter>
//                         <Button onClick={() => handleVerify(index)}>
//                           Verify
//                         </Button>
//                       </DialogFooter>
//                     )}
//                   </DialogContent>
//                 </Dialog>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// *****************21-08-25 *********************/

// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import {
//   CheckCircle,
//   XCircle,
//   FileText,
//   Store,
//   User,
//   Phone,
//   Mail,
//   ArrowLeft,
// } from "lucide-react";
// import Link from "next/link";
// import { toast } from "sonner";
// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Accordion,
//   AccordionItem,
//   AccordionTrigger,
//   AccordionContent,
// } from "@/components/ui/accordion";
// import { useRouter, useParams } from "next/navigation";

// const retailerData = {
//   retailerKYC: {
//     personalDetails: {
//       fullName: "Rajesh Kumar",
//       mobileNumber: "9876543210",
//       emailAddress: "rajesh@example.com",
//     },
//     addressInformation: {
//       currentAddress: "123 MG Road, Bangalore",
//       permanentAddress: "45 Residency Road, Bangalore",
//       liveSelfie: "",
//     },
//     bankDetails: {
//       ifscCode: "HDFC0001234",
//       bankName: "HDFC Bank",
//       accountNumber: "1234567890",
//       accountHolderName: "Rajesh Kumar",
//     },
//     shopKYC: {
//       businessInformation: {
//         businessType: "retailer",
//         gstNumber: "29ABCDE1234F1Z5",
//       },
//       companyBankDetails: {
//         ifscCode: "ICIC0004567",
//         accountNumber: "9876543210",
//         bankName: "ICICI Bank",
//         accountHolderName: "Rajesh Enterprises Pvt Ltd",
//       },
//       documentUpload: {
//         businessDocuments: [
//           { documentType: "aadhaar_card", file: "aadhaar_rajesh.pdf" },
//           { documentType: "pan_card", file: "pan_rajesh.pdf" },
//           { documentType: "gst_certificate", file: "gst_cert.pdf" },
//           { documentType: "shop_licence", file: "licence.pdf" },
//           { documentType: "bank_statement", file: "statement.pdf" },
//           { documentType: "shop_photo", file: "shop_photo.jpg" },
//         ],
//         shopPhotos: {
//           inside: "inside.jpg",
//           outside: "outside.jpg",
//           signboard: "signboard.jpg",
//         },
//       },
//     },
//     directors: [
//       {
//         name: "Suresh Kumar",
//         email: "suresh@example.com",
//         mobileNumber: "9123456789",
//       },
//     ],
//   },
// };

// const documentDetailsMap = {
//   aadhaar_card: {
//     "Holder Name": "Rajesh Kumar",
//     "Aadhaar Number": "1234 5678 9012",
//     "Mobile Number": "9876543210",
//     Address: "123 MG Road, Bangalore",
//     VID: "1234-5678-9012-3456",
//     "Created By": "Admin User",
//     "Created At": "2025-08-15 10:30 AM",
//     "Updated At": "2025-08-18 04:45 PM",
//   },
//   pan_card: {
//     "Holder Name": "Rajesh Kumar",
//     "PAN Number": "ABCDE1234F",
//     "Father's Name": "Suresh Kumar",
//     DOB: "15-08-1980",
//     "Created By": "Admin User",
//     "Created At": "2025-08-10 09:15 AM",
//     "Updated At": "2025-08-19 02:00 PM",
//   },
//   gst_certificate: {
//     "Legal Name / Trade Name": "ABC Traders Pvt Ltd",
//     "Address of Business": "123 Market Street, Mumbai, India",
//     "PAN / Aadhaar of Proprietor": "ABCDE1234F",
//     "Date of Incorporation / Registration of Business": "12-05-2018",
//     "Constitution of Business": "Private Limited",
//     "GSTIN / UIN Status": "Active",
//     "Taxpayer Type": "Regular",
//     "Aadhaar Authenticated?": "Yes (15-06-2020)",
//     "e-KYC Verified": "Applicable",
//     "Additional Trade Name (If Any)": "ABC Mart",
//   },
//   shop_licence: {
//     "Licence Number": "LIC1234567",
//     "Issued By": "BBMP",
//     "Valid Till": "31-12-2025",
//     "Created By": "Rajesh Kumar",
//     "Created At": "2025-08-05 08:45 AM",
//     "Updated At": "2025-08-18 05:30 PM",
//   },
//   bank_statement: {
//     "Account Holder": "Rajesh Kumar",
//     "Account Number": "1234567890",
//     "IFSC Code": "HDFC0001234",
//     Bank: "HDFC Bank",
//     "Created By": "Bank Upload Bot",
//     "Created At": "2025-08-11 11:20 AM",
//     "Updated At": "2025-08-17 03:40 PM",
//   },
//   shop_photo: {
//     "Photo Type": "Shop Front",
//     "Uploaded File": "shop_photo.jpg",
//     "Created By": "Rajesh Kumar",
//     "Created At": "2025-08-14 07:50 AM",
//     "Updated At": "2025-08-19 01:15 PM",
//   },
// };

// export default function KycProfileCard() {
//   const [openDialog, setOpenDialog] = useState(null);
//   const [reviewDialog, setReviewDialog] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [verifiedDocs, setVerifiedDocs] = useState([]);
//   const retailer = retailerData.retailerKYC;
//   const documents = retailer.shopKYC.documentUpload.businessDocuments;
//    const router = useRouter();
//   const { id } = useParams();

//   const kycStatus = "pending";

//   const handleFetch = (index) => {
//     setOpenDialog(index);
//     setLoading(true);
//     setTimeout(() => setLoading(false), 1500);
//   };

//   const handleVerify = (index) => {
//     setVerifiedDocs((prev) => [...prev, index]);
//     setOpenDialog(null);
//   };

//   const handleApprove = () => {
//     toast.success(
//       `${retailer.personalDetails.fullName}'s KYC has been approved successfully.`
//     );
//   };

//   const handleReject = () => {
//     toast.error(
//       `${retailer.personalDetails.fullName}'s KYC has been rejected.`
//     );
//   };

//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
//       in_review: { label: "In Review", className: "bg-blue-100 text-blue-800" },
//       approved: { label: "Approved", className: "bg-green-100 text-green-800" },
//       rejected: { label: "Rejected", className: "bg-red-100 text-red-800" },
//     };

//     const config = statusConfig[status] || statusConfig.pending;
//     return <Badge className={config.className}>{config.label}</Badge>;
//   };

//   return (
//     <div className="p-6">
//       <div className="mb-6">
//         <div className="flex items-center space-x-4 mb-4">
//           <Link href="/dashboard/applicationid">
//             <Button variant="outline" size="sm">
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back to Applications
//             </Button>
//           </Link>
//         </div>
//         <div className="flex justify-between items-start">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//               Admin Review - {retailer.personalDetails.fullName}
//             </h1>
//             <p className="text-gray-600 dark:text-gray-400">
//               Review all KYC data and documents for approval
//             </p>
//           </div>
//           <div className="flex items-center space-x-3">
//             {getStatusBadge(kycStatus)}
//             <div className="flex space-x-2">
//               <Button onClick={handleApprove}>
//                 <CheckCircle className="h-4 w-4 mr-2" />
//                 Approve
//               </Button>
//               <Button variant="destructive" onClick={handleReject}>
//                 <XCircle className="h-4 w-4 mr-2" />
//                 Reject
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Grid Layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Company Information */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <Store className="h-5 w-5 mr-2" />
//               Company Information
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div>
//               <label className="text-sm font-medium">Business Type</label>
//               <p>{retailer.shopKYC.businessInformation.businessType}</p>
//             </div>
//             <div>
//               <label className="text-sm font-medium">GST Number</label>
//               <p>{retailer.shopKYC.businessInformation.gstNumber}</p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <User className="h-5 w-5 mr-2" />
//               Contact Information
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div>
//               <label className="text-sm font-medium">Contact Person</label>
//               <p>{retailer.personalDetails.fullName}</p>
//             </div>
//             <div className="flex items-center">
//               <Mail className="h-4 w-4 mr-2 text-gray-500" />
//               <p>{retailer.personalDetails.emailAddress}</p>
//             </div>
//             <div className="flex items-center">
//               <Phone className="h-4 w-4 mr-2 text-gray-500" />
//               <p>{retailer.personalDetails.mobileNumber}</p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Addresses</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div>
//               <label className="text-sm font-medium">Current Address</label>
//               <p>{retailer.addressInformation.currentAddress}</p>
//             </div>
//             <Separator />
//             <div>
//               <label className="text-sm font-medium">Permanent Address</label>
//               <p>{retailer.addressInformation.permanentAddress}</p>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Bank Details */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Bank Details</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div>
//               <label className="text-sm font-medium">Personal Bank</label>
//               <div>
//                 <p>Account: {retailer.bankDetails.accountNumber}</p>
//                 <p>Holder: {retailer.bankDetails.accountHolderName}</p>
//                 <p>IFSC: {retailer.bankDetails.ifscCode}</p>
//                 <p>Bank: {retailer.bankDetails.bankName}</p>
//               </div>
//             </div>
//             <Separator />
//             <div>
//               <label className="text-sm font-medium">Company Bank</label>
//               <div>
//                 <p>
//                   Account: {retailer.shopKYC.companyBankDetails.accountNumber}
//                 </p>
//                 <p>
//                   Holder:{" "}
//                   {retailer.shopKYC.companyBankDetails.accountHolderName}
//                 </p>
//                 <p>IFSC: {retailer.shopKYC.companyBankDetails.ifscCode}</p>
//                 <p>Bank: {retailer.shopKYC.companyBankDetails.bankName}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Documents */}
//       <Card className="mt-6">
//         <CardHeader>
//           <CardTitle className="flex items-center">
//             <FileText className="h-5 w-5 mr-2" />
//             Uploaded Documents
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {documents.map((document, index) => (
//               <div
//                 key={index}
//                 className="flex items-center justify-between border p-3 rounded-lg"
//               >
//                 <div className="flex items-center space-x-3">
//                   <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
//                     <FileText className="h-5 w-5 text-primary" />
//                   </div>
//                   <div>
//                     <h4 className="font-medium">{document.file}</h4>
//                     <Badge variant="outline">{document.documentType}</Badge>
//                   </div>
//                 </div>

//                 {verifiedDocs.includes(index) ? (
//                   <div className="flex items-center space-x-2">
//                     <Badge className="bg-green-100 text-green-700">
//                       Verified
//                     </Badge>
//                     <Button
//                       size="sm"
//                       variant="secondary"
//                       onClick={() =>
//                         router.push(`/dashboard/applicationid/${id}/${index}`)
//                       }
//                     >
//                       Review
//                     </Button>
//                   </div>
//                 ) : (
//                   <Button size="sm" onClick={() => handleFetch(index)}>
//                     Fetch
//                   </Button>
//                 )}

//                 {/* Dialog Popup for Fetch */}
//                 <Dialog
//                   open={openDialog === index}
//                   onOpenChange={setOpenDialog}
//                 >
//                   <DialogContent className="sm:max-w-md">
//                     <DialogHeader>
//                       <DialogTitle>Document Preview</DialogTitle>
//                     </DialogHeader>

//                     {loading ? (
//                       <div className="space-y-3">
//                         <Skeleton className="h-40 w-full" />
//                         <Skeleton className="h-4 w-3/4" />
//                       </div>
//                     ) : (
//                       <div className="p-4 border rounded-lg">
//                         <p className="text-sm text-gray-600">
//                           Document: <b>{document.file}</b>
//                         </p>
//                         <p className="text-sm">Type: {document.documentType}</p>
//                       </div>
//                     )}

//                     {!loading && (
//                       <DialogFooter>
//                         <Button onClick={() => handleVerify(index)}>
//                           Verify
//                         </Button>
//                       </DialogFooter>
//                     )}
//                   </DialogContent>
//                 </Dialog>

//                 {/* Review Dialog */}
//                 <Dialog
//                   open={reviewDialog === index}
//                   onOpenChange={setReviewDialog}
//                 >
//                   <DialogContent className="sm:max-w-lg">
//                     <DialogHeader>
//                       <DialogTitle>
//                         Review - {document.documentType}
//                       </DialogTitle>
//                     </DialogHeader>

//                     {document.documentType === "gst_certificate" ? (
//                       <Accordion
//                         type="single"
//                         collapsible
//                         className="w-full border rounded-lg"
//                       >
//                         {Object.entries(
//                           documentDetailsMap["gst_certificate"]
//                         ).map(([key, value], i) => (
//                           <AccordionItem
//                             className="px-4"
//                             key={i}
//                             value={`item-${i}`}
//                           >
//                             <AccordionTrigger>{key}</AccordionTrigger>
//                             <AccordionContent>{value}</AccordionContent>
//                           </AccordionItem>
//                         ))}
//                       </Accordion>
//                     ) : (
//                       // ✅ Other Documents stay in table format
//                       <div className="overflow-x-auto border rounded-lg">
//                         <table className="w-full text-sm">
//                           <tbody>
//                             {documentDetailsMap[document.documentType] &&
//                               Object.entries(
//                                 documentDetailsMap[document.documentType]
//                               ).map(([key, value], i) => (
//                                 <tr
//                                   key={i}
//                                   className="border-b last:border-none hover:bg-gray-50"
//                                 >
//                                   <td className="p-2 font-medium w-1/3">
//                                     {key}
//                                   </td>
//                                   <td className="p-2">{value}</td>
//                                 </tr>
//                               ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     )}

//                     <DialogFooter>
//                       <Button onClick={() => setReviewDialog(null)}>
//                         Close
//                       </Button>
//                     </DialogFooter>
//                   </DialogContent>
//                 </Dialog>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
