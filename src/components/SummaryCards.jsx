import React from 'react';
import { Wallet, Users, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import './SummaryCards.css';

function SummaryCards({ totalExpenses, totalMembers, youOwe, youAreOwed }) {
  return (
    <div className="summary-cards">
      <div className="summary-card">
        <div className="card-icon">
          <Wallet size={32} />
        </div>
        <div className="card-content">
          <h3 className="card-title">Total Expenses</h3>
          <p className="card-value">PKR {totalExpenses.toLocaleString()}</p>
        </div>
      </div>

      <div className="summary-card">
        <div className="card-icon">
          <Users size={32} />
        </div>
        <div className="card-content">
          <h3 className="card-title">Total Members</h3>
          <p className="card-value">{totalMembers}</p>
        </div>
      </div>

      <div className="summary-card">
        <div className="card-icon negative">
          <ArrowUpRight size={32} />
        </div>
        <div className="card-content">
          <h3 className="card-title">You Owe</h3>
          <p className="card-value negative">PKR {youOwe.toLocaleString()}</p>
          <span className="sample-badge">⚠ Sample Value</span>
        </div>
      </div>

      <div className="summary-card">
        <div className="card-icon positive">
          <ArrowDownLeft size={32} />
        </div>
        <div className="card-content">
          <h3 className="card-title">You Are Owed</h3>
          <p className="card-value positive">PKR {youAreOwed.toLocaleString()}</p>
          <span className="sample-badge">⚠ Sample Value</span>
        </div>
      </div>
    </div>
  );
}

export default SummaryCards;
