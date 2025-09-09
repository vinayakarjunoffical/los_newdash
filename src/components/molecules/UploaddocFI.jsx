"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "../atoms/ImageUpload";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { ExcelUploadPopup } from "../atoms/ExcelUploadPopup";

const documentList = {
  customer: [
    {
      category: "Identity Proof",
      documents: [
        "Aadhaar Card",
        "PAN Card",
        "Passport",
        "Voter ID",
        "Driving License",
      ],
    },
    {
      category: "Address Proof",
      documents: ["Utility Bill", "Rent Agreement"],
    },
  ],
  retailer: [
    {
      category: "Business Proof",
      documents: [
        "GST Certificate",
        "Shop Act License",
        "Udyam Registration",
        "Business Registration Certificate",
      ],
    },
    {
      category: "Address Proof",
      documents: [
        "Shop Act License",
        "Electricity Bill",
        "Rental Agreement",
        "Property Tax Receipt",
      ],
    },
    {
      category: "Other Supporting",
      documents: [
        "Owner Photo",
        "Cancelled Cheque",
        "Shop / Office Photographs",
      ],
    },
  ],
};

const questionsData = [
  {
    id: 1,
    question: "Is the shop physically verified?",
    required: true,
    length: 50,
    supportedDocument: "Shop License",
  },
  {
    id: 2,
    question: "Does the customer have a valid ID proof?",
    required: true,
    length: 20,
  },
  {
    id: 3,
    question: "Has the income proof document been collected?",
    required: false,
    length: 100,
    supportedDocument: "Salary Slip",
  },
];

const UploaddocFI = ({ userId, userType, retailer }) => {
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [selectedDoc, setSelectedDoc] = useState("");
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [locationFetched, setLocationFetched] = useState(false);
  const [open, setOpen] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [importOpen, setImportOpen] = useState(false);
  const router = useRouter();

  const handleDocClick = (doc) => {
    setSelectedDoc(doc);
    setOpen(true);
  };

  // ✅ Export questionsData to Excel
  const handleExport = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(questionsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Questions");
      XLSX.writeFile(wb, "questions.xlsx");
      toast.success("Excel exported successfully!");
    } catch (err) {
      toast.error("Export failed");
      console.error(err);
    }
  };

  // ✅ Import questionsData from Excel
  // const handleImport = (e) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = (event) => {
  //     try {
  //       const data = new Uint8Array(event.target.result);
  //       const workbook = XLSX.read(data, { type: "array" });
  //       const sheetName = workbook.SheetNames[0];
  //       const sheet = workbook.Sheets[sheetName];
  //       const parsed = XLSX.utils.sheet_to_json(sheet);

  //       toast.success("Excel imported successfully!");
  //       console.log("Imported Data:", parsed);
  //       setImportOpen(false);
  //     } catch (err) {
  //       toast.error("Import failed");
  //       console.error(err);
  //     }
  //   };
  //   reader.readAsArrayBuffer(file);
  // };


const handleImport = (input) => {
  // 🔹 Support both event or direct file
  const file = input?.target?.files?.[0] || input;

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsed = XLSX.utils.sheet_to_json(sheet);

      // ✅ Success message
      toast.success("Excel imported successfully!");
      console.log("Imported Data:", parsed);

      // Optional: close modal if you're using dialog
      setImportOpen(false);
    } catch (err) {
      toast.error("Import failed");
      console.error("Excel Import Error:", err);
    }
  };

  reader.readAsArrayBuffer(file);
};
  const requiredDocs =
    documentList[userType?.toLowerCase()]?.flatMap((cat) => cat.documents) ||
    [];
  const remainingDocs = requiredDocs.filter((doc) => !uploadedDocs[doc]);

  const handleUpload = (docName) => {
    setUploadedDocs((prev) => {
      const updated = { ...prev, [docName]: true };

      const allUploaded = requiredDocs.every((doc) => updated[doc]);
      if (allUploaded) {
        toast.success("All documents uploaded. Please answer the questions.");
        setShowQuestions(true);
      }

      return updated;
    });

    setSelectedDoc("");
  };

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude.toFixed(6), lng: longitude.toFixed(6) });
        setLocationFetched(true);
        toast.success("Location fetched successfully");
      },
      (err) => {
        toast.error("Failed to fetch location");
        console.error(err);
      }
    );
  };

  if (!userType || !documentList[userType.toLowerCase()]) {
    return (
      <Card className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <CardHeader>
          <CardTitle>Invalid or missing user type</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No document list available. Please check the URL.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Card className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <CardHeader className="space-y-4">
            <h2 className="text-2xl font-bold">User Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-base">
              <p className="font-semibold">
                User ID: <span className="font-normal">{userId}</span>
              </p>
              <p className="font-semibold">
                User Type:{" "}
                <span className="font-normal capitalize">{userType}</span>
              </p>
              <p className="font-semibold">
                Applied Date: <span className="font-normal">25 Aug 2025</span>
              </p>
              <p className="font-semibold">
                Status: <span className="font-normal">FI Pending</span>
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4 mb-6">
              <Label className="font-semibold">Fetch Current Location</Label>
              <Button
                type="submit"
                onClick={fetchLocation}
                className="w-[200px] text-white py-2 px-4 dark:bg-gray-800 rounded-lg shadow-md transition"
              >
                Get Location
              </Button>

              <div className="grid grid-cols-2 gap-4 mt-3">
                <input
                  type="text"
                  readOnly
                  value={location.lat || "Latitude"}
                  className="border rounded-lg py-2 px-3 
                  bg-gray-100 dark:bg-gray-800 
                  text-gray-800 dark:text-gray-200 
                  border-gray-300 dark:border-gray-700"
                />
                <input
                  type="text"
                  readOnly
                  value={location.lng || "Longitude"}
                  className="border rounded-lg py-2 px-3 
                  bg-gray-100 dark:bg-gray-800 
                  text-gray-800 dark:text-gray-200 
                  border-gray-300 dark:border-gray-700"
                />
              </div>
            </div>

            {locationFetched && (
              <div className="space-y-4">
                <div>
                  <Label className="font-semibold">Select Document</Label>
                  <select
                    className="w-full border rounded-lg py-2 px-4 mt-2 
                    bg-white dark:bg-gray-800 
                    text-gray-800 dark:text-gray-200 
                    border-gray-300 dark:border-gray-700"
                    value={selectedDoc}
                    onChange={(e) => setSelectedDoc(e.target.value)}
                    disabled={remainingDocs.length === 0}
                  >
                    <option value="">-- Select --</option>
                    {remainingDocs.map((doc, i) => (
                      <option key={i} value={doc}>
                        {doc}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedDoc && (
                  <div>
                    <ImageUpload
                      docName={selectedDoc}
                      onUpload={() => handleUpload(selectedDoc)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ✅ Questionnaire BELOW Upload */}
            {/* ✅ Step-by-step Questionnaire */}
            {showQuestions && (
              <div className="mt-6 space-y-6">
                <div className="flex gap-4 mb-4">
                  <Button onClick={handleExport} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button onClick={() => setImportOpen(true)} variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </div>
                <h3 className="text-lg font-bold">FI Verification Questions</h3>

                <Card className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  {(() => {
                    const q = questionsData[currentQuestion]; // show only current question
                    return (
                      <div key={q.id} className="space-y-3">
                        {/* Question */}
                        <Label className="font-semibold">
                          {q.question}
                          {q.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </Label>
                        <input
                          type="text"
                          className="w-full border rounded-lg py-2 px-3 
                bg-gray-100 dark:bg-gray-800 
                text-gray-800 dark:text-gray-200 
                border-gray-300 dark:border-gray-700"
                          value={answers[q.id] || ""}
                          maxLength={q.length}
                          onChange={(e) =>
                            setAnswers((prev) => ({
                              ...prev,
                              [q.id]: e.target.value,
                            }))
                          }
                          required={q.required}
                        />

                        {/* ✅ Show ImageUpload if supportedDocument exists */}
                        {q.supportedDocument && (
                          <div className="mt-2">
                            <Label className="text-sm font-medium">
                              Upload {q.supportedDocument}
                            </Label>
                            <ImageUpload
                              docName={q.supportedDocument}
                              onUpload={() => handleUpload(q.supportedDocument)}
                            />
                          </div>
                        )}

                        {/* Navigation buttons */}
                        <div className="flex justify-between mt-4">
                          {currentQuestion > 0 && (
                            <Button
                              variant="outline"
                              onClick={() =>
                                setCurrentQuestion((prev) => prev - 1)
                              }
                            >
                              Previous
                            </Button>
                          )}

                          {currentQuestion < questionsData.length - 1 ? (
                            <Button
                              onClick={() => {
                                if (q.required && !answers[q.id]) {
                                  toast.error(
                                    "Please answer this question before continuing"
                                  );
                                  return;
                                }
                                setCurrentQuestion((prev) => prev + 1);
                              }}
                            >
                              Next
                            </Button>
                          ) : (
                            <Button
                              onClick={() => {
                                const missing = questionsData.filter(
                                  (q) => q.required && !answers[q.id]
                                );
                                if (missing.length > 0) {
                                  toast.error(
                                    "Please fill all required questions"
                                  );
                                  return;
                                }
                                toast.success(
                                  `${retailer?.personalDetails?.fullName}'s KYC has been approved`
                                );
                                setTimeout(
                                  () => router.push("/dashboard"),
                                  1200
                                );
                              }}
                            >
                              Submit
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Checklist */}
      <div>
        <Card className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <CardHeader className="!mb-0">
            <CardTitle className="text-xl font-bold">
              Document Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* ✅ Existing Document List */}
            {documentList[userType.toLowerCase()].map((cat, idx) => (
              <div key={idx} className="mb-6">
                <h3 className="text-lg font-semibold pb-2">{cat.category}</h3>
                <ul className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cat.documents.map((doc, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between 
                  bg-gray-50 dark:bg-gray-800 
                  px-3 py-2 rounded-lg shadow-sm 
                  hover:bg-gray-100 dark:hover:bg-gray-700 
                  transition"
                    >
                      <span
                        onClick={() => handleDocClick(doc)}
                        className="text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer"
                      >
                        {doc}
                      </span>

                      <div className="flex items-center gap-2">
                        {/* Old Doc button only for these docs */}
                        <Button
                          onClick={() => {
                            setSelectedDoc(doc);
                            setOpen(true);
                          }}
                          className="px-2 py-1 text-xs !h-7 rounded-md border-1 "
                          variant="ghost"
                        >
                          Old Doc
                        </Button>

                        <CheckCircle
                          className={`h-5 w-5 ${
                            uploadedDocs[doc]
                              ? "text-green-600"
                              : "text-gray-400 dark:text-gray-500"
                          }`}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* ✅ Question Supported Documents (without Old Doc button / popup) */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold pb-2">Question Documents</h3>
              <ul className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {questionsData
                  .filter((q) => q.supportedDocument)
                  .map((q) => (
                    <li
                      key={q.id}
                      className="flex items-center justify-between 
                  bg-gray-50 dark:bg-gray-800 
                  px-3 py-2 rounded-lg shadow-sm 
                  hover:bg-gray-100 dark:hover:bg-gray-700 
                  transition"
                    >
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {q.supportedDocument}
                      </span>

                      <CheckCircle
                        className={`h-5 w-5 ${
                          uploadedDocs[q.supportedDocument]
                            ? "text-green-600"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                    </li>
                  ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* ✅ Keep Popup for only "Old Doc" documents */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <DialogHeader>
              <DialogTitle>{selectedDoc}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              <Skeleton className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-40 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={importOpen} onOpenChange={setImportOpen}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <DialogHeader>
              <DialogTitle>Import Excel File</DialogTitle>
            </DialogHeader>
            
            <ExcelUploadPopup docName="Questionnaire Excel" onUpload={handleImport} />
            <p className="text-sm text-gray-500">
              Upload an Excel file containing your questions.
            </p>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UploaddocFI;

//************************4-9-25 19:06*************************** */
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { CheckCircle } from "lucide-react";
// import { toast } from "sonner";
// import { ImageUpload } from "../atoms/ImageUpload";
// import { Button } from "../ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Skeleton } from "@/components/ui/skeleton";

// // ✅ Document list
// const documentList = {
//   customer: [
//     {
//       category: "Identity Proof",
//       documents: ["Aadhaar Card", "PAN Card", "Passport", "Voter ID", "Driving License"],
//     },
//     {
//       category: "Address Proof",
//       documents: ["Utility Bill", "Rent Agreement"],
//     },
//   ],
//   retailer: [
//     {
//       category: "Business Proof",
//       documents: [
//         "GST Certificate",
//         "Shop Act License",
//         "Udyam Registration",
//         "Business Registration Certificate",
//       ],
//     },
//     {
//       category: "Address Proof",
//       documents: ["Shop Act License", "Electricity Bill", "Rental Agreement", "Property Tax Receipt"],
//     },
//     {
//       category: "Other Supporting",
//       documents: ["Owner Photo", "Cancelled Cheque", "Shop / Office Photographs"],
//     },
//   ],
// };

// // ✅ Questionnaire data (can be replaced with API/JSON)
// const questionsData = [
//   {
//     id: 1,
//     question: "Is the shop physically verified?",
//     required: true,
//     length: 50,
//     supportedDocument: "Shop License"
//   },
//   {
//     id: 2,
//     question: "Does the customer have a valid ID proof?",
//     required: true,
//     length: 20,
//     supportedDocument: "Aadhaar Card"
//   },
//   {
//     id: 3,
//     question: "Has the income proof document been collected?",
//     required: false,
//     length: 100,
//     supportedDocument: "Salary Slip"
//   },
// ];

// const UploaddocFI = ({ userId, userType, retailer }) => {
//   const [uploadedDocs, setUploadedDocs] = useState({});
//   const [selectedDoc, setSelectedDoc] = useState("");
//   const [location, setLocation] = useState({ lat: "", lng: "" });
//   const [locationFetched, setLocationFetched] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [showQuestions, setShowQuestions] = useState(false);
//   const [answers, setAnswers] = useState({});
//   const router = useRouter();

//   // ✅ Handle doc click
//   const handleDocClick = (doc) => {
//     setSelectedDoc(doc);
//     setOpen(true);
//   };

//   // ✅ Required docs
//   const requiredDocs =
//     documentList[userType?.toLowerCase()]?.flatMap((cat) => cat.documents) || [];
//   const remainingDocs = requiredDocs.filter((doc) => !uploadedDocs[doc]);

//   // ✅ Handle document upload
//   const handleUpload = (docName) => {
//     setUploadedDocs((prev) => {
//       const updated = { ...prev, [docName]: true };

//       const allUploaded = requiredDocs.every((doc) => updated[doc]);
//       if (allUploaded) {
//         toast.success("All documents uploaded. Please answer the questions.");
//         setShowQuestions(true);
//       }

//       return updated;
//     });

//     setSelectedDoc("");
//   };

//   const fetchLocation = () => {
//     if (!navigator.geolocation) {
//       toast.error("Geolocation is not supported by this browser.");
//       return;
//     }
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const { latitude, longitude } = pos.coords;
//         setLocation({ lat: latitude.toFixed(6), lng: longitude.toFixed(6) });
//         setLocationFetched(true);
//         toast.success("Location fetched successfully");
//       },
//       (err) => {
//         toast.error("Failed to fetch location");
//         console.error(err);
//       }
//     );
//   };

//   if (!userType || !documentList[userType.toLowerCase()]) {
//     return (
//       <Card className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
//         <CardHeader>
//           <CardTitle>Invalid or missing user type</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p>No document list available. Please check the URL.</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
//       {/* Left Side */}
//       <div>
//         <Card className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
//           <CardHeader className="space-y-4">
//             <h2 className="text-2xl font-bold">User Details</h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-base">
//               {/* <p className="font-semibold">
//                 Name: <span className="font-normal">Pranav Jagam</span>
//               </p> */}
//               <p className="font-semibold">
//                 User ID: <span className="font-normal">{userId}</span>
//               </p>
//               <p className="font-semibold">
//                 User Type:{" "}
//                 <span className="font-normal capitalize">{userType}</span>
//               </p>
//               <p className="font-semibold">
//                 Applied Date: <span className="font-normal">25 Aug 2025</span>
//               </p>
//               <p className="font-semibold">
//                 Status: <span className="font-normal">FI Pending</span>
//               </p>
//             </div>
//           </CardHeader>

//           <CardContent>
//             {/* Location */}
//             <div className="space-y-4 mb-6">
//               <Label className="font-semibold">Fetch Current Location</Label>
//               <Button
//                 type="submit"
//                 onClick={fetchLocation}
//                 className="w-[200px] text-white py-2 px-4 dark:bg-gray-800 rounded-lg shadow-md transition"
//               >
//                 Get Location
//               </Button>

//               <div className="grid grid-cols-2 gap-4 mt-3">
//                 <input
//                   type="text"
//                   readOnly
//                   value={location.lat || "Latitude"}
//                   className="border rounded-lg py-2 px-3
//                   bg-gray-100 dark:bg-gray-800
//                   text-gray-800 dark:text-gray-200
//                   border-gray-300 dark:border-gray-700"
//                 />
//                 <input
//                   type="text"
//                   readOnly
//                   value={location.lng || "Longitude"}
//                   className="border rounded-lg py-2 px-3
//                   bg-gray-100 dark:bg-gray-800
//                   text-gray-800 dark:text-gray-200
//                   border-gray-300 dark:border-gray-700"
//                 />
//               </div>
//             </div>

//             {/* Document Upload */}
//             {locationFetched && (
//               <div className="space-y-4">
//                 <div>
//                   <Label className="font-semibold">Select Document</Label>
//                   <select
//                     className="w-full border rounded-lg py-2 px-4 mt-2
//                     bg-white dark:bg-gray-800
//                     text-gray-800 dark:text-gray-200
//                     border-gray-300 dark:border-gray-700"
//                     value={selectedDoc}
//                     onChange={(e) => setSelectedDoc(e.target.value)}
//                     disabled={remainingDocs.length === 0}
//                   >
//                     <option value="">-- Select --</option>
//                     {remainingDocs.map((doc, i) => (
//                       <option key={i} value={doc}>
//                         {doc}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {selectedDoc && (
//                   <div>
//                     <ImageUpload
//                       docName={selectedDoc}
//                       onUpload={() => handleUpload(selectedDoc)}
//                     />
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ✅ Questionnaire BELOW Upload */}
//             {showQuestions && (
//               <div className="mt-6 space-y-4">
//                 <h3 className="text-lg font-bold">FI Verification Questions</h3>
//                 {questionsData.map((q) => (
//                   <div key={q.id} className="space-y-2">
//                     <Label className="font-semibold">
//                       {q.question}
//                       {q.required && <span className="text-red-500 ml-1">*</span>}
//                     </Label>
//                     <input
//                       type="text"
//                       className="w-full border rounded-lg py-2 px-3
//                         bg-gray-100 dark:bg-gray-800
//                         text-gray-800 dark:text-gray-200
//                         border-gray-300 dark:border-gray-700"
//                       value={answers[q.id] || ""}
//                       onChange={(e) =>
//                         setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
//                       }
//                       required={q.required}
//                     />
//                   </div>
//                 ))}

//                 <Button
//                   className="lg:w-[250px] w-full mt-4"
//                   onClick={() => {
//                     const missing = questionsData.filter(
//                       (q) => q.required && !answers[q.id]
//                     );
//                     if (missing.length > 0) {
//                       toast.error("Please fill all required questions");
//                       return;
//                     }
//                     toast.success(
//                       `${retailer?.personalDetails?.fullName}'s KYC has been approved`
//                     );
//                     setTimeout(() => router.push("/dashboard"), 1200);
//                   }}
//                 >
//                   Submit Answers
//                 </Button>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Right Side - Checklist */}
//       <div>
//        <Card className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
//     <CardHeader className="!mb-0">
//       <CardTitle className="text-xl font-bold">Document Checklist</CardTitle>
//     </CardHeader>
//     <CardContent>
//       {documentList[userType.toLowerCase()].map((cat, idx) => (
//         <div key={idx} className="mb-6">
//           <h3 className="text-lg font-semibold pb-2">{cat.category}</h3>
//           <ul className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {cat.documents.map((doc, i) => (
//               <li
//                 key={i}
//                 className="flex items-center justify-between
//                   bg-gray-50 dark:bg-gray-800
//                   px-3 py-2 rounded-lg shadow-sm
//                   hover:bg-gray-100 dark:hover:bg-gray-700
//                   transition"
//               >
//                 <span
//                   onClick={() => handleDocClick(doc)}
//                   className="text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer"
//                 >
//                   {doc}
//                 </span>

//                 <div className="flex items-center gap-2">

//                   <Button
//                     onClick={() => {
//                       setSelectedDoc(doc);
//                       setOpen(true);
//                     }}
//                     className="px-2 py-1 text-xs !h-7 rounded-md border-1 "
//                     variant="ghost"
//                   >
//                     Old Doc
//                   </Button>

//                   <CheckCircle
//                     className={`h-5 w-5 ${
//                       uploadedDocs[doc]
//                         ? "text-green-600"
//                         : "text-gray-400 dark:text-gray-500"
//                     }`}
//                   />
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       ))}
//     </CardContent>
//   </Card>

//         {/* Popup (Dialog) */}
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
//             <DialogHeader>
//               <DialogTitle>{selectedDoc}</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-3 mt-4">
//               <Skeleton className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700" />
//               <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
//               <Skeleton className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700" />
//               <Skeleton className="h-40 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// };

// export default UploaddocFI;

//*******************************2-9-25 15.19***************************** */

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { CheckCircle } from "lucide-react";
// import { toast } from "sonner";
// import { ImageUpload } from "../atoms/ImageUpload";
// import { Button } from "../ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Skeleton } from "@/components/ui/skeleton";

// const documentList = {
//   customer: [
//     {
//       category: "Identity Proof",
//       documents: ["Aadhaar Card", "PAN Card", "Passport", "Voter ID", "Driving License"],
//     },
//     {
//       category: "Address Proof",
//       documents: ["Utility Bill", "Rent Agreement"],
//     },
//   ],
//   retailer: [
//     {
//       category: "Business Proof",
//       documents: [
//         "GST Certificate",
//         "Shop Act License",
//         "Udyam Registration",
//         "Business Registration Certificate",
//       ],
//     },
//     {
//       category: "Address Proof",
//       documents: ["Shop Act License", "Electricity Bill", "Rental Agreement", "Property Tax Receipt"],
//     },
//     {
//       category: "Other Supporting",
//       documents: ["Owner Photo", "Cancelled Cheque", "Shop / Office Photographs"],
//     },
//   ],
// };

// const UploaddocFI = ({ userId, userType, retailer }) => {
//   const [uploadedDocs, setUploadedDocs] = useState({});
//   const [selectedDoc, setSelectedDoc] = useState("");
//   const [location, setLocation] = useState({ lat: "", lng: "" });
//   const [locationFetched, setLocationFetched] = useState(false);
//   const router = useRouter();
//   const [open, setOpen] = useState(false);

//   const handleDocClick = (doc) => {
//     setSelectedDoc(doc);
//     setOpen(true);
//   };

//   const requiredDocs =
//     documentList[userType?.toLowerCase()]?.flatMap((cat) => cat.documents) || [];
//   const remainingDocs = requiredDocs.filter((doc) => !uploadedDocs[doc]);

//   const handleUpload = (docName) => {
//     setUploadedDocs((prev) => {
//       const updated = { ...prev, [docName]: true };

//       const allUploaded = requiredDocs.every((doc) => updated[doc]);
//       if (allUploaded) {
//         toast.success(`${retailer?.personalDetails?.fullName}'s KYC has been approved`);

//         setTimeout(() => {
//           router.push("/dashboard");
//         }, 1000);
//       }

//       return updated;
//     });

//     setSelectedDoc("");
//   };

//   const fetchLocation = () => {
//     if (!navigator.geolocation) {
//       toast.error("Geolocation is not supported by this browser.");
//       return;
//     }
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const { latitude, longitude } = pos.coords;
//         setLocation({ lat: latitude.toFixed(6), lng: longitude.toFixed(6) });
//         setLocationFetched(true);
//         toast.success("Location fetched successfully");
//       },
//       (err) => {
//         toast.error("Failed to fetch location");
//         console.error(err);
//       }
//     );
//   };

//   if (!userType || !documentList[userType.toLowerCase()]) {
//     return (
//       <Card className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
//         <CardHeader>
//           <CardTitle>Invalid or missing user type</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p>No document list available. Please check the URL.</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
//       {/* Left Side */}
//       <div>
//         <Card className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
//           <CardHeader className="space-y-4">
//             <h2 className="text-2xl font-bold">User Details</h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-base">
//               <p className="font-semibold">
//                 Name: <span className="font-normal">Pranav Jagam</span>
//               </p>
//               <p className="font-semibold">
//                 User ID: <span className="font-normal">{userId}</span>
//               </p>
//               <p className="font-semibold">
//                 User Type:{" "}
//                 <span className="font-normal capitalize">{userType}</span>
//               </p>
//               <p className="font-semibold">
//                 Applied Date: <span className="font-normal">25 Aug 2025</span>
//               </p>
//               <p className="font-semibold">
//                 Status: <span className="font-normal">FI Pending</span>
//               </p>
//             </div>
//           </CardHeader>

//           <CardContent>
//             <div className="space-y-4 mb-6">
//               <Label className="font-semibold">Fetch Current Location</Label>
//               <Button
//                 type="submit"
//                 onClick={fetchLocation}
//                 className="w-[200px] text-white py-2 px-4 dark:bg-gray-800 rounded-lg shadow-md transition"
//               >
//                 Get Location
//               </Button>

//               <div className="grid grid-cols-2 gap-4 mt-3">
//                 <input
//                   type="text"
//                   readOnly
//                   value={location.lat || "Latitude"}
//                   className="border rounded-lg py-2 px-3
//                   bg-gray-100 dark:bg-gray-800
//                   text-gray-800 dark:text-gray-200
//                   border-gray-300 dark:border-gray-700"
//                 />
//                 <input
//                   type="text"
//                   readOnly
//                   value={location.lng || "Longitude"}
//                   className="border rounded-lg py-2 px-3
//                   bg-gray-100 dark:bg-gray-800
//                   text-gray-800 dark:text-gray-200
//                   border-gray-300 dark:border-gray-700"
//                 />
//               </div>
//             </div>

//             {locationFetched && (
//               <div className="space-y-4">
//                 <div>
//                   <Label className="font-semibold">Select Document</Label>
//                   <select
//                     className="w-full border rounded-lg py-2 px-4 mt-2
//                     bg-white dark:bg-gray-800
//                     text-gray-800 dark:text-gray-200
//                     border-gray-300 dark:border-gray-700"
//                     value={selectedDoc}
//                     onChange={(e) => setSelectedDoc(e.target.value)}
//                     disabled={remainingDocs.length === 0}
//                   >
//                     <option value="">-- Select --</option>
//                     {remainingDocs.map((doc, i) => (
//                       <option key={i} value={doc}>
//                         {doc}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {selectedDoc && (
//                   <div>
//                     <ImageUpload
//                       docName={selectedDoc}
//                       onUpload={() => handleUpload(selectedDoc)}
//                     />
//                   </div>
//                 )}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Right Side - Checklist */}
//       <div>
//         <Card className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
//           <CardHeader className="!mb-0">
//             <CardTitle className="text-xl font-bold">Document Checklist</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {documentList[userType.toLowerCase()].map((cat, idx) => (
//               <div key={idx} className="mb-6">
//                 <h3 className="text-lg font-semibold pb-2">{cat.category}</h3>
//                 <ul className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {cat.documents.map((doc, i) => (
//                     <li
//                       key={i}
//                       onClick={() => handleDocClick(doc)}
//                       className="flex items-center justify-between
//                         bg-gray-50 dark:bg-gray-800
//                         px-3 py-2 rounded-lg shadow-sm cursor-pointer
//                         hover:bg-gray-100 dark:hover:bg-gray-700
//                         transition"
//                     >
//                       <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                         {doc}
//                       </span>
//                       <CheckCircle
//                         className={`h-5 w-5 ${
//                           uploadedDocs[doc]
//                             ? "text-green-600"
//                             : "text-gray-400 dark:text-gray-500"
//                         }`}
//                       />
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         {/* Popup (Dialog) */}
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
//             <DialogHeader>
//               <DialogTitle>{selectedDoc}</DialogTitle>
//             </DialogHeader>
//             {/* Skeleton inside popup */}
//             <div className="space-y-3 mt-4">
//               <Skeleton className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700" />
//               <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
//               <Skeleton className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700" />
//               <Skeleton className="h-40 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// };

// export default UploaddocFI;

/********************updated section code 25 - 08 - 25 7.25 ******************** */

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation"; // ✅ Import router
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { CheckCircle } from "lucide-react";
// import { toast } from "sonner";
// import { ImageUpload } from "../atoms/ImageUpload";

// const documentList = {
//   customer: [
//     {
//       category: "Identity Proof",
//       documents: [
//         "Aadhaar Card",
//         "PAN Card",
//         "Passport",
//         "Voter ID",
//         "Driving License",
//       ],
//     },
//     {
//       category: "Address Proof",
//       documents: [
//         "Aadhaar Card",
//         "Passport",
//         "Voter ID",
//         "Utility Bill",
//         "Rent Agreement",
//       ],
//     },
//   ],
//   retailer: [
//     {
//       category: "Business Proof",
//       documents: [
//         "GST Certificate",
//         "Shop Act License",
//         "Udyam Registration",
//         "Business Registration Certificate",
//       ],
//     },
//     {
//       category: "Address Proof",
//       documents: [
//         "Shop Act License",
//         "Electricity Bill",
//         "Rental Agreement",
//         "Property Tax Receipt",
//       ],
//     },
//     {
//       category: "Other Supporting",
//       documents: [
//         "Owner Photo",
//         "Cancelled Cheque",
//         "Shop / Office Photographs",
//       ],
//     },
//   ],
// };

// const UploaddocFI = ({ userId, userType, retailer }) => {
//   const [uploadedDocs, setUploadedDocs] = useState({});
//   const [selectedDoc, setSelectedDoc] = useState("");
//   const router = useRouter(); // ✅ Router hook

//   const requiredDocs =
//     documentList[userType?.toLowerCase()]?.flatMap((cat) => cat.documents) ||
//     [];
//   const remainingDocs = requiredDocs.filter((doc) => !uploadedDocs[doc]);

//   // ✅ Handle upload callback
//   const handleUpload = (docName) => {
//     setUploadedDocs((prev) => {
//       const updated = { ...prev, [docName]: true };

//       const allUploaded = requiredDocs.every((doc) => updated[doc]);
//       if (allUploaded) {
//         toast.success(
//           `${retailer?.personalDetails?.fullName}'s KYC has been approved ✅`
//         );

//         setTimeout(() => {
//           router.push("/dashboard");
//         }, 1000);
//       }

//       return updated;
//     });

//     setSelectedDoc("");
//   };

//   if (!userType || !documentList[userType.toLowerCase()]) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Invalid or missing user type</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p>No document list available. Please check the URL.</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
//       {/* Left Side */}
//       <div>
//         <Card>
//           {/* <CardTitle>User ID: {userId}</CardTitle> */}
//           <CardHeader className="space-y-4">
//             <h2 className="text-2xl font-bold">User Details</h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-base">
//               {/* Name */}
//               <p className="font-semibold">
//                 Name: <span className="font-normal">Pranav Jagam</span>
//               </p>

//               {/* User ID */}
//               <p className="font-semibold">
//                 User ID: <span className="font-normal">{userId}</span>
//               </p>

//               {/* User Type */}
//               <p className="font-semibold">
//                 User Type:{" "}
//                 <span className="font-normal capitalize">{userType}</span>
//               </p>

//               {/* Joining Date */}
//               <p className="font-semibold">
//                 Applied Date: <span className="font-normal">25 Aug 2025</span>
//               </p>

//               {/* Status */}
//               <p className="font-semibold">
//                 Status: <span className="font-normal">FI Pending</span>
//               </p>
//             </div>
//           </CardHeader>

//           <CardContent>
//             <div className="space-y-4">

//               <div>
//                 <Label className="font-semibold">Select Document</Label>
//                 <select
//                   className="w-full border rounded-lg py-2 px-4 mt-2"
//                   value={selectedDoc}
//                   onChange={(e) => setSelectedDoc(e.target.value)}
//                   disabled={remainingDocs.length === 0}
//                 >
//                   <option value="">-- Select --</option>
//                   {remainingDocs.map((doc, i) => (
//                     <option key={i} value={doc}>
//                       {doc}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* ✅ File Upload */}
//               {selectedDoc && (
//                 <div>
//                   <ImageUpload
//                     docName={selectedDoc}
//                     onUpload={() => handleUpload(selectedDoc)}
//                   />
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Right Side - Checklist */}
//       <div>
//         <Card>
//           <CardHeader className="!mb-0">
//             <CardTitle className="text-xl font-bold">
//               Document Checklist
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {documentList[userType.toLowerCase()].map((cat, idx) => (
//               <div key={idx} className="mb-6">
//                 <h3 className="text-lg font-semibold pb-2">{cat.category}</h3>

//                 {/* ✅ Grid for 2-column layout */}
//                 <ul className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {cat.documents.map((doc, i) => (
//                     <li
//                       key={i}
//                       className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg shadow-sm"
//                     >
//                       <span className="text-sm font-medium text-gray-700">
//                         {doc}
//                       </span>
//                       <CheckCircle
//                         className={`h-5 w-5 ${
//                           uploadedDocs[doc] ? "text-green-600" : "text-gray-400"
//                         }`}
//                       />
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default UploaddocFI;

//**********************************25-8-25***************** */

// "use client";

// import { useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { CheckCircle } from "lucide-react";

// const UploaddocFI = () => {
//   const searchParams = useSearchParams();
//   const userId = searchParams.get("id");
//   const queryUserType = searchParams.get("userType");

//   console.log("id and user", userId,queryUserType )

//   // Normalize userType from URL (case-insensitive)
//   const userType = queryUserType
//     ? queryUserType.charAt(0).toUpperCase() + queryUserType.slice(1).toLowerCase()
//     : null;

//   const [uploadedDocs, setUploadedDocs] = useState({});
//   const [file, setFile] = useState(null);

//   // Document list config
//   const documentList = {
//     Customer: [
//       {
//         category: "Identity Proof",
//         documents: ["Aadhaar Card", "PAN Card", "Passport", "Voter ID", "Driving License"],
//       },
//       {
//         category: "Address Proof",
//         documents: ["Aadhaar Card", "Passport", "Voter ID", "Utility Bill", "Rent Agreement"],
//       },
//     ],
//     Retailer: [
//       {
//         category: "Business Proof",
//         documents: [
//           "GST Certificate",
//           "Shop Act License",
//           "Udyam Registration",
//           "Business Registration Certificate",
//         ],
//       },
//       {
//         category: "Address Proof",
//         documents: [
//           "Shop Act License",
//           "Electricity Bill",
//           "Rental Agreement",
//           "Property Tax Receipt",
//         ],
//       },
//       {
//         category: "Other Supporting",
//         documents: ["Owner Photo", "Cancelled Cheque", "Shop / Office Photographs"],
//       },
//     ],
//   };

//   // Handle file submit
//   const handleSubmit = (docName) => {
//     setUploadedDocs((prev) => ({
//       ...prev,
//       [docName]: true,
//     }));
//     setFile(null);
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
//       {/* Left Side */}
//       <div>
//         <Card>
//           <CardHeader>
//             <CardTitle>
//               Documents for {userType || "Unknown"}{" "}
//               {userId && <span className="text-sm text-gray-500">(User ID: {userId})</span>}
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {userType && documentList[userType] ? (
//               <div className="mt-6 space-y-6">
//                 {documentList[userType].map((cat, idx) => (
//                   <div key={idx}>
//                     <h3 className="font-semibold mb-2">{cat.category}</h3>
//                     {cat.documents.map((doc, i) => (
//                       <Card key={i} className="mb-4 p-4">
//                         <Label>{doc}</Label>
//                         <Input
//                           type="file"
//                           className="mt-2"
//                           onChange={(e) => setFile(e.target.files[0])}
//                         />
//                         <Button
//                           className="mt-3 w-full"
//                           disabled={!file}
//                           onClick={() => handleSubmit(doc)}
//                         >
//                           Submit {doc}
//                         </Button>
//                       </Card>
//                     ))}
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-red-500">Invalid or missing user type.</p>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Right Side */}
//       <div>
//         <Card>
//           <CardHeader>
//             <CardTitle>Document Checklist</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {userType && documentList[userType] ? (
//               documentList[userType].map((cat, idx) => (
//                 <div key={idx} className="mb-4">
//                   <h3 className="font-semibold">{cat.category}</h3>
//                   <ul className="mt-2 space-y-2">
//                     {cat.documents.map((doc, i) => (
//                       <li key={i} className="flex items-center justify-between border-b pb-2">
//                         <span>{doc}</span>
//                         <CheckCircle
//                           className={`h-5 w-5 ${
//                             uploadedDocs[doc] ? "text-green-600" : "text-gray-400"
//                           }`}
//                         />
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ))
//             ) : (
//               <p className="text-red-500">Invalid or missing user type.</p>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default UploaddocFI;
