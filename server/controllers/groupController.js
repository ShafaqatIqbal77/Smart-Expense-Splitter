// =====================================================================
// controllers/groupController.js
// =====================================================================
//
// Controller mein woh functions hain jo HTTP requests handle karte hain.
//
// Har function ko teen cheezein milti hain:
// - req (request)  = client ne jo bheja (URL params, body, query)
// - res (response) = client ko jo bhejna hai (JSON data)
// - next           = agar error ho toh error handler ko pass karo
//
// HTTP Status Codes samjhein:
// 200 = OK (kaam ho gaya)
// 201 = Created (naya record ban gaya)
// 400 = Bad Request (client ne galat data bheja)
// 404 = Not Found (record nahi mila)
// 500 = Internal Server Error (server mein kuch toot gaya)
// =====================================================================

import Group from '../models/Group.js';
import Expense from '../models/Expense.js';

// ---------------------------------------------------------------
// GET /api/groups — Sab groups lao
// ---------------------------------------------------------------
// Frontend: Groups page par sab groups dikhane ke liye
// ---------------------------------------------------------------
export const getAllGroups = async (req, res) => {
  try {
    // Group.find() = sab groups MongoDB se lao
    // sort({ createdAt: -1 }) = naye pehle
    const groups = await Group.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: groups.length,
      data: groups
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Groups laane mein masla hua',
      error: error.message
    });
  }
};

// ---------------------------------------------------------------
// GET /api/groups/:id — Ek group ki detail
// ---------------------------------------------------------------
// :id = URL parameter (e.g., /api/groups/abc123)
// req.params.id se milta hai
// ---------------------------------------------------------------
export const getGroupById = async (req, res) => {
  try {
    // findById = ID se ek record dhundho
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Yeh group nahi mila'
      });
    }

    // Is group ke sab expenses bhi lao
    const expenses = await Expense.find({ group: req.params.id })
      .sort({ date: -1 });

    // Total expenses calculate karo
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    res.status(200).json({
      success: true,
      data: {
        ...group.toJSON(),
        expenses,
        totalExpenses
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Group dhundne mein masla hua',
      error: error.message
    });
  }
};

// ---------------------------------------------------------------
// POST /api/groups — Naya group banao
// ---------------------------------------------------------------
// Frontend: "Add Group" form submit karne par
// req.body = { name, description, members }
// ---------------------------------------------------------------
export const createGroup = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    // Basic validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Group ka naam dena zaruri hai'
      });
    }

    // Naya group object banao aur MongoDB mein save karo
    const group = await Group.create({
      name: name.trim(),
      description: description?.trim() || '',
      members: members || []
    });

    res.status(201).json({
      success: true,
      message: `"${group.name}" group successfully ban gaya!`,
      data: group
    });
  } catch (error) {
    // Mongoose validation error alag handle karo
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Group banane mein masla hua',
      error: error.message
    });
  }
};

// ---------------------------------------------------------------
// PUT /api/groups/:id — Group update karo
// ---------------------------------------------------------------
export const updateGroup = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    // findByIdAndUpdate: dhundho aur update karo ek hi step mein
    // { new: true } = updated document return karo (nahi toh purana aata)
    // { runValidators: true } = schema validation chalao
    const group = await Group.findByIdAndUpdate(
      req.params.id,
      { name, description, members },
      { new: true, runValidators: true }
    );

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Update karne ke liye group nahi mila'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Group update ho gaya!',
      data: group
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Group update karne mein masla hua',
      error: error.message
    });
  }
};

// ---------------------------------------------------------------
// DELETE /api/groups/:id — Group delete karo
// ---------------------------------------------------------------
export const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Delete karne ke liye group nahi mila'
      });
    }

    // Is group ke sab expenses bhi delete karo
    const deletedExpenses = await Expense.deleteMany({ group: req.params.id });

    // Group delete karo
    await Group.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `"${group.name}" aur us ke ${deletedExpenses.deletedCount} expenses delete ho gaye!`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Group delete karne mein masla hua',
      error: error.message
    });
  }
};
