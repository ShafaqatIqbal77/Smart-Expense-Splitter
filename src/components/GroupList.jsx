import React from 'react';
import { Users } from 'lucide-react';
import './GroupList.css';

function GroupList({ groups }) {
  return (
    <div className="group-section">
      <h2 className="section-title">Your Groups</h2>
      <div className="group-list">
        {groups.map((group) => (
          <div key={group.id} className="group-card">
            <div className="group-header">
              <div className="group-icon">
                <Users size={36} />
              </div>
              <div className="group-info">
                <h3 className="group-name">{group.name}</h3>
                <p className="group-members">{group.memberCount} members</p>
              </div>
            </div>
            <div className="group-footer">
              <span className="group-expenses">
                Total: PKR {group.totalExpenses.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GroupList;
