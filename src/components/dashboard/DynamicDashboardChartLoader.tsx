"use client";

import type { ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from 'next/dynamic';

const DashboardVulnerabilityChart = dynamic(
  () => import('@/components/dashboard/DashboardVulnerabilityChart'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[300px] w-full" />
  }
);

interface DynamicDashboardChartLoaderProps {
  data: Array<Record<string, any>>;
  config: ChartConfig;
}

export default function DynamicDashboardChartLoader({ data, config }: DynamicDashboardChartLoaderProps) {
  return <DashboardVulnerabilityChart data={data} config={config} />;
}
