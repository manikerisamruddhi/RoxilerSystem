import React, { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2'; 
import { Chart, registerables } from 'chart.js'; 
import styles from './TransactionBasrChart.module.css'

Chart.register(...registerables);

interface TransactionBarChartProps {
  selectedMonth: string;
}

interface BarChartData {
  labels: string[];
  values: number[];
}

const TransactionBarChart: React.FC<TransactionBarChartProps> = ({ selectedMonth }) => {
  const [barChartData, setBarChartData] = useState<BarChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const fetchBarChartData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3001/api/transactions/statistics/bar-chart/${selectedMonth}`);
        const result = await res.json();

        console.log('API Result:', result); // Log the API result

        // Initialize manualData correctly
        const manualData = {
          data: [] as { label: string; value: number }[],
        };

        // Map the result to manualData
        result.data.forEach((item: any) => {
          manualData.data.push({ label: item.range, value: item.count });
        });

        const labels = manualData.data.map((item) => item.label);
        const values = manualData.data.map((item) => item.value);

        console.log('Labels:', labels); // Log the labels
        console.log('Values:', values); // Log the values

        setBarChartData({ labels, values });
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBarChartData();

    return () => {
      // Only destroy chart if chartRef.current exists
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [selectedMonth]);

  // Ensure chartData is defined only when barChartData is set
  const chartData = barChartData ? {
    labels: barChartData.labels,
    datasets: [
      {
        label: 'Sales Amount',
        data: barChartData.values,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  } : null;

  // Chart options to manage Y-axis values
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: Math.max(...(barChartData?.values || [10])), // Adjust max based on data
        title: {
          display: true,
          text: 'Sales Amount',
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (loading) {
    return <div>Loading bar chart...</div>;
  }

  return (
    <>
      <div className={styles.barChartContainer}>
        <h2>Bar Chart for {selectedMonth}</h2>
        {barChartData ? (
          <div className={styles.chart}>
            {/* Render chart only if chartData is defined */}
            {chartData && <Bar ref={chartRef} data={chartData} options={options} />}
          </div>
        ) : (
          <div>No data available for {selectedMonth}</div>
        )}
      </div>
    </>
  );
};

export default TransactionBarChart;
