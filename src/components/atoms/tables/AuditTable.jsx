"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockAuditLogs } from "@/utils/mockData";
import { getAuditLogs } from "@/utils/auditLogger";

export default function AuditTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    const realLogs = getAuditLogs();
    const combinedLogs = [
      ...realLogs,
      ...mockAuditLogs.map((log) => ({
        id: log.id,
        action: log.action,
        entityType: "retailer",
        entityId: log.entityId,
        performedBy: log.userName,
        timestamp: log.timestamp,
        details: log.details,
        ipAddress: "192.168.1.1",
      })),
    ];
    setAuditLogs(combinedLogs);
  }, []);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.performedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction =
      actionFilter === "all" || log.action.toLowerCase().includes(actionFilter);
    return matchesSearch && matchesAction;
  });

  const getActionBadge = (action) => {
    switch (true) {
      case action.includes("approved"):
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
      case action.includes("rejected"):
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      case action.includes("created"):
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Created</Badge>;
      case action.includes("updated"):
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Updated</Badge>;
      default:
        return <Badge variant="outline">Action</Badge>;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
     

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="flex flex-wrap gap-4 p-4">
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[250px]"
            data-testid="input-search-logs"
          />
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-48" data-testid="select-action-filter">
              <SelectValue placeholder="All Actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="updated">Updated</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} data-testid={`row-log-${log.id}`}>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {log.performedBy}
                      </div>
                    </TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{log.entityType}</div>
                        <div className="text-gray-500">{log.entityId}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      {log.details}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
