"use client";

/**
 * Admin Chart Components
 * ----------------------
 * Reusable chart components built on recharts, themed with
 * --admin-* CSS variables for dark/light mode support.
 */
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";

const CHART_COLORS = [
  "#25D6FF",
  "#5EDBFF",
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
];

/* --------------------------- Tooltip --------------------------- */

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div
      className="rounded-lg border shadow-xl px-3 py-2 text-[12px]"
      style={{
        background: "var(--admin-surface)",
        borderColor: "var(--admin-border)",
        color: "var(--admin-text)",
      }}
    >
      {label && <p className="font-medium mb-1">{label}</p>}
      {payload.map((entry: any, i: number) => (
        <p key={i} className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: entry.color || entry.fill }}
          />
          <span style={{ color: "var(--admin-text-secondary)" }}>
            {entry.name}:
          </span>
          <span className="font-medium">
            {typeof entry.value === "number"
              ? entry.value.toLocaleString()
              : entry.value}
          </span>
        </p>
      ))}
    </div>
  );
}

/* --------------------------- Area Chart --------------------------- */

export function AdminAreaChart({
  data,
  dataKey = "value",
  xKey = "name",
  color = "#25D6FF",
  height = 200,
}: {
  data: any[];
  dataKey?: string;
  xKey?: string;
  color?: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={`area-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: "var(--admin-text-muted)", fontSize: 11 }}
          axisLine={{ stroke: "var(--admin-border)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--admin-text-muted)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<ChartTooltip />} />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          fill={`url(#area-${dataKey})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* --------------------------- Bar Chart --------------------------- */

export function AdminBarChart({
  data,
  dataKey = "value",
  xKey = "name",
  color = "#25D6FF",
  height = 200,
  horizontal = false,
}: {
  data: any[];
  dataKey?: string;
  xKey?: string;
  color?: string;
  height?: number;
  horizontal?: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" vertical={horizontal} horizontal={!horizontal} />
        <XAxis
          type={horizontal ? "number" : "category"}
          dataKey={horizontal ? undefined : xKey}
          tick={{ fill: "var(--admin-text-muted)", fontSize: 11 }}
          axisLine={{ stroke: "var(--admin-border)" }}
          tickLine={false}
        />
        <YAxis
          type={horizontal ? "category" : "number"}
          dataKey={horizontal ? xKey : undefined}
          tick={{ fill: "var(--admin-text-muted)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={horizontal ? 80 : 40}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--admin-surface-2)", opacity: 0.5 }} />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* --------------------------- Line Chart --------------------------- */

export function AdminLineChart({
  data,
  lines,
  xKey = "name",
  height = 200,
}: {
  data: any[];
  lines: { key: string; color: string; name: string }[];
  xKey?: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: "var(--admin-text-muted)", fontSize: 11 }}
          axisLine={{ stroke: "var(--admin-border)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--admin-text-muted)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<ChartTooltip />} />
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            strokeWidth={2}
            name={line.name}
            dot={{ fill: line.color, r: 3 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

/* --------------------------- Donut Chart --------------------------- */

export function AdminDonutChart({
  data,
  height = 200,
}: {
  data: { name: string; value: number }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

/* --------------------------- Radial Progress --------------------------- */

export function AdminRadialProgress({
  value,
  size = 120,
  color = "#25D6FF",
  label,
}: {
  value: number;
  size?: number;
  color?: string;
  label?: string;
}) {
  const data = [{ name: "progress", value, fill: color }];
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={90}
          endAngle={90 + (value / 100) * 360}
        >
          <RadialBar background={{ fill: "var(--admin-surface-2)" }} dataKey="value" cornerRadius={10} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[20px] font-bold" style={{ color: "var(--admin-text)" }}>
          {value}%
        </span>
        {label && (
          <span className="text-[10px] mt-0.5" style={{ color: "var(--admin-text-muted)" }}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
