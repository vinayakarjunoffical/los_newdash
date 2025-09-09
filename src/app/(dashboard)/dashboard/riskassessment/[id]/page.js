// "use client";

// import React, { useMemo, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Progress } from "@/components/ui/progress";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import {
//   CheckCircle2,
//   XCircle,
//   FileText,
//   CreditCard,
//   TrendingUp,
//   AlertTriangle,
//   User,
//   Banknote,
//   Building2,
//   ChevronRight,
//   Check,
//   Circle,
//   Plus,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip as RTooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { useParams } from "next/navigation";
// import { credit } from "@/utils/credit";
// import { toast } from "sonner";
// import Ceditscore from "@/components/atoms/chart/Ceditscore";

// // -------------------- Mock Data --------------------
// // const applicant = {
// //   id: "APP-2024-00087",
// //   name: "Aarav Sharma",
// //   loanType: "Personal Loan",
// //   amountApplied: 500000,
// //   tenureMonths: 36,
// //   incomeMonthly: 85000,
// //   fixedObligationsMonthly: 32000,
// //   employment: {
// //     type: "Salaried",
// //     company: "TechNova Pvt Ltd",
// //     experienceYears: 4,
// //   },
// //   bankSummary: {
// //     avgBalance: 42000,
// //     avgInflow: 90000,
// //     avgOutflow: 78000,
// //     redFlags: ["2 cheque bounces in last 12 months"],
// //   },
// //   cibil: {
// //     score: 738,
// //     utilization: 31,
// //     onTimeEMIRatio: 96,
// //   },
// //   bureau: {
// //     historyYears: 6,
// //     activeLines: [
// //       {
// //         type: "Credit Card",
// //         limit: 150000,
// //         balance: 43000,
// //         status: "Active",
// //         dpd: 0,
// //       },
// //       {
// //         type: "Two-Wheeler Loan",
// //         limit: 0,
// //         balance: 28000,
// //         status: "Closed",
// //         dpd: 0,
// //       },
// //       {
// //         type: "Consumer Durable",
// //         limit: 0,
// //         balance: 12000,
// //         status: "Active",
// //         dpd: 0,
// //       },
// //     ],
// //     delinquencies: 0,
// //     inquiriesLast6m: 3,
// //   },
// //   documents: [
// //     { name: "PAN", status: "verified" },
// //     { name: "Aadhaar", status: "verified" },
// //     { name: "Address Proof", status: "pending" },
// //     { name: "Salary Slips (3M)", status: "verified" },
// //     { name: "Bank Statement (6M)", status: "verified" },
// //   ],
// // };

// // Utility
// const currency = (n) =>
//   n.toLocaleString("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 0,
//   });

// const Stage = ({ label, active, done, onClick }) => (
//   <button
//     onClick={onClick}
//     className={`group w-full flex items-center justify-between rounded-2xl px-4 py-3 text-left border transition ${
//       active
//         ? "bg-primary/10 border-primary"
//         : done
//         ? "bg-muted border-transparent"
//         : "hover:bg-muted/60 border-transparent"
//     }`}
//   >
//     <span className="flex items-center gap-3">
//       {done ? (
//         <Check className="h-4 w-4 text-primary" />
//       ) : active ? (
//         <Circle className="h-4 w-4 text-primary animate-pulse" />
//       ) : (
//         <ChevronRight className="h-4 w-4 text-muted-foreground" />
//       )}
//       <span className="font-medium">{label}</span>
//     </span>
//     {done && <Badge variant="secondary">Done</Badge>}
//   </button>
// );

// // Simple radial gauge
// // const ScoreGauge = ({ value = 700, min = 300, max = 900, label = "CIBIL" }) => {
// //   const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
// //   return (
// //     <div className="flex flex-col items-center justify-center gap-3">
// //       <div className="relative h-36 w-36">
// //         <div
// //           className="absolute inset-0 rounded-full"
// //           style={{
// //             background: `conic-gradient(var(--primary) ${pct}%, hsl(var(--muted)) ${pct}% 100%)`,
// //           }}
// //         />
// //         <div className="absolute inset-2 rounded-full bg-background border" />
// //         <div className="absolute inset-0 grid place-items-center">
// //           <div className="text-center">
// //             <div className="text-2xl font-bold">{value}</div>
// //             <div className="text-xs text-muted-foreground">{label} Score</div>
// //           </div>
// //         </div>
// //       </div>
// //       <div className="text-xs text-muted-foreground">
// //         Range {min}–{max}
// //       </div>
// //     </div>
// //   );
// // };

// export default function LOSCreditAnalysisDashboard() {
//   const [activeTab, setActiveTab] = useState("analysis");
//   const { id } = useParams();
// //   const applicant = credit.find((item) => item.id === Number(id));

// //  const dti = useMemo(() => {
// //     const ratio =
// //       (applicant.fixedObligationsMonthly / applicant.incomeMonthly) * 100;
// //     return Math.round(ratio);
// //   }, []);

// //   const incomeVsObligations = [
// //     { name: "Income", value: applicant.incomeMonthly },
// //     { name: "Obligations", value: applicant.fixedObligationsMonthly },
// //   ];

// //   const eligibility = useMemo(() => {
// //     const maxEMI =
// //       applicant.incomeMonthly * 0.4 - applicant.fixedObligationsMonthly;
// //     const rate = 0.18 / 12;
// //     const n = applicant.tenureMonths;
// //     const loanEligible =
// //       maxEMI > 0
// //         ? Math.round(
// //             (maxEMI * (Math.pow(1 + rate, n) - 1)) /
// //               (rate * Math.pow(1 + rate, n))
// //           )
// //         : 0;
// //     return Math.max(0, loanEligible);
// //   }, []);

// //   const approvalProbability = useMemo(() => {
// //     const scorePart = (applicant.cibil.score - 300) / 600;
// //     const dtiPart = 1 - Math.min(1, dti / 60);
// //     const redFlagPenalty = applicant.bankSummary.redFlags.length > 0 ? 0.15 : 0;
// //     const prob = Math.max(
// //       0,
// //       Math.min(1, 0.55 * scorePart + 0.35 * dtiPart - redFlagPenalty + 0.15)
// //     );
// //     return Math.round(prob * 100);
// //   }, [dti]);

// const applicant = credit.find((item) => item.id === Number(id));

// const dti = useMemo(() => {
//   if (!applicant?.incomeMonthly || !applicant?.fixedObligationsMonthly) {
//     return 0;
//   }
//   const ratio =
//     (applicant.fixedObligationsMonthly / applicant.incomeMonthly) * 100;
//   return Math.round(ratio);
// }, [applicant?.fixedObligationsMonthly, applicant?.incomeMonthly]);

// const incomeVsObligations = useMemo(
//   () => [
//     { name: "Income", value: applicant?.incomeMonthly ?? 0 },
//     { name: "Obligations", value: applicant?.fixedObligationsMonthly ?? 0 },
//   ],
//   [applicant?.incomeMonthly, applicant?.fixedObligationsMonthly]
// );

// const eligibility = useMemo(() => {
//   if (
//     !applicant?.incomeMonthly ||
//     !applicant?.fixedObligationsMonthly ||
//     !applicant?.tenureMonths
//   ) {
//     return 0;
//   }

//   const maxEMI =
//     applicant.incomeMonthly * 0.4 - applicant.fixedObligationsMonthly;
//   const rate = 0.18 / 12;
//   const n = applicant.tenureMonths;

//   if (maxEMI <= 0) return 0;

//   return Math.round(
//     (maxEMI * (Math.pow(1 + rate, n) - 1)) / (rate * Math.pow(1 + rate, n))
//   );
// }, [
//   applicant?.incomeMonthly,
//   applicant?.fixedObligationsMonthly,
//   applicant?.tenureMonths,
// ]);

// const approvalProbability = useMemo(() => {
//   if (!applicant?.cibil?.score) return 0;

//   const scorePart = (applicant.cibil.score - 300) / 600;
//   const dtiPart = 1 - Math.min(1, dti / 60);

//   const redFlags = applicant?.bankSummary?.redFlags ?? [];
//   const redFlagPenalty = redFlags.length > 0 ? 0.15 : 0;

//   const prob = Math.max(
//     0,
//     Math.min(1, 0.55 * scorePart + 0.35 * dtiPart - redFlagPenalty + 0.15)
//   );
//   return Math.round(prob * 100);
// }, [dti, applicant?.cibil?.score, applicant?.bankSummary?.redFlags]);


//   const handleApprove = () => {
//     toast.success("Application approved successfully ");
//   };

//   const handleReject = () => {
//     toast.error("Application rejected");
//   };

//   const handleExport = () => {
//     toast.success("Your PDF has been exported successfully.");
//   };

//   const handleHold = () =>{
//     toast.warning("Application On Hold");
//   }

//   if (!applicant) {
//     return <div>No applicant found</div>;
//   }

//   const [extraDocs, setExtraDocs] = useState([]);
//   const [newDoc, setNewDoc] = useState("");

//   // Merge original + new
//   const allDocuments = [...applicant.documents, ...extraDocs];

//   const handleAddDocument = () => {
//     if (!newDoc.trim()) return;
//     setExtraDocs([...extraDocs, { name: newDoc, status: "pending" }]);
//     setNewDoc("");
//   };

//   const completion =
//     (allDocuments.filter((d) => d.status === "verified").length /
//       allDocuments.length) *
//     100;

 

//   const riskGrade =
//     approvalProbability >= 80
//       ? "A"
//       : approvalProbability >= 65
//       ? "B"
//       : approvalProbability >= 50
//       ? "C"
//       : "D";

//   const completed = {
//     analysis: true,
//     bank: true,
//     bureau: true,
//     docs: applicant.documents.every((d) => d.status === "verified"),
//     approve: false,
//   };

//   return (
//     <TooltipProvider>
//       <div className="flex h-full w-full gap-4 p-4">
//         {/* Main */}
//         <main className="flex-1">
//           {/* Header */}
//           <div className="mb-4 flex items-center justify-between gap-3">
//             <div className="space-y-1">
//               <h1 className="text-2xl font-bold tracking-tight">
//                 LOS Risk Assessment
//               </h1>
//               <p className="text-sm text-muted-foreground">
//                 Application <span className="font-medium">{applicant.id}</span>{" "}
//                 · {applicant.loanType}
//               </p>
//             </div>
//             <div className="flex items-center gap-2">
//               <Input
//                 placeholder="Search applicants"
//                 className="hidden sm:block w-64"
//               />
//               <Button variant="outline" onClick={handleExport}>
//                 Export PDF
//               </Button>
//             </div>
//           </div>

//           {/* Top Summary Cards */}
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm text-muted-foreground">
//                   Applicant
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="flex items-center justify-between">
//                 <div>
//                   <div className="text-lg font-semibold">{applicant.name}</div>
//                   <div className="text-xs text-muted-foreground">
//                     {applicant.employment.type} @ {applicant.employment.company}
//                   </div>
//                 </div>
//                 <User className="h-8 w-8" />
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm text-muted-foreground">
//                   Amount Applied
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="flex items-center justify-between">
//                 <div className="text-lg font-semibold">
//                   {currency(applicant.amountApplied)}
//                 </div>
//                 <Banknote className="h-8 w-8" />
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm text-muted-foreground">
//                   Risk Grade
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="flex items-center justify-between">
//                 <Badge
//                   variant={
//                     riskGrade === "A"
//                       ? "default"
//                       : riskGrade === "B"
//                       ? "secondary"
//                       : "destructive"
//                   }
//                   className="text-base px-3 py-1 rounded-xl"
//                 >
//                   {riskGrade}
//                 </Badge>
//                 <AlertTriangle className="h-8 w-8" />
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm text-muted-foreground">
//                   Approval Probability
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center justify-between">
//                   <span className="text-lg font-semibold">
//                     {approvalProbability}%
//                   </span>
//                   <TrendingUp className="h-8 w-8" />
//                 </div>
//                 <Progress value={approvalProbability} className="mt-3" />
//               </CardContent>
//             </Card>
//           </div>

//           <Separator className="my-4" />

//           {/* Tabs Content */}
//           <Tabs
//             value={activeTab}
//             onValueChange={setActiveTab}
//             className="space-y-4"
//           >
//             <TabsList className="grid lg:grid-cols-5 grid-cols-5 overflow-x-scroll lg:overflow-hidden">
//               <TabsTrigger value="analysis">Credit Analysis</TabsTrigger>
//               <TabsTrigger value="bank">Bank & CIBIL</TabsTrigger>
//               <TabsTrigger value="bureau">Bureau</TabsTrigger>
//               <TabsTrigger value="docs">Documents</TabsTrigger>
//               <TabsTrigger value="approve">Approval</TabsTrigger>
//             </TabsList>

//             {/* Credit Analysis */}
//             <TabsContent value="analysis" className="space-y-4">
//               <div className="grid gap-4 lg:grid-cols-3">
//                 <Card className="lg:col-span-1">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <CreditCard className="h-5 w-5" /> Debt-to-Income (DTI)
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="h-48">
//                         <ResponsiveContainer width="100%" height="100%">
//                           <PieChart>
//                             <Pie
//                               data={incomeVsObligations}
//                               dataKey="value"
//                               nameKey="name"
//                               innerRadius={45}
//                               outerRadius={70}
//                             >
//                               {incomeVsObligations.map((_, idx) => (
//                                 <Cell key={idx} />
//                               ))}
//                             </Pie>
//                             <RTooltip />
//                           </PieChart>
//                         </ResponsiveContainer>
//                       </div>
//                       <div className="space-y-2">
//                         <div className="text-sm">
//                           Monthly Income:{" "}
//                           <span className="font-medium">
//                             {currency(applicant.incomeMonthly)}
//                           </span>
//                         </div>
//                         <div className="text-sm">
//                           Monthly Obligations:{" "}
//                           <span className="font-medium">
//                             {currency(applicant.fixedObligationsMonthly)}
//                           </span>
//                         </div>
//                         <div className="text-sm">
//                           DTI Ratio:{" "}
//                           <Badge
//                             variant={dti < 45 ? "secondary" : "destructive"}
//                           >
//                             {dti}%
//                           </Badge>
//                         </div>
//                         <div className="text-sm">
//                           Tenure:{" "}
//                           <span className="font-medium">
//                             {applicant.tenureMonths} months
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="lg:col-span-2">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Building2 className="h-5 w-5" /> Employment & Obligations
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="grid sm:grid-cols-2 gap-4">
//                     <div className="space-y-1">
//                       <div className="text-sm text-muted-foreground">
//                         Employment
//                       </div>
//                       <div className="text-base font-medium">
//                         {applicant.employment.type}
//                       </div>
//                       <div className="text-sm">
//                         Company:{" "}
//                         <span className="font-medium">
//                           {applicant.employment.company}
//                         </span>
//                       </div>
//                       <div className="text-sm">
//                         Experience:{" "}
//                         <span className="font-medium">
//                           {applicant.employment.experienceYears} years
//                         </span>
//                       </div>
//                     </div>
//                     <div className="space-y-1">
//                       <div className="text-sm text-muted-foreground">
//                         Loan Eligibility (est.)
//                       </div>
//                       <div className="text-2xl font-semibold">
//                         {currency(eligibility)}
//                       </div>
//                       <div className="text-xs text-muted-foreground">
//                         Calculated from affordable EMI and tenure
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>

//             {/* Bank & CIBIL */}
//             <TabsContent value="bank" className="space-y-4">
//               <div className="grid gap-4 lg:grid-cols-3">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>CIBIL Score</CardTitle>
//                   </CardHeader>
//                   <CardContent className="flex items-center justify-center">
//                     {/* <ScoreGauge value={applicant.cibil.score} /> */}
//                     <Ceditscore value={applicant.cibil.score} />
//                   </CardContent>
//                 </Card>

//                 <Card className="lg:col-span-2">
//                   <CardHeader>
//                     <CardTitle>Bank Statement Summary</CardTitle>
//                   </CardHeader>
//                   <CardContent className="grid sm:grid-cols-3 gap-4">
//                     <div>
//                       <div className="text-sm text-muted-foreground">
//                         Average Balance
//                       </div>
//                       <div className="font-semibold">
//                         {currency(applicant.bankSummary.avgBalance)}
//                       </div>
//                     </div>
//                     <div>
//                       <div className="text-sm text-muted-foreground">
//                         Avg Inflow
//                       </div>
//                       <div className="font-semibold">
//                         {currency(applicant.bankSummary.avgInflow)}
//                       </div>
//                     </div>
//                     <div>
//                       <div className="text-sm text-muted-foreground">
//                         Avg Outflow
//                       </div>
//                       <div className="font-semibold">
//                         {currency(applicant.bankSummary.avgOutflow)}
//                       </div>
//                     </div>
//                     <div className="sm:col-span-3">
//                       <div className="text-sm text-muted-foreground mb-2">
//                         Red Flags
//                       </div>
//                       {applicant.bankSummary.redFlags.length === 0 ? (
//                         <Badge variant="secondary">None</Badge>
//                       ) : (
//                         <ul className="list-disc list-inside text-sm">
//                           {applicant.bankSummary.redFlags.map((f, i) => (
//                             <li key={i} className="text-destructive">
//                               {f}
//                             </li>
//                           ))}
//                         </ul>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>

//             {/* Bureau Check */}
//             <TabsContent value="bureau" className="space-y-4">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Trade Lines & History</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid gap-4 md:grid-cols-4">
//                     <div>
//                       <div className="text-sm text-muted-foreground">
//                         History Length
//                       </div>
//                       <div className="font-semibold">
//                         {applicant.bureau.historyYears} years
//                       </div>
//                     </div>
//                     <div>
//                       <div className="text-sm text-muted-foreground">
//                         Delinquencies
//                       </div>
//                       <div className="font-semibold">
//                         {applicant.bureau.delinquencies}
//                       </div>
//                     </div>
//                     <div>
//                       <div className="text-sm text-muted-foreground">
//                         Inquiries (6m)
//                       </div>
//                       <div className="font-semibold">
//                         {applicant.bureau.inquiriesLast6m}
//                       </div>
//                     </div>
//                   </div>

//                   <ScrollArea className="mt-4 h-56 rounded-md border">
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>Type</TableHead>
//                           <TableHead>Limit</TableHead>
//                           <TableHead>Balance</TableHead>
//                           <TableHead>Status</TableHead>
//                           <TableHead>DPD</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {applicant.bureau.activeLines.map((l, i) => (
//                           <TableRow key={i}>
//                             <TableCell>{l.type}</TableCell>
//                             <TableCell>
//                               {l.limit ? currency(l.limit) : "—"}
//                             </TableCell>
//                             <TableCell>{currency(l.balance)}</TableCell>
//                             <TableCell>
//                               <Badge
//                                 variant={
//                                   l.status === "Active"
//                                     ? "secondary"
//                                     : "outline"
//                                 }
//                               >
//                                 {l.status}
//                               </Badge>
//                             </TableCell>
//                             <TableCell>{l.dpd}</TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </ScrollArea>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             {/* Documents */}
//             <TabsContent value="docs" className="space-y-4">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Document Checklist</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {/* Progress */}
//                   <div className="mb-4">
//                     <div className="text-sm text-muted-foreground mb-1">
//                       Completion
//                     </div>
//                     <Progress value={completion} />
//                   </div>

//                   {/* Document list */}
//                   <div className="grid sm:grid-cols-2 gap-3 mb-4">
//                     {allDocuments.map((doc, i) => (
//                       <motion.div
//                         key={i}
//                         initial={{ opacity: 0, y: 6 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: i * 0.04 }}
//                         className="flex items-center justify-between rounded-2xl border p-3"
//                       >
//                         <div className="flex items-center gap-3">
//                           <FileText className="h-4 w-4" />
//                           <div>
//                             <div className="font-medium text-sm">
//                               {doc.name}
//                             </div>
//                             <div className="text-xs text-muted-foreground">
//                               KYC/Financial
//                             </div>
//                           </div>
//                         </div>
//                         {doc.status === "verified" ? (
//                           <Badge className="gap-1" variant="secondary">
//                             <CheckCircle2 className="h-3 w-3" /> Verified
//                           </Badge>
//                         ) : (
//                           <Badge className="gap-1" variant="destructive">
//                             <XCircle className="h-3 w-3" /> Pending
//                           </Badge>
//                         )}
//                       </motion.div>
//                     ))}
//                   </div>

//                   {/* Add new document input */}
//                   <div className="flex gap-2">
//                     <Input
//                       placeholder="Enter document name..."
//                       value={newDoc}
//                       onChange={(e) => setNewDoc(e.target.value)}
//                     />
//                     <Button onClick={handleAddDocument}>
//                       <Plus className="h-4 w-4 mr-1" /> Add
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             {/* Approval */}
//             <TabsContent value="approve" className="space-y-4">
//               <div className="grid gap-4 lg:grid-cols-3">
//                 <Card className="lg:col-span-2">
//                   <CardHeader>
//                     <CardTitle>Eligibility vs Applied</CardTitle>
//                   </CardHeader>
//                   <CardContent className="h-64">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart
//                         data={[
//                           {
//                             name: "Amount",
//                             Applied: applicant.amountApplied,
//                             Eligible: eligibility,
//                           },
//                         ]}
//                       >
//                         <XAxis dataKey="name" />
//                         <YAxis />
//                         <RTooltip />
//                         <Bar dataKey="Applied" />
//                         <Bar dataKey="Eligible" />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Decision</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-3">
//                     <div className="text-sm">Approval Probability</div>
//                     <div className="text-3xl font-semibold">
//                       {approvalProbability}%
//                     </div>
//                     <Progress value={approvalProbability} />
//                     <Textarea
//                       placeholder="Reviewer notes..."
//                       className="min-h-[120px]"
//                     />
//                     <div className="flex gap-2">
//                        <Button className="flex-1" variant="secondary" onClick={handleHold}>
//                         On Hold
//                       </Button>
//                       <Button className="flex-1" onClick={handleApprove}>
//                         Approve
//                       </Button>
//                       <Button
//                         variant="destructive"
//                         className="flex-1"
//                         onClick={handleReject}
//                       >
//                         Reject
//                       </Button>
//                     </div>
//                     <div className="text-xs text-muted-foreground">
//                       Actions will trigger workflow events (notify applicant,
//                       disbursal, etc.).
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </main>
//       </div>
//     </TooltipProvider>
//   );
// }
