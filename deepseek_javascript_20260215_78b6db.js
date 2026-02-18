import React from 'react';
import { Link } from 'react-router-dom';

const ThankYou = () => {
  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center' }}>
        <img src="/logo.png" alt="Company Logo" className="logo" />
        <h2>Thank You!</h2>
        <p style={{ fontSize: '1.2rem', margin: '2rem 0' }}>
          Your tax return has been submitted successfully.
        </p>
        <Link
          to="/"
          className="btn-primary"
          style={{ textDecoration: 'none', display: 'inline-block', width: 'auto', padding: '0.8rem 2rem' }}
        >
          Submit Another
        </Link>
        <div className="privacy-link" style={{ marginTop: '2rem' }}>
          <a href="/privacy.html">Privacy Policy</a>
        </div>
      </div>
      <div className="footer">
        © 2025 SecureTax. All rights reserved. | Contact: support@example.com
      </div>
    </div>
  );
};

export default ThankYou;