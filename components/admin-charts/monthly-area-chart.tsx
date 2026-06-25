"use client";

import type { MonthlyStats } from "@/lib/mock/admin.mock";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MonthlyAreaChartProps {
  data: MonthlyStats[];
}

// 월별 이벤트 수 및 참여자 수 추이를 보여주는 Area 차트
export function MonthlyAreaChart({ data }: MonthlyAreaChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            {/* 이벤트 수 영역 그라데이션 */}
            <linearGradient id="colorEventCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            {/* 참여자 수 영역 그라데이션 */}
            <linearGradient
              id="colorParticipantCount"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
          />
          <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
          <Tooltip />
          <Legend />
          {/* 이벤트 수 (파란색) */}
          <Area
            type="monotone"
            dataKey="event_count"
            name="이벤트 수"
            stroke="#3b82f6"
            fill="url(#colorEventCount)"
            strokeWidth={2}
          />
          {/* 참여자 수 (녹색) */}
          <Area
            type="monotone"
            dataKey="participant_count"
            name="참여자 수"
            stroke="#22c55e"
            fill="url(#colorParticipantCount)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
