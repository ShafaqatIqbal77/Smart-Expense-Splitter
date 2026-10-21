// =====================================================================
// controllers/expenseController.js
// =====================================================================
//
// Yeh controller expense se related sab operations handle karta hai.
//
// IMPORTANT — Equal Split Logic:
// Agar amount = PKR 1000 aur 3 members hain:
// 1000 / 3 = 333.333...
// Hum Math.round() ya toFixed(2) se 2 decimal tak rakhte hain.
// Lekin 333.33 * 3 = 999.99 — 1 paisa missing!
// Is liye hum pehle barabar divide karte hain, phir jo bacha
// woh pehle member ko dete hain. Yeh "penny adjustment" hai.
// =====================================================================

import Expense from '../models/Expense.js';
import Group from '../models/Group.js';

// ---------------------------------------------------------------
// Helper Function: Equal Split Calculate Karo
// ---------------------------------------------------------------
// amount: total expense (e.g., 1000)
// memberNames: members ki array (e.g., ['Ahmed', 'Ali', 'Sara'])
// Return: participants array jis mein har member ka share hai
// ---------------------------------------------------------------
const calculateEqualSplit = (amount, memberNames) => {
  const count = memberNames.length;
  if (count === 0) return [];

  // 2 decimal tak round karo
  const baseShare = Math.round((amount / count) * 100) / 100;
  
  // Total check: rounding ki wajah se jo farq ho
  const totalDistributed = baseShare * count;
  const remainder = Math.round((amount - totalDistributed) * 100) / 100;

  return memberNames.map((name, index) => ({
    memberName: name,
    // Pehle member ko bacha hua amount bhi dedo (penny adjustment)
    share: index === 0 ? baseShare + remainder : baseShare
  }));
};

// ---------------------------------------------------------------
// GET /api/expenses — Sab expenses lao
// ---------------------------------------------------------------
// Query params:
// ?group=GROUP_ID  → sirf us group ke expenses
// ?limit=10        → sirf 10 expenses
// ---------------------------------------------------------------
export const getAllExpenses = async (req, res) => {
  try {
    const { group, limit } = req.query;

    // Filter object — shuru mein khali
    const filter = {};
    
    // Agar group ID diya hai toh filter mein add karo
    if (group) {
      filter.group = group;
    }

    // Query banao
    let query = Expense.find(filter)
      .populate('group', 'name members') // group ki sirf name aur members fields
      .sort({ date: -1 });               // Newest first

    // Limit apply karo agar diya hai
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const expenses = await query;

    // Total calculate karo
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    res.status(200).json({
      success: true,
      count: expenses.length,
      totalAmount,
      data: expenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Expenses laane mein masla hua',
      error: error.message
    });
  }
};

// ---------------------------------------------------------------
// GET /api/expenses/:id — Ek expense ki detail
// ---------------------------------------------------------------
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('group', 'name members');

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Yeh expense nahi mili'
      });
    }

    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Expense dhundne mein masla hua',
      error: error.message
    });
  }
};

// ---------------------------------------------------------------
// POST /api/expenses — Naya expense add karo
// ---------------------------------------------------------------
// req.body = {
//   title, amount, group (Group ID), paidBy, date, splitMethod
// }
// ---------------------------------------------------------------
export const createExpense = async (req, res) => {
  try {
    const { title, amount, group, paidBy, date, splitMethod, notes } = req.body;

    // --- Server-side Validation ---
    // Client side bhi karta hai lekin server par bhi zaruri hai!
    // Koi seedha API call kar ke galat data bhej sakta hai.
    if (!title?.trim()) {
      return res.status(400).json({ success: false, message: 'Title zaruri hai' });
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Amount valid hona chahiye (zero se zyada)' });
    }
    if (!group) {
      return res.status(400).json({ success: false, message: 'Group ID zaruri hai' });
    }
    if (!paidBy?.trim()) {
      return res.status(400).json({ success: false, message: 'Paid by zaruri hai' });
    }

    // --- Group Verify Karo ---
    // Confirm karo ke yeh group ID actually exist karti hai
    const groupDoc = await Group.findById(group);
    if (!groupDoc) {
      return res.status(404).json({
        success: false,
        message: 'Diya hua Group ID nahi mila. Valid group ID bhejo.'
      });
    }

    // --- Split Calculate Karo ---
    // Group ke members ki list se participants banao
    const memberNames = groupDoc.members.map(m => m.name);
    let participants = [];

    if (splitMethod === 'equal' || !splitMethod) {
      if (memberNames.length > 0) {
        participants = calculateEqualSplit(Number(amount), memberNames);
      }
    }

    // --- Expense Save Karo ---
    const expense = await Expense.create({
      title: title.trim(),
      amount: Number(amount),
      group,
      paidBy: paidBy.trim(),
      date: date || new Date(),
      splitMethod: splitMethod || 'equal',
      participants,
      notes: notes?.trim() || ''
    });

    // Populate karo taake response mein group ka naam bhi aaye
    await expense.populate('group', 'name members');

    res.status(201).json({
      success: true,
      message: `"${expense.title}" expense successfully add ho gaya! PKR ${expense.amount.toLocaleString()}`,
      data: expense
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Group ID galat format mein hai' });
    }
    res.status(500).json({
      success: false,
      message: 'Expense add karne mein masla hua',
      error: error.message
    });
  }
};

// ---------------------------------------------------------------
// PUT /api/expenses/:id — Expense update karo
// ---------------------------------------------------------------
export const updateExpense = async (req, res) => {
  try {
    const { title, amount, group, paidBy, date, splitMethod, notes } = req.body;

    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Update karne ke liye expense nahi mili'
      });
    }

    // Agar amount ya group badla hai toh splits recalculate karo
    let participants = expense.participants;
    const newAmount = amount ? Number(amount) : expense.amount;
    const newGroup = group || expense.group;

    if (amount || group) {
      const groupDoc = await Group.findById(newGroup);
      if (groupDoc) {
        const memberNames = groupDoc.members.map(m => m.name);
        participants = calculateEqualSplit(newAmount, memberNames);
      }
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        title: title?.trim() || expense.title,
        amount: newAmount,
        group: newGroup,
        paidBy: paidBy?.trim() || expense.paidBy,
        date: date || expense.date,
        splitMethod: splitMethod || expense.splitMethod,
        participants,
        notes: notes?.trim() !== undefined ? notes.trim() : expense.notes
      },
      { new: true, runValidators: true }
    ).populate('group', 'name members');

    res.status(200).json({
      success: true,
      message: 'Expense update ho gayi!',
      data: updatedExpense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Expense update karne mein masla hua',
      error: error.message
    });
  }
};

// ---------------------------------------------------------------
// DELETE /api/expenses/:id — Expense delete karo
// ---------------------------------------------------------------
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Delete karne ke liye expense nahi mili'
      });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `"${expense.title}" expense delete ho gayi!`,
      deletedId: req.params.id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Expense delete karne mein masla hua',
      error: error.message
    });
  }
};

// ---------------------------------------------------------------
// GET /api/expenses/summary — Balance summary calculate karo
// ---------------------------------------------------------------
// Yeh endpoint calculate karta hai ke har member ne kitna pay kiya
// aur kitna unka share tha — difference hi unka balance hai
// ---------------------------------------------------------------
export const getExpenseSummary = async (req, res) => {
  try {
    const { group } = req.query;
    const filter = group ? { group } : {};

    const expenses = await Expense.find(filter).populate('group', 'name members');

    // Har member ka paid aur share track karo
    const memberStats = {};

    expenses.forEach(expense => {
      // Payer ne kitna pay kiya
      if (!memberStats[expense.paidBy]) {
        memberStats[expense.paidBy] = { paid: 0, share: 0 };
      }
      memberStats[expense.paidBy].paid += expense.amount;

      // Har participant ka share
      expense.participants.forEach(participant => {
        if (!memberStats[participant.memberName]) {
          memberStats[participant.memberName] = { paid: 0, share: 0 };
        }
        memberStats[participant.memberName].share += participant.share;
      });
    });

    // Balance = paid - share
    // Positive = unhe receive karna hai
    // Negative = unhein pay karna hai
    const balances = Object.entries(memberStats).map(([name, stats]) => ({
      memberName: name,
      totalPaid: Math.round(stats.paid * 100) / 100,
      totalShare: Math.round(stats.share * 100) / 100,
      balance: Math.round((stats.paid - stats.share) * 100) / 100
    }));

    res.status(200).json({
      success: true,
      data: balances
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Summary calculate karne mein masla hua',
      error: error.message
    });
  }
};
