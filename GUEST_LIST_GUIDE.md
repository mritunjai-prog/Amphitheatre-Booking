# Guest List Manual Application Guide

## 📋 Overview

This guide explains how to manually apply a guest list to your convocation booking system from localhost.

---

## 🚀 Quick Start

### Step 1: Prepare Your Guest List

1. **Option A - Use the template:**

   - Copy `data/guest_list_template.csv` to `data/guest_list.csv`
   - Edit with your guest data

2. **Option B - Create your own:**
   - Create a new file: `data/guest_list.csv`
   - Add columns: `name`, `email`, `phone`, `category`

### Step 2: Format Your CSV

**Required columns:**

- `name` - Guest name (REQUIRED)
- `email` - Email address (optional, will auto-generate if missing)
- `phone` - Phone number (optional)
- `category` - Guest category (optional, defaults to "Guests")

**Supported categories:**

- `Guests` - Regular guests (seat numbers: G1, G2, G3...)
- `Faculty` - Faculty members (seat numbers: F1, F2, F3...)
- `VIP` - VIP guests (seat numbers: VIP-1, VIP-2...)

### Step 3: Apply the Guest List

```bash
node scripts/applyGuestList.js
```

This will:

- ✅ Read your `guest_list.csv`
- ✅ Update `booked_seats.csv` with new guests
- ✅ Preserve existing degree and college students
- ✅ Update `users.csv` for guests and faculty
- ✅ Prepare data for ticket generation

### Step 4: Verify on Localhost

Start your dev server:

```bash
npm run dev
```

Open: http://localhost:3000

Check that:

- Guest seats (G1, G2...) show as booked
- Faculty seats (F1, F2...) show as booked
- VIP seats show as booked
- Student seats remain unchanged

### Step 5: Generate Tickets

```bash
node scripts/generateTickets.js
```

This will generate PDF tickets for all guests, faculty, VIP, and students.

### Step 6: Deploy to Vercel

```bash
git add data/booked_seats.csv data/users.csv public/data/
git commit -m "Apply guest list for convocation"
git push origin main
```

Vercel will automatically deploy your changes.

---

## 📊 Example Guest List CSV

```csv
name,email,phone,category
Dr. Rajesh Kumar,rajesh.kumar@spsu.ac.in,9876543210,Faculty
Prof. Anita Sharma,anita.sharma@spsu.ac.in,9876543211,Faculty
Mr. John Doe,john.doe@example.com,9876543212,Guests
Ms. Jane Smith,jane.smith@example.com,9876543213,Guests
Hon. Chief Guest,chief.guest@example.com,9876543214,VIP
```

---

## 🔄 The Script Will:

### Preserve:

- ✅ Degree students (D1-D196)
- ✅ College students (1-388)
- ✅ Parents bookings

### Update:

- 🔄 VIP seats (VIP-1, VIP-2...)
- 🔄 Guest seats (G1, G2...)
- 🔄 Faculty seats (F1, F2...)

### Output:

- 📄 `data/booked_seats.csv` - Updated with guests
- 📄 `public/data/booked_seats.csv` - Synced copy
- 📄 `data/users.csv` - Guest/faculty users
- 📄 `public/data/users.csv` - Synced copy

---

## 💡 Tips

### Flexible Column Names

The script auto-detects columns, so these variations work:

- **Name:** "name", "student name", "guest name", "faculty name"
- **Email:** "email", "email address", "mail"
- **Phone:** "phone", "contact", "mobile", "phone number"
- **Category:** "category", "type", "group"

### Category Auto-Detection

The script is smart about categories:

- Words like "faculty", "teacher", "staff" → Faculty
- Words like "vip", "chief" → VIP
- Everything else → Guests

### Missing Data

- **No email?** Auto-generates: `name@guest.com`
- **No phone?** Sets to: `N/A`
- **No category?** Defaults to: `Guests`

---

## ⚠️ Important Notes

1. **Backup First:** The script overwrites guest/faculty data (students are safe)

2. **Run from Project Root:**

   ```bash
   cd d:\react-amphitheater-admin
   node scripts/applyGuestList.js
   ```

3. **Check Capacity:**

   - Max VIP: 26 seats (Row 1)
   - Max Guests: 56 seats (Rows 2-3)
   - Max Faculty: 60 seats (Rows 4-5)

4. **Re-runnable:** You can edit `guest_list.csv` and run the script again

---

## 🐛 Troubleshooting

### Error: "guest_list.csv not found"

**Solution:** Create `data/guest_list.csv` with your guest data

### Error: "Could not detect name column"

**Solution:** Ensure your CSV has a column with "name" in the header

### Guests not showing on website

**Solution:**

1. Check `data/booked_seats.csv` - guests should be there
2. Refresh browser (Ctrl+F5)
3. Check browser console for errors

### Want to start over?

**Solution:**

1. Delete or rename `data/guest_list.csv`
2. Restore original CSV files from git

---

## 📞 Support

If you encounter issues:

1. Check the console output for error messages
2. Verify your CSV format matches the template
3. Ensure all required files exist in the correct folders

---

**Created:** October 25, 2025  
**Script:** `scripts/applyGuestList.js`  
**Template:** `data/guest_list_template.csv`
