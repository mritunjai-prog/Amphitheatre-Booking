# Degree Student Update Summary - October 23, 2025

## Overview

Updated all degree-awarding students with new data from **NEW DEGREE AWARDING.csv** form. Total of **196 unique degree students** now registered.

---

## Processing Details

### Source Data

- **File**: NEW DEGREE AWARDING.csv
- **Total Responses**: 202 rows
- **Valid Entries**: 201 students with names
- **Empty Rows**: 1

### Final Count

- **Unique Students (by email)**: 196
- **Duplicates Removed**: 5 (same person submitted twice)
- **Enrollment Conflicts**: 2 (different people with same enrollment)

---

## Duplicates Removed (5 Students)

These students submitted the form twice. We kept their **first submission** and removed the duplicate:

1. **Rishabh Pokharna** (23MBA00347)

   - Email: rishabhpokharna04@gmail.com
   - Kept: Row 3 | Removed: Row 30

2. **Atul Haribhau Kachare** (19DP000127)

   - Email: atulhkachare@gmail.com
   - Kept: Row 15 | Removed: Row 33

3. **Siddharth Singh** (23MBA00352)

   - Email: sshekhawat183@gmail.com
   - Kept: Row 29 | Removed: Row 111

4. **Labhanshu vislot** (23MBA00415)

   - Email: vislotlabhanshu@gmail.com
   - Kept: Row 125 | Removed: Row 126

5. **HIMANSHU VYAS** (23MBA00420)
   - Email: vyashimanshu1611@gmail.com
   - Kept: Row 134 | Removed: Row 184

---

## ⚠️ Enrollment Conflicts (2 Cases - REQUIRES VERIFICATION)

These are **different students** who were assigned the **same enrollment number** in the form. Both are kept in the system but **manual verification is needed** to correct the enrollment records:

### Conflict 1: Enrollment **21CS002302**

Two different students both have this enrollment number:

**Person A: Abhijit Tiwari**

- Email: abhijittiwari681@gmail.com
- Degree: Bachelor of Technology
- Row in CSV: 59

**Person B: Anjali Ahuja**

- Email: anjaliahuja05002@gmail.com
- Degree: Bachelor of Technology
- Row in CSV: 79

**Action Required**: Check university records to determine which student should have enrollment 21CS002302. One of them likely has a different enrollment number.

---

### Conflict 2: Enrollment **23MBA00385**

Two different students both have this enrollment number:

**Person A: Priyal Dak**

- Email: dakpriyal5@gmail.com
- Degree: Master of Business Administration
- Row in CSV: 50

**Person B: Esha kothari**

- Email: eshakothari082001@gmail.com
- Degree: Master of Business Administration
- Row in CSV: 114

**Action Required**: Check university records to determine which student should have enrollment 23MBA00385. One of them likely has a different enrollment number.

---

## Current Booking Status

### Before Update (Oct 23, 2025 - Morning)

- Degree Students: 175
- College Students: 395
- **Total: 570 tickets**

### After Update (Oct 23, 2025 - Evening)

- Degree Students: 196
- College Students: 395
- **Total: 591 tickets**

### Change

- **+21 degree students** (net increase after removing 5 duplicates)

---

## Seat Capacity

| Category             | Booked  | Capacity | Remaining | Utilization |
| -------------------- | ------- | -------- | --------- | ----------- |
| **Degree Students**  | 196     | 210      | 14        | 93.3%       |
| **College Students** | 395     | 578      | 183       | 68.3%       |
| **Total**            | **591** | **788**  | **197**   | **75.0%**   |

---

## Files Updated

1. ✅ `data/booked_seats.csv` - Complete booking database
2. ✅ `data/users.csv` - Attendee information
3. ✅ `public/data/users.csv` - Public attendee data
4. ✅ `tickets/ticket_D1.pdf` to `tickets/ticket_D196.pdf` - Degree tickets
5. ✅ `tickets/ticket_C1.pdf` to `tickets/ticket_C395.pdf` - College tickets (unchanged)
6. ✅ `data/degree_processing_summary.json` - Processing log

---

## Scripts Used

- `scripts/processNewDegreeAwarding196.js` - Main processing script
- `scripts/analyzeDuplicates.js` - Duplicate analysis tool
- `scripts/generateTickets.js` - Ticket generation with SPSU branding

---

## Next Steps

1. ⚠️ **URGENT**: Verify the 2 enrollment conflicts with the registrar's office

   - Contact Abhijit Tiwari and Anjali Ahuja about enrollment 21CS002302
   - Contact Priyal Dak and Esha kothari about enrollment 23MBA00385

2. 📧 **Email Distribution**: Send tickets to all 196 degree students

   - All tickets generated with SPSU logo, QR codes, and correct details
   - Event: October 28, 2025 at 4:30 PM

3. 📋 **Record Keeping**: Maintain this summary for reference

4. 🎟️ **Remaining Capacity**: 14 degree seats still available for late registrations

---

## Technical Details

- **Date Processed**: October 23, 2025
- **Processing Method**: Unique by email (first occurrence kept)
- **Duplicate Detection**: Email-based with enrollment conflict flagging
- **Ticket Format**: PDF with QR code, logo, seat information
- **Contact**: studentwelfare@spsu.ac.in

---

## Summary

✅ **196 unique degree-awarding students** successfully processed  
✅ **5 duplicate submissions** identified and removed  
⚠️ **2 enrollment conflicts** flagged for verification  
✅ **591 total tickets** generated and ready for distribution  
✅ **75% venue capacity** utilized

**Last Updated**: October 23, 2025, 11:15 PM
