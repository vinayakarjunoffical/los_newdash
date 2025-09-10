"use client";

import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import DataTE from "../atoms/tables/DataTE";

// Sample JSON data
const integrationData = [
  { id: 1, name: "WhatsApp", createdDate: "2025-09-01" },
  { id: 2, name: "SMS", createdDate: "2025-09-03" },
  { id: 3, name: "Email", createdDate: "2025-09-05" },
];

export default function IntegrationTable() {
    const columns = [
    { key: "id", label: "Integration ID", sortable: true },
    { key: "name", label: "Integration Name", sortable: true },
    { key: "createdDate", label: "Created Date", sortable: true },
  ];

  return (
    // <div className="p-6">
    //   <h1 className="text-2xl font-bold mb-4">Integrations</h1>
    //   <Table>
    //     <TableHeader>
    //       <TableRow>
    //         <TableHead>Integration Name</TableHead>
    //         <TableHead>Created Date</TableHead>
    //         <TableHead>Action</TableHead>
    //       </TableRow>
    //     </TableHeader>
    //     <TableBody>
    //       {integrationData.map((integration) => (
    //         <TableRow key={integration.id}>
    //           <TableCell>{integration.name}</TableCell>
    //           <TableCell>{integration.createdDate}</TableCell>
    //           <TableCell>
    //             <Link href={`/integrations/${integration.id}`}>
    //               <Button variant="outline">View</Button>
    //             </Link>
    //           </TableCell>
    //         </TableRow>
    //       ))}
    //     </TableBody>
    //   </Table>
    // </div>
     <DataTE
        columns={columns}
        data={integrationData}
        itemsPerPage={10}
        enableSearch
        enableSelection
        actionBasePath="/dashboard/whatsapp"
        actionParams={["id"]}
        showAddButton 
      />
  );
}
