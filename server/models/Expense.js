// =====================================================================
// models/Expense.js — Expense ka Mongoose Model
// =====================================================================
//
// Yeh model frontend ke AddExpenseForm se seedha match karta hai:
// title, amount, paidBy, group, date, splitMethod
//
// Is mein hum group ka reference (ObjectId) store karte hain
// na ke sirf naam. Isse hum baad mein "populate" kar sakte hain
// matlab expense ke saath poori group ki info aa jati hai.
// =====================================================================

import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    // -----------------------------------------------
    // Expense ka Title
    // -----------------------------------------------
    title: {
      type: String,
      required: [true, 'Expense ka title likhna zaruri hai'],
      trim: true,
      maxlength: [200, 'Title 200 characters se zyada nahi ho sakta']
    },

    // -----------------------------------------------
    // Amount — number hona chahiye, zero se zyada
    // -----------------------------------------------
    amount: {
      type: Number,
      required: [true, 'Amount likhna zaruri hai'],
      min: [0.01, 'Amount zero se zyada hona chahiye']
    },

    // -----------------------------------------------
    // Group Reference
    // -----------------------------------------------
    // mongoose.Schema.Types.ObjectId = MongoDB ka unique ID type
    // ref: 'Group' = yeh Group model se linked hai
    // Isse hum later expense.populate('group') likh sakte hain
    // aur poori group object milti hai sirf ID ki jagah
    // -----------------------------------------------
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: [true, 'Group select karna zaruri hai']
    },

    // -----------------------------------------------
    // Payer (Kisne pay kiya)
    // -----------------------------------------------
    // Abhi hum sirf naam store kar rahe hain.
    // Group ke members array mein se aana chahiye.
    // -----------------------------------------------
    paidBy: {
      type: String,
      required: [true, 'Paid by field zaruri hai'],
      trim: true
    },

    // -----------------------------------------------
    // Date — kab ka expense hai
    // -----------------------------------------------
    date: {
      type: Date,
      required: [true, 'Tarikh likhna zaruri hai'],
      default: Date.now  // Agar nahi diya toh aaj ki date
    },

    // -----------------------------------------------
    // Split Method — kitne tarike se baanta jaaye
    // -----------------------------------------------
    // enum: matlab sirf yeh values allowed hain
    // Baad mein 'percentage', 'exact' aur add kar sakte hain
    splitMethod: {
      type: String,
      enum: {
        values: ['equal'],
        message: 'Abhi sirf equal split available hai'
      },
      default: 'equal'
    },

    // -----------------------------------------------
    // Participants — Kaun kaun is expense mein hai
    // -----------------------------------------------
    // Agar empty rakha toh hum group ke sab members
    // ko participants maan lenge (server side handle hoga)
    participants: [
      {
        memberName: {
          type: String,
          required: true
        },
        share: {
          type: Number,
          default: 0  // Server calculate karega
        }
      }
    ],

    // -----------------------------------------------
    // Notes — Optional extra info
    // -----------------------------------------------
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true  // createdAt, updatedAt auto milenge
  }
);

// ---------------------------------------------------------------
// Index — Group ke hisaab se expenses dhundhna fast karta hai
// ---------------------------------------------------------------
// Jab hum GET /api/expenses?group=xyz likhein, yeh index
// us query ko bahut tezi se chalaata hai
expenseSchema.index({ group: 1 });
expenseSchema.index({ date: -1 }); // Date ke hisaab se sort (newest first)

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
