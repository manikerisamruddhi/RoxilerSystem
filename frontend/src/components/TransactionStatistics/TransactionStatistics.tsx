import React, { useState, useEffect } from 'react';
import styles from './TransactionStatisctics.module.css'

interface Statistics {
  totalAmount: number;
  totalSoldItems: number;
  totalNotSoldItems: number;
}

interface TransactionStatisticsProps {
  selectedMonth: string;
}

const TransactionStatistics: React.FC<TransactionStatisticsProps> = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, [selectedMonth]);

  const fetchStatistics = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/transactions/statistics/${selectedMonth}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setStatistics({
        totalAmount: data.saleAmount || 0,
        totalSoldItems: data.soldItemCount || 0,
        totalNotSoldItems: data.unSoldItemCount || 0,
      });
    } catch (error) {
      console.error('Error fetching statistics: ', error);
    }
  };

  return (
    <div className={styles.statisticsContainer}>
      <h1 className={styles.heading}>Statistics for {selectedMonth}</h1>
      {statistics ? (
        <div className={styles.statisticsBox}>
          <p>Total Amount of Sales: ${statistics.totalAmount.toFixed(2)}</p>
          <p>Total Sold Items: {statistics.totalSoldItems}</p>
          <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
        </div>
      ) : (
        <p>Loading statistics...</p>
      )}
    </div>
  );
}

export default TransactionStatistics;
