import React, { useState } from 'react';
import { Search, Plus, User, Calendar } from 'lucide-react';
import './DashboardHeader.css';

function DashboardHeader({ onAddExpenseClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome back!</h1>
          <p className="welcome-subtitle">Here's what's happening with your expenses</p>
        </div>
        <div className="date-display">
          <Calendar className="calendar-icon" size={18} />
          <span className="date-text">{currentDate}</span>
        </div>
      </div>

      <div className="header-right">
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Search expenses, groups..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <button className="add-expense-btn" onClick={onAddExpenseClick}>
          <Plus className="btn-icon" size={20} />
          <span className="btn-text">Add Expense</span>
        </button>

        <div className="user-profile">
          <div className="user-avatar">
            <User className="user-icon" size={24} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
