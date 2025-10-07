# � Manual CSV Save Guide

## Overview

The application now provides **manual control** over CSV file saving!

## How It Works

### 1. **Manual CSV Download**

You control when to save changes to CSV files:

- ✅ **Assign a seat** → No automatic download
- ✅ **Remove assignment** → No automatic download
- ✅ **Manual save** → Click "💾 Save to CSV" button to download

### 2. **What You Need To Do**

After making changes:

1. **Click "💾 Save to CSV"** button in the Operations Console
2. **Look for the downloaded file** in your Downloads folder:
   - File name: `booked_seats.csv`
3. **Replace the old file**:

   ```
   Copy: Downloads/booked_seats.csv
   Paste into:
   - react-amphitheater-admin/public/data/booked_seats.csv (REQUIRED)
   - react-amphitheater-admin/data/booked_seats.csv (OPTIONAL - for backup)
   ```

4. **Refresh the page** (Ctrl+Shift+R) to see persisted changes

### 3. **Available Buttons**

| Button                 | Icon | Action                            |
| ---------------------- | ---- | --------------------------------- |
| **Save to CSV**        | 💾   | Download current state as CSV     |
| **Refresh CSV Data**   | 🔄   | Reload data from CSV files        |
| **Export Assignments** | 📥   | Export detailed assignment report |
| **View CSV Data**      | 📊   | View/edit CSV data in modal       |

## CSV File Format

The auto-generated CSV maintains this structure:

```csv
category,seatNumber,userId,userName,email,phone,notes

# GUESTS
Guests,G1,1,Mritunjai Singh,mritunjai.singh@university.edu,+91-9876543210,Chief Guest

# FACULTY
Faculty,F10,3,Dr. Rajesh Kumar,rajesh.kumar@university.edu,+91-9876543212,Faculty Representative

# DEGREE STUDENTS
Degree Students,D50,8,Rahul Sharma,rahul.sharma@university.edu,+91-9876543217,Student Representative

# COLLEGE STUDENTS
College Students,150,6,Sneha Gupta,sneha.gupta@university.edu,+91-9876543215,Student Council Lead
```

## Workflow Example

### Scenario: Assign seat G5 to Anita Verma

1. **Click seat G5** (available)
2. **Select "Anita Verma"** from dropdown
3. **Click "✅ Assign User"**
4. ✅ **Notification**: "Seat G5 assigned to Anita Verma! CSV auto-downloaded."
5. 📥 **Check Downloads** folder for `booked_seats.csv`
6. 📋 **Copy file** to `public/data/booked_seats.csv`
7. 🔄 **Refresh browser** (Ctrl+Shift+R)
8. ✅ **Seat G5 now persists** after refresh!

### Scenario: Remove seat assignment

1. **Click assigned seat** (e.g., F10)
2. **Click "🗑 Remove Assignment"**
3. ✅ **Notification**: "Assignment removed for seat F10! CSV auto-downloaded."
4. 📥 **Check Downloads** folder for `booked_seats.csv`
5. 📋 **Copy file** to `public/data/booked_seats.csv`
6. 🔄 **Refresh browser**
7. ✅ **Seat F10 now available** after refresh!

## Important Notes

⚠️ **Browser Security Limitation**

- Browsers cannot directly write to local files for security
- That's why we use **download → manual replace** workflow

✅ **For Production**

- Use a backend API (Node.js/Python/Java)
- API will save directly to database or file system
- No manual file copying needed

## Troubleshooting

### Problem: Changes don't persist after refresh

**Solution**: Make sure you replaced `public/data/booked_seats.csv` with the downloaded file

### Problem: Multiple CSV files downloaded

**Solution**: Normal! Each change downloads a new file. Just use the latest one.

### Problem: Can't find downloaded CSV

**Solution**: Check your browser's Downloads folder or Downloads setting

## Quick Tips

1. 💡 **Use "💾 Save to CSV" button** anytime to download current state
2. 💡 **Keep backups** of your CSV files before making major changes
3. 💡 **Check Downloads folder** after each assign/remove action
4. 💡 **Use "📊 View CSV Data"** to see current state without downloading

---

**Need help?** Check the notifications after each action for guidance!
