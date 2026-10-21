import React from 'react';
import { ArrowUp, ArrowDown, Check } from 'lucide-react';
import './MemberBalances.css';

function MemberBalances({ members }) {
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

  // Separate members by balance status
  const oweMoney = members.filter(m => m.balance < 0);
  const owedMoney = members.filter(m => m.balance > 0);
  const settled = members.filter(m => m.balance === 0);

  return (
    <div className="member-balances-section">
      <h2 className="section-title">Member Balances</h2>

      <div className="balances-container">
        {/* Members who owe money */}
        {oweMoney.length > 0 && (
          <div className="balance-group">
            <h3 className="balance-group-title owe">
              Owes Money
            </h3>
            <div className="member-list">
              {oweMoney.map((member) => (
                <div key={member.id} className="member-card negative">
                  <div className="member-avatar" style={{ backgroundColor: getAvatarColor(member.name) }}>
                    <span className="avatar-initials">{getInitials(member.name)}</span>
                  </div>
                  <div className="member-info">
                    <span className="member-name">{member.name}</span>
                    <span className="member-balance">
                      PKR {Math.abs(member.balance).toLocaleString()}
                    </span>
                  </div>
                  <span className="balance-indicator negative">
                    <ArrowUp size={20} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Members who should receive money */}
        {owedMoney.length > 0 && (
          <div className="balance-group">
            <h3 className="balance-group-title receive">
              Should Receive
            </h3>
            <div className="member-list">
              {owedMoney.map((member) => (
                <div key={member.id} className="member-card positive">
                  <div className="member-avatar" style={{ backgroundColor: getAvatarColor(member.name) }}>
                    <span className="avatar-initials">{getInitials(member.name)}</span>
                  </div>
                  <div className="member-info">
                    <span className="member-name">{member.name}</span>
                    <span className="member-balance">
                      PKR {member.balance.toLocaleString()}
                    </span>
                  </div>
                  <span className="balance-indicator positive">
                    <ArrowDown size={20} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settled members */}
        {settled.length > 0 && (
          <div className="balance-group">
            <h3 className="balance-group-title settled">
              Settled
            </h3>
            <div className="member-list">
              {settled.map((member) => (
                <div key={member.id} className="member-card neutral">
                  <div className="member-avatar" style={{ backgroundColor: getAvatarColor(member.name) }}>
                    <span className="avatar-initials">{getInitials(member.name)}</span>
                  </div>
                  <div className="member-info">
                    <span className="member-name">{member.name}</span>
                    <span className="member-balance">
                      PKR 0
                    </span>
                  </div>
                  <span className="balance-indicator neutral">
                    <Check size={20} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No members message */}
        {members.length === 0 && (
          <p className="no-members">No members to display</p>
        )}
      </div>
    </div>
  );
}

export default MemberBalances;
