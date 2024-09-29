import React, { useState, useEffect } from 'react';
import styles from './TransactionDashboard.module.css'; // Using CSS module

// Define the Product interface
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  sold: boolean;
  dateOfSale: Date | null;
}

// Correctly type props
interface TransactionDashboardProps {
  selectedMonth: string; // Change to string (capital S for consistency with TypeScript)
}

function TransactionDashboard({ selectedMonth }: TransactionDashboardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    fetchAllTransactions(); // Fetch all transactions when the component mounts or when the month changes
  }, [selectedMonth]); // Fetch data on month change

  const fetchAllTransactions = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/transactions/all/${selectedMonth}`);
      
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      console.log(data);
      setProducts(data); // Ensure you're setting the products array
    } catch (error) {
      console.log('Error fetching data: ', error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleSearchClick = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/transactions/search?search=${searchText}&month=${selectedMonth}`);
      
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      console.log(data);
      setProducts(data.products); // Ensure you are setting the products array
    } catch (error) {
      console.log('Error fetching data: ', error);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.heading}>Product List</h1>
      <div className={styles.searchContainer}>
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchText} 
          onChange={handleSearchChange} 
        />
        <button onClick={handleSearchClick}>Search</button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.title}</td>
              <td>{product.description}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.category}</td>
              <td>{product.sold ? 'Yes' : 'No'}</td>
              <td>
                <img src={product.image} alt={product.title} className={styles.productImage} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.monthSelector}>
        <label htmlFor="month-select">Select Month:</label>
        <select id="month-select" value={selectedMonth} onChange={(e) => {/* handle month change */}}>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          {/* Add more months as needed */}
        </select>
      </div>
    </div>
  );
}

export default TransactionDashboard;
