// =====================================================================
// models/Group.js — Group ka Mongoose Model
// =====================================================================
//
// Mongoose Model = MongoDB collection ka "blueprint"
//
// Database mein aik collection hogi jiska naam "groups" hoga.
// (Mongoose automatically plural kar deta hai: Group → groups)
//
// Har group document is schema ke mutabiq hoga.
// =====================================================================

import mongoose from 'mongoose';

// ---------------------------------------------------------------
// Group Schema — Group document ki structure define karta hai
// ---------------------------------------------------------------
const groupSchema = new mongoose.Schema(
  {
    // Group ka naam — required, aur extra spaces trim ho jayenge
    name: {
      type: String,
      required: [true, 'Group ka naam likhna zaruri hai'],
      trim: true,       // "  Friends  " → "Friends"
      maxlength: [100, 'Naam 100 characters se zyada nahi ho sakta']
    },

    // Group ka description — optional
    description: {
      type: String,
      trim: true,
      default: ''
    },

    // Group ke members ki list
    // Yeh ek array hai jis mein member objects hain
    // Abhi hum sirf naam store kar rahe hain (agle steps mein improve hoga)
    members: [
      {
        name: {
          type: String,
          required: true,
          trim: true
        }
      }
    ],

    // Group ka currency — abhi sirf PKR
    currency: {
      type: String,
      default: 'PKR'
    }
  },
  {
    // timestamps: true = MongoDB automatically createdAt aur updatedAt
    // fields add karta hai har document mein
    // Yeh useful hai ye track karne ke liye ke kab banaya/badla
    timestamps: true
  }
);

// ---------------------------------------------------------------
// Virtual Field: memberCount
// ---------------------------------------------------------------
// "Virtual" ka matlab: yeh database mein save nahi hota,
// sirf jab data padhte hain tab calculate hota hai.
// Hum manually har jagah members.length likhne se bach jaate hain.
// ---------------------------------------------------------------
groupSchema.virtual('memberCount').get(function () {
  return this.members.length;
});

// Virtual fields ko JSON mein include karo (by default nahi hoti)
groupSchema.set('toJSON', { virtuals: true });
groupSchema.set('toObject', { virtuals: true });

// ---------------------------------------------------------------
// Model Export
// ---------------------------------------------------------------
// mongoose.model('Group', groupSchema) ka matlab:
// - Pehla argument: Model ka naam (collection: "groups" ban jayega)
// - Doosra argument: Schema
// ---------------------------------------------------------------
const Group = mongoose.model('Group', groupSchema);

export default Group;
