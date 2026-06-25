"use client";

import type { MonthlyStats } from "@/lib/mock/admin.mock";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ParticipationBarChartProps {
  data: MonthlyStats[];
}

// 월별 참여자 수를 보여주는 Bar 차트
export function ParticipationBarChart({ data }: ParticipationBarChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
          />
          <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
          <Tooltip />
          {/* 참여자 수 막대 (파란색) */}
          <Bar
            dataKey="participant_count"
            name="참여자 수"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
