"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Download, Upload, CheckCircle2, Circle,Check } from "lucide-react";
import { DocumentUpload } from "../atoms/DocumentUpload";
import { pdiData } from "@/utils/Pdidata";
import { Card, CardHeader } from "@/components/ui/card";

export default function PDIPage() {
  const { id } = useParams();

  // 🔹 find application by ID (id from params is string, so convert to number)
  const config = pdiData.find((item) => item.id === Number(id));

  if (!config) {
    return <p className="p-6 text-red-500">Invalid Integration ID</p>;
  }

  // use questions from JSON
  const questionsData = config.questions;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [docs, setDocs] = useState({});
  const [completedQuestions, setCompletedQuestions] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [remark, setRemark] = useState("");

  const totalQuestions = questionsData.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleUpload = (docName, file) => {
    setDocs((prev) => ({ ...prev, [docName]: file?.name || "Uploaded" }));
    toast.success(`${docName} uploaded successfully`);
  };

  const handleExport = () => toast.info("Export functionality coming soon...");
  const handleImport = () => toast.info("Import functionality coming soon...");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 max-w-6xl mx-auto">
      {/* Left: Questions + User Details */}
      <div className="md:col-span-2 space-y-6">
        {/* 🔹 User Details Card */}
        <Card>
          <CardHeader className="space-y-4">
            <h2 className="text-lg font-bold">User Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-base">
              <p className="font-semibold">
                Application ID:{" "}
                <span className="font-normal">{config.applicationId}</span>
              </p>
              <p className="font-semibold">
                User Type:{" "}
                <span className="font-normal capitalize">{config.userType}</span>
              </p>
              <p className="font-semibold">
                Name: <span className="font-normal">{config.name}</span>
              </p>
              <p className="font-semibold">
                Email: <span className="font-normal">{config.email}</span>
              </p>
              <p className="font-semibold">
                Phone: <span className="font-normal">{config.phone}</span>
              </p>
              <p className="font-semibold">
                Address: <span className="font-normal">{config.address}</span>
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Header buttons */}
        <div className="flex gap-4 mb-6">
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleImport} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>

        <h3 className="text-lg font-bold mb-4">
          PDI Questions for {config.name} ({config.applicationId})
        </h3>

        {/* Progress */}
        <div className="mb-4">
          <Progress value={progress} />
          <p className="text-sm text-gray-600 mt-1">
            Question {currentQuestion + 1} of {totalQuestions}
          </p>
        </div>

        {/* Question Card */}
        <Card className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {!submitted ? (
            (() => {
              const q = questionsData[currentQuestion];
              return (
                <div key={q.qid} className="space-y-3">
                  {/* Question */}
                  <Label className="font-semibold">
                    {q.question}
                    {q.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>

                  <input
                    type="text"
                    className="w-full border rounded-lg py-2 px-3 
                      bg-gray-100 dark:bg-gray-800 
                      text-gray-800 dark:text-gray-200 
                      border-gray-300 dark:border-gray-700"
                    value={answers[q.qid] || ""}
                    maxLength={q.length}
                    onChange={(e) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [q.qid]: e.target.value,
                      }))
                    }
                    required={q.required}
                  />

                  {/* Upload if required */}
                  {q.supportedDocument && (
                    <div className="mt-2">
                      <DocumentUpload
                        docName={q.supportedDocument}
                        onUpload={(file) =>
                          handleUpload(q.supportedDocument, file)
                        }
                      />
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between mt-6">
                    {currentQuestion > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentQuestion((prev) => prev - 1)}
                      >
                        Previous
                      </Button>
                    )}

                    {currentQuestion < totalQuestions - 1 ? (
                      <Button
                        onClick={() => {
                          if (q.required && !answers[q.qid]) {
                            toast.error("Please answer this question first");
                            return;
                          }

                          setCompletedQuestions((prev) => ({
                            ...prev,
                            [q.qid]: true,
                          }));

                          setCurrentQuestion((prev) => prev + 1);
                        }}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          const missing = questionsData.filter(
                            (q) => q.required && !answers[q.qid]
                          );
                          if (missing.length > 0) {
                            toast.error("Please fill all required questions");
                            return;
                          }

                          const allCompleted = {};
                          questionsData.forEach((q) => {
                            allCompleted[q.qid] = true;
                          });
                          setCompletedQuestions(allCompleted);

                          toast.success("PDI Questions Submitted!");
                          setSubmitted(true);
                        }}
                      >
                        Submit
                      </Button>
                    )}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-semibold text-green-600">
    <CheckCircle2 className="w-5 h-5" />
    PDI Verification Completed!
  </h4>

              {/* Remark Section */}
              <div>
                <Label className="font-semibold">Remarks</Label>
                <textarea
                  className="w-full border rounded-lg py-2 px-3 mt-2
                    bg-gray-100 dark:bg-gray-800 
                    text-gray-800 dark:text-gray-200 
                    border-gray-300 dark:border-gray-700"
                  rows={4}
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Enter your remarks here..."
                />
              </div>

              <Button
                onClick={() => {
                  if (!remark.trim()) {
                    toast.error("Please enter a remark before saving");
                    return;
                  }
                  toast.success("Remarks saved successfully!");
                }}
              >
                Save Remark
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Right: Checklist */}
      <div className="border rounded-lg p-4 bg-white dark:bg-gray-900 shadow-sm">
        <h4 className="font-semibold mb-4 text-lg">Checklist</h4>
        <ul className="space-y-3">
          {questionsData.map((q) => {
            const answered = !!answers[q.qid];
            const docUploaded = q.supportedDocument
              ? !!docs[q.supportedDocument]
              : true;
            const done =
              completedQuestions[q.qid] &&
              (q.supportedDocument ? docUploaded : true);

            return (
              <li
                key={q.qid}
                className="flex items-center justify-between 
                  bg-gray-50 dark:bg-gray-800 
                  px-3 py-2 rounded-lg shadow-sm 
                  hover:bg-gray-100 dark:hover:bg-gray-700 
                  transition"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {q.question}
                  {q.supportedDocument && (
                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                      Document: {q.supportedDocument}{" "}
                      {docs[q.supportedDocument] && ""}
                    </span>
                  )}
                </span>

                {done ? (
                  <CheckCircle2 className="text-green-500 w-5 h-5 flex-shrink-0" />
                ) : (
                  <Circle className="text-gray-400 w-5 h-5 flex-shrink-0" />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}


  
//**************************11-09-25 4:48 without change ********************** */
// "use client";

// import { useState } from "react";
// import { useParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Progress } from "@/components/ui/progress";
// import { toast } from "sonner";
// import { Download, Upload, CheckCircle2, Circle } from "lucide-react";
// import { DocumentUpload } from "../atoms/DocumentUpload";
// import { pdiData } from "@/utils/Pdidata";

// // const questionsData = [
// //   {
// //     id: 1,
// //     question: "Is the shop physically verified?",
// //     required: true,
// //     length: 50,
// //     supportedDocument: "Shop License",
// //   },
// //   {
// //     id: 2,
// //     question: "Does the customer have a valid ID proof?",
// //     required: true,
// //     length: 20,
// //   },
// //   {
// //     id: 3,
// //     question: "Has the income proof document been collected?",
// //     required: false,
// //     length: 100,
// //     supportedDocument: "Salary Slip",
// //   },
// // ];

// export default function PDIPage() {
//     const { id } = useParams();
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [docs, setDocs] = useState({});
//   const [completedQuestions, setCompletedQuestions] = useState({});
//   const totalQuestions = questionsData.length;
//   const progress = ((currentQuestion + 1) / totalQuestions) * 100;
//    const config = pdiData[id];

   
//   if (!config) {
//     return <p className="p-6 text-red-500">Invalid Integration ID</p>;
//   }

//   const handleUpload = (docName, file) => {
//     setDocs((prev) => ({ ...prev, [docName]: file?.name || "Uploaded" }));
//     toast.success(`${docName} uploaded successfully`);
//   };

//   const handleExport = () => {
//     toast.info("Export functionality coming soon...");
//   };
//    const handleImport = () => {
//     toast.info("Import functionality coming soon...");
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 max-w-6xl mx-auto">
//       {/* Left: Questions */}
//       <div className="md:col-span-2 space-y-6">
//         {/* Header buttons */}
//         <div className="flex gap-4 mb-6">
//           <Button onClick={handleExport} variant="outline">
//             <Download className="w-4 h-4 mr-2" />
//             Export
//           </Button>
//           <Button onClick={handleImport}  variant="outline">
//             <Upload className="w-4 h-4 mr-2" />
//             Import
//           </Button>
//         </div>

//         <h3 className="text-lg font-bold mb-4">PDI Questions</h3>

//         {/* Progress */}
//         <div className="mb-4">
//           <Progress value={progress} />
//           <p className="text-sm text-gray-600 mt-1">
//             Question {currentQuestion + 1} of {totalQuestions}
//           </p>
//         </div>

//         <Card className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
//           {(() => {
//             const q = questionsData[currentQuestion];
//             return (
//               <div key={q.id} className="space-y-3">
//                 {/* Question */}
//                 <Label className="font-semibold">
//                   {q.question}
//                   {q.required && <span className="text-red-500 ml-1">*</span>}
//                 </Label>

//                 <input
//                   type="text"
//                   className="w-full border rounded-lg py-2 px-3 
//                     bg-gray-100 dark:bg-gray-800 
//                     text-gray-800 dark:text-gray-200 
//                     border-gray-300 dark:border-gray-700"
//                   value={answers[q.id] || ""}
//                   maxLength={q.length}
//                   onChange={(e) =>
//                     setAnswers((prev) => ({
//                       ...prev,
//                       [q.id]: e.target.value,
//                     }))
//                   }
//                   required={q.required}
//                 />

//                 {/* Upload if required */}
//                 {q.supportedDocument && (
//                   <div className="mt-2">
                   
//                     <DocumentUpload
//                       docName={q.supportedDocument}
//                       onUpload={(file) => handleUpload(q.supportedDocument, file)}
//                     />
//                   </div>
//                 )}

//                 {/* Navigation */}
//                 <div className="flex justify-between mt-6">
//                   {currentQuestion > 0 && (
//                     <Button
//                       variant="outline"
//                       onClick={() => setCurrentQuestion((prev) => prev - 1)}
//                     >
//                       Previous
//                     </Button>
//                   )}

//                   {currentQuestion < totalQuestions - 1 ? (
//                     <Button
//                       onClick={() => {
//                         if (q.required && !answers[q.id]) {
//                           toast.error("Please answer this question first");
//                           return;
//                         }

//                         // Mark question as completed
//                         setCompletedQuestions((prev) => ({
//                           ...prev,
//                           [q.id]: true,
//                         }));

//                         setCurrentQuestion((prev) => prev + 1);
//                       }}
//                     >
//                       Next
//                     </Button>
//                   ) : (
//                     <Button
//                       onClick={() => {
//                         const missing = questionsData.filter(
//                           (q) => q.required && !answers[q.id]
//                         );
//                         if (missing.length > 0) {
//                           toast.error("Please fill all required questions");
//                           return;
//                         }

//                         // Mark all completed
//                         const allCompleted = {};
//                         questionsData.forEach((q) => {
//                           allCompleted[q.id] = true;
//                         });
//                         setCompletedQuestions(allCompleted);

//                         toast.success("PDI Verification Completed!");
//                       }}
//                     >
//                       Submit
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             );
//           })()}
//         </Card>
//       </div>

//       {/* Right: Checklist */}
//       <div className="border rounded-lg p-4 bg-white dark:bg-gray-900 shadow-sm">
//         <h4 className="font-semibold mb-4 text-lg">Checklist</h4>
//         <ul className="space-y-3">
//           {questionsData.map((q) => {
//             const answered = !!answers[q.id];
//             const docUploaded = q.supportedDocument
//               ? !!docs[q.supportedDocument]
//               : true;
//             const done =
//               completedQuestions[q.id] &&
//               (q.supportedDocument ? docUploaded : true);

//             return (
//               <li
//                 key={q.id}
//                 className="flex items-center justify-between 
//                   bg-gray-50 dark:bg-gray-800 
//                   px-3 py-2 rounded-lg shadow-sm 
//                   hover:bg-gray-100 dark:hover:bg-gray-700 
//                   transition"
//               >
//                 {/* Question + Doc Label */}
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                   {q.question}
//                   {q.supportedDocument && (
//                     <span className="block text-xs text-gray-500 dark:text-gray-400">
//                       Document: {q.supportedDocument}{" "}
//                       {docs[q.supportedDocument] && ""}
//                     </span>
//                   )}
//                 </span>

//                 {/* Status Icon */}
//                 {done ? (
//                   <CheckCircle2 className="text-green-500 w-5 h-5 flex-shrink-0" />
//                 ) : (
//                   <Circle className="text-gray-400 w-5 h-5 flex-shrink-0" />
//                 )}
//               </li>
//             );
//           })}
//         </ul>
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Progress } from "@/components/ui/progress";
// import { toast } from "sonner";
// import { Download, Upload } from "lucide-react";
// import { DocumentUpload } from "../atoms/DocumentUpload";

// // ✅ Example image upload placeholder
// const ImageUpload = ({ docName, onUpload }) => (
//   <div className="flex flex-col gap-2">
//     <input type="file" onChange={onUpload} />
//   </div>
// );

// const questionsData = [
//   {
//     id: 1,
//     question: "Is the shop physically verified?",
//     required: true,
//     length: 50,
//     supportedDocument: "Shop License",
//   },
//   {
//     id: 2,
//     question: "Does the customer have a valid ID proof?",
//     required: true,
//     length: 20,
//   },
//   {
//     id: 3,
//     question: "Has the income proof document been collected?",
//     required: false,
//     length: 100,
//     supportedDocument: "Salary Slip",
//   },
// ];

// export default function PDIPage() {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const totalQuestions = questionsData.length;
//   const progress = ((currentQuestion + 1) / totalQuestions) * 100;

//   const handleUpload = (docName) => {
//     toast.success(`${docName} uploaded successfully`);
//   };

//   const handleExport = () => {
//     toast.info("Export functionality coming soon...");
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       {/* Header buttons */}
//       <div className="flex gap-4 mb-6">
//         <Button onClick={handleExport} variant="outline">
//           <Download className="w-4 h-4 mr-2" />
//           Export
//         </Button>
//         <Button variant="outline">
//           <Upload className="w-4 h-4 mr-2" />
//           Import
//         </Button>
//       </div>

//       <h3 className="text-lg font-bold mb-4">FI Verification Questions</h3>

//       {/* ✅ Progress bar */}
//       <div className="mb-4">
//         <Progress value={progress} />
//         <p className="text-sm text-gray-600 mt-1">
//           Question {currentQuestion + 1} of {totalQuestions}
//         </p>
//       </div>

//       <Card className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
//         {(() => {
//           const q = questionsData[currentQuestion];
//           return (
//             <div key={q.id} className="space-y-3">
//               {/* Question */}
//               <Label className="font-semibold">
//                 {q.question}
//                 {q.required && <span className="text-red-500 ml-1">*</span>}
//               </Label>

//               <input
//                 type="text"
//                 className="w-full border rounded-lg py-2 px-3 
//                   bg-gray-100 dark:bg-gray-800 
//                   text-gray-800 dark:text-gray-200 
//                   border-gray-300 dark:border-gray-700"
//                 value={answers[q.id] || ""}
//                 maxLength={q.length}
//                 onChange={(e) =>
//                   setAnswers((prev) => ({
//                     ...prev,
//                     [q.id]: e.target.value,
//                   }))
//                 }
//                 required={q.required}
//               />

//               {/* ✅ Show Upload if document required */}
//               {q.supportedDocument && (
//                 <div className="mt-2">
//     <DocumentUpload
//       docName={q.supportedDocument}
//       onUpload={() => handleUpload(q.supportedDocument)}
//     />
//   </div>

//               )}

//               {/* Navigation buttons */}
//               <div className="flex justify-between mt-6">
//                 {currentQuestion > 0 && (
//                   <Button
//                     variant="outline"
//                     onClick={() => setCurrentQuestion((prev) => prev - 1)}
//                   >
//                     Previous
//                   </Button>
//                 )}

//                 {currentQuestion < totalQuestions - 1 ? (
//                   <Button
//                     onClick={() => {
//                       if (q.required && !answers[q.id]) {
//                         toast.error("Please answer this question first");
//                         return;
//                       }
//                       setCurrentQuestion((prev) => prev + 1);
//                     }}
//                   >
//                     Next
//                   </Button>
//                 ) : (
//                   <Button
//                     onClick={() => {
//                       const missing = questionsData.filter(
//                         (q) => q.required && !answers[q.id]
//                       );
//                       if (missing.length > 0) {
//                         toast.error("Please fill all required questions");
//                         return;
//                       }
//                       toast.success("PDI Verification Completed!");
//                     }}
//                   >
//                     Submit
//                   </Button>
//                 )}
//               </div>
//             </div>
//           );
//         })()}
//       </Card>
//     </div>
//   );
// }
