import { useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Card } from "@/components/ui/card";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const analyticsData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Completed Projects',
      data: [12, 15, 18, 14, 20, 17],
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
      borderColor: 'rgba(34, 197, 94, 1)',
      borderWidth: 1,
    },
    {
      label: 'Active Projects',
      data: [8, 10, 12, 15, 10, 13],
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
    }
  ]
};

export const AnalyticsSection = () => {
  const chartRef = useRef<ChartJS>(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Project Analytics</h2>
      <BackgroundGradient className="rounded-[22px] p-1 bg-zinc-900">
        <Card className="p-6 rounded-[20px]">
          <div className="h-[300px]">
            <Bar
              ref={chartRef}
              data={analyticsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                    labels: {
                      color: 'rgb(229, 231, 235)',
                      padding: 20,
                      font: { size: 12 }
                    }
                  }
                },
                scales: {
                  x: {
                    grid: {
                      color: 'rgba(229, 231, 235, 0.1)'
                    },
                    ticks: {
                      color: 'rgb(229, 231, 235)'
                    }
                  },
                  y: {
                    grid: {
                      color: 'rgba(229, 231, 235, 0.1)'
                    },
                    ticks: {
                      color: 'rgb(229, 231, 235)'
                    }
                  }
                }
              }}
            />
          </div>
        </Card>
      </BackgroundGradient>
    </div>
  );
}

export default AnalyticsSection;
