// Email Configuration Template
// Copy this file to emailConfig.js and fill in your SMTP details

module.exports = {
  // SMTP Server Configuration
  smtp: {
    host: "smtp.gmail.com", // e.g., 'smtp.gmail.com' for Gmail
    port: 587, // Usually 587 for TLS or 465 for SSL
    secure: false, // true for 465, false for other ports
    auth: {
      user: "your-email@domain.com", // Your email address
      pass: "your-app-password", // Your email password or app-specific password
    },
  },

  // Email Template Configuration
  from: {
    name: "SPSU Convocation Committee",
    email: "convocation@spsu.ac.in",
  },

  // Email Subject and Content
  subject: "Your SPSU Convocation 2025 Entry Ticket",

  // Batch sending configuration
  batchSize: 10, // Number of emails to send at once
  delayBetweenBatches: 2000, // Delay in milliseconds between batches

  // Test mode - set to true to send only to test emails
  testMode: false,
  testEmails: ["test@example.com"],
};

/*
SETUP INSTRUCTIONS:

1. For Gmail:
   - Enable 2-Factor Authentication
   - Generate an App Password: https://myaccount.google.com/apppasswords
   - Use the app password in the 'pass' field above

2. For Other Email Services:
   - Outlook/Hotmail: host: 'smtp-mail.outlook.com', port: 587
   - Yahoo: host: 'smtp.mail.yahoo.com', port: 587
   - Office365: host: 'smtp.office365.com', port: 587

3. Rename this file to 'emailConfig.js' and update the values

4. IMPORTANT: Add 'emailConfig.js' to .gitignore to keep credentials safe
*/
