import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import './ExpenseList.css';

// =====================================================================
// ExpenseList Component
// =====================================================================
// Yeh component expenses ki list dikhata hai ek table mein.
// Delete confirmation bhi is component mein handle hota hai.
//
// Props:
// - expenses: expense objects ki array (App.jsx se aati hai)
// - onDeleteExpense: ek callback function jo parent ko delete ka signal
//   deta hai (Child -> Parent communication)
// =====================================================================

function ExpenseList({ expenses, onDeleteExpense }) {

  // -------------------------------------------------------
  // STATE: deleteConfirm
  // -------------------------------------------------------
  // Jab user delete button dabaye, hum pehle confirm karte hain.
  // Is state mein us expense ka id store hota hai jise delete
  // karna hai. Agar null hai, matlab koi confirmation nahi chal rahi.
  //
  // Flow:
  // 1. User delete dabaye  → deleteConfirm = expense.id (confirmation show)
  // 2. User "Haan" dabaye  → onDeleteExpense(id) call karo, confirm null
  // 3. User "Nahi" dabaye  → deleteConfirm = null (cancel)
  // -------------------------------------------------------
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Delete button dabaane par — confirmation state set karo
  const handleDeleteClick = (expenseId) => {
    setDeleteConfirm(expenseId);
  };

  // "Haan, Delete Karo" dabaane par — actual delete karo
  const handleConfirmDelete = () => {
    // Parent (App.jsx) ko signal bhejo ke yeh ID wala expense hatao
    onDeleteExpense(deleteConfirm);
    // Confirmation band karo
    setDeleteConfirm(null);
  };

  // "Cancel" dabaane par — confirmation band karo, kuch mat karo
  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  // -------------------------------------------------------
  // Empty State
  // Agar koi expense nahi hai toh yeh dikhao
  // -------------------------------------------------------
  if (expenses.length === 0) {
    return (
      <div className="expense-section">
        <h2 className="section-title">📋 Recent Expenses</h2>
        <div className="no-expenses">
          <span className="no-expenses-icon">💸</span>
          <p>Abhi koi expense nahi hai.</p>
          <p className="no-expenses-hint">Upar "Add Expense" button daba kar pehla expense add karen!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="expense-section">
      <div className="expense-section-header">
        <h2 className="section-title">📋 Recent Expenses</h2>
        <span className="expense-count">{expenses.length} expense{expenses.length !== 1 ? 's' : ''}</span>
      </div>

      {/* -------------------------------------------------------
          Delete Confirmation Dialog
          Yeh sirf tab dikhega jab deleteConfirm null nahi hogi.
          Conditional rendering ka example:
          {condition && <Component />}
          ------------------------------------------------------- */}
      {deleteConfirm !== null && (
        <div className="delete-confirm-banner" role="alert">
          <span className="confirm-text">
            ⚠ Kya aap sach mein yeh expense delete karna chahte hain?
          </span>
          <div className="confirm-actions">
            <button
              className="confirm-yes-btn"
              onClick={handleConfirmDelete}
            >
              ✓ Haan, Delete Karo
            </button>
            <button
              className="confirm-no-btn"
              onClick={handleCancelDelete}
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      )}

      <div className="expense-table-container">
        <table className="expense-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Expense</th>
              <th>Group</th>
              <th>Paid By</th>
              <th>Tarikh</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* expenses array ko map kar ke har ek expense ki row banao */}
            {expenses.map((expense, index) => (
              <tr
                key={expense.id}
                className={`expense-row ${deleteConfirm === expense.id ? 'row-pending-delete' : ''}`}
              >
                {/* Row number — simple counter for UI */}
                <td className="expense-number">{index + 1}</td>

                <td className="expense-name">{expense.title}</td>

                <td className="expense-group">
                  <span className="group-badge">{expense.group}</span>
                </td>

                <td className="expense-payer">{expense.paidBy}</td>

                <td className="expense-date">
                  {/* Date ko readable format mein dikhao */}
                  {new Date(expense.date + 'T00:00:00').toLocaleDateString('en-PK', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>

                <td className="expense-amount">
                  {/* amount ek number hai, toLocaleString() se readable banao */}
                  PKR {expense.amount.toLocaleString('en-PK', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                  })}
                </td>

                <td className="expense-actions">
                  <button
                    className={`delete-btn ${deleteConfirm === expense.id ? 'delete-btn-active' : ''}`}
                    onClick={() => handleDeleteClick(expense.id)}
                    title="Expense delete karen"
                    aria-label={`${expense.title} delete karen`}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

          {/* Table Footer: Total dikhao */}
          <tfoot>
            <tr className="total-row">
              <td colSpan={5} className="total-label">Total Expenses</td>
              <td className="total-amount">
                {/* expenses array ka sum calculate karo */}
                PKR {expenses
                  .reduce((sum, exp) => sum + exp.amount, 0)
                  .toLocaleString('en-PK', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                  })}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default ExpenseList;
