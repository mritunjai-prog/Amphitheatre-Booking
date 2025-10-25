# New Consent Form Processing Summary

**Date:** October 24, 2025  
**Task:** Process NEW CONSENT FORM.csv, allocate 388 college seats, regenerate tickets

---

## 📊 Data Processing Results

### Input Data:

- **Total entries in consent form:** 444
- **Unique students found:** 439 (after deduplication)
- **Excluded:** Mritunjai Singh (as requested)
- **Students allocated seats:** 388 (first 388 unique students)

### Final Seat Allocation:

- **Degree Students:** 196 (seats D1-D196)
- **College Students:** 388 (seats 1-388)
- **Total Booked Seats:** 584

---

## ✅ Files Updated

### 1. Booking Data:

- ✅ `data/booked_seats.csv` - Updated with 388 new college students
- ✅ `public/data/booked_seats.csv` - Synchronized

### 2. User Data:

- ✅ `data/users.csv` - Updated with 388 college students
- ✅ `public/data/users.csv` - Synchronized

### 3. College Students Reference:

- ✅ `other-data/college-students-data.csv` - Updated with 388 students
  - Columns: Seat Number, Name, Email, Phone Number, Program

### 4. Tickets:

- ✅ Generated **584 PDF tickets** with QR codes
- ✅ Location: `tickets/` folder
- ✅ 0 errors during generation

---

## 📋 Sample College Students

### First 10 Students:

1. **Seat 1:** Anurag 5 (B.tech)
2. **Seat 2:** Lakshya verma (Cse)
3. **Seat 3:** Y Avanthika (Cse Aiml)
4. **Seat 4:** Kapil meghwal (CSE DATA SCIENCE)
5. **Seat 5:** Vundekoti Karthik (Cse aiml)
6. **Seat 6:** Sanjay venkat kumar (CSE(AIML))
7. **Seat 7:** Dashrath Pal Singh (Civil engineering)
8. **Seat 8:** MANTOORI ROSHINI (CSE aiml)
9. **Seat 9:** Anima Jain (BBA)
10. **Seat 10:** T Ishwarya (CSE)

### Last 10 Students:

379. **Seat 379:** Y Yasaswinichowdary (Btech ECE)
380. **Seat 380:** Aman Sisodiya (B.TECH CSE AIML)
381. **Seat 381:** M sai vardhan (CSE CYBERSECURITY)
382. **Seat 382:** Mahipal Singh Rao (CSE)
383. **Seat 383:** Ashish jat (btech)
384. **Seat 384:** Bhupendra Mali (CSE)
385. **Seat 385:** Shamas sheikh (Bca)
386. **Seat 386:** Dishant Jain (Management)
387. **Seat 387:** Manvendra Singh Chouhan (Bba)
388. **Seat 388:** Priyank Dhankar (CSE)

---

## 🔄 Processing Logic

### Deduplication:

- Used **email address** as unique identifier
- Removed duplicate entries based on email
- Resulted in 439 unique students from 444 entries

### Exclusions:

- **Mritunjai Singh** - Excluded as requested
- Any entries missing name or email

### Seat Allocation:

- First 388 unique students received seats
- Seats numbered sequentially: 1, 2, 3, ... 388
- Preserved order from consent form (timestamp order)

---

## 📁 Script Created

**File:** `scripts/processNewConsentForm.js`

**Functions:**

1. Read and parse NEW CONSENT FORM.csv
2. Deduplicate based on email addresses
3. Exclude Mritunjai Singh
4. Limit to 388 students
5. Update booked_seats.csv (with existing 196 degree students)
6. Update users.csv
7. Update college-students-data.csv
8. Maintain synchronization between data/ and public/data/

---

## 🎯 Verification

### Check the data:

```bash
# View updated booking data
code data/booked_seats.csv

# View college students data
code other-data/college-students-data.csv

# Count tickets generated
(Get-ChildItem tickets -Filter *.pdf).Count
```

### Expected Results:

- **Total rows in booked_seats.csv:** 585 (1 header + 196 degree + 388 college)
- **Total rows in users.csv:** 389 (1 header + 388 college)
- **Total PDF tickets:** 584
- **College data CSV:** 389 rows (1 header + 388 students)

---

## ✅ Task Complete

All files have been updated and 584 tickets have been successfully generated!

**Total Capacity:** 1,030 seats  
**Booked Seats:** 584 (196 degree + 388 college)  
**Available Seats:** 446

The system is ready for the convocation ceremony! 🎓
