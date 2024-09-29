import React, { useState } from 'react';
import TransactionDashboard from './components/transactionDashboard/TransactionDashboard';
import TransactionStatistics from './components/TransactionStatistics/TransactionStatistics';
import TransactionBarChart from './components/TransactionBarChart/TransactionBarChart';
import './App.css'; // Import your CSS file here

const App = () => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const [selectedMonth, setSelectedMonth] = useState<string>('March');

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  return (
    <div className="appContainer">
      <div className="monthSelector">
        <label htmlFor="month-select">Select Month: </label>
        <select id="month-select" value={selectedMonth} onChange={(e) => handleMonthChange(e.target.value)}>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
      <TransactionDashboard selectedMonth={selectedMonth} />
      <TransactionStatistics selectedMonth={selectedMonth} />
      <TransactionBarChart selectedMonth={'March'} />
    </div>
  );
};

export default App;
