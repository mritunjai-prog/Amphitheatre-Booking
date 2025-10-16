# 🎓 SPSU Convocation - Amphitheater Booking System

Professional seat booking and ticket management system for Sir Padampat Singhania University Convocation 2025.

> **📚 All documentation has been organized in the [docs/](docs/) folder** - 29 files with comprehensive index

## 🌐 Live Demo

**🚀 [View Live Application](https://amphitheatre-booking-git-main-mritunjai-singhs-projects.vercel.app/)**

Deployed on Vercel with automatic CI/CD from GitHub.

---

## 📊 System Overview

### Current Status: ✅ Fully Operational

| Metric                | Value                  |
| --------------------- | ---------------------- |
| **Total Students**    | 556                    |
| **Degree Students**   | 175 (D1-D175)          |
| **College Students**  | 381 (1-381)            |
| **Tickets Generated** | 556 PDFs with QR codes |
| **Event Date**        | December 28, 2025      |
| **Event Time**        | 4:30 PM                |

---

## ✨ Features

### 🎯 **Complete Ticket Management System**

- **Professional PDF Tickets**: 556 tickets with QR codes, university branding, and detailed information
- **Automated Email Distribution**: Batch email system with HTML templates and error handling
- **Student Database**: 175 degree students + 381 college students with automatic duplicate detection
- **V-Shaped Seating**: 25-row amphitheater with left/right section assignment
- **Category-Based Allocation**: VIP, Guests, Faculty, Parents, Degree Students, College Students
- **Real-time Visual Management**: Interactive seat map with color-coded status

### 🎫 **Ticket System Highlights**

- **Smart Duplicate Removal**: Detected and removed 48 duplicate entries
- **QR Code Verification**: Unique codes for secure entry validation
- **Mobile-Optimized PDFs**: 600x800px single-page tickets
- **Batch Email Processing**: 10 emails at a time with delays to prevent blocking

### 📊 **CSV Data Management**

- **Master Database**: 556 students across all categories
- **Source Integration**: Degree students Excel + College consent forms
- **Data Export**: Download assignments and reports as CSV
- **Auto-loading**: Reads data files on startup

---

## 🚀 Quick Start

### View the Booking System

```bash
npm install
npm run dev
```

Access at: **http://localhost:3000**

### Generate Tickets

```bash
npm run generate-tickets
```

Generates 556 professional PDF tickets with QR codes.

### Send Tickets via Email

```bash
# Setup email config first
copy scripts\emailConfig.template.js scripts\emailConfig.js
# Edit emailConfig.js with your SMTP details

# Then send tickets
npm run send-tickets
```

---

## 📁 Project Structure

```
react-amphitheater-admin/
├── src/                          # React TypeScript source
│   ├── components/               # UI components
│   │   ├── Seat.tsx
│   │   ├── SeatRow.tsx
│   │   ├── SeatModal.tsx
│   │   ├── Notification.tsx
│   │   └── DataViewer.tsx
│   ├── types/                    # TypeScript types
│   ├── utils/                    # Utility functions
│   └── styles/                   # CSS styles
├── scripts/                      # Node.js scripts
│   ├── generateTickets.js        # PDF ticket generation
│   ├── sendTicketEmails.js       # Email distribution
│   ├── assignDegreeStudents.js   # Student assignment
│   └── processDuplicates.js      # Duplicate removal
├── data/                         # CSV data files
│   ├── booked_seats.csv          # Seat assignments (556)
│   ├── users.csv                 # User database (556)
│   └── *.csv                     # Source data
├── tickets/                      # Generated PDF tickets (556 files)
├── docs/                         # 📚 All documentation (29 files)
│   └── README.md                 # Documentation index
├── public/                       # Static assets
│   └── data/                     # Public data files
├── package.json                  # Dependencies
└── vite.config.ts                # Vite configuration
```

---

## � Documentation

**All documentation is organized in the [docs/](docs/) folder.**

### Key Documentation Files:

- **[docs/FINAL_STATUS.md](docs/FINAL_STATUS.md)** - Complete system status
- **[docs/TICKET_SYSTEM_GUIDE.md](docs/TICKET_SYSTEM_GUIDE.md)** - Ticket generation & email guide
- **[docs/DEGREE_STUDENTS_ASSIGNMENT.md](docs/DEGREE_STUDENTS_ASSIGNMENT.md)** - Student seat assignments
- **[docs/DUPLICATE_REMOVAL_REPORT.md](docs/DUPLICATE_REMOVAL_REPORT.md)** - Duplicate handling report (48 removed)
- **[docs/QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md)** - Quick commands reference

**📖 [View Full Documentation Index](docs/README.md)** - 29 organized documentation files

---

## 🎫 Ticket System

### Generate Tickets

```bash
npm run generate-tickets
```

Generates 556 professional PDF tickets with:

- University branding and logo
- Student information (name, enrollment, contact)
- Seat assignment (row, number, section)
- QR code for verification (encoded ticket data)
- Event details (date, time, venue)
- Entry instructions and guidelines

### Email Tickets

```bash
npm run send-tickets
```

Sends personalized emails to all 556 students with:

- Professional HTML email template
- PDF ticket attachment
- Event details and instructions
- Batch processing (10 emails at a time)
- Error handling and logging

---

## 🪑 Seating Layout

### V-Shape Design (Reverse Tapering - 25 Rows)

- **Row 1**: VIP (50 seats) - University dignitaries
- **Rows 2-3**: Guests (100 seats) - External guests
- **Rows 4-5**: Faculty (100 seats) - Teaching staff
- **Row 6**: Parents (50 seats) - Student guardians
- **Rows 7-12**: Degree Students (175 seats) - D1-D175
- **Rows 13-25**: College Students (381 seats) - 1-381

### Section Assignment

Each row divided into:

- **Left Section**: First half of row seats
- **Right Section**: Second half of row seats
- Automatically calculated based on row configuration

---

## 🎓 Student Categories

### Degree-Awarding Students (175)

Students receiving degrees at the convocation:

- M.Tech: 17 students
- MCA: 2 students
- B.Tech: 67 students
- MBA: 58 students
- PhD: 13 students
- BBA: 18 students

**Seats**: D1-D175 (Rows 7-12)

### College Students (381)

Other university students attending:

- Various programs and branches
- Duplicate-cleaned dataset
- All verified entries

**Seats**: 1-381 (Rows 13-25)

---

## 📊 CSV Data Format

### users.csv (556 records)

```csv
id,name,email,phone,category
1,Mritunjai Singh,email@example.com,+91-1234567890,Degree Students
```

### booked_seats.csv (556 records)

```csv
category,seatNumber,userId,userName,email,phone,notes
Degree Students,D1,1,Student Name,email@example.com,1234567890,M.Tech
```

---

## 🎯 How to Use

### 1. View Seat Layout

- See visual amphitheater with all 556+ seats
- Color-coded by category
- Interactive seat selection

### 2. Manage Assignments

- Click seats to view details
- Search for specific students or seats
- Export data to CSV

### 3. Generate & Send Tickets

- Run ticket generation script
- Configure email settings
- Send tickets to all students

### 4. Entry Verification

- Scan QR codes at entry
- Verify ticket authenticity
- Track attendance

---

## 🎨 Visual Features

### Color Coding

- 🟢 **Green/Teal**: Available seats
- 🔴 **Rose/Red**: Assigned/booked seats
- 🟡 **Amber**: VIP/Guest reserved seats
- 🔵 **Blue**: Parent/Faculty seats
- 🟣 **Purple**: Student seats

### Interactive Elements

- Hover effects on seats
- Click animations
- Responsive layout adapts to screen size
- Modern gradient backgrounds

---

## 🔧 Available Scripts

```bash
npm run dev                    # Start development server
npm run build                  # Build for production
npm run generate-tickets       # Generate all PDF tickets
npm run send-tickets           # Email tickets to students
npm run tickets-full-process   # Generate & send in one command
```

---

## 🚀 Build & Deploy

### Development

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

### Deploy to Vercel

```bash
# Connected to GitHub - auto-deploys on push
# Or use Vercel CLI:
vercel
```

**Current Deployment**: [amphitheatre-booking.vercel.app](https://amphitheatre-booking-git-main-mritunjai-singhs-projects.vercel.app/)

---

## 🔐 Security

### Email Configuration

- Keep `emailConfig.js` secure (git-ignored)
- Use app-specific passwords for Gmail
- Never commit SMTP credentials

### Data Privacy

- Student data encrypted in transit
- QR codes for secure ticket verification
- Access controls on admin interface

---

## 📧 Email Setup

### For Gmail:

1. Enable 2-Factor Authentication on your Google account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Copy `scripts/emailConfig.template.js` to `scripts/emailConfig.js`
4. Update with your Gmail and app password

### For Other Email Providers:

See [docs/TICKET_SYSTEM_GUIDE.md](docs/TICKET_SYSTEM_GUIDE.md) for detailed SMTP configuration instructions.

---

## ✅ System Status

### Completed Tasks

- [x] V-shaped seat allocation system (25 rows)
- [x] Student database integration (556 students)
- [x] Duplicate detection & removal (48 duplicates found and removed)
- [x] Professional PDF ticket generation (556 tickets)
- [x] QR code implementation for verification
- [x] Automated email distribution system
- [x] Left/Right section assignment
- [x] Time correction (4:30 PM)
- [x] Single-page ticket optimization
- [x] Comprehensive documentation (29 files organized)

### Ready For Production

- [x] Ticket distribution to all students
- [x] Entry verification system
- [x] Convocation ceremony deployment

---

## 🎉 Event Details

**SPSU Convocation Ceremony 2025**

- 📅 **Date**: December 28, 2025
- 🕐 **Time**: 4:30 PM
- 📍 **Venue**: University Amphitheatre
- 🎓 **Attendees**: 556 students
- 🎫 **Tickets**: All generated and ready

---

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 3
- **PDF Generation**: PDFKit
- **QR Codes**: qrcode library
- **Email**: nodemailer
- **Data**: CSV (Papa Parse)
- **Deployment**: Vercel

---

## 📞 Support & Contact

### Documentation

- 📖 Full documentation: [docs/](docs/) folder
- 📝 Quick reference: [docs/QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md)
- 🎫 Ticket guide: [docs/TICKET_SYSTEM_GUIDE.md](docs/TICKET_SYSTEM_GUIDE.md)
- 🔧 System status: [docs/FINAL_STATUS.md](docs/FINAL_STATUS.md)

### Project Links

- **GitHub**: github.com/mritunjai-prog/Amphitheatre-Booking
- **Live Demo**: [amphitheatre-booking.vercel.app](https://amphitheatre-booking-git-main-mritunjai-singhs-projects.vercel.app/)
- **Email**: convocation@spsu.ac.in

---

## 📋 Requirements Met

✅ **React + TypeScript** - Modern tech stack  
✅ **CSV Data Integration** - 556 students from multiple sources  
✅ **Professional Ticket System** - PDF with QR codes  
✅ **Email Distribution** - Automated batch sending  
✅ **556 Seats Allocated** - V-shaped 25-row layout  
✅ **Duplicate Removal** - 48 duplicates cleaned  
✅ **Complete Documentation** - 29 organized files  
✅ **Production Ready** - Deployed and tested

---

## 📄 License

This project is for Sir Padampat Singhania University internal use.

---

**Status**: ✅ Ready for Convocation  
**Last Updated**: October 16, 2025  
**Total Students**: 556  
**Tickets Generated**: 556  
**System Status**: Fully Operational

---

**🎓 Everything is ready for SPSU Convocation 2025!**
