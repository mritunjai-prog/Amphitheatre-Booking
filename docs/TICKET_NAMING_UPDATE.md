# Ticket Naming Convention Update

**Date**: October 16, 2025  
**Status**: ✅ Complete

---

## 🎫 Changes Implemented

### 1. **New Ticket Naming Convention**

Tickets are now named based on category prefix + seat number:

| Category             | Prefix | Example Filename | Description                            |
| -------------------- | ------ | ---------------- | -------------------------------------- |
| **Degree Students**  | `D`    | `ticket_D1.pdf`  | Degree-awarding students (175 tickets) |
| **College Students** | `C`    | `ticket_C1.pdf`  | Other college students (381 tickets)   |
| **Faculty**          | `F`    | `ticket_F1.pdf`  | Teaching staff (future)                |
| **VIP**              | `V`    | `ticket_V1.pdf`  | VIP guests (future)                    |
| **Guests**           | `G`    | `ticket_G1.pdf`  | External guests (future)               |
| **Parents**          | `P`    | `ticket_P1.pdf`  | Student parents (future)               |

#### Previous Naming Convention (Deprecated)

- Old format: `ticket_D1_123.pdf` (included user ID)
- New format: `ticket_D1.pdf` (clean and simple)

---

### 2. **Email Field Removed for Degree Students**

**Reason**: Privacy and security for degree-awarding students

#### Ticket Layout Changes:

**Degree Student Tickets:**

- ✅ Guest Name
- ❌ Email (REMOVED)
- ✅ Contact (Phone)
- ✅ Category
- ✅ Notes

**College Student Tickets:**

- ✅ Guest Name
- ✅ Email (RETAINED)
- ✅ Contact (Phone)
- ✅ Category
- ✅ Notes

**Other Category Tickets (Future):**

- ✅ All fields retained (including email)

---

## 📊 Summary Statistics

### Tickets Generated

| Category         | Count   | Naming Pattern               | Email Field |
| ---------------- | ------- | ---------------------------- | ----------- |
| Degree Students  | 175     | `ticket_D1` to `ticket_D175` | ❌ No       |
| College Students | 381     | `ticket_C1` to `ticket_C381` | ✅ Yes      |
| **Total**        | **556** | -                            | -           |

---

## 🔧 Technical Implementation

### Files Modified

1. **`scripts/generateTickets.js`**

   - Added `getTicketPrefix()` function
   - Updated filename generation logic
   - Added conditional email rendering

2. **`scripts/sendTicketEmails.js`**
   - Added `getTicketPrefix()` function
   - Updated ticket filename lookup logic
   - Ensures email attachments match new naming

### Code Changes

#### Ticket Prefix Function

```javascript
function getTicketPrefix(category) {
  if (category === "Degree Students") return "D";
  if (category === "Faculty") return "F";
  if (category === "College Students") return "C";
  if (category === "VIP") return "V";
  if (category === "Guests") return "G";
  if (category === "Parents") return "P";
  return "T"; // Default fallback
}
```

#### Filename Generation

```javascript
const prefix = getTicketPrefix(ticket.category);
const seatNum = ticket.seatNumber.replace(/[^\d]/g, "");
const fileName = `ticket_${prefix}${seatNum}.pdf`;
```

#### Conditional Email Rendering

```javascript
// Email - Only show for non-degree students
if (ticket.category !== "Degree Students") {
  doc.fontSize(11).font("Helvetica-Bold").text("EMAIL:", 60, yPos);
  doc
    .fontSize(10)
    .font("Helvetica")
    .text(ticket.email, 180, yPos + 1);

  yPos += 30;
}
```

---

## ✅ Verification Steps

### 1. Generation Verification

```bash
node scripts\generateTickets.js
```

**Result**: ✅ 556 tickets generated successfully

### 2. Naming Verification

```powershell
# Check degree student tickets
Get-ChildItem tickets\ticket_D*.pdf | Measure-Object
# Result: 175 tickets

# Check college student tickets
Get-ChildItem tickets\ticket_C*.pdf | Measure-Object
# Result: 381 tickets
```

### 3. Visual Verification

- ✅ Opened `ticket_D1.pdf` - Confirmed email field removed
- ✅ Opened `ticket_C1.pdf` - Confirmed email field present

---

## 🎯 Benefits

### 1. **Cleaner File Names**

- Easy to identify category at a glance
- Simpler file management
- Better sorting in file explorer

### 2. **Privacy Protection**

- Degree students' emails not displayed on tickets
- Reduces risk of email harvesting
- Professional appearance

### 3. **Scalability**

- Easy to add new categories (Faculty, VIP, etc.)
- Consistent naming pattern
- Future-proof design

### 4. **Better Organization**

- Quick filtering: `ticket_D*.pdf` shows all degree tickets
- Alphabetical sorting groups by category
- Easy bulk operations

---

## 📋 Sample Tickets

### Degree Student Ticket (`ticket_D1.pdf`)

```
┌─────────────────────────────────────────┐
│  SIR PADAMPAT SINGHANIA UNIVERSITY      │
│     CONVOCATION CEREMONY 2025           │
│  Date: 28th December, 2025 | 4:30 PM   │
├─────────────────────────────────────────┤
│           ENTRY TICKET                  │
├─────────────────────────────────────────┤
│ GUEST NAME:   [Student Name]            │
│ CONTACT:      [Phone Number]            │  ← Email removed
│ CATEGORY:     DEGREE STUDENTS           │
│ NOTES:        [Degree Type]             │
├─────────────────────────────────────────┤
│ SEAT: D1                                │
│ Row: 7 | Section: Left          [QR]   │
└─────────────────────────────────────────┘
```

### College Student Ticket (`ticket_C1.pdf`)

```
┌─────────────────────────────────────────┐
│  SIR PADAMPAT SINGHANIA UNIVERSITY      │
│     CONVOCATION CEREMONY 2025           │
│  Date: 28th December, 2025 | 4:30 PM   │
├─────────────────────────────────────────┤
│           ENTRY TICKET                  │
├─────────────────────────────────────────┤
│ GUEST NAME:   [Student Name]            │
│ EMAIL:        [Email Address]           │  ← Email present
│ CONTACT:      [Phone Number]            │
│ CATEGORY:     COLLEGE STUDENTS          │
├─────────────────────────────────────────┤
│ SEAT: 1                                 │
│ Row: 13 | Section: Left         [QR]   │
└─────────────────────────────────────────┘
```

---

## 🚀 Future Enhancements

### Planned Categories

When faculty, VIP, and other categories are added:

- `ticket_F1.pdf` to `ticket_F[N].pdf` - Faculty
- `ticket_V1.pdf` to `ticket_V[N].pdf` - VIP
- `ticket_G1.pdf` to `ticket_G[N].pdf` - Guests
- `ticket_P1.pdf` to `ticket_P[N].pdf` - Parents

### Email Field Policy

- **No Email**: Degree Students, VIP (privacy)
- **With Email**: College Students, Faculty, Guests, Parents (contact purposes)

---

## 📝 Commands Reference

### Generate Tickets

```bash
npm run generate-tickets
# or
node scripts\generateTickets.js
```

### Send Tickets via Email

```bash
npm run send-tickets
# or
node scripts\sendTicketEmails.js
```

### List Tickets by Category

```powershell
# Degree students
Get-ChildItem tickets\ticket_D*.pdf

# College students
Get-ChildItem tickets\ticket_C*.pdf

# All tickets
Get-ChildItem tickets\*.pdf
```

### Open Sample Tickets

```powershell
# Open degree student ticket
Start-Process tickets\ticket_D1.pdf

# Open college student ticket
Start-Process tickets\ticket_C1.pdf
```

---

## ✅ Completion Checklist

- [x] Implemented `getTicketPrefix()` function
- [x] Updated ticket filename generation
- [x] Added conditional email rendering
- [x] Updated email sending script
- [x] Generated all 556 tickets with new naming
- [x] Verified degree tickets don't show email
- [x] Verified college tickets show email
- [x] Removed old ticket files
- [x] Tested sample tickets
- [x] Documentation complete

---

## 📞 Support

For questions about ticket naming or generation:

- See: [TICKET_SYSTEM_GUIDE.md](TICKET_SYSTEM_GUIDE.md)
- Email: convocation@spsu.ac.in

---

**Status**: ✅ Complete  
**Tickets Generated**: 556  
**Naming Convention**: Category-based (D, C, F, V, G, P)  
**Privacy**: Email removed for Degree Students

---

**🎓 Ready for SPSU Convocation 2025!**
