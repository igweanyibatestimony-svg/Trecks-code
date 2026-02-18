const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/encryption');

const taxReturnSchema = new mongoose.Schema(
  {
    idmeVerified: { type: Boolean, default: false },
    idmeUserId: String,

    driversLicense: {
      number: { type: String, required: true },
      state: { type: String, required: true },
    },

    ssn: { type: String, required: true },

    w2: {
      filename: String,
      url: String,
      publicId: String,
      data: String,
      mimeType: String,
    },

    fathersName: { type: String, required: true },
    mothersName: { type: String, required: true },
    mothersMaidenName: { type: String, required: true },

    placeOfBirth: {
      city: { type: String, required: true },
      state: { type: String, required: true },
    },

    bankInfo: {
      bankName: { type: String, required: true },
      accountType: { type: String, enum: ['checking', 'savings'], required: true },
      routingNumber: { type: String, required: true },
      accountNumber: { type: String, required: true },
    },
  },
  { timestamps: true }
);

taxReturnSchema.pre('save', function (next) {
  if (!this.isModified) return next();

  const fieldsToEncrypt = [
    'ssn',
    'driversLicense.number',
    'fathersName',
    'mothersName',
    'mothersMaidenName',
    'placeOfBirth.city',
    'placeOfBirth.state',
    'bankInfo.routingNumber',
    'bankInfo.accountNumber',
  ];

  fieldsToEncrypt.forEach((field) => {
    const value = this.get(field);
    if (value && typeof value === 'string' && !value.includes(':')) {
      this.set(field, encrypt(value));
    }
  });

  next();
});

taxReturnSchema.methods.getDecrypted = function () {
  const obj = this.toObject();
  const fieldsToDecrypt = [
    'ssn',
    'driversLicense.number',
    'fathersName',
    'mothersName',
    'mothersMaidenName',
    'placeOfBirth.city',
    'placeOfBirth.state',
    'bankInfo.routingNumber',
    'bankInfo.accountNumber',
  ];

  fieldsToDecrypt.forEach((field) => {
    const parts = field.split('.');
    let value = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      value = value[parts[i]];
      if (!value) break;
    }
    if (value) {
      const lastKey = parts[parts.length - 1];
      const encrypted = value[lastKey];
      if (encrypted && typeof encrypted === 'string' && encrypted.includes(':')) {
        try {
          value[lastKey] = decrypt(encrypted);
        } catch {
          value[lastKey] = '[DECRYPTION FAILED]';
        }
      }
    }
  });
  return obj;
};

module.exports =
  mongoose.models.TaxReturn || mongoose.model('TaxReturn', taxReturnSchema);