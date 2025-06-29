const axios = require('axios');

const sendSMS = async (phone, message) => {
  try {
    const res = await axios.get(
      `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/${phone}/${encodeURIComponent(
        message
      )}/${process.env.TWO_FACTOR_SENDER_ID}`
    );
    console.log('✅ SMS sent:', res.data);
  } catch (err) {
    console.error('❌ SMS Error:', err.message);
  }
};

module.exports = sendSMS;
