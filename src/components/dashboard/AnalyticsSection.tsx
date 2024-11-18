import { useEffect, useRef } from 'react';
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Card } from "@/components/ui/card";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const analyticsData: ChartData<'bar'> = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Projects Completed',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: 'rgba(129, 140, 248, 0.5)',
      borderColor: 'rgb(129, 140, 248)',
      borderWidth: 1,
    },
    {
      label: 'New Projects',
      data: [8, 15, 7, 9, 4, 6],
      backgroundColor: 'rgba(52, 211, 153, 0.5)',
      borderColor: 'rgb(52, 211, 153)',
      borderWidth: 1,
    }
  ]
};

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
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
};

export const AnalyticsSection = () => {
  const chartRef = useRef<ChartJS<'bar'>>(null);

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
              options={chartOptions}
            />
          </div>
        </Card>
      </BackgroundGradient>
    </div>
  );
};
