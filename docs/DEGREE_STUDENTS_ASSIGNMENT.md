# Degree Students Seat Assignment Summary

## Overview

Successfully integrated 175 degree-awarding students from the Convocation 12 database into the amphitheater booking system.

## Execution Date

Processed on: December 28, 2025 (as per attendance form date)

## Student Distribution by Degree

| Degree Program                                | Number of Students | Seat Range    |
| --------------------------------------------- | ------------------ | ------------- |
| **M.Tech** (Master of Technology)             | 17                 | D1 - D17      |
| **MCA** (Master Computer Application)         | 2                  | D18 - D19     |
| **B.Tech** (Bachelor of Technology)           | 67                 | D20 - D86     |
| **MBA** (Master of Business Administration)   | 58                 | D87 - D144    |
| **PhD** (Doctor of Philosophy)                | 13                 | D145 - D157   |
| **BBA** (Bachelor of Business Administration) | 18                 | D158 - D175   |
| **TOTAL**                                     | **175**            | **D1 - D175** |

## Seat Allocation Details

### Category: Degree Students

- **Seat Prefix**: D (e.g., D1, D2, D3... D175)
- **Rows Assigned**: Rows 7-12 in the amphitheater (as per seating configuration)
- **All students** are assigned to the "Degree Students" category

## Files Updated

### 1. `/data/booked_seats.csv`

Contains seat assignments with the following information:

- Category: "Degree Students"
- Seat Number: D1 to D175
- User ID: Unique ID for each student
- User Name: Full name from database
- Email: Generated from enrollment number
- Phone: Contact number from database
- Notes: Degree program and enrollment number

### 2. `/data/users.csv`

Contains user information:

- ID: Unique user identifier
- Name: Student full name
- Email: Generated email address
- Phone: Contact number
- Category: "Degree Students"

### 3. `/public/data/` (Mirror copies for web access)

Both files are also copied to the public directory for the React application to access.

## Sample Seat Assignments

### M.Tech Students (D1-D17)

- **D1**: Kiran Raj (23MCS00204)
- **D2**: Ajay Singh kumawat (23MCE00217)
- **D3**: Harshvardhan singh dulawat (23MCE00218)
- ... (14 more)

### MCA Students (D18-D19)

- **D18**: Suraj Pratap Singh Rao (23MCA00033)
- **D19**: Naman jain (23MCA00031)

### B.Tech Students (D20-D86)

- **D20**: Vikram Mali (21CS002438)
- **D21**: Aatmagya Upadhyay (20CS002289)
- ... (65 more)

### MBA Students (D87-D144)

- **D87**: PARAM TAIMNI (23MBA00348)
- **D88**: Rishabh Pokharna (23MBA00347)
- ... (56 more)

### PhD Students (D145-D157)

- **D145**: Dr.Chitra Bhole (20DP000141)
- **D146**: Jotiram Krishna Deshmukh (21DP000169)
- ... (11 more)

### BBA Students (D158-D175)

- **D158**: Tanishka sharma t (22bba00244)
- **D159**: Narendra Singh Deora (22BBA00231)
- ... (16 more)

## Seating Configuration

According to your amphitheater design:

- **Rows 7-12** are reserved for Degree Students
- These rows use **V-shape tapering** (reverse tapering)
- Seats are split into **left and right sections**
- Each row has varying number of seats based on the tapering design

### Estimated Capacity for Degree Students Section

Based on the seating algorithm:

- Row 7: ~46 seats
- Row 8: ~46 seats
- Row 9: ~44 seats
- Row 10: ~44 seats
- Row 11: ~42 seats
- Row 12: ~42 seats
- **Total capacity**: ~264 seats

**Current allocation**: 175 students (66% capacity)
**Available seats**: ~89 seats remaining in Degree Students section

## Next Steps

1. **Start your development server** to view the updated bookings:

   ```bash
   npm run dev
   ```

2. **Access the application** at `http://localhost:5173` (or your configured port)

3. **Verify seat assignments**:

   - Check that all 175 students are displayed
   - Verify seats D1-D175 are marked as "booked"
   - Confirm student information is correct

4. **Export/Print** the seating chart if needed for the convocation event

## Data Quality Notes

- All 175 students have valid names, enrollment numbers, and phone numbers
- Emails are auto-generated using enrollment numbers (format: `enrollment@example.com`)
- Each student record includes their degree program and enrollment number in the notes field
- Phone numbers have been cleaned (spaces removed)

## Script Used

Created: `/scripts/assignDegreeStudents.js`

- Parses the CSV database
- Extracts student information by degree program
- Generates sequential seat numbers (D1-D175)
- Creates user records and seat assignments
- Outputs to both data and public directories

---

**Status**: ✅ Complete
**Total Students Processed**: 175
**Seats Assigned**: D1 to D175
**Ready for Convocation**: Yes
