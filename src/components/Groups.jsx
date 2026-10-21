import React, { useState } from 'react';
import { Search, Users, Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import './Groups.css';

function Groups({ groups, expenses }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter groups based on search
  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate group stats
  const getGroupStats = (groupName) => {
    const groupExpenses = expenses.filter(exp => exp.group === groupName);
    const totalExpenses = groupExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const expenseCount = groupExpenses.length;
    return { totalExpenses, expenseCount };
  };

  // Calculate overall stats
  const totalGroups = groups.length;
  const totalMembers = groups.reduce((sum, group) => sum + group.memberCount, 0);
  const totalExpenses = groups.reduce((sum, group) => sum + group.totalExpenses, 0);

  return (
    <div className="groups-page">
      <div className="groups-header">
        <div className="header-left">
          <h1 className="page-title">Groups</h1>
          <p className="page-subtitle">Manage your expense groups</p>
        </div>
        <div className="header-right">
          <button className="add-group-btn">
            <Plus size={20} />
            <span>Add Group</span>
          </button>
        </div>
      </div>

      <div className="groups-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{totalGroups}</span>
            <span className="stat-label">Total Groups</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{totalMembers}</span>
            <span className="stat-label">Total Members</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">PKR {totalExpenses.toLocaleString()}</span>
            <span className="stat-label">Total Expenses</span>
          </div>
        </div>
      </div>

      <div className="groups-controls">
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="groups-grid">
        {filteredGroups.length === 0 ? (
          <div className="no-groups">
            <p>No groups found matching your search.</p>
          </div>
        ) : (
          filteredGroups.map((group) => {
            const stats = getGroupStats(group.name);
            return (
              <div key={group.id} className="group-card">
                <div className="group-header">
                  <div className="group-icon">
                    <Users size={32} />
                  </div>
                  <div className="group-info">
                    <h3 className="group-name">{group.name}</h3>
                    <p className="group-members">{group.memberCount} members</p>
                  </div>
                  <button className="group-menu-btn" title="More options">
                    <MoreVertical size={20} />
                  </button>
                </div>

                <div className="group-stats-row">
                  <div className="group-stat">
                    <span className="stat-label">Expenses</span>
                    <span className="stat-value">{stats.expenseCount}</span>
                  </div>
                  <div className="group-stat">
                    <span className="stat-label">Total</span>
                    <span className="stat-value">PKR {stats.totalExpenses.toLocaleString()}</span>
                  </div>
                </div>

                <div className="group-footer">
                  <button className="view-btn">View Details</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="groups-footer">
        <p className="results-count">
          Showing {filteredGroups.length} of {groups.length} groups
        </p>
      </div>
    </div>
  );
}

export default Groups;
