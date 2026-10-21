import React from 'react';
import './ExpenseSplittingExplanation.css';

function ExpenseSplittingExplanation() {
  // Example calculation
  const totalExpense = 3000;
  const memberCount = 3;
  const perPersonShare = (totalExpense / memberCount).toFixed(2);

  return (
    <div className="splitting-explanation">
      <h2 className="section-title">How Expense Splitting Works</h2>

      <div className="explanation-content">
        <div className="explanation-card">
          <h3 className="card-heading">Equal Split Method</h3>
          <p className="card-description">
            When you add an expense with "Equal" split method, the total amount is divided equally among all group members.
          </p>
        </div>

        <div className="calculation-example">
          <h3 className="example-title">Example Calculation</h3>
          <div className="calculation-steps">
            <div className="step">
              <span className="step-number">1</span>
              <div className="step-content">
                <strong>Total Expense:</strong> PKR {totalExpense.toLocaleString()}
              </div>
            </div>

            <div className="step">
              <span className="step-number">2</span>
              <div className="step-content">
                <strong>Number of Members:</strong> {memberCount}
              </div>
            </div>

            <div className="step">
              <span className="step-number">3</span>
              <div className="step-content">
                <strong>Calculation:</strong>
                <div className="formula">
                  {totalExpense} ÷ {memberCount} = {perPersonShare}
                </div>
              </div>
            </div>

            <div className="step result">
              <span className="step-number">4</span>
              <div className="step-content">
                <strong>Each Member's Share:</strong>
                <div className="result-value">PKR {perPersonShare}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="explanation-card">
          <h3 className="card-heading">Balance Update</h3>
          <p className="card-description">
            <strong>Who paid:</strong> The person who paid the expense gets credit for the full amount.<br />
            <strong>Others:</strong> Each member's balance is reduced by their share amount.<br />
            <strong>Result:</strong> Members who paid more than their share will have a positive balance (they should receive money), and members who paid less will have a negative balance (they owe money).
          </p>
        </div>

        <div className="note-box">
          <span className="note-icon">💡</span>
          <p className="note-text">
            <strong>Note:</strong> This is a simplified explanation. In a real application, the splitting logic would be more complex and would track individual payments across multiple expenses.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ExpenseSplittingExplanation;
