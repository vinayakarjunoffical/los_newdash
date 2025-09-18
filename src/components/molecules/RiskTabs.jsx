// import React from 'react'
// import { useMemo, useState } from "react";
// import { useParams } from "next/navigation"; 
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Textarea } from "@/components/ui/textarea";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Progress } from "@/components/ui/progress";
// import { motion } from "framer-motion";
// import { Input } from "@/components/ui/input";
// import {
//   Accordion,
//   AccordionItem,
//   AccordionTrigger,
//   AccordionContent,
// } from "@/components/ui/accordion";
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
// import { Badge } from "@/components/ui/badge";
// import {
//   XCircle,
//   FileText,
//   CreditCard,
//   AlertTriangle,
//   Building2,
//   CircleDashed,
//   CheckCircle2,
//   Plus,
// } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import RiskCredit from '../atoms/chart/RiskCredit';
// import { toast } from "sonner";

// const currency = (n) =>
//   n.toLocaleString("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 0,
//   });

// const RiskTabs = ({ credit }) => {
//       const { id } = useParams(); 
//      const [activeTab, setActiveTab] = useState("analysis");
//        const [open, setOpen] = useState(false);
//        const [selectedLine, setSelectedLine] = useState(null);
//          const [extraDocs, setExtraDocs] = useState([]);
//          const [newDoc, setNewDoc] = useState("");

//       const applicant = credit.find((item) => item.id === Number(id));
//   const dti = useMemo(() => {
//     if (!applicant) return 0;

//     if (!applicant.incomeMonthly || !applicant.fixedObligationsMonthly) {
//       return 0;
//     }

//     const ratio =
//       (applicant.fixedObligationsMonthly / applicant.incomeMonthly) * 100;

//     return Math.round(ratio);
//   }, [applicant]);

//   const eligibility = useMemo(() => {
//     if (!applicant) return 0;

//     const maxEMI =
//       applicant.incomeMonthly * 0.4 - applicant.fixedObligationsMonthly;
//     const rate = 0.18 / 12;
//     const n = applicant.tenureMonths;

//     if (maxEMI <= 0 || !n) return 0;

//     const loanEligible = Math.round(
//       (maxEMI * (Math.pow(1 + rate, n) - 1)) / (rate * Math.pow(1 + rate, n))
//     );

//     return Math.max(0, loanEligible);
//   }, [applicant]);

//   // Approval Probability
//   const approvalProbability = useMemo(() => {
//     if (!applicant) return 0;

//     const scorePart = (applicant.cibil?.score - 300) / 600;
//     const dtiPart = 1 - Math.min(1, dti / 60);

//     const redFlags = applicant.bankSummary?.redFlags ?? [];
//     const redFlagPenalty = redFlags.length > 0 ? 0.15 : 0;

//     const prob = Math.max(
//       0,
//       Math.min(1, 0.55 * scorePart + 0.35 * dtiPart - redFlagPenalty + 0.15)
//     );

//     return Math.round(prob * 100);
//   }, [applicant, dti]);

//   const handleOpen = (line) => {
//     setSelectedLine(line);
//     setOpen(true);
//   };
//   const renderStatus = (record) => {
//     if (!record) {
//       return <CircleDashed className="w-5 h-5 text-gray-400 mx-auto" />;
//     }
//     if (record.disputed) {
//       return <AlertTriangle className="w-5 h-5 text-orange-500 mx-auto" />;
//     }
//     if (record.paidOnTime) {
//       return <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />;
//     }
//     return <XCircle className="w-5 h-5 text-red-500 mx-auto" />;
//   };

//   const groupByYear = (emiHistory) => {
//     const years = ["2021", "2022", "2023", "2024", "2025"]; // all years you want to show
//     const grouped = {};

//     // initialize all years
//     years.forEach((year) => {
//       grouped[year] = {};
//     });

//     // populate EMI data
//     emiHistory.forEach((r) => {
//       const [year, month] = r.month.split("-");
//       if (!grouped[year]) grouped[year] = {};
//       grouped[year][month] = r;
//     });

//     return grouped;
//   };

//   const handleApprove = () => {
//     toast.success("Application approved successfully ");
//   };

//   const handleReject = () => {
//     toast.error("Application rejected");
//   };

//   const handleExport = () => {
//     toast.success("Your PDF has been exported successfully.");
//   };

//   const handleHold = () => {
//     toast.warning("Application On Hold");
//   };

//     if (!applicant) {
//     return <div>No applicant found</div>;
//   }

//   // Merge original + new
//   const allDocuments = [...applicant.documents, ...extraDocs];

//   const handleAddDocument = () => {
//     if (!newDoc.trim()) return;
//     setExtraDocs([...extraDocs, { name: newDoc, status: "pending" }]);
//     setNewDoc("");
//   };

//     const completion =
//     (allDocuments.filter((d) => d.status === "verified").length /
//       allDocuments.length) *
//     100;


//       const incomeVsObligations = [
//     { name: "Income", value: applicant.incomeMonthly },
//     { name: "Obligations", value: applicant.fixedObligationsMonthly },
//   ];
//   return (
//     <div>
//          {/* Tabs Content */}
//           <Tabs
//             value={activeTab}
//             onValueChange={setActiveTab}
//             className="space-y-4"
//           >
//             <TabsList className="grid lg:grid-cols-10 grid-cols-10 overflow-x-scroll lg:overflow-hidden">
//               <TabsTrigger value="application">Login Data</TabsTrigger>
//               <TabsTrigger value="fi">FI Data</TabsTrigger>
//               <TabsTrigger value="analysis">Credit Analysis</TabsTrigger>
//               <TabsTrigger value="bank">Bank & CIBIL</TabsTrigger>
//               <TabsTrigger value="bureau">Bureau</TabsTrigger>
//               <TabsTrigger value="docs">Documents</TabsTrigger>
//               <TabsTrigger value="pdi">PDI Data</TabsTrigger>
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
//                     <RiskCredit value={applicant.cibil?.score ?? 0} />
//                   </CardContent>
//                 </Card>

//                 {/* RIGHT: either aggregated summary (fallback) OR list of accounts via Accordion */}
//                 <Card className="lg:col-span-2">
//                   <CardHeader>
//                     <CardTitle>Bank Statement Summary</CardTitle>
//                   </CardHeader>
//                   <CardContent className="grid gap-4">
//                     {/* derive summary from bankAccounts when available */}
//                     {(() => {
//                       // local helper to compute derived summary
//                       const accounts = applicant.bankAccounts ?? null;
//                       if (accounts && accounts.length > 0) {
//                         const avgBalance =
//                           Math.round(
//                             accounts.reduce(
//                               (s, a) => s + (a.avgBalance ?? 0),
//                               0
//                             ) / accounts.length
//                           ) || 0;
//                         const avgInflow =
//                           Math.round(
//                             accounts.reduce(
//                               (s, a) => s + (a.avgInflow ?? 0),
//                               0
//                             ) / accounts.length
//                           ) || 0;
//                         const avgOutflow =
//                           Math.round(
//                             accounts.reduce(
//                               (s, a) => s + (a.avgOutflow ?? 0),
//                               0
//                             ) / accounts.length
//                           ) || 0;
//                         const redFlags = accounts.flatMap(
//                           (a) => a.redFlags ?? []
//                         );
//                         applicant.bankSummary = applicant.bankSummary ?? {};
//                         applicant.bankSummary.avgBalance =
//                           applicant.bankSummary.avgBalance ?? avgBalance;
//                         applicant.bankSummary.avgInflow =
//                           applicant.bankSummary.avgInflow ?? avgInflow;
//                         applicant.bankSummary.avgOutflow =
//                           applicant.bankSummary.avgOutflow ?? avgOutflow;
//                         applicant.bankSummary.redFlags =
//                           applicant.bankSummary.redFlags ?? redFlags;

//                         return (
//                           <>
//                             {/* Aggregated row (still shows aggregate at top) */}
//                             <div className="grid sm:grid-cols-3 gap-1">
//                               <div>
//                                 <div className="text-sm text-muted-foreground">
//                                   Average Balance
//                                 </div>
//                                 <div className="font-semibold">
//                                   {currency(applicant.bankSummary.avgBalance)}
//                                 </div>
//                               </div>
//                               <div>
//                                 <div className="text-sm text-muted-foreground">
//                                   Avg Inflow
//                                 </div>
//                                 <div className="font-semibold">
//                                   {currency(applicant.bankSummary.avgInflow)}
//                                 </div>
//                               </div>
//                               <div>
//                                 <div className="text-sm text-muted-foreground">
//                                   Avg Outflow
//                                 </div>
//                                 <div className="font-semibold">
//                                   {currency(applicant.bankSummary.avgOutflow)}
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Accordion showing each account */}
//                             <div className="mt-1 mb-3 px-2">
//                               <Accordion type="single" collapsible className="">
//                                 {accounts.map((acc, idx) => (
//                                   <AccordionItem
//                                     key={idx}
//                                     value={`acc-${idx}`}
//                                     className="border rounded-lg px-2"
//                                   >
//                                     <AccordionTrigger className="flex justify-between items-center">
//                                       <div className="text-sm font-medium">
//                                         {acc.bankName} — {acc.accountType}
//                                       </div>
//                                       <div className="text-xs text-muted-foreground">
//                                         {currency(acc.currentBalance)} ·{" "}
//                                         {acc.accountNumber?.slice(-4)}
//                                       </div>
//                                     </AccordionTrigger>

//                                     <AccordionContent className="p-4">
//                                       <div className="grid sm:grid-cols-3 gap-4">
//                                         <div>
//                                           <div className="text-xs text-muted-foreground">
//                                             Account Number
//                                           </div>
//                                           <div className="font-medium">
//                                             {acc.accountNumber}
//                                           </div>
//                                         </div>
//                                         <div>
//                                           <div className="text-xs text-muted-foreground">
//                                             IFSC / Branch
//                                           </div>
//                                           <div className="font-medium">
//                                             {acc.ifscCode} · {acc.branchName} (
//                                             {acc.branchCode})
//                                           </div>
//                                         </div>
//                                         <div>
//                                           <div className="text-xs text-muted-foreground">
//                                             Current Balance
//                                           </div>
//                                           <div className="font-medium">
//                                             {currency(acc.currentBalance)}
//                                           </div>
//                                         </div>

//                                         <div>
//                                           <div className="text-xs text-muted-foreground">
//                                             Avg Balance
//                                           </div>
//                                           <div className="font-medium">
//                                             {currency(acc.avgBalance)}
//                                           </div>
//                                         </div>
//                                         <div>
//                                           <div className="text-xs text-muted-foreground">
//                                             Avg Inflow
//                                           </div>
//                                           <div className="font-medium">
//                                             {currency(acc.avgInflow)}
//                                           </div>
//                                         </div>
//                                         <div>
//                                           <div className="text-xs text-muted-foreground">
//                                             Avg Outflow
//                                           </div>
//                                           <div className="font-medium">
//                                             {currency(acc.avgOutflow)}
//                                           </div>
//                                         </div>

//                                         <div className="sm:col-span-3">
//                                           <div className="text-xs text-muted-foreground mb-2">
//                                             Red Flags
//                                           </div>
//                                           {!acc.redFlags ||
//                                           acc.redFlags.length === 0 ? (
//                                             <Badge variant="secondary">
//                                               None
//                                             </Badge>
//                                           ) : (
//                                             <ul className="list-disc list-inside text-sm">
//                                               {acc.redFlags.map((f, i) => (
//                                                 <li
//                                                   key={i}
//                                                   className="text-destructive"
//                                                 >
//                                                   {f}
//                                                 </li>
//                                               ))}
//                                             </ul>
//                                           )}
//                                         </div>
//                                       </div>
//                                     </AccordionContent>
//                                   </AccordionItem>
//                                 ))}
//                               </Accordion>
//                             </div>
//                           </>
//                         );
//                       }

//                       // fallback when bankAccounts not present — show old bankSummary block
//                       const b = applicant.bankSummary ?? {
//                         avgBalance: 0,
//                         avgInflow: 0,
//                         avgOutflow: 0,
//                         redFlags: [],
//                       };
//                       return (
//                         <div className="grid sm:grid-cols-3 gap-4">
//                           <div>
//                             <div className="text-sm text-muted-foreground">
//                               Average Balance
//                             </div>
//                             <div className="font-semibold">
//                               {currency(b.avgBalance)}
//                             </div>
//                           </div>
//                           <div>
//                             <div className="text-sm text-muted-foreground">
//                               Avg Inflow
//                             </div>
//                             <div className="font-semibold">
//                               {currency(b.avgInflow)}
//                             </div>
//                           </div>
//                           <div>
//                             <div className="text-sm text-muted-foreground">
//                               Avg Outflow
//                             </div>
//                             <div className="font-semibold">
//                               {currency(b.avgOutflow)}
//                             </div>
//                           </div>
//                           <div className="sm:col-span-3 mt-2">
//                             <div className="text-sm text-muted-foreground mb-2">
//                               Red Flags
//                             </div>
//                             {b.redFlags.length === 0 ? (
//                               <Badge variant="secondary">None</Badge>
//                             ) : (
//                               <ul className="list-disc list-inside text-sm">
//                                 {b.redFlags.map((f, i) => (
//                                   <li key={i} className="text-destructive">
//                                     {f}
//                                   </li>
//                                 ))}
//                               </ul>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })()}
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>

//             <TabsContent value="bureau" className="space-y-4">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Trade Lines & History</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {/* Bureau summary */}
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

//                   {/* Trade Lines Table */}
//                   <ScrollArea className="mt-4 h-56 rounded-md border">
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>Organization</TableHead>
//                           <TableHead>Type</TableHead>
//                           <TableHead>Limit</TableHead>
//                           <TableHead>Balance</TableHead>
//                           <TableHead>Status</TableHead>
//                           <TableHead>DPD</TableHead>
//                           <TableHead>Action</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {applicant.bureau.activeLines.map((l, i) => (
//                           <TableRow key={i}>
//                             <TableCell>
//                               {l.organization ? currency(l.organization) : "—"}
//                             </TableCell>
//                             <TableCell
//                               className="text-blue-600 cursor-pointer hover:underline"
//                               onClick={() => handleOpen(l)}
//                             >
//                               {l.type}
//                             </TableCell>
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
//                             <TableCell>
//                               <Button
//                                 size="sm"
//                                 onClick={() => {
//                                   setSelectedLine(l);
//                                   setOpen(true);
//                                 }}
//                               >
//                                 View
//                               </Button>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </ScrollArea>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             {/* Popup Modal */}
//             <Dialog open={open} onOpenChange={setOpen}>
//               <DialogContent className="min-w-xl w-full">
//                 <DialogHeader>
//                   <DialogTitle>EMI / Payment History</DialogTitle>
//                 </DialogHeader>

//                 {selectedLine && (
//                   <div className="space-y-6">
//                     {/* Loan summary */}
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <p className="text-sm text-muted-foreground">
//                           Sanctioned Amount
//                         </p>
//                         <p className="font-semibold">
//                           {currency(selectedLine.limit)}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-muted-foreground">
//                           Current Balance
//                         </p>
//                         <p className="font-semibold">
//                           {currency(selectedLine.balance)}
//                         </p>
//                       </div>
//                     </div>

//                     {/* EMI / Payment History */}
//                     <ScrollArea className="h-72 rounded-md border w-fit">
//                       <Table>
//                         <TableHeader>
//                           <TableRow>
//                             <TableHead>Year</TableHead>
//                             <TableHead>Jan</TableHead>
//                             <TableHead>Feb</TableHead>
//                             <TableHead>Mar</TableHead>
//                             <TableHead>Apr</TableHead>
//                             <TableHead>May</TableHead>
//                             <TableHead>Jun</TableHead>
//                             <TableHead>Jul</TableHead>
//                             <TableHead>Aug</TableHead>
//                             <TableHead>Sep</TableHead>
//                             <TableHead>Oct</TableHead>
//                             <TableHead>Nov</TableHead>
//                             <TableHead>Dec</TableHead>
//                           </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                           {Object.entries(
//                             groupByYear(selectedLine.emiHistory || [])
//                           ).map(([year, months]) => (
//                             <TableRow key={year}>
//                               <TableCell className="font-semibold">
//                                 {year}
//                               </TableCell>
//                               {[
//                                 "01",
//                                 "02",
//                                 "03",
//                                 "04",
//                                 "05",
//                                 "06",
//                                 "07",
//                                 "08",
//                                 "09",
//                                 "10",
//                                 "11",
//                                 "12",
//                               ].map((m) => (
//                                 <TableCell key={m} className="text-center">
//                                   {renderStatus(months[m])}
//                                 </TableCell>
//                               ))}
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                     </ScrollArea>

//                     {/* Legend */}
//                     <div className="flex gap-6 text-sm items-center">
//                       <span className="flex items-center gap-1">
//                         <CheckCircle2 className="w-4 h-4 text-green-600" /> On
//                         time
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <XCircle className="w-4 h-4 text-red-500" /> Late
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <CircleDashed className="w-4 h-4 text-gray-400" /> Not
//                         reported
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <AlertTriangle className="w-4 h-4 text-orange-500" />{" "}
//                         Disputed
//                       </span>
//                     </div>
//                   </div>
//                 )}
//               </DialogContent>
//             </Dialog>

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
//                       <Button
//                         className="flex-1"
//                         variant="secondary"
//                         onClick={handleHold}
//                       >
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
//     </div>
//   )
// }

// export default RiskTabs
  //*************************************************************************** */


  
"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Import subcomponents
import AnalysisTab from "@/components/molecules/tabs/AnalysisTab";
import BankTab from "@/components/molecules/tabs/BankTab";
import BureauTab from "@/components/molecules/tabs/BureauTab";
import DocumentsTab from "@/components/molecules/tabs/DocumentsTab";
import ApprovalTab from "@/components/molecules/tabs/ApprovalTab";
import TradeLineDialog from "@/components/molecules/tabs/TradeLineDialog";
import LoginTab from "./tabs/LoginTab";
import FiTab from "./tabs/FiTab";
import PdiTab from "./tabs/PdiTab";

const RiskTabs = ({ credit,fi,pdi,login }) => {
  // const { id } = useParams();
  const [activeTab, setActiveTab] = useState("login");
  const [open, setOpen] = useState(false);
  const [selectedLine, setSelectedLine] = useState(null);
  const [extraDocs, setExtraDocs] = useState([]);
  const [newDoc, setNewDoc] = useState("");

  // const applicant = credit.find((item) => item.id === Number(id));

  const applicant = credit;

   console.log("credit",applicant)

  const Login = login;
  const FI = fi;
  const PDI = pdi;

  console.log("adff",PDI)

  // ---------------- Calculations ----------------
  const dti = useMemo(() => {
    if (!applicant?.incomeMonthly || !applicant?.fixedObligationsMonthly) return 0;
    return Math.round(
      (applicant.fixedObligationsMonthly / applicant.incomeMonthly) * 100
    );
  }, [applicant]);

  const eligibility = useMemo(() => {
    if (!applicant) return 0;
    const maxEMI = applicant.incomeMonthly * 0.4 - applicant.fixedObligationsMonthly;
    const rate = 0.18 / 12;
    const n = applicant.tenureMonths;
    if (maxEMI <= 0 || !n) return 0;
    return Math.max(
      0,
      Math.round((maxEMI * (Math.pow(1 + rate, n) - 1)) / (rate * Math.pow(1 + rate, n)))
    );
  }, [applicant]);

  const approvalProbability = useMemo(() => {
    if (!applicant) return 0;
    const scorePart = (applicant.cibil?.score - 300) / 600;
    const dtiPart = 1 - Math.min(1, dti / 60);
    const redFlags = applicant.bankSummary?.redFlags ?? [];
    const redFlagPenalty = redFlags.length > 0 ? 0.15 : 0;
    return Math.round(
      Math.max(0, Math.min(1, 0.55 * scorePart + 0.35 * dtiPart - redFlagPenalty + 0.15)) * 100
    );
  }, [applicant, dti]);

  if (!applicant) return <div>No applicant found 2</div>;

  // Merge docs
  const allDocuments = [...applicant.documents, ...extraDocs];
  const completion =
    (allDocuments.filter((d) => d.status === "verified").length / allDocuments.length) * 100;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      {/* Tab Headers */}
      <TabsList className="grid lg:grid-cols-10 grid-cols-10 overflow-x-scroll lg:overflow-hidden">
        <TabsTrigger value="login">Login Data</TabsTrigger>
        <TabsTrigger value="fi">FI Data</TabsTrigger>
        <TabsTrigger value="analysis">Credit Analysis</TabsTrigger>
        <TabsTrigger value="bank">Bank & CIBIL</TabsTrigger>
        <TabsTrigger value="bureau">Bureau</TabsTrigger>
        <TabsTrigger value="docs">Documents</TabsTrigger>
        <TabsTrigger value="pdi">PDI Data</TabsTrigger>
        <TabsTrigger value="approve">Approval</TabsTrigger>
      </TabsList>

      {/* Tab Contents */}
      <TabsContent value="login">
        <LoginTab loginData={Login} />
      </TabsContent>

      {/* Tab Contents */}
      <TabsContent value="fi">
        <FiTab fiData={FI} />
      </TabsContent>

      {/* Tab Contents */}
      <TabsContent value="analysis">
        <AnalysisTab applicant={applicant} dti={dti} eligibility={eligibility} />
      </TabsContent>

      <TabsContent value="bank">
        <BankTab applicant={applicant} />
      </TabsContent>

      <TabsContent value="bureau">
        <BureauTab
          applicant={applicant}
          onViewLine={(line) => {
            setSelectedLine(line);
            setOpen(true);
          }}
        />
      </TabsContent>

      <TabsContent value="docs">
        <DocumentsTab
          allDocuments={allDocuments}
          newDoc={newDoc}
          setNewDoc={setNewDoc}
          setExtraDocs={setExtraDocs}
          extraDocs={extraDocs}
          completion={completion}
        />
      </TabsContent>

      <TabsContent value="pdi">
        <PdiTab pdiData={PDI} />
      </TabsContent>

      <TabsContent value="approve">
        <ApprovalTab
          applicant={applicant}
          eligibility={eligibility}
          approvalProbability={approvalProbability}
        />
      </TabsContent>

      {/* Shared Dialog */}
      <TradeLineDialog
        open={open}
        setOpen={setOpen}
        selectedLine={selectedLine}
      />
    </Tabs>
  );
};

export default RiskTabs;




