"use client";

import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  TrendingUp,
  AlertTriangle,
  User,
  Banknote,
  ChevronRight,
  Check,
  Circle,
} from "lucide-react";
import { useParams } from "next/navigation";
import { credit } from "@/utils/credit";
import RiskTabs from "../molecules/RiskTabs";
import CardRisk from "../atoms/CardRisk";
import { riskData } from "@/utils/risk2";

// Utility for currency formatting
const currency = (n) =>
  n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

export default function RiskAllData() {
  const { id } = useParams();

  console.log(id)

  // Risk data
  const applicant = riskData.find((item) => item.id === Number(id));
  console.log("bin",applicant)
  // Credit data
  const applicant1 = credit.find((item) => item.id === Number(id));

  // Handle missing data
  if (!applicant) return <div className="p-4">Applicant not found</div>;

  // Extract credit info safely
  const creditApplicant = applicant1 || {};
  const cibilScore = creditApplicant.cibil?.score || 0;
  const redFlags = creditApplicant.bankSummary?.redFlags || [];
  const incomeMonthly = creditApplicant.incomeMonthly || 0;
  const fixedObligationsMonthly = creditApplicant.fixedObligationsMonthly || 0;

  // Debt-to-Income Ratio
  const dti = useMemo(() => {
    return incomeMonthly ? Math.round((fixedObligationsMonthly / incomeMonthly) * 100) : 0;
  }, [incomeMonthly, fixedObligationsMonthly]);

  // Approval Probability
  const approvalProbability = useMemo(() => {
    const scorePart = (cibilScore - 300) / 600;
    const dtiPart = 1 - Math.min(1, dti / 60);
    const redFlagPenalty = redFlags.length > 0 ? 0.15 : 0;

    const prob = Math.max(
      0,
      Math.min(1, 0.55 * scorePart + 0.35 * dtiPart - redFlagPenalty + 0.15)
    );

    return Math.round(prob * 100);
  }, [cibilScore, dti, redFlags.length]);

  // Risk grade
  const riskGrade =
    approvalProbability >= 80
      ? "A"
      : approvalProbability >= 65
      ? "B"
      : approvalProbability >= 50
      ? "C"
      : "D";

  return (
    <TooltipProvider>
      <div className="flex h-full w-full gap-4 p-4">
        {/* Main content */}
        <main className="flex-1">
          {/* Top Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Applicant */}
            <CardRisk
              title="Applicant"
              value={applicant.name}
              subtitle={`${applicant.employment.type} @ ${applicant.employment.company}`}
              icon={<User className="h-8 w-8" />}
            />

            {/* Amount Applied */}
            <CardRisk
              title="Amount Applied"
              value={currency(applicant.amountApplied)}
              icon={<Banknote className="h-8 w-8" />}
            />

            {/* Risk Grade (credit data) */}
            <CardRisk
              title="Risk Grade"
              value={
                <Badge
                  variant={
                    riskGrade === "A"
                      ? "default"
                      : riskGrade === "B"
                      ? "secondary"
                      : "destructive"
                  }
                  className="text-base px-3 py-1 rounded-xl"
                >
                  {riskGrade}
                </Badge>
              }
              icon={<AlertTriangle className="h-8 w-8" />}
            />

            {/* Approval Probability (credit data) */}
            <CardRisk
              title="Approval Probability"
              value={`${approvalProbability}%`}
              icon={<TrendingUp className="h-8 w-8" />}
              extra={<Progress value={approvalProbability} className="mt-3" />}
            />
          </div>

          <Separator className="my-4" />

          {/* Tabs with Credit, FI, PDI, Login Data */}
          <RiskTabs
            credit={applicant1}
            login={applicant.loginData}
            pdi={applicant.pdiData}
            fi={applicant.fiData}
          />
        </main>
      </div>
    </TooltipProvider>
  );
}
