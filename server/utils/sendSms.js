const axios = require('axios');

const sendSMS = async (phone, amount, category, status) => {
  try {
    const response = await axios.post(
      `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/ADDON_SERVICES/SEND/TSMS`,
      {
        From: process.env.TWO_FACTOR_SENDER_ID,
        To: phone.replace('+91', ''), // 2Factor expects 10-digit mobile number
        TemplateName: process.env.TWO_FACTOR_TEMPLATE_NAME,
        VAR1: amount,
        VAR2: category,
        VAR3: status
      }
    );

    if (response.data && response.data.Status === 'Success') {
      console.log('✅ SMS sent:', response.data);
      return { Status: 'Success', Details: 'Message sent successfully' };
    } else {
      console.error('❌ SMS Error:', response.data);
      return { Status: 'Error', Details: response.data.Details || 'Failed to send' };
    }

  } catch (error) {
    console.error('❌ SMS Send Failed:', error.response?.data || error.message);
    return {
      Status: 'Error',
      Details: error.response?.data?.Details || error.message || 'Unknown error'
    };
  }
};

module.exports = sendSMS;
