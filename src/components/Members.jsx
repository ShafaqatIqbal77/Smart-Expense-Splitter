import React, { useState } from 'react';
import { Search, User, ArrowUp, ArrowDown, Check, Mail, Phone } from 'lucide-react';
import './Members.css';

function Members({ members, memberBalances, groups, expenses }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Helper function to get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper function to get a color based on name
  const getAvatarColor = (name) => {
    const colors = [
      '#2d7a3e', '#16a34a', '#dc2626', '#2563eb',
      '#7c3aed', '#db2777', '#ea580c', '#0891b2'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Get member balance
  const getMemberBalance = (memberName) => {
    const member = memberBalances.find(m => m.name === memberName);
    return member ? member.balance : 0;
  };

  // Get member's groups
  const getMemberGroups = (memberName) => {
    const memberExpenses = expenses.filter(exp => exp.paidBy === memberName);
    const uniqueGroups = [...new Set(memberExpenses.map(exp => exp.group))];
    return uniqueGroups;
  };

  // Get member's total expenses paid
  const getMemberTotalPaid = (memberName) => {
    const memberExpenses = expenses.filter(exp => exp.paidBy === memberName);
    return memberExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  };

  // Filter members based on search and status
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
    const balance = getMemberBalance(member.name);
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'owes' && balance < 0) ||
                         (filterStatus === 'receives' && balance > 0) ||
                         (filterStatus === 'settled' && balance === 0);
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalMembers = members.length;
  const owesCount = memberBalances.filter(m => m.balance < 0).length;
  const receivesCount = memberBalances.filter(m => m.balance > 0).length;
  const settledCount = memberBalances.filter(m => m.balance === 0).length;

  return (
    <div className="members-page">
      <div className="members-header">
        <div className="header-left">
          <h1 className="page-title">Members</h1>
          <p className="page-subtitle">Manage group members and their balances</p>
        </div>
        <div className="header-right">
          <button className="add-member-btn">
            <User size={20} />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      <div className="members-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <User size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{totalMembers}</span>
            <span className="stat-label">Total Members</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon owes">
            <ArrowUp size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{owesCount}</span>
            <span className="stat-label">Owes Money</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon receives">
            <ArrowDown size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{receivesCount}</span>
            <span className="stat-label">Should Receive</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon settled">
            <Check size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{settledCount}</span>
            <span className="stat-label">Settled</span>
          </div>
        </div>
      </div>

      <div className="members-controls">
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="owes">Owes Money</option>
            <option value="receives">Should Receive</option>
            <option value="settled">Settled</option>
          </select>
        </div>
      </div>

      <div className="members-grid">
        {filteredMembers.length === 0 ? (
          <div className="no-members">
            <p>No members found matching your criteria.</p>
          </div>
        ) : (
          filteredMembers.map((member) => {
            const balance = getMemberBalance(member.name);
            const memberGroups = getMemberGroups(member.name);
            const totalPaid = getMemberTotalPaid(member.name);
            
            let statusClass = 'settled';
            let statusIcon = <Check size={20} />;
            let statusText = 'Settled';
            
            if (balance < 0) {
              statusClass = 'owes';
              statusIcon = <ArrowUp size={20} />;
              statusText = 'Owes';
            } else if (balance > 0) {
              statusClass = 'receives';
              statusIcon = <ArrowDown size={20} />;
              statusText = 'Receives';
            }

            return (
              <div key={member.id} className="member-card">
                <div className="member-header">
                  <div className="member-avatar" style={{ backgroundColor: getAvatarColor(member.name) }}>
                    <span className="avatar-initials">{getInitials(member.name)}</span>
                  </div>
                  <div className="member-info">
                    <h3 className="member-name">{member.name}</h3>
                    <div className="member-status">
                      <span className={`status-badge ${statusClass}`}>
                        {statusIcon}
                        <span>{statusText}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="member-balance-section">
                  <span className="balance-label">Balance</span>
                  <span className={`balance-value ${statusClass}`}>
                    PKR {Math.abs(balance).toLocaleString()}
                  </span>
                </div>

                <div className="member-stats-row">
                  <div className="member-stat">
                    <span className="stat-label">Groups</span>
                    <span className="stat-value">{memberGroups.length}</span>
                  </div>
                  <div className="member-stat">
                    <span className="stat-label">Paid</span>
                    <span className="stat-value">PKR {totalPaid.toLocaleString()}</span>
                  </div>
                </div>

                {memberGroups.length > 0 && (
                  <div className="member-groups">
                    <span className="groups-label">Active in:</span>
                    <div className="groups-list">
                      {memberGroups.map((group, index) => (
                        <span key={index} className="group-tag">{group}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="member-footer">
                  <button className="view-btn">View Details</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="members-footer">
        <p className="results-count">
          Showing {filteredMembers.length} of {members.length} members
        </p>
      </div>
    </div>
  );
}

export default Members;
