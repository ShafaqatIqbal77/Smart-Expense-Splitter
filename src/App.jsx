import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardHeader from './components/DashboardHeader';
import SummaryCards from './components/SummaryCards';
import GroupList from './components/GroupList';
import AddExpenseForm from './components/AddExpenseForm';
import ExpenseList from './components/ExpenseList';
import MemberBalances from './components/MemberBalances';
import ExpenseSplittingExplanation from './components/ExpenseSplittingExplanation';
import Expenses from './components/Expenses';
import Groups from './components/Groups';
import Members from './components/Members';
import Settings from './components/Settings';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddExpenseForm, setShowAddExpenseForm] = useState(false);

  // ---------------------------------------------------------------
  // Summary Data State
  // ---------------------------------------------------------------
  // IMPORTANT: totalExpenses yahan se nahi aata!
  // Hum isko neeche expenses.reduce() se calculate karte hain.
  // Yeh is liye better hai kyunke ek hi "source of truth" (expenses)
  // hai — agar expense add/delete ho, total automatically update hoga.
  //
  // youOwe aur youAreOwed = SAMPLE VALUES
  // Settlement logic abhi implement nahi hua. Yeh values next step
  // mein actual calculations se replace hongi.
  // ---------------------------------------------------------------
  const [summaryData] = useState({
    totalMembers: 8,
    youOwe: 2500,       // ⚠ SAMPLE VALUE — next step mein calculate hoga
    youAreOwed: 4500    // ⚠ SAMPLE VALUE — next step mein calculate hoga
  });

  // Sample data for groups
  const groups = [
    {
      id: 1,
      name: 'University Friends',
      memberCount: 5,
      totalExpenses: 8000
    },
    {
      id: 2,
      name: 'Hostel Roommates',
      memberCount: 3,
      totalExpenses: 5000
    },
    {
      id: 3,
      name: 'Weekend Trip',
      memberCount: 4,
      totalExpenses: 2000
    }
  ];

  // Sample data for members
  const members = [
    { id: 1, name: 'Ahmed' },
    { id: 2, name: 'Fatima' },
    { id: 3, name: 'Ali' },
    { id: 4, name: 'Sara' },
    { id: 5, name: 'Usman' },
    { id: 6, name: 'Ayesha' },
    { id: 7, name: 'Bilal' },
    { id: 8, name: 'Zara' }
  ];

  // Sample data for member balances
  const [memberBalances, setMemberBalances] = useState([
    { id: 1, name: 'Ahmed', balance: 4500 },
    { id: 2, name: 'Fatima', balance: 1500 },
    { id: 3, name: 'Ali', balance: 800 },
    { id: 4, name: 'Sara', balance: -2500 },
    { id: 5, name: 'Usman', balance: -1000 },
    { id: 6, name: 'Ayesha', balance: 0 },
    { id: 7, name: 'Bilal', balance: -500 },
    { id: 8, name: 'Zara', balance: 1200 }
  ]);

  // Sample data for expenses
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      title: 'Dinner at Restaurant',
      amount: 3000,
      paidBy: 'Ahmed',
      group: 'University Friends',
      date: '2024-10-20',
      splitMethod: 'equal'
    },
    {
      id: 2,
      title: 'Grocery Shopping',
      amount: 1500,
      paidBy: 'Fatima',
      group: 'Hostel Roommates',
      date: '2024-10-19',
      splitMethod: 'equal'
    },
    {
      id: 3,
      title: 'Movie Tickets',
      amount: 800,
      paidBy: 'Ali',
      group: 'Weekend Trip',
      date: '2024-10-18',
      splitMethod: 'equal'
    }
  ]);

  // ---------------------------------------------------------------
  // handleAddExpense Function
  // ---------------------------------------------------------------
  // Child component (AddExpenseForm) yeh function call karta hai
  // jab user form submit kare. Yeh "callback prop" pattern hai.
  //
  // [...prev, newExpense] = spread operator
  // Yeh pehli array ki sab items rakhta hai aur end mein naya
  // expense add karta hai. Seedha push() nahi karte kyunke
  // React ko naya array chahiye hota hai re-render ke liye!
  // ---------------------------------------------------------------
  const handleAddExpense = (newExpense) => {
    // Expenses list mein naya expense add karo
    setExpenses(prev => [...prev, newExpense]);
    // Note: totalExpenses automatically update ho jata hai
    // kyunke hum isko expenses se compute kar rahe hain (neeche dekhen)
  };

  // ---------------------------------------------------------------
  // handleDeleteExpense Function
  // ---------------------------------------------------------------
  // ExpenseList component yeh function call karta hai jab user
  // delete confirm kare.
  //
  // filter() ek naya array banata hai jis mein woh item NAHI hogi
  // jis ka id match karta ho. Yeh original array nahi badlta!
  // ---------------------------------------------------------------
  const handleDeleteExpense = (expenseId) => {
    // Sirf woh expenses rakho jin ka id match nahi karta
    setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
    // Total bhi automatically recalculate ho jata hai!
  };

  // Function to handle Add Expense button click
  const handleAddExpenseClick = () => {
    setShowAddExpenseForm(!showAddExpenseForm);
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        <div className="content-wrapper">
          {activeTab === 'dashboard' && (
            <div className="dashboard-content">
              <DashboardHeader onAddExpenseClick={handleAddExpenseClick} />
              <SummaryCards
                totalExpenses={expenses.reduce((sum, exp) => sum + exp.amount, 0)}
                totalMembers={members.length}
                youOwe={summaryData.youOwe}
                youAreOwed={summaryData.youAreOwed}
              />
              <GroupList groups={groups} />
              {showAddExpenseForm && (
                <AddExpenseForm
                  onAddExpense={handleAddExpense}
                  onClose={() => setShowAddExpenseForm(false)}
                  groups={groups}
                  members={members}
                />
              )}
              <ExpenseList
                expenses={expenses}
                onDeleteExpense={handleDeleteExpense}
              />
              <MemberBalances members={memberBalances} />
              <ExpenseSplittingExplanation />
            </div>
          )}
          {activeTab === 'expenses' && (
            <Expenses
              expenses={expenses}
              onDeleteExpense={handleDeleteExpense}
            />
          )}

          {activeTab === 'groups' && (
            <Groups
              groups={groups}
              expenses={expenses}
            />
          )}

          {activeTab === 'members' && (
            <Members
              members={members}
              memberBalances={memberBalances}
              groups={groups}
              expenses={expenses}
            />
          )}

          {activeTab === 'settings' && (
            <Settings />
          )}

          {activeTab !== 'dashboard' && activeTab !== 'expenses' && activeTab !== 'groups' && activeTab !== 'members' && activeTab !== 'settings' && (
            <>
              <header className="page-header">
                <h1 className="page-title">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h1>
                <p className="page-subtitle">Welcome to SmartSplit</p>
              </header>
              <p className="placeholder-text">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content will be displayed here.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
