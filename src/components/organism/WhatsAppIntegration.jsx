
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { integrationConfigs } from "@/utils/access/integrationConfigs";

export default function IntegrationForm() {
  const { id } = useParams(); // dynamic route like /dashboard/[id]

  console.log("sdfsdf form id",id)
  const config = integrationConfigs[id];

  if (!config) {
    return <p className="p-6 text-red-500">Invalid Integration ID</p>;
  }

  // Build initial form state from config fields
  const initialFormState = config.fields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormState);
  const [submittedData, setSubmittedData] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedData([...submittedData, { ...formData, status: "active" }]);
    setFormData(initialFormState); // reset form
  };

  const handleStatusChange = (index, status) => {
    const updated = [...submittedData];
    updated[index].status = status;
    setSubmittedData(updated);
  };

  return (
    <Tabs defaultValue={id}>
      <TabsList className="mb-4">
        <TabsTrigger value={id}>{config.title}</TabsTrigger>
      </TabsList>

      <TabsContent value={id}>
        <Card className="p-4 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              {config.title}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {/* Form */}
            <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 mt-4">
              {config.fields.map((field) => (
                <div key={field.name} className="flex flex-col space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                  />
                </div>
              ))}

              <div className="col-span-2 flex justify-start mt-4">
                <Button className="w-[200px]" type="submit">
                  Submit
                </Button>
              </div>
            </form>

            {/* Submitted Data Table */}
            {submittedData.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Submitted Credentials</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {config.fields.map((f) => (
                          <TableHead className="border-b border-gray-200 dark:border-gray-700" key={f.name}>{f.label}</TableHead>
                        ))}
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submittedData.map((row, index) => (
                        <TableRow key={index}>
                          {config.fields.map((f) => (
                            <TableCell key={f.name}>{row[f.name]}</TableCell>
                          ))}
                          <TableCell className="border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`status-${index}`}
                                checked={row.status === "active"}
                                onCheckedChange={(checked) =>
                                  handleStatusChange(index, checked ? "active" : "deactive")
                                }
                              />
                              <Label htmlFor={`status-${index}`}>
                                {row.status === "active" ? "Active" : "Deactive"}
                              </Label>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}


//**********************************10-09-25  5:10******************************* */

// "use client";

// import { useState } from "react";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch";

// export default function WhatsAppIntegration() {
//   const [formData, setFormData] = useState({
//     apiKey: "",
//     apiSecret: "",
//     senderId: "",
//     webhookUrl: "",
//     phoneNumber: "",
//     accountId: "",
//     environment: "",
//     description: "",
//   });

//   const [submittedData, setSubmittedData] = useState([]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setSubmittedData([
//       ...submittedData,
//       { ...formData, status: "active" }, // default status
//     ]);
//     setFormData({
//       apiKey: "",
//       apiSecret: "",
//       senderId: "",
//       webhookUrl: "",
//       phoneNumber: "",
//       accountId: "",
//       environment: "",
//       description: "",
//     });
//   };

//   const handleStatusChange = (index, status) => {
//     const updated = [...submittedData];
//     updated[index].status = status;
//     setSubmittedData(updated);
//   };

//   return (
//     <Tabs defaultValue="whatsapp">
//       {/* Tabs above the card */}
//       <TabsList className="mb-4">
//         <TabsTrigger value="whatsapp">WhatsApp Credentials</TabsTrigger>
//       </TabsList>

//       <TabsContent value="whatsapp">
//         <Card className="p-4 shadow-lg rounded-2xl">
//           <CardHeader>
//             <CardTitle className="text-xl font-semibold">
//               Gupshup WhatsApp Integration
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {/* Form */}
//             <form
//               onSubmit={handleSubmit}
//               className="grid grid-cols-3 gap-4 mt-4"
//             >
//               {Object.keys(formData).map((key) => (
//                 <div key={key} className="flex flex-col space-y-2">
//                   <Label htmlFor={key} className="capitalize">
//                     {key.replace(/([A-Z])/g, " $1")}
//                   </Label>
//                   <Input
//                     id={key}
//                     name={key}
//                     value={formData[key]}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//               ))}

//               <div className="col-span-2 flex  justify-start mt-4">
//                 <Button className="w-[200px]" type="submit">
//                   Submit
//                 </Button>
//               </div>
//             </form>

//             {/* Submitted Data */}
//             {submittedData.length > 0 && (
              
//               <div className="mt-8">
//                 <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
//                   Submitted Credentials
//                 </h3>

//                 {/* Responsive wrapper */}
//                 <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
//                   <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                     <TableHeader className="bg-gray-50 dark:bg-gray-800">
//                       <TableRow>
//                         {Object.keys(formData).map((key) => (
//                           <TableHead
//                             key={key}
//                             className="capitalize border-b border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-gray-700 dark:text-gray-200 whitespace-nowrap"
//                           >
//                             {key.replace(/([A-Z])/g, " $1")}
//                           </TableHead>
//                         ))}
//                         <TableHead className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-gray-700 dark:text-gray-200 whitespace-nowrap">
//                           Action
//                         </TableHead>
//                       </TableRow>
//                     </TableHeader>

//                     <TableBody className="bg-white dark:bg-gray-900">
//                       {submittedData.map((row, index) => (
//                         <TableRow
//                           key={index}
//                           className="hover:bg-gray-50 dark:hover:bg-gray-800"
//                         >
//                           {Object.keys(formData).map((key) => (
//                             <TableCell
//                               key={key}
//                               className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-700 dark:text-gray-200 whitespace-nowrap"
//                             >
//                               {row[key]}
//                             </TableCell>
//                           ))}
//                           <TableCell className="border-b border-gray-200 dark:border-gray-700 px-4 py-2">
//                             <div className="flex items-center space-x-2">
//                               <Switch
//                                 id={`status-${index}`}
//                                 checked={row.status === "active"}
//                                 onCheckedChange={(checked) =>
//                                   handleStatusChange(
//                                     index,
//                                     checked ? "active" : "deactive"
//                                   )
//                                 }
//                               />
//                               <Label
//                                 htmlFor={`status-${index}`}
//                                 className="cursor-pointer text-gray-700 dark:text-gray-200"
//                               >
//                                 {row.status === "active"
//                                   ? "Active"
//                                   : "Deactive"}
//                               </Label>
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </TabsContent>
//     </Tabs>
//   );
// }

// "use client";

// import { useState } from "react";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// export default function WhatsAppIntegration() {
//   const [formData, setFormData] = useState({
//     apiKey: "",
//     apiSecret: "",
//     senderId: "",
//     webhookUrl: "",
//     phoneNumber: "",
//     accountId: "",
//     environment: "",
//     description: "",
//   });

//   const [submittedData, setSubmittedData] = useState([]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setSubmittedData([...submittedData, formData]);
//     setFormData({
//       apiKey: "",
//       apiSecret: "",
//       senderId: "",
//       webhookUrl: "",
//       phoneNumber: "",
//       accountId: "",
//       environment: "",
//       description: "",
//     });
//   };

//   return (
//     <Tabs defaultValue="whatsapp" className="w-full">
//       {/* Tabs placed ABOVE the card */}
//       <TabsList className="mb-4">
//         <TabsTrigger value="whatsapp">WhatsApp Credentials</TabsTrigger>
//       </TabsList>

//       <TabsContent value="whatsapp">
//         <Card className="p-4 shadow-lg rounded-2xl">
//           <CardHeader>
//             <CardTitle className="text-xl font-semibold">Gupshup WhatsApp Integration</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 mt-4">
//               {Object.keys(formData).map((key) => (
//                 <div key={key} className="flex flex-col space-y-2">
//                   <Label htmlFor={key} className="capitalize">
//                     {key.replace(/([A-Z])/g, " $1")}
//                   </Label>
//                   <Input
//                     id={key}
//                     name={key}
//                     value={formData[key]}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//               ))}

//               <div className="col-span-2 flex justify-start mt-4">
//                 <Button className="w-[200px] font-semibold text-base" type="submit">Submit</Button>
//               </div>
//             </form>

//             {submittedData.length > 0 && (
//               <div className="mt-8">
//                 <h3 className="text-lg font-semibold mb-2">Submitted Credentials</h3>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       {Object.keys(formData).map((key) => (
//                         <TableHead key={key} className="capitalize">
//                           {key.replace(/([A-Z])/g, " $1")}
//                         </TableHead>
//                       ))}
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {submittedData.map((row, index) => (
//                       <TableRow key={index}>
//                         {Object.keys(formData).map((key) => (
//                           <TableCell key={key}>{row[key]}</TableCell>
//                         ))}
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </TabsContent>
//     </Tabs>
//   );
// }

// "use client";

// import { useState } from "react";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// export default function WhatsAppIntegration() {
//   const [formData, setFormData] = useState({
//     apiKey: "",
//     apiSecret: "",
//     senderId: "",
//     webhookUrl: "",
//     phoneNumber: "",
//     accountId: "",
//     environment: "",
//     description: "",
//   });

//   const [submittedData, setSubmittedData] = useState([]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setSubmittedData([...submittedData, formData]);
//     setFormData({
//       apiKey: "",
//       apiSecret: "",
//       senderId: "",
//       webhookUrl: "",
//       phoneNumber: "",
//       accountId: "",
//       environment: "",
//       description: "",
//     });
//   };

//   return (
//     <Card className="p-4 shadow-lg rounded-2xl">
//       <CardHeader>
//         <CardTitle className="text-xl font-semibold">Gupshup WhatsApp Integration</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Tabs defaultValue="whatsapp">
//           <TabsList>
//             <TabsTrigger value="whatsapp">WhatsApp Credentials</TabsTrigger>
//           </TabsList>

//           <TabsContent value="whatsapp">
//             <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-4">
//               {Object.keys(formData).map((key) => (
//                 <div key={key} className="flex flex-col space-y-1">
//                   <Label htmlFor={key} className="capitalize">
//                     {key.replace(/([A-Z])/g, " $1")}
//                   </Label>
//                   <Input
//                     id={key}
//                     name={key}
//                     value={formData[key]}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//               ))}

//               <div className="col-span-2 flex justify-end mt-4">
//                 <Button type="submit">Submit</Button>
//               </div>
//             </form>

//             {submittedData.length > 0 && (
//               <div className="mt-8">
//                 <h3 className="text-lg font-semibold mb-2">Submitted Credentials</h3>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       {Object.keys(formData).map((key) => (
//                         <TableHead key={key} className="capitalize">
//                           {key.replace(/([A-Z])/g, " $1")}
//                         </TableHead>
//                       ))}
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {submittedData.map((row, index) => (
//                       <TableRow key={index}>
//                         {Object.keys(formData).map((key) => (
//                           <TableCell key={key}>{row[key]}</TableCell>
//                         ))}
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             )}
//           </TabsContent>
//         </Tabs>
//       </CardContent>
//     </Card>
//   );
// }
