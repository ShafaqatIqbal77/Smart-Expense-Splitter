import React, { useState } from 'react';
import { Search, Filter, Trash2, Calendar, Wallet } from 'lucide-react';
import './Expenses.css';

function Expenses({ expenses, onDeleteExpense }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  // Get unique groups from expenses
  const groups = [...new Set(expenses.map(exp => exp.group))];

  // Filter expenses based on search and filters
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expense.paidBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = filterGroup === 'all' || expense.group === filterGroup;
    const matchesDate = filterDate === 'all' || 
                       (filterDate === 'recent' && isRecent(expense.date)) ||
                       (filterDate === 'month' && isThisMonth(expense.date));
    
    return matchesSearch && matchesGroup && matchesDate;
  });

  // Helper function to check if date is recent (last 7 days)
  const isRecent = (dateString) => {
    const expenseDate = new Date(dateString);
    const today = new Date();
    const diffTime = today - expenseDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  // Helper function to check if date is this month
  const isThisMonth = (dateString) => {
    const expenseDate = new Date(dateString);
    const today = new Date();
    return expenseDate.getMonth() === today.getMonth() && 
           expenseDate.getFullYear() === today.getFullYear();
  };

  // Calculate total amount
  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="expenses-page">
      <div className="expenses-header">
        <div className="header-left">
          <h1 className="page-title">Expenses</h1>
          <p className="page-subtitle">Manage and track all your expenses</p>
        </div>
        <div className="header-right">
          <div className="total-summary">
            <Wallet className="summary-icon" size={20} />
            <div className="summary-text">
              <span className="summary-label">Total</span>
              <span className="summary-value">PKR {totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="expenses-controls">
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter className="filter-icon" size={18} />
          <select
            className="filter-select"
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
          >
            <option value="all">All Groups</option>
            {groups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <Calendar className="filter-icon" size={18} />
          <select
            className="filter-select"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="recent">Last 7 Days</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      <div className="expenses-table-container">
        {filteredExpenses.length === 0 ? (
          <div className="no-expenses">
            <p>No expenses found matching your criteria.</p>
          </div>
        ) : (
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Expense</th>
                <th>Group</th>
                <th>Paid By</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="expense-row">
                  <td className="expense-name">{expense.title}</td>
                  <td className="expense-group">{expense.group}</td>
                  <td className="expense-payer">{expense.paidBy}</td>
                  <td className="expense-date">
                    {new Date(expense.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="expense-amount">
                    PKR {expense.amount.toLocaleString()}
                  </td>
                  <td className="expense-actions">
                    <button
                      className="delete-btn"
                      onClick={() => onDeleteExpense(expense.id)}
                      title="Delete expense"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="expenses-footer">
        <p className="results-count">
          Showing {filteredExpenses.length} of {expenses.length} expenses
        </p>
      </div>
    </div>
  );
}

export default Expenses;
