# Other Data - Student Information

This folder contains student information files for the convocation ceremony.

### Files in this folder:

#### `degree-students-confidential.csv`

- **Purpose:** Quick reference for degree-awarding students
- **Contains:** 196 degree students
- **Columns:**
  - `seatNumber` - Seat assignment (D1-D196)
  - `name` - Student full name
  - `phone` - Contact phone number
  - `degree` - Degree type

#### `college-students-data.csv`

- **Purpose:** Quick reference for college students
- **Contains:** 338 college students
- **Columns:**
  - `seatNumber` - Seat assignment (1-338)
  - `name` - Student full name
  - `email` - Student email address
  - `phone` - Contact phone number
  - `program` - Academic program/course

### Degree Students Distribution:

| Degree Type                               | Count | Seat Range |
| ----------------------------------------- | ----- | ---------- |
| Doctor of Philosophy (Ph.D.)              | 12    | D1-D12     |
| Master of Technology (M.Tech)             | 19    | D13-D31    |
| Master of Business Administration (MBA)   | 61    | D32-D92    |
| Master of Computer Applications (MCA)     | 2     | D93-D94    |
| Bachelor of Technology (B.Tech)           | 80    | D95-D174   |
| Bachelor of Business Administration (BBA) | 22    | D175-D196  |

### College Students:

- **Total:** 338 students
- **Seat Range:** 1-338
- **Order:** As allocated (alphabetically organized)

### Data Organization:

**Degree Students:**

1. **Degree Priority:** Ph.D. → M.Tech → MBA → MCA → B.Tech → BBA
2. **Alphabetical Order:** Within each degree level, students are sorted alphabetically by name

**College Students:**

- Maintained in original allocation order

### Usage:

These files can be used for:

- Quick lookup of student seat assignments
- Contact information for last-minute communications
- Verification during student check-in
- Seating arrangement coordination
- Printing for event staff reference

### Regenerating these files:

To regenerate or update this data:

```bash
# For degree students
node scripts/generateConfidentialData.js

# For college students
node scripts/generateCollegeData.js
```

---

**Last Updated:** October 24, 2025  
**Total Students:** 534 (196 Degree + 338 College)  
**Event:** Convocation Ceremony
