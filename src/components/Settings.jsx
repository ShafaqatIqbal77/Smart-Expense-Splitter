import React, { useState } from 'react';
import { User, Bell, DollarSign, Palette, Shield, LogOut, ChevronRight, ToggleRight, ToggleLeft } from 'lucide-react';
import './Settings.css';

function Settings() {
  const [settings, setSettings] = useState({
    // Profile settings
    name: 'Ahmed',
    email: 'ahmed@example.com',
    phone: '+92 300 1234567',
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: false,
    expenseReminders: true,
    
    // Currency settings
    currency: 'PKR',
    
    // Theme settings
    darkMode: false,
    
    // Account settings
    twoFactorAuth: false,
  });

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCurrencyChange = (e) => {
    setSettings(prev => ({
      ...prev,
      currency: e.target.value
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and preferences</p>
      </div>

      <div className="settings-grid">
        {/* Profile Section */}
        <div className="settings-section">
          <div className="section-header">
            <User className="section-icon" size={24} />
            <h2 className="section-title">Profile</h2>
          </div>
          <div className="settings-content">
            <div className="setting-item">
              <label className="setting-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={settings.name}
                onChange={handleInputChange}
                className="setting-input"
              />
            </div>
            <div className="setting-item">
              <label className="setting-label">Email</label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleInputChange}
                className="setting-input"
              />
            </div>
            <div className="setting-item">
              <label className="setting-label">Phone</label>
              <input
                type="tel"
                name="phone"
                value={settings.phone}
                onChange={handleInputChange}
                className="setting-input"
              />
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="settings-section">
          <div className="section-header">
            <Bell className="section-icon" size={24} />
            <h2 className="section-title">Notifications</h2>
          </div>
          <div className="settings-content">
            <div className="setting-item toggle">
              <div className="toggle-info">
                <span className="setting-label">Email Notifications</span>
                <span className="setting-description">Receive email updates for expenses</span>
              </div>
              <button
                className={`toggle-btn ${settings.emailNotifications ? 'active' : ''}`}
                onClick={() => handleToggle('emailNotifications')}
              >
                {settings.emailNotifications ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              </button>
            </div>
            <div className="setting-item toggle">
              <div className="toggle-info">
                <span className="setting-label">Push Notifications</span>
                <span className="setting-description">Receive push notifications</span>
              </div>
              <button
                className={`toggle-btn ${settings.pushNotifications ? 'active' : ''}`}
                onClick={() => handleToggle('pushNotifications')}
              >
                {settings.pushNotifications ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              </button>
            </div>
            <div className="setting-item toggle">
              <div className="toggle-info">
                <span className="setting-label">Expense Reminders</span>
                <span className="setting-description">Get reminded about pending expenses</span>
              </div>
              <button
                className={`toggle-btn ${settings.expenseReminders ? 'active' : ''}`}
                onClick={() => handleToggle('expenseReminders')}
              >
                {settings.expenseReminders ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Currency Section */}
        <div className="settings-section">
          <div className="section-header">
            <DollarSign className="section-icon" size={24} />
            <h2 className="section-title">Currency</h2>
          </div>
          <div className="settings-content">
            <div className="setting-item">
              <label className="setting-label">Default Currency</label>
              <select
                value={settings.currency}
                onChange={handleCurrencyChange}
                className="setting-select"
              >
                <option value="PKR">PKR - Pakistani Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="INR">INR - Indian Rupee</option>
              </select>
            </div>
          </div>
        </div>

        {/* Theme Section */}
        <div className="settings-section">
          <div className="section-header">
            <Palette className="section-icon" size={24} />
            <h2 className="section-title">Appearance</h2>
          </div>
          <div className="settings-content">
            <div className="setting-item toggle">
              <div className="toggle-info">
                <span className="setting-label">Dark Mode</span>
                <span className="setting-description">Switch to dark theme</span>
              </div>
              <button
                className={`toggle-btn ${settings.darkMode ? 'active' : ''}`}
                onClick={() => handleToggle('darkMode')}
              >
                {settings.darkMode ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="settings-section">
          <div className="section-header">
            <Shield className="section-icon" size={24} />
            <h2 className="section-title">Security</h2>
          </div>
          <div className="settings-content">
            <div className="setting-item toggle">
              <div className="toggle-info">
                <span className="setting-label">Two-Factor Authentication</span>
                <span className="setting-description">Add extra security to your account</span>
              </div>
              <button
                className={`toggle-btn ${settings.twoFactorAuth ? 'active' : ''}`}
                onClick={() => handleToggle('twoFactorAuth')}
              >
                {settings.twoFactorAuth ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              </button>
            </div>
            <div className="setting-item">
              <button className="action-btn">
                Change Password
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <div className="settings-section danger">
          <div className="settings-content">
            <button className="logout-btn">
              <LogOut size={20} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
