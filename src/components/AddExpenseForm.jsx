import React, { useState } from 'react';
import './AddExpenseForm.css';

// =====================================================================
// AddExpenseForm Component
// =====================================================================
// Yeh ek "controlled form" component hai.
// "Controlled" ka matlab: har input field ki value React state mein
// stored hai, seedha DOM mein nahi. Isliye hum hamesha React se poochh
// sakte hain ke form mein abhi kya likha hua hai.
//
// Props (parent se aane wala data):
// - onAddExpense: ek function jo parent (App.jsx) ne bheja hai.
//   Jab form submit hoga, ham yeh function call kar ke naya expense
//   parent tak bhejenge. (Child -> Parent communication)
// - onClose: ek function jo form band karta hai (cancel ke liye)
// - groups: groups ki list (select dropdown ke liye)
// - members: members ki list (select dropdown ke liye)
// =====================================================================

function AddExpenseForm({ onAddExpense, onClose, groups, members }) {

  // -------------------------------------------------------
  // STATE 1: formData
  // -------------------------------------------------------
  // Yeh ek object hai jis mein sab form fields ki values hain.
  // Ek hi useState mein sab fields isliye rakhe hain taake code
  // clean rahe aur ek jagah se manage ho sake.
  // -------------------------------------------------------
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    paidBy: '',
    group: '',
    date: new Date().toISOString().split('T')[0], // aaj ki date default
    splitMethod: 'equal'
  });

  // -------------------------------------------------------
  // STATE 2: errors
  // -------------------------------------------------------
  // Yeh object validation errors store karta hai.
  // Misaal: { title: 'Title likhna zaruri hai', amount: '' }
  // Agar kisi field ka error empty string hai, matlab woh valid hai.
  // -------------------------------------------------------
  const [errors, setErrors] = useState({});

  // -------------------------------------------------------
  // STATE 3: successMessage
  // -------------------------------------------------------
  // Jab expense successfully add ho jaye, yeh message show hoga.
  // -------------------------------------------------------
  const [successMessage, setSuccessMessage] = useState('');

  // -------------------------------------------------------
  // handleChange Function
  // -------------------------------------------------------
  // Yeh function tab chalta hai jab koi bhi input field mein
  // kuch type karta hai ya select karta hai.
  //
  // e.target.name  = field ka name attribute (e.g., "title")
  // e.target.value = jo user ne type kiya (e.g., "Dinner")
  //
  // [name]: value  = computed property name — yeh JavaScript
  // ki ek shortcut hai. Agar name = "title" toh yeh likhne
  // ke barabar hai: { title: value }
  // -------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Pehle wali saari values rakh, sirf jo badli woh update karo
    setFormData({
      ...formData,
      [name]: value
    });

    // Jab user type karna shuru kare, us field ka error hatao
    // Taake user ko feel ho ke unka input accept ho raha hai
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // -------------------------------------------------------
  // validateForm Function
  // -------------------------------------------------------
  // Yeh function form submit se pehle sab fields check karta hai.
  // Agar koi field galat hai, us ka error message set karta hai.
  // Return karta hai: true (sab theek) ya false (kuch galat hai)
  // -------------------------------------------------------
  const validateForm = () => {
    const newErrors = {};

    // Title check: empty ya sirf spaces nahi hona chahiye
    if (!formData.title.trim()) {
      newErrors.title = '⚠ Expense ka title likhna zaruri hai';
    }

    // Amount check: number hona chahiye aur zero se zyada
    const amountValue = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amountValue) || amountValue <= 0) {
      newErrors.amount = '⚠ Amount ek valid number hona chahiye jo zero se zyada ho';
    }

    // PaidBy check: koi member select hona chahiye
    if (!formData.paidBy) {
      newErrors.paidBy = '⚠ Konsa member ne pay kiya yeh batana zaruri hai';
    }

    // Group check: koi group select hona chahiye
    if (!formData.group) {
      newErrors.group = '⚠ Koi ek group select karna zaruri hai';
    }

    // Date check: date empty nahi honi chahiye
    if (!formData.date) {
      newErrors.date = '⚠ Tarikh likhna zaruri hai';
    }

    // Saare errors ek baar mein set karo (performance ke liye)
    setErrors(newErrors);

    // Agar newErrors object khali hai matlab sab valid hai
    return Object.keys(newErrors).length === 0;
  };

  // -------------------------------------------------------
  // handleSubmit Function
  // -------------------------------------------------------
  // Yeh form submit hone par chalta hai.
  // e.preventDefault() — browser ka default behavior rok deta hai
  // (warna page refresh ho jata aur data gayab ho jata!)
  // -------------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault(); // Page ko refresh hone se roko!

    // Pehle validate karo, agar sab theek toh aage badho
    if (validateForm()) {

      // Naya expense object banao
      // Date.now() ek unique number deta hai (milliseconds since 1970)
      // Yeh hum unique ID ke tor par use kar rahe hain
      const newExpense = {
        id: Date.now(),
        title: formData.title.trim(),
        amount: parseFloat(formData.amount), // string ko number banao
        paidBy: formData.paidBy,
        group: formData.group,
        date: formData.date,
        splitMethod: formData.splitMethod
      };

      // Parent (App.jsx) ko naya expense bhejo via callback prop
      // Yahi hai Child-to-Parent communication!
      onAddExpense(newExpense);

      // Success message dikhao
      setSuccessMessage(`✅ "${formData.title}" ka expense successfully add ho gaya!`);

      // Form reset karo taake dubara use kar saken
      setFormData({
        title: '',
        amount: '',
        paidBy: '',
        group: '',
        date: new Date().toISOString().split('T')[0],
        splitMethod: 'equal'
      });

      // 2.5 second baad success message hatao
      setTimeout(() => {
        setSuccessMessage('');
      }, 2500);
    }
  };

  // -------------------------------------------------------
  // JSX (User Interface)
  // -------------------------------------------------------
  return (
    <div className="add-expense-overlay">
      <div className="add-expense-form">

        {/* Form Header */}
        <div className="form-header">
          <h2 className="form-title">💸 Naya Expense Add Karen</h2>
          {/* Cancel button — onClose prop call karta hai jo App.jsx mein form hide karta hai */}
          <button
            type="button"
            className="form-close-btn"
            onClick={onClose}
            title="Form band karo"
            aria-label="Form band karo"
          >
            ✕
          </button>
        </div>

        {/* Success Message — sirf tab dikhega jab successMessage state empty nahi hogi */}
        {successMessage && (
          <div className="success-message" role="alert">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* ----- Expense Title Field ----- */}
          {/* htmlFor="title" aur id="title" — yeh accessibility ke liye hain */}
          {/* Label click karne se input focus ho jata hai */}
          <div className="form-group">
            <label htmlFor="title">Expense Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Misaal: Dinner at Restaurant"
              className={errors.title ? 'error' : ''}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {/* Conditional rendering: sirf tab dikhe jab error ho */}
            {errors.title && (
              <span className="error-message" id="title-error" role="alert">
                {errors.title}
              </span>
            )}
          </div>

          {/* ----- Amount Field ----- */}
          <div className="form-group">
            <label htmlFor="amount">Amount (PKR) *</label>
            <div className="input-with-prefix">
              <span className="input-prefix">PKR</span>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                className={errors.amount ? 'error' : ''}
                aria-describedby={errors.amount ? 'amount-error' : undefined}
              />
            </div>
            {errors.amount && (
              <span className="error-message" id="amount-error" role="alert">
                {errors.amount}
              </span>
            )}
          </div>

          {/* ----- Two Column Row: Paid By + Group ----- */}
          <div className="form-row">

            {/* Paid By Dropdown */}
            <div className="form-group">
              <label htmlFor="paidBy">Paid By *</label>
              <select
                id="paidBy"
                name="paidBy"
                value={formData.paidBy}
                onChange={handleChange}
                className={errors.paidBy ? 'error' : ''}
                aria-describedby={errors.paidBy ? 'paidby-error' : undefined}
              >
                <option value="">-- Member chunen --</option>
                {/* members array ko map kar ke har member ka option banao */}
                {members.map((member) => (
                  <option key={member.id} value={member.name}>
                    {member.name}
                  </option>
                ))}
              </select>
              {errors.paidBy && (
                <span className="error-message" id="paidby-error" role="alert">
                  {errors.paidBy}
                </span>
              )}
            </div>

            {/* Group Dropdown */}
            <div className="form-group">
              <label htmlFor="group">Group *</label>
              <select
                id="group"
                name="group"
                value={formData.group}
                onChange={handleChange}
                className={errors.group ? 'error' : ''}
                aria-describedby={errors.group ? 'group-error' : undefined}
              >
                <option value="">-- Group chunen --</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.name}>
                    {group.name}
                  </option>
                ))}
              </select>
              {errors.group && (
                <span className="error-message" id="group-error" role="alert">
                  {errors.group}
                </span>
              )}
            </div>

          </div>

          {/* ----- Two Column Row: Date + Split Method ----- */}
          <div className="form-row">

            {/* Date Field */}
            <div className="form-group">
              <label htmlFor="date">Tarikh *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={errors.date ? 'error' : ''}
                aria-describedby={errors.date ? 'date-error' : undefined}
              />
              {errors.date && (
                <span className="error-message" id="date-error" role="alert">
                  {errors.date}
                </span>
              )}
            </div>

            {/* Split Method Dropdown */}
            <div className="form-group">
              <label htmlFor="splitMethod">Split Method</label>
              <select
                id="splitMethod"
                name="splitMethod"
                value={formData.splitMethod}
                onChange={handleChange}
              >
                <option value="equal">Barabar (Equal Split)</option>
                {/* Future steps mein aur options aayenge */}
              </select>
              <span className="field-hint">💡 Abhi sirf Equal Split available hai</span>
            </div>

          </div>

          {/* ----- Action Buttons ----- */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              ✕ Cancel
            </button>
            <button type="submit" className="submit-btn">
              ✚ Expense Add Karen
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddExpenseForm;
