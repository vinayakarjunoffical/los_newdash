"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CardRisk({ 
  title, 
  value, 
  icon, 
  subtitle, 
  extra 
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            {subtitle ? (
              <>
                <div className="text-lg font-semibold">{value}</div>
                <div className="text-xs text-muted-foreground">{subtitle}</div>
              </>
            ) : (
              <div className="text-lg font-semibold">{value}</div>
            )}
          </div>
          {icon && <div>{icon}</div>}
        </div>
        {extra && <div>{extra}</div>}
      </CardContent>
    </Card>
  );
}

