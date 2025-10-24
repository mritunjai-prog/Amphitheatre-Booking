# Confidential Data - Degree Students

## ⚠️ CONFIDENTIAL - RESTRICTED ACCESS

This folder contains sensitive student information for the convocation ceremony.

### Files in this folder:

#### `degree-students-confidential.csv`

- **Purpose:** Quick reference for degree-awarding students
- **Contains:** 196 degree students
- **Columns:**
  - `seatNumber` - Seat assignment (D1-D196)
  - `name` - Student full name
  - `phone` - Contact phone number
  - `degree` - Degree type

### Degree Distribution:

| Degree Type                               | Count | Seat Range |
| ----------------------------------------- | ----- | ---------- |
| Doctor of Philosophy (Ph.D.)              | 12    | D1-D12     |
| Master of Technology (M.Tech)             | 19    | D13-D31    |
| Master of Business Administration (MBA)   | 61    | D32-D92    |
| Master of Computer Applications (MCA)     | 2     | D93-D94    |
| Bachelor of Technology (B.Tech)           | 80    | D95-D174   |
| Bachelor of Business Administration (BBA) | 22    | D175-D196  |

### Data Organization:

Students are organized by:

1. **Degree Priority:** Ph.D. → M.Tech → MBA → MCA → B.Tech → BBA
2. **Alphabetical Order:** Within each degree level, students are sorted alphabetically by name

### Security Notes:

🔒 **This folder is protected:**

- Added to `.gitignore` - will NOT be committed to git
- Contains personal phone numbers and contact information
- Should only be accessible to authorized event organizers

### Usage:

This file can be used for:

- Quick lookup of student seat assignments
- Contact information for last-minute communications
- Verification during student check-in
- Seating arrangement coordination

### Regenerating this file:

To regenerate or update this data:

```bash
node scripts/generateConfidentialData.js
```

---

**Last Updated:** October 24, 2025  
**Total Students:** 196 Degree Students  
**Event:** Convocation Ceremony
