"use client";

import type { EventStatusDist } from "@/lib/mock/admin.mock";
import type { EventStatus } from "@/lib/types/enums";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface StatusPieChartProps {
  data: EventStatusDist[];
}

// 이벤트 상태별 색상 매핑
const STATUS_COLORS: Record<EventStatus, string> = {
  recruiting: "#3b82f6",
  confirmed: "#22c55e",
  completed: "#6b7280",
  cancelled: "#ef4444",
};

// 이벤트 상태 분포를 보여주는 Pie 차트
export function StatusPieChart({ data }: StatusPieChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="count"
            nameKey="label"
            paddingAngle={3}
          >
            {data.map((entry) => (
              <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}개`, ""]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
