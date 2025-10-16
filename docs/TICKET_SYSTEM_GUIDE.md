# 🎫 Ticket Generation & Email System - Complete Guide

## 📋 Overview

Professional ticket generation and email distribution system for SPSU Convocation 2025. Generates beautiful PDF tickets with QR codes for all 556 students and emails them automatically.

---

## 🚀 Quick Start

### Step 1: Install Required Packages

```bash
npm install
```

This will install:
- `pdfkit` - PDF generation
- `qrcode` - QR code generation
- `nodemailer` - Email sending
- All required TypeScript types

### Step 2: Generate Tickets

```bash
npm run generate-tickets
```

This will create 556 PDF tickets in the `tickets/` folder.

### Step 3: Setup Email Configuration

1. Copy the email template:
   ```bash
   copy scripts\emailConfig.template.js scripts\emailConfig.js
   ```

2. Edit `scripts/emailConfig.js` with your SMTP details (see guide below)

### Step 4: Send Tickets via Email

```bash
npm run send-tickets
```

Or run both steps together:
```bash
npm run tickets-full-process
```

---

## 📧 Email Configuration Guide

### For Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication** in your Google Account

2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the generated 16-character password

3. **Update emailConfig.js**:
   ```javascript
   smtp: {
     host: 'smtp.gmail.com',
     port: 587,
     secure: false,
     auth: {
       user: 'your-email@gmail.com',
       pass: 'your-16-char-app-password'  // Without spaces
     }
   }
   ```

### For Other Email Services

**Outlook/Hotmail:**
```javascript
smtp: {
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@outlook.com',
    pass: 'your-password'
  }
}
```

**Yahoo:**
```javascript
smtp: {
  host: 'smtp.mail.yahoo.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@yahoo.com',
    pass: 'your-app-password'  // Generate from Yahoo account security
  }
}
```

**Office 365:**
```javascript
smtp: {
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@yourdomain.com',
    pass: 'your-password'
  }
}
```

---

## 🎨 Ticket Features

### Each ticket includes:

✅ **University Header** - Professional branding  
✅ **Student Information** - Name, email, phone, category  
✅ **Seat Details** - Large, prominent seat number  
✅ **QR Code** - For quick verification at entry  
✅ **Event Details** - Date, time, venue  
✅ **Important Instructions** - Entry guidelines  
✅ **Unique Ticket ID** - SPSU-CONV-2025-{userId}  

### Design Highlights:

- **Size**: 600x800px (easy to view on mobile)
- **Colors**: University brand colors (Blue, Red, Orange)
- **QR Code**: Contains ticket ID, name, seat, category
- **Professional Layout**: Clean, easy to read

---

## 📊 What Gets Generated

### 1. Ticket Files (`tickets/` folder)

```
tickets/
├── ticket_D1_1.pdf          # Degree student tickets
├── ticket_D2_2.pdf
├── ...
├── ticket_1_176.pdf         # College student tickets
├── ticket_2_177.pdf
├── ...
└── ticket_381_556.pdf
```

**Total**: 556 PDF files

### 2. Summary Files

- `generation_summary.json` - Ticket generation stats
- `email_summary.json` - Email sending stats
- `email_errors.json` - Failed email details (if any)

---

## 📧 Email Features

### Professional Email Template:

✅ **HTML Email** - Beautiful, responsive design  
✅ **Plain Text Version** - For email clients that don't support HTML  
✅ **PDF Attachment** - Ticket attached automatically  
✅ **Personalized** - Each email customized with student details  

### Email Content:

- Congratulations message
- Event details (date, time, venue)
- Seat assignment
- Important instructions
- Contact information
- Ticket ID for reference

### Sending Configuration:

- **Batch Size**: 10 emails at a time (configurable)
- **Delay Between Batches**: 2 seconds (prevents spam detection)
- **Test Mode**: Send to test emails first
- **Error Handling**: Logs all failures with details

---

## 🧪 Testing Before Full Send

### Enable Test Mode:

In `emailConfig.js`:
```javascript
testMode: true,
testEmails: ['your-test-email@example.com']
```

This will:
- Send only to your test email(s)
- Send only first 5 tickets
- Allow you to verify email format and attachments

### Disable Test Mode for Production:

```javascript
testMode: false
```

---

## 📊 Statistics

### Tickets to Generate:

| Category | Count | Seat Range |
|----------|-------|------------|
| Degree Students | 175 | D1 - D175 |
| College Students | 381 | 1 - 381 |
| **TOTAL** | **556** | - |

### Estimated Time:

- **Ticket Generation**: ~5-10 minutes (556 PDFs)
- **Email Sending**: ~15-20 minutes (with batching)
- **Total Process**: ~25-30 minutes

---

## 🛠️ Troubleshooting

### Issue: "SMTP Authentication Failed"

**Solution**: 
- Check username/password
- For Gmail, use App Password, not regular password
- Verify 2FA is enabled for Gmail

### Issue: "Tickets not found"

**Solution**:
- Run `npm run generate-tickets` first
- Check that `tickets/` folder contains PDF files

### Issue: "Too many emails, rate limited"

**Solution**:
- Increase `delayBetweenBatches` in emailConfig.js
- Decrease `batchSize`
- Use a professional email service (SendGrid, AWS SES)

### Issue: "Emails going to spam"

**Solution**:
- Add SPF and DKIM records to your domain
- Use a professional email service
- Warm up your sending domain gradually

---

## 📋 Step-by-Step Execution

### Complete Process:

```bash
# 1. Install dependencies
npm install

# 2. Generate all tickets
npm run generate-tickets

# 3. Setup email config
copy scripts\emailConfig.template.js scripts\emailConfig.js
# Edit emailConfig.js with your SMTP details

# 4. Test with a few emails (set testMode: true)
npm run send-tickets

# 5. Send to all students (set testMode: false)
npm run send-tickets
```

---

## 🔒 Security Notes

1. **Never commit emailConfig.js** - Add to .gitignore
2. **Use App Passwords** - Not your regular email password
3. **Rotate Passwords** - Change after campaign
4. **Monitor Sending** - Check for suspicious activity

---

## 📁 File Structure

```
react-amphitheater-admin/
├── scripts/
│   ├── generateTickets.js           # PDF generation
│   ├── sendTicketEmails.js          # Email sending
│   ├── emailConfig.template.js      # Email config template
│   └── emailConfig.js               # Your config (git-ignored)
├── tickets/                         # Generated PDFs
│   ├── ticket_*.pdf                 # 556 ticket files
│   ├── generation_summary.json      # Generation stats
│   ├── email_summary.json           # Email stats
│   └── email_errors.json            # Error log
├── data/
│   ├── booked_seats.csv             # Source data
│   └── users.csv                    # User data
└── package.json                     # NPM scripts
```

---

## ✅ Verification Checklist

Before sending to all students:

- [ ] Generated all 556 tickets successfully
- [ ] Tickets look correct (open a few PDFs to verify)
- [ ] QR codes are readable
- [ ] Email config is correct
- [ ] Tested with test email (testMode: true)
- [ ] Email received with correct attachment
- [ ] PDF opens correctly on mobile
- [ ] Ready to send to all (testMode: false)

---

## 📞 Support

For issues or questions:
- Check this guide first
- Review error logs in `tickets/email_errors.json`
- Verify SMTP settings in emailConfig.js
- Test with a single email first

---

## 🎉 Success Indicators

You'll know it's working when:

✅ Console shows "✓ Generated X/556 tickets..."  
✅ `tickets/` folder contains 556 PDF files  
✅ Console shows "✓ SMTP connection verified"  
✅ Console shows "✓ Sent to: [Name] ([Email])"  
✅ Recipients receive emails with PDF attachments  
✅ QR codes scan correctly  

---

## 📊 Expected Output

### During Ticket Generation:
```
🎫 CONVOCATION TICKET GENERATOR
════════════════════════════════════════════════════════════════

📊 Total tickets to generate: 556
   - Degree Students: 175
   - College Students: 381

🎨 Generating tickets...

   ✓ Generated 50/556 tickets...
   ✓ Generated 100/556 tickets...
   ...
   ✓ Generated 556/556 tickets...

✅ TICKET GENERATION COMPLETE!

   ✓ Successfully generated: 556 tickets
   ✗ Errors: 0

📁 Tickets saved in: D:\react-amphitheater-admin\tickets
```

### During Email Sending:
```
📧 CONVOCATION TICKET EMAIL SENDER
════════════════════════════════════════════════════════════════

📊 Total emails to send: 556
   - Degree Students: 175
   - College Students: 381

✅ SMTP connection verified successfully!

📤 Starting email delivery...

   ✓ [1/556] Sent to: Kiran Raj (23mcs00204@example.com)
   ✓ [2/556] Sent to: Ajay Singh kumawat (23mce00217@example.com)
   ...

✅ EMAIL SENDING COMPLETE!

   ✓ Successfully sent: 556 emails
   ✗ Errors: 0
```

---

**🎓 System ready to send 556 professional tickets to all convocation attendees!**
