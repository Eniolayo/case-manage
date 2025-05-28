import Chart from "react-apexcharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ApexCharts tooltip types
interface TooltipParams {
  series: number[];
  seriesIndex: number;
  dataPointIndex?: number;
  w: {
    globals: {
      labels: string[];
      categoryLabels: string[];
      colors: string[];
    };
  };
}

type CaseStatus = "In Progress" | "Resolved" | "Escalated";
type FilterType = "ALL" | "DEBIT_CARD" | "CREDIT_CARD" | "WALLET";

type Case = {
  id: string;
  entityId: string;
  status: CaseStatus;
  score: number;
  assignee: string;
  created: string;
  cardType: FilterType;
  priority: "high" | "medium" | "low";
};

interface CaseChartsProps {
  cases: Case[];
  primaryFilter: FilterType;
}

export function CaseCharts({ cases }: CaseChartsProps) {
  // Prepare data for status distribution chart
  const statusData = cases.reduce((acc, case_) => {
    acc[case_.status] = (acc[case_.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusLabels = Object.keys(statusData);
  const statusValues = Object.values(statusData);

  // Create color mapping based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "#f59e0b"; // Yellow/amber
      case "Resolved":
        return "#10b981"; // Green
      case "Escalated":
        return "#ef4444"; // Red
      default:
        return "#6b7280"; // Gray for unknown status
    }
  };

  const statusColors = statusLabels.map(getStatusColor);

  const statusChartOptions = {
    chart: {
      type: "donut" as const,
      toolbar: { show: false },
    },
    labels: statusLabels,
    colors: statusColors,
    legend: {
      position: "bottom" as const,
      fontSize: "12px",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return Math.round(val) + "%";
      },
      style: {
        fontSize: "12px",
        fontWeight: "bold",
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: "100%",
            height: 250,
          },
          legend: {
            position: "bottom",
            fontSize: "11px",
          },
          dataLabels: {
            style: {
              fontSize: "10px",
            },
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            width: "100%",
            height: 200,
          },
          legend: {
            position: "bottom",
            fontSize: "10px",
          },
          dataLabels: {
            style: {
              fontSize: "9px",
            },
          },
        },
      },
    ],
    tooltip: {
      enabled: true,
      theme: "light",
      style: {
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
      },
      custom: function ({ series, seriesIndex, w }: TooltipParams): string {
        const label = w.globals.labels[seriesIndex];
        const value = series[seriesIndex];
        const total = series.reduce(
          (acc: number, curr: number) => acc + curr,
          0
        );
        const percentage = Math.round((value / total) * 100);

        return `
          <div style="
            background: white; 
            border: 1px solid #e5e7eb; 
            border-radius: 8px; 
            padding: 12px 16px; 
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            font-family: Inter, sans-serif;
            min-width: 140px;
          ">
            <div style="
              font-weight: 600; 
              color: #374151; 
              margin-bottom: 6px;
              font-size: 13px;
            ">
              ${label}
            </div>
            <div style="
              display: flex; 
              justify-content: space-between; 
              align-items: center;
              gap: 12px;
            ">
              <div style="
                display: flex; 
                align-items: center; 
                gap: 6px;
              ">
                <div style="
                  width: 8px; 
                  height: 8px; 
                  background: ${w.globals.colors[seriesIndex]}; 
                  border-radius: 50%;
                "></div>
                <span style="
                  font-weight: 500; 
                  color: #111827;
                  font-size: 14px;
                ">
                  ${value} case${value !== 1 ? "s" : ""}
                </span>
              </div>
              <span style="
                font-weight: 600; 
                color: ${w.globals.colors[seriesIndex]};
                font-size: 14px;
              ">
                ${percentage}%
              </span>
            </div>
          </div>
        `;
      },
    },
  };
  // Prepare data for cases over time (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  const casesOverTime = last7Days.map((date) => {
    return cases.filter((case_) => {
      const caseDate = new Date(case_.created).toISOString().split("T")[0];
      return caseDate === date;
    }).length;
  });
  const timeSeriesChartOptions = {
    chart: {
      type: "line" as const,
      toolbar: { show: false },
      zoom: {
        enabled: false,
      },
      selection: {
        enabled: false,
      },
    },
    xaxis: {
      categories: last7Days.map((date) => {
        const d = new Date(date);
        return d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }),
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    colors: ["#3b82f6"], // Blue color to match "New Cases" styling
    stroke: {
      curve: "smooth" as const,
      width: 3,
    },
    markers: {
      size: 5,
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 3,
    },
    tooltip: {
      enabled: true,
      theme: "light",
      style: {
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
      },
      custom: function ({
        series,
        seriesIndex,
        dataPointIndex = 0,
        w,
      }: any): string {
        const date = w.globals.categoryLabels[dataPointIndex];
        const value = series[seriesIndex][dataPointIndex];
        return `
          <div style="
            background: white; 
            border: 1px solid #e5e7eb; 
            border-radius: 8px; 
            padding: 12px 16px; 
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            font-family: Inter, sans-serif;
            min-width: 120px;
          ">
            <div style="
              font-weight: 600; 
              color: #374151; 
              margin-bottom: 4px;
              font-size: 13px;
            ">
              ${date}
            </div>
            <div style="
              display: flex; 
              align-items: center; 
              gap: 8px;
            ">              <div style="
                width: 8px; 
                height: 8px; 
                background: #3b82f6; 
                border-radius: 50%;
              "></div>
              <span style="
                font-weight: 500; 
                color: #111827;
                font-size: 14px;
              ">
                ${value} case${value !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        `;
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 250,
          },
          xaxis: {
            labels: {
              style: {
                fontSize: "10px",
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                fontSize: "10px",
              },
            },
          },
          stroke: {
            width: 2,
          },
          markers: {
            size: 4,
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 200,
          },
          xaxis: {
            labels: {
              style: {
                fontSize: "9px",
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                fontSize: "9px",
              },
            },
          },
          stroke: {
            width: 2,
          },
          markers: {
            size: 3,
          },
        },
      },
    ],
  };
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-5">
      {/* Cases Trend - Takes up 60% (3/5 columns) on large screens, full width on mobile */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-lg">Cases Trend (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            options={timeSeriesChartOptions}
            series={[
              {
                name: "Cases",
                data: casesOverTime,
              },
            ]}
            type="line"
            height={300}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Case Status Distribution - Takes up 40% (2/5 columns) on large screens, full width on mobile */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Case Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            options={statusChartOptions}
            series={statusValues}
            type="donut"
            height={300}
            className="w-full"
          />
        </CardContent>
      </Card>
    </div>
  );
}
