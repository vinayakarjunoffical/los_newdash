"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react"; 

export default function DataTE({
  columns,
  data,
  itemsPerPage = 5,
  actionBasePath = "",
  actionParams = ["id"],
  showAddButton = false, 
}) {
  const router = useRouter();

  const [tableData, setTableData] = React.useState(data);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: "asc",
  });

  // 🔹 Add Modal State
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({});

  // 🔹 Build URL
  const buildUrl = (item) => {
    const id = item[actionParams[0]];
    const queryString = actionParams
      .slice(1)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(item[key])}`
      )
      .join("&");

    return `${actionBasePath}/${id}${queryString ? `?${queryString}` : ""}`;
  };

  // 🔹 Sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // 🔹 Filter + Sort
  const filteredData = React.useMemo(() => {
    let filtered = tableData.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return filtered;
  }, [tableData, searchTerm, sortConfig]);

  // 🔹 Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // 🔹 Handle Add
  const handleAddClick = () => {
    // reset form with empty values
    const emptyForm = {};
    columns.forEach((col) => {
      emptyForm[col.key] = "";
    });
    setFormData(emptyForm);
    setIsDialogOpen(true);
  };

  const handleFormChange = (e, key) => {
    setFormData({ ...formData, [key]: e.target.value });
  };

  const handleFormSubmit = () => {
    setTableData([...tableData, { ...formData }]);
    setIsDialogOpen(false);
  };

  return (
    <div className="min-w-full px-5 py-3">
      {/* 🔍 Search + Add Button */}
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-1/3"
        />

        {showAddButton && (
          <Button onClick={handleAddClick} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add
          </Button>
        )}
      </div>

      {/* 🔹 Table */}
      <div className="max-w-full border rounded-lg px-5 py-2 overflow-x-auto scroll-smooth">
        <Table className="min-w-full table-auto">
          <TableHeader>
            <TableRow>
              <TableHead key="checkbox" className="w-12">
                <Checkbox />
              </TableHead>
              {columns.map((col, colIndex) => (
                <TableHead
                  key={`head-${colIndex}`}
                  className={`${
                    col.sortable ? "cursor-pointer" : ""
                  } dark:text-gray-200 whitespace-nowrap`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  {col.label}
                  {sortConfig.key === col.key &&
                    (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
                </TableHead>
              ))}
              <TableHead key="action" className="whitespace-nowrap">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((item, rowIndex) => (
                <TableRow key={`row-${rowIndex}`}>
                  <TableCell key={`check-${rowIndex}`}>
                    <Checkbox />
                  </TableCell>

                  {columns.map((col, colIndex) => (
                    <TableCell
                      key={`cell-${rowIndex}-${colIndex}`}
                      className="whitespace-nowrap dark:text-gray-200"
                    >
                      {col.render ? col.render(item) : item[col.key]}
                    </TableCell>
                  ))}

                  {/* 🔹 Action Button */}
                  <TableCell
                    key={`action-${rowIndex}`}
                    className="whitespace-nowrap"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(buildUrl(item))}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 2} className="text-center">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 📄 Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* 🔹 Add Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Entry</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 mt-4">
            {columns.map((col) => (
              <div key={col.key} className="flex flex-col space-y-2">
                <Label htmlFor={col.key}>{col.label}</Label>
                <Input
                  id={col.key}
                  value={formData[col.key] || ""}
                  onChange={(e) => handleFormChange(e, col.key)}
                />
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleFormSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
//******************************************10-09-25 5:54 without add button*********************************** */

// "use client";

// import * as React from "react";
// import {
//   Table,
//   TableBody,
//   TableHead,
//   TableHeader,
//   TableRow,
//   TableCell,
// } from "@/components/ui/table";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";

// export default function DataTE({
//   columns,
//   data,
//   itemsPerPage = 5,
//   actionBasePath = "", 
//   actionParams = ["id"], 
// }) {
//   const router = useRouter();

//   const [currentPage, setCurrentPage] = React.useState(1);
//   const [searchTerm, setSearchTerm] = React.useState("");
//   const [sortConfig, setSortConfig] = React.useState({
//     key: null,
//     direction: "asc",
//   });

//   // const buildUrl = (item) => {
//   //   return `${actionBasePath}/${actionParams.map((key) => item[key]).join("/")}`;
//   // };

//   const buildUrl = (item) => {
//   const id = item[actionParams[0]];
//   const queryString = actionParams
//     .slice(1)
//     .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(item[key])}`)
//     .join("&");

//   return `${actionBasePath}/${id}${queryString ? `?${queryString}` : ""}`;
// };




//   // 🔹 Sorting
//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };

//   // 🔹 Filter + Sort
//   const filteredData = React.useMemo(() => {
//     let filtered = data.filter((item) =>
//       Object.values(item)
//         .join(" ")
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase())
//     );

//     if (sortConfig.key) {
//       filtered = [...filtered].sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key]) {
//           return sortConfig.direction === "asc" ? -1 : 1;
//         }
//         if (a[sortConfig.key] > b[sortConfig.key]) {
//           return sortConfig.direction === "asc" ? 1 : -1;
//         }
//         return 0;
//       });
//     }
//     return filtered;
//   }, [data, searchTerm, sortConfig]);

//   // 🔹 Pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   return (
//     <div className="min-w-full px-5 py-3 ">
//       {/* 🔍 Search */}
//       <div className="flex items-center justify-between mb-4">
//         <Input
//           placeholder="Search..."
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="w-1/3"
//         />

//       </div>

//       <div className=" max-w-full border rounded-lg px-5 py-2 overflow-x-auto scroll-smooth">
//         <Table className="min-w-full table-auto">
//           <TableHeader>
//             <TableRow>
//               <TableHead key="checkbox" className="w-12">
//                 <Checkbox />
//               </TableHead>
//               {columns.map((col, colIndex) => (
//                 <TableHead
//                   key={`head-${colIndex}`}
//                   className={`${
//                     col.sortable ? "cursor-pointer" : ""
//                   } dark:text-gray-200 whitespace-nowrap`}
//                   onClick={() => col.sortable && handleSort(col.key)}
//                 >
//                   {col.label}
//                   {sortConfig.key === col.key &&
//                     (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
//                 </TableHead>
//               ))}
//               <TableHead key="action" className="whitespace-nowrap">
//                 Action
//               </TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {currentData.length > 0 ? (
//               currentData.map((item, rowIndex) => (
//                 <TableRow key={`row-${rowIndex}`}>
//                   <TableCell key={`check-${rowIndex}`}>
//                     <Checkbox />
//                   </TableCell>

//                   {columns.map((col, colIndex) => (
//                     <TableCell
//                       key={`cell-${rowIndex}-${colIndex}`}
//                       className="whitespace-nowrap dark:text-gray-200"
//                     >
//                       {col.render ? col.render(item) : item[col.key]}
//                     </TableCell>
//                   ))}

//                   {/* 🔹 Action Button */}
//                   <TableCell
//                     key={`action-${rowIndex}`}
//                     className="whitespace-nowrap"
//                   >
//                     <Button
//                       variant="outline"
//                       size="sm"
//                      onClick={() => router.push(buildUrl(item))}
//                     >
//                       View
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length + 2} className="text-center">
//                   No data found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* 📄 Pagination */}
//       <div className="flex justify-between items-center mt-4">
//         <span>
//           Page {currentPage} of {totalPages || 1}
//         </span>
//         <div className="space-x-2">
//           <Button
//             variant="outline"
//             size="sm"
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((p) => p - 1)}
//           >
//             Previous
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             disabled={currentPage === totalPages || totalPages === 0}
//             onClick={() => setCurrentPage((p) => p + 1)}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

//*************************************add the new data 01.38******************************************** */
// "use client";

// import * as React from "react";
// import {
//   Table,
//   TableBody,
//   TableHead,
//   TableHeader,
//   TableRow,
//   TableCell,
// } from "@/components/ui/table";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";

// export default function DataTE({
//   columns,
//   data,
//   itemsPerPage = 5,
// }) {
//   const router = useRouter();

//   // 🔹 State
//   const [currentPage, setCurrentPage] = React.useState(1);
//   const [searchTerm, setSearchTerm] = React.useState("");
//   const [sortConfig, setSortConfig] = React.useState({
//     key: null,
//     direction: "asc",
//   });

//   // 🔹 Sorting handler
//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };

//   // 🔹 Filter + sort
//   const filteredData = React.useMemo(() => {
//     let filtered = data.filter((item) =>
//       Object.values(item)
//         .join(" ")
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase())
//     );

//     if (sortConfig.key) {
//       filtered = [...filtered].sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key]) {
//           return sortConfig.direction === "asc" ? -1 : 1;
//         }
//         if (a[sortConfig.key] > b[sortConfig.key]) {
//           return sortConfig.direction === "asc" ? 1 : -1;
//         }
//         return 0;
//       });
//     }

//     return filtered;
//   }, [data, searchTerm, sortConfig]);

//   // 🔹 Pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   return (
//     <div className="w-full">
//       {/* 🔍 Search */}
//       <div className="flex items-center justify-between mb-4">
//         <Input
//           placeholder="Search..."
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="w-1/3"
//         />
//       </div>

//       {/* 📋 Table Wrapper with Horizontal Scroll */}
//       <div className="w-full overflow-x-auto border rounded-lg">
//         <Table className="min-w-full">
//           <TableHeader>
//             <TableRow>
//               <TableHead key="checkbox" className="w-12">
//                 <Checkbox />
//               </TableHead>
//               {columns.map((col, colIndex) => (
//                 <TableHead
//                   key={`head-${colIndex}`}
//                   className={`${col.sortable ? "cursor-pointer" : ""} dark:text-gray-200 whitespace-nowrap`}
//                   onClick={() => col.sortable && handleSort(col.key)}
//                 >
//                   {col.label}
//                   {sortConfig.key === col.key &&
//                     (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
//                 </TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {currentData.length > 0 ? (
//               currentData.map((item, rowIndex) => (
//                 <TableRow key={`row-${rowIndex}`}>
//                   <TableCell key={`check-${rowIndex}`}>
//                     <Checkbox />
//                   </TableCell>

//                   {columns.map((col, colIndex) => (
//                     <TableCell
//                       key={`cell-${rowIndex}-${colIndex}`}
//                       className={`whitespace-nowrap ${
//                         (col.key === "applicationId" && item[col.key]) ||
//                         (col.key === "fiLink" && item[col.key])
//                           ? "text-blue-600 cursor-pointer underline"
//                           : ""
//                       } dark:text-gray-200`}
//                       onClick={() => {
//                         if (col.key === "applicationId" && item[col.key]) {
//                           router.push(`/dashboard/applicationid/${item.id}`);
//                         }
//                         if (col.key === "fiLink" && item[col.key]) {
//                           router.push(`/dashboard/fi/${item.id}`);
//                         }
//                       }}
//                     >
//                       {col.render ? col.render(item) : item[col.key]}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length + 1} className="text-center">
//                   No data found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* 📄 Pagination */}
//       <div className="flex justify-between items-center mt-4">
//         <span>
//           Page {currentPage} of {totalPages || 1}
//         </span>
//         <div className="space-x-2">
//           <Button
//             variant="outline"
//             size="sm"
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((p) => p - 1)}
//           >
//             Previous
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             disabled={currentPage === totalPages || totalPages === 0}
//             onClick={() => setCurrentPage((p) => p + 1)}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

//*********************new add 1.27**************** */

// "use client";

// import * as React from "react";
// import {
//   Table,
//   TableBody,
//   TableHead,
//   TableHeader,
//   TableRow,
//   TableCell,
// } from "@/components/ui/table";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";

// export default function DataTE({
//   columns,
//   data,
//    itemsPerPage = 10,
//   enableSearch = true,
//   enableSelection = true,
// }) {
//   const router = useRouter();

//   // 🔹 State
//   const [currentPage, setCurrentPage] = React.useState(1);
//   const [searchTerm, setSearchTerm] = React.useState("");
//   const [sortConfig, setSortConfig] = React.useState({
//     key: null,
//     direction: "asc",
//   });

//   // 🔹 Sorting handler
//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };

//   // 🔹 Filter + sort
//   const filteredData = React.useMemo(() => {
//     let filtered = data.filter((item) =>
//       Object.values(item)
//         .join(" ")
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase())
//     );

//     if (sortConfig.key) {
//       filtered = [...filtered].sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key]) {
//           return sortConfig.direction === "asc" ? -1 : 1;
//         }
//         if (a[sortConfig.key] > b[sortConfig.key]) {
//           return sortConfig.direction === "asc" ? 1 : -1;
//         }
//         return 0;
//       });
//     }

//     return filtered;
//   }, [data, searchTerm, sortConfig]);

//   // 🔹 Pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   return (
//     <div className="w-full overflow-x-auto">
//       {/* 🔍 Search */}
//       <div className="flex items-center justify-between mb-4">
//         <Input
//           placeholder="Search..."
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="w-1/3"
//         />
//       </div>

//       {/* 📋 Table */}
//       <Table className="min-w-full border rounded-lg overflow-x-scroll">
//         <TableHeader>
//           <TableRow>
//             <TableHead key="checkbox" className="w-12">
//               <Checkbox />
//             </TableHead>
//             {columns.map((col, colIndex) => (
//               <TableHead
//                 key={`head-${colIndex}`} // ✅ unique
//                 className={`${col.sortable ? "cursor-pointer" : ""} dark:text-gray-200`}
//                 onClick={() => col.sortable && handleSort(col.key)}
//               >
//                 {col.label}
//                 {sortConfig.key === col.key &&
//                   (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
//               </TableHead>
//             ))}
//           </TableRow>
//         </TableHeader>

//         <TableBody>
//           {currentData.length > 0 ? (
//             currentData.map((item, rowIndex) => (
//               <TableRow key={`row-${rowIndex}`}>
//                 <TableCell key={`check-${rowIndex}`}>
//                   <Checkbox />
//                 </TableCell>

//                 {columns.map((col, colIndex) => (
//                   <TableCell
//                     key={`cell-${rowIndex}-${colIndex}`} // ✅ guaranteed unique
//                     className={`${
//                       (col.key === "applicationId" && item[col.key]) ||
//                       (col.key === "fiLink" && item[col.key])
//                         ? "text-blue-600 cursor-pointer underline"
//                         : ""
//                     } dark:text-gray-200`}
//                     onClick={() => {
//                       if (col.key === "applicationId" && item[col.key]) {
//                         router.push(`/dashboard/applicationid/${item.id}`);
//                       }
//                       if (col.key === "fiLink" && item[col.key]) {
//                         router.push(`/dashboard/fi/${item.id}`);
//                       }
//                     }}
//                   >
//                     {col.render ? col.render(item) : item[col.key]}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={columns.length + 1} className="text-center">
//                 No data found
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>

//       {/* 📄 Pagination */}
//       <div className="flex justify-between items-center mt-4">
//         <span>
//           Page {currentPage} of {totalPages || 1}
//         </span>
//         <div className="space-x-2">
//           <Button
//             variant="outline"
//             size="sm"
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((p) => p - 1)}
//           >
//             Previous
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             disabled={currentPage === totalPages || totalPages === 0}
//             onClick={() => setCurrentPage((p) => p + 1)}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

//*****************add new code 1:09**************************** */
// "use client";

// import * as React from "react";
// import {
//   Table,
//   TableBody,
//   TableHead,
//   TableHeader,
//   TableRow,
//   TableCell,
// } from "@/components/ui/table";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";

// export default function DataTE({
//   columns,
//   data,
//   itemsPerPage = 10,
//   enableSearch = true,
//   enableSelection = true,
// }) {
//   const router = useRouter();

//   const [search, setSearch] = React.useState("");
//   const [sortConfig, setSortConfig] = React.useState({
//     key: "",
//     direction: "",
//   });
//   const [currentPage, setCurrentPage] = React.useState(1);
//   const [selectedRows, setSelectedRows] = React.useState([]);

//   // 🔹 Search
//   const filteredData = data.filter((item) =>
//     Object.values(item).some((val) =>
//       String(val).toLowerCase().includes(search.toLowerCase())
//     )
//   );

//   // 🔹 Sorting
//   const sortedData = React.useMemo(() => {
//     if (!sortConfig.key) return filteredData;

//     return [...filteredData].sort((a, b) => {
//       if (a[sortConfig.key] < b[sortConfig.key])
//         return sortConfig.direction === "asc" ? -1 : 1;
//       if (a[sortConfig.key] > b[sortConfig.key])
//         return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });
//   }, [filteredData, sortConfig]);

//   // 🔹 Pagination
//   const paginatedData = sortedData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );
//   const totalPages = Math.ceil(sortedData.length / itemsPerPage);

//   // 🔹 Handlers
//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc")
//       direction = "desc";
//     setSortConfig({ key, direction });
//   };

//   const toggleRow = (id) => {
//     setSelectedRows((prev) =>
//       prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
//     );
//   };

//   const toggleAll = () => {
//     if (selectedRows.length === paginatedData.length) {
//       setSelectedRows([]);
//     } else {
//       setSelectedRows(paginatedData.map((row) => row.id));
//     }
//   };

//   return (
//     <div className="space-y-6 p-4">
//       {/* 🔹 Search */}
//       {enableSearch && (
//         <Input
//           placeholder="Search..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="max-w-sm dark:bg-gray-800 dark:text-gray-200"
//         />
//       )}

//       {/* 🔹 Table */}
//       <div className="overflow-x-auto w-full">
//         <Table className="min-w-[900px] border border-gray-200 dark:border-gray-700 dark:bg-gray-900">
//           <TableHeader className="bg-gray-50 dark:bg-gray-800">
//             <TableRow>
//               {enableSelection && (
//                 <TableHead>
//                   <Checkbox
//                     checked={
//                       selectedRows.length === paginatedData.length &&
//                       paginatedData.length > 0
//                     }
//                     indeterminate={
//                       selectedRows.length > 0 &&
//                       selectedRows.length < paginatedData.length
//                     }
//                     onCheckedChange={toggleAll}
//                     className="dark:ring-1 dark:ring-gray-500"
//                   />
//                 </TableHead>
//               )}

//               {columns.map((col, colIndex) => (
//                 <TableHead
//                   key={`${col.key}-${colIndex}`} // ✅ unique key
//                   className={`${col.sortable ? "cursor-pointer" : ""} dark:text-gray-200`}
//                   onClick={() => col.sortable && handleSort(col.key)}
//                 >
//                   {col.label}
//                 </TableHead>
//               ))}

//               {/* 🔹 Always show Action Column */}
//               <TableHead className="dark:text-gray-200 text-center">
//                 Action
//               </TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {paginatedData.map((item, rowIndex) => (
//               <TableRow
//                 key={item.id || rowIndex}
//                 className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
//                   rowIndex % 2 === 0
//                     ? "bg-white dark:bg-gray-900"
//                     : "bg-gray-50 dark:bg-gray-800"
//                 }`}
//               >
//                 {enableSelection && (
//                   <TableCell>
//                     <Checkbox
//                       checked={selectedRows.includes(item.id)}
//                       onCheckedChange={() => toggleRow(item.id)}
//                       className="dark:ring-1 dark:ring-gray-500"
//                     />
//                   </TableCell>
//                 )}

//                 {columns.map((col, colIndex) => (
//                   <TableCell
//                     key={`${item.id || rowIndex}-${col.key || colIndex}`} // ✅ unique key
//                     className={`${
//                       (col.key === "applicationId" && item[col.key]) ||
//                       (col.key === "fiLink" && item[col.key])
//                         ? "text-blue-600 cursor-pointer underline"
//                         : ""
//                     } dark:text-gray-200`}
//                     onClick={() => {
//                       if (col.key === "applicationId" && item[col.key]) {
//                         router.push(`/dashboard/applicationid/${item.id}`);
//                       }
//                       if (col.key === "fiLink" && item[col.key]) {
//                         router.push(`/dashboard/fi/${item.id}`);
//                       }
//                     }}
//                   >
//                     {col.render ? col.render(item) : item[col.key]}
//                   </TableCell>
//                 ))}

//                 {/* 🔹 Conditional Action Buttons */}
//                 <TableCell>
//                   <div className="flex gap-2 justify-center">
//                     {/* View button only if applicationId exists */}
//                     {item.applicationId && (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="dark:border-gray-600 dark:text-gray-200"
//                         onClick={() =>
//                           router.push(`/dashboard/applicationid/${item.id}`)
//                         }
//                       >
//                         View
//                       </Button>
//                     )}

//                     {/* FI button only if fiLink exists */}
//                     {item.fiLink && (
//                       <Button
//                         variant="secondary"
//                         size="sm"
//                         className="dark:border-gray-600 dark:text-gray-200"
//                         onClick={() => router.push(`/dashboard/fi/${item.id}`)}
//                       >
//                         FI
//                       </Button>
//                     )}
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* 🔹 Pagination */}
//       <div className="flex justify-between items-center space-x-2">
//         <Button
//           variant="outline"
//           disabled={currentPage === 1}
//           onClick={() => setCurrentPage((prev) => prev - 1)}
//           className="dark:border-gray-600 dark:text-gray-200"
//         >
//           Previous
//         </Button>

//         <span className="text-gray-700 dark:text-gray-200 font-medium">
//           Page {currentPage} of {totalPages}
//         </span>

//         <Button
//           variant="outline"
//           disabled={currentPage === totalPages}
//           onClick={() => setCurrentPage((prev) => prev + 1)}
//           className="dark:border-gray-600 dark:text-gray-200"
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// }

//*********************add new ********************** */

// "use client";

// import * as React from "react";
// import {
//   Table,
//   TableBody,
//   TableHead,
//   TableHeader,
//   TableRow,
//   TableCell,
// } from "@/components/ui/table";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";

// export default function DataTE({
//   columns,
//   data,
//   itemsPerPage = 10,
//   enableSearch = true,
//   enableSelection = true,
// }) {
//   const router = useRouter();

//   const [search, setSearch] = React.useState("");
//   const [sortConfig, setSortConfig] = React.useState({
//     key: "",
//     direction: "",
//   });
//   const [currentPage, setCurrentPage] = React.useState(1);
//   const [selectedRows, setSelectedRows] = React.useState([]);

//   // 🔹 Search
//   const filteredData = data.filter((item) =>
//     Object.values(item).some((val) =>
//       String(val).toLowerCase().includes(search.toLowerCase())
//     )
//   );

//   // 🔹 Sorting
//   const sortedData = React.useMemo(() => {
//     if (!sortConfig.key) return filteredData;

//     return [...filteredData].sort((a, b) => {
//       if (a[sortConfig.key] < b[sortConfig.key])
//         return sortConfig.direction === "asc" ? -1 : 1;
//       if (a[sortConfig.key] > b[sortConfig.key])
//         return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });
//   }, [filteredData, sortConfig]);

//   // 🔹 Pagination
//   const paginatedData = sortedData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );
//   const totalPages = Math.ceil(sortedData.length / itemsPerPage);

//   // 🔹 Handlers
//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc")
//       direction = "desc";
//     setSortConfig({ key, direction });
//   };

//   const toggleRow = (id) => {
//     setSelectedRows((prev) =>
//       prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
//     );
//   };

//   const toggleAll = () => {
//     if (selectedRows.length === paginatedData.length) {
//       setSelectedRows([]);
//     } else {
//       setSelectedRows(paginatedData.map((row) => row.id));
//     }
//   };

//   return (
//     <div className="space-y-6 p-4">
//       {/* 🔹 Search */}
//       {enableSearch && (
//         <Input
//           placeholder="Search..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="max-w-sm dark:bg-gray-800 dark:text-gray-200"
//         />
//       )}

//       {/* 🔹 Table */}
//       <div className="overflow-x-auto w-full">
//         <Table className="min-w-[900px] border border-gray-200 dark:border-gray-700 dark:bg-gray-900">
//           <TableHeader className="bg-gray-50 dark:bg-gray-800">
//             <TableRow>
//               {enableSelection && (
//                 <TableHead>
//                   <Checkbox
//                     checked={
//                       selectedRows.length === paginatedData.length &&
//                       paginatedData.length > 0
//                     }
//                     indeterminate={
//                       selectedRows.length > 0 &&
//                       selectedRows.length < paginatedData.length
//                     }
//                     onCheckedChange={toggleAll}
//                     className="dark:ring-1 dark:ring-gray-500"
//                   />
//                 </TableHead>
//               )}

//               {columns.map((col) => (
//                 <TableHead
//                   key={col.key}
//                   className={`${col.sortable ? "cursor-pointer" : ""} dark:text-gray-200`}
//                   onClick={() => col.sortable && handleSort(col.key)}
//                 >
//                   {col.label}
//                 </TableHead>
//               ))}

//               {/* 🔹 Always show Action Column */}
//               <TableHead className="dark:text-gray-200 text-center">
//                 Action
//               </TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {paginatedData.map((item, rowIndex) => (
//               <TableRow
//                 key={item.id || rowIndex}
//                 className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
//                   rowIndex % 2 === 0
//                     ? "bg-white dark:bg-gray-900"
//                     : "bg-gray-50 dark:bg-gray-800"
//                 }`}
//               >
//                 {enableSelection && (
//                   <TableCell>
//                     <Checkbox
//                       checked={selectedRows.includes(item.id)}
//                       onCheckedChange={() => toggleRow(item.id)}
//                       className="dark:ring-1 dark:ring-gray-500"
//                     />
//                   </TableCell>
//                 )}

//                 {columns.map((col, colIndex) => (
//                   <TableCell
//                     key={`${item.id || rowIndex}-${col.key || colIndex}`}
//                     className={`${
//                       (col.key === "applicationId" && item[col.key]) ||
//                       (col.key === "fiLink" && item[col.key])
//                         ? "text-blue-600 cursor-pointer underline"
//                         : ""
//                     } dark:text-gray-200`}
//                     onClick={() => {
//                       if (col.key === "applicationId" && item[col.key]) {
//                         router.push(`/dashboard/applicationid/${item.id}`);
//                       }
//                       if (col.key === "fiLink" && item[col.key]) {
//                         router.push(`/dashboard/fi/${item.id}`);
//                       }
//                     }}
//                   >
//                     {col.render ? col.render(item) : item[col.key]}
//                   </TableCell>
//                 ))}

//                 {/* 🔹 Conditional Action Buttons */}
//                 <TableCell>
//                   <div className="flex gap-2 justify-center">
//                     {/* View button only if applicationId exists */}
//                     {item.applicationId && (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="dark:border-gray-600 dark:text-gray-200"
//                         onClick={() =>
//                           router.push(`/dashboard/applicationid/${item.id}`)
//                         }
//                       >
//                         View
//                       </Button>
//                     )}

//                     {/* FI button only if fiLink exists */}
//                     {item.fiLink && (
//                       <Button
//                         variant="secondary"
//                         size="sm"
//                         className="dark:border-gray-600 dark:text-gray-200"
//                         onClick={() => router.push(`/dashboard/fi/${item.id}`)}
//                       >
//                         FI
//                       </Button>
//                     )}
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* 🔹 Pagination */}
//       <div className="flex justify-between items-center space-x-2">
//         <Button
//           variant="outline"
//           disabled={currentPage === 1}
//           onClick={() => setCurrentPage((prev) => prev - 1)}
//           className="dark:border-gray-600 dark:text-gray-200"
//         >
//           Previous
//         </Button>

//         <span className="text-gray-700 dark:text-gray-200 font-medium">
//           Page {currentPage} of {totalPages}
//         </span>

//         <Button
//           variant="outline"
//           disabled={currentPage === totalPages}
//           onClick={() => setCurrentPage((prev) => prev + 1)}
//           className="dark:border-gray-600 dark:text-gray-200"
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// }

//**********************************23-08-25 18:15******** */

// "use client";

// import * as React from "react";
// import {
//   Table,
//   TableBody,
//   TableHead,
//   TableHeader,
//   TableRow,
//   TableCell,
// } from "@/components/ui/table";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";

// export default function DataTE({
//   columns,
//   data,
//   itemsPerPage = 10,
//   enableSearch = true,
//   enableSelection = true,
// }) {
//   const router = useRouter();
//   const [search, setSearch] = React.useState("");
//   const [sortConfig, setSortConfig] = React.useState({
//     key: "",
//     direction: "",
//   });
//   const [currentPage, setCurrentPage] = React.useState(1);
//   const [selectedRows, setSelectedRows] = React.useState([]);

//   // 🔹 Search
//   const filteredData = data.filter((item) =>
//     Object.values(item).some((val) =>
//       String(val).toLowerCase().includes(search.toLowerCase())
//     )
//   );

//   // 🔹 Sorting
//   const sortedData = React.useMemo(() => {
//     if (!sortConfig.key) return filteredData;
//     return [...filteredData].sort((a, b) => {
//       if (a[sortConfig.key] < b[sortConfig.key])
//         return sortConfig.direction === "asc" ? -1 : 1;
//       if (a[sortConfig.key] > b[sortConfig.key])
//         return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });
//   }, [filteredData, sortConfig]);

//   // 🔹 Pagination
//   const paginatedData = sortedData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );
//   const totalPages = Math.ceil(sortedData.length / itemsPerPage);

//   // 🔹 Handlers
//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc")
//       direction = "desc";
//     setSortConfig({ key, direction });
//   };

//   const toggleRow = (id) => {
//     setSelectedRows((prev) =>
//       prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
//     );
//   };

//   const toggleAll = () => {
//     if (selectedRows.length === paginatedData.length) {
//       setSelectedRows([]);
//     } else {
//       setSelectedRows(paginatedData.map((row) => row.id));
//     }
//   };

//   return (
//     <div className="space-y-6 p-4">
//       {/* 🔹 Search */}
//       {enableSearch && (
//         <Input
//           placeholder="Search..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="max-w-sm dark:bg-gray-800 dark:text-gray-200"
//         />
//       )}

//       {/* 🔹 Table */}
//       <div className="overflow-x-auto w-full">
//         <Table className="min-w-[900px] border border-gray-200 dark:border-gray-700 dark:bg-gray-900">
//           <TableHeader className="bg-gray-50 dark:bg-gray-800">
//             <TableRow>
//               {enableSelection && (
//                 <TableHead>
//                   <Checkbox
//                     checked={
//                       selectedRows.length === paginatedData.length &&
//                       paginatedData.length > 0
//                     }
//                     indeterminate={
//                       selectedRows.length > 0 &&
//                       selectedRows.length < paginatedData.length
//                     }
//                     onCheckedChange={toggleAll}
//                     className="dark:ring-1 dark:ring-gray-500"
//                   />
//                 </TableHead>
//               )}
//               {columns.map((col) => (
//                 <TableHead
//                   key={col.key}
//                   className={`${
//                     col.sortable ? "cursor-pointer" : ""
//                   } dark:text-gray-200`}
//                   onClick={() => col.sortable && handleSort(col.key)}
//                 >
//                   {col.label}
//                 </TableHead>
//               ))}
//               {/* 🔹 Extra Action Column */}
//               <TableHead className="dark:text-gray-200">Action</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {paginatedData.map((item, rowIndex) => (
//               <TableRow
//                 key={item.id || rowIndex}
//                 className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
//                   rowIndex % 2 === 0
//                     ? "bg-white dark:bg-gray-900"
//                     : "bg-gray-50 dark:bg-gray-800"
//                 }`}
//               >
//                 {enableSelection && (
//                   <TableCell>
//                     <Checkbox
//                       checked={selectedRows.includes(item.id)}
//                       onCheckedChange={() => toggleRow(item.id)}
//                       className="dark:ring-1 dark:ring-gray-500"
//                     />
//                   </TableCell>
//                 )}

//                 {columns.map((col, colIndex) => (
//                   <TableCell
//                     key={`${item.id || rowIndex}-${col.key || colIndex}`}
//                     className={`${
//                       col.key === "applicationId"
//                         ? "text-blue-600 cursor-pointer underline"
//                         : ""
//                     } dark:text-gray-200`}
//                     onClick={() => {
//                       if (col.key === "applicationId") {
//                         router.push(`/dashboard/applicationid/${item.id}`);
//                       }
//                     }}
//                   >
//                     {col.render ? col.render(item) : item[col.key]}
//                   </TableCell>
//                 ))}

//                 {/* 🔹 Extra Action Button */}
//                 <TableCell>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="dark:border-gray-600 dark:text-gray-200"
//                     onClick={() => router.push(`/dashboard/applicationid/${item.id}`)}
//                   >
//                     View
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* 🔹 Pagination */}
//       <div className="flex justify-between items-center space-x-2">
//         <Button
//           variant="outline"
//           disabled={currentPage === 1}
//           onClick={() => setCurrentPage((prev) => prev - 1)}
//           className="dark:border-gray-600 dark:text-gray-200"
//         >
//           Previous
//         </Button>
//         <span className="text-gray-700 dark:text-gray-200 font-medium">
//           Page {currentPage} of {totalPages}
//         </span>
//         <Button
//           variant="outline"
//           disabled={currentPage === totalPages}
//           onClick={() => setCurrentPage((prev) => prev + 1)}
//           className="dark:border-gray-600 dark:text-gray-200"
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// }
