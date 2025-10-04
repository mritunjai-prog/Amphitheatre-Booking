# React Amphitheater Admin System

A simple, modern React + TypeScript application for managing university amphitheater seat assignments with CSV data integration.

## 🌐 Live Demo

**🚀 [View Live Application](https://amphitheatre-booking-git-main-mritunjai-singhs-projects.vercel.app/)**

Deployed on Vercel with automatic CI/CD from GitHub.

## ✨ Features

### 🎯 **Simple & Direct**

- **CSV Data Integration**: Loads user data from `data/users.csv`
- **Pre-assigned Reservations**: Optional `data/booked_seats.csv` auto-books VIP seats at startup
- **Visual Seat Management**: 1000 seats across 15 rows with central aisle and mirrored sections
- **Manual Assignment**: Admin clicks seats to assign users
- **Real-time Updates**: Seats highlight when booked/assigned or imported from CSV
- **Responsive Design**: Works on desktop, tablet, and mobile

### 🎭 **Amphitheater Layout**

- **1000 Total Seats**: Exactly as requested
- **15 Rows**: Numbered 1-15 with extended seat labeling (1a…1z, 1aa, 1ab, …) so no `#` symbols are used
- **Central Aisle**: Bisects the amphitheater into left/right sections
- **Guest Row**: Row 1 exclusively reserved for guests
- **Visual Highlighting**: Different colors for available/booked/reserved seats

### 📊 **CSV Data Management**

- **Sample Data Included**: 20 users including "Mritunjai Singh"
- **Booked Seats Sheet**: `data/booked_seats.csv` maps seats to user IDs and ticket status
- **Categories**: Students, Guests, Parents, Faculty, Alumni
- **Auto-loading**: Reads both CSV files on startup
- **Refresh Feature**: Reload CSV data without restart
- **Export Feature**: Download seat assignments as CSV

### 🎫 **Seat Management**

- **Click to Assign**: Click any seat to assign users from CSV
- **Smart Filtering**: Only shows eligible users for reserved seats
- **Ticket Generation**: Mark seats as "ticket generated"
- **Visual Status**: Color-coded seat status (available/booked/highlighted)
- **Search Function**: Find specific seats instantly

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd react-amphitheater-admin
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Open Browser

```
http://localhost:3000
```

## 📁 Project Structure

```
react-amphitheater-admin/
├── data/
│   ├── users.csv              # User data (modify as needed)
│   └── booked_seats.csv       # Optional pre-assigned seats synced at load
├── src/
│   ├── components/
│   │   ├── Seat.tsx           # Individual seat component
│   │   ├── SeatRow.tsx        # Row of seats with aisle
│   │   ├── SeatModal.tsx      # Assignment modal
│   │   ├── Notification.tsx   # Toast notifications
│   │   └── ImportedAssignments.tsx # Table of CSV-imported reservations
│   ├── types/
│   │   └── index.ts          # TypeScript types
│   ├── utils/
│   │   └── index.ts          # CSV parsing, seat generation
│   ├── App.tsx               # Main application
│   ├── index.css             # Tailwind layer + theme tokens
│   └── main.tsx              # Entry point
├── index.html                # HTML template
├── package.json              # Dependencies
└── vite.config.ts            # Vite configuration
```

## 📊 CSV Data Format

The `data/users.csv` file should have this format:

```csv
id,name,email,phone,category
1,Mritunjai Singh,mritunjai.singh@university.edu,+91-9876543210,Guests
2,Priya Sharma,priya.sharma@university.edu,+91-9876543211,Students
3,Dr. Rajesh Kumar,rajesh.kumar@university.edu,+91-9876543212,Faculty
```

### Supported Categories:

- `Students` - University students
- `Guests` - External guests
- `Parents` - Student parents
- `Faculty` - University faculty
- `Alumni` - Former students

## 🎯 How to Use

### **1. View Seat Layout**

- See the visual amphitheater with 1000 seats
- Different colors show seat status
- Row 1 is highlighted as guest-only

### **2. Assign Seats**

- Click any available seat
- Modal opens showing seat details
- Select user from dropdown (filtered by category)
- Click "Assign User" to confirm

### **3. Manage Assignments**

- Click assigned seats to view details
- Generate tickets for assigned users
- Remove assignments if needed
- Export all assignments to CSV

### **4. Search & Navigate**

- Use search box to find specific seats
- Searched seats are highlighted in blue
- Statistics panel shows real-time counts

## 🎨 Visual Features

### **Color Coding**

- 🟢 **Green/Teal**: Available seats
- 🔴 **Rose**: Assigned/booked seats
- 🟡 **Amber**: Guest-reserved seats (Row 1)
- 🔵 **Indigo**: Highlighted/searched seats

### **Interactive Elements**

- **Hover Effects**: Seats scale on hover
- **Click Animations**: Smooth transitions
- **Responsive Layout**: Adapts to screen size
- **Modern Design**: Gradient backgrounds and shadows

## 🔧 Customization

### **Modify Seat Layout**

Edit `src/utils/index.ts` in the `generateSeats()` function:

```typescript
// Change number of rows
for (let row = 1; row <= 15; row++) {

// Change seats per row
const seatsInRow = row <= 10 ? 70 : 60;
```

### **Update CSV Structure**

Modify the CSV parsing in `src/utils/index.ts`:

```typescript
export const parseCSVData = (csvText: string): User[] => {
  // Add your CSV parsing logic
};
```

### **Change Styling**

Tailwind CSS powers the UI. Update theme tokens in `tailwind.config.cjs` or author custom utilities in `src/index.css`:

- Adjust gradients, fonts, and shadows in the Tailwind config
- Add reusable component classes under the `@layer components` block
- Leverage utility classes directly inside React components for fine-grained tweaks

## 📱 Responsive Design

- **Desktop**: Full feature set with hover effects
- **Tablet**: Touch-optimized with adjusted seat sizes
- **Mobile**: Compact layout with stacked controls

## 🎯 Technical Features

### **React + TypeScript**

- Type-safe development
- Component-based architecture
- Modern React hooks

### **CSV Integration**

- PapaParse library for CSV parsing
- Automatic data loading
- Export functionality

### **Performance**

- Efficient rendering with React keys
- Optimized seat generation
- Smooth animations with CSS transitions

## 🚀 Build & Deploy

### **Development**

```bash
npm run dev
```

### **Production Build**

```bash
npm run build
```

### **Preview Build**

```bash
npm run preview
```

## 📋 Requirements Met

✅ **HTML, CSS, TypeScript, React** - Complete modern stack  
✅ **CSV Data Integration** - Loads users from CSV file  
✅ **Manual Seat Assignment** - Admin clicks to assign  
✅ **Visual Highlighting** - Booked seats are highlighted  
✅ **1000 Seats, 15 Rows** - Exact layout as requested  
✅ **Central Aisle Design** - Bisects amphitheater  
✅ **Sample User Data** - Includes "Mritunjai Singh"  
✅ **Responsive Interface** - Works on all devices

This is a **simple, focused solution** that does exactly what you requested without unnecessary complexity!
