# 📊 Google Sheets Integration Guide

This guide will help you integrate Google Sheets with your Amphitheater Booking system so that live responses can be automatically synced.

## 🎯 Overview

Instead of using static CSV files, you can:

1. Collect responses via Google Forms → Google Sheets
2. Use Google Sheets API to fetch live data
3. Auto-refresh the system to show new registrations in real-time

---

## 📝 Step 1: Set Up Google Sheets

### Create Your Sheets

1. **Users Sheet** (Registration Form Responses)

   - Column A: `id` (auto-generated row number or form timestamp)
   - Column B: `name`
   - Column C: `email`
   - Column D: `phone`
   - Column E: `category` (VIP, Guests, Faculty, Degree Students, College Students)

2. **Booked Seats Sheet** (Pre-assigned seats)
   - Column A: `userId`
   - Column B: `seatNumber`
   - Column C: `ticketGenerated` (true/false)
   - Column D: `notes`

### Make Sheet Public (or use API)

**Option A: Public Access (Simple)**

1. Click **Share** button in Google Sheets
2. Click **"Change to anyone with the link"**
3. Set permission to **"Viewer"**
4. Copy the sheet URL

**Option B: API Access (Secure)**

- Use Google Sheets API with OAuth2 authentication
- More secure but requires backend setup

---

## 🔧 Step 2: Update Your Code

### Install Required Package

```bash
npm install papaparse
```

### Update `utils/index.ts`

Replace the CSV loading functions with Google Sheets loading:

```typescript
// Add this helper function to convert Google Sheets to CSV format
export const loadGoogleSheetAsCSV = async (
  sheetUrl: string
): Promise<string> => {
  // Convert Google Sheets URL to CSV export URL
  const sheetId = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
  const gid = new URL(sheetUrl).searchParams.get("gid") || "0";

  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;

  const response = await fetch(csvUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch Google Sheet: ${response.statusText}`);
  }

  return response.text();
};

// Update loadCSVData function
export const loadCSVData = async (source: string): Promise<User[]> => {
  try {
    let csvText: string;

    // Check if source is a Google Sheets URL
    if (source.includes("docs.google.com/spreadsheets")) {
      csvText = await loadGoogleSheetAsCSV(source);
    } else {
      // Load from local CSV file
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error(`Failed to load CSV: ${response.statusText}`);
      }
      csvText = await response.text();
    }

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const users = results.data.map((row: any, index: number) => ({
            id: row.id ? parseInt(row.id) : index + 1,
            name: row.name?.trim() || "",
            email: row.email?.trim() || "",
            phone: row.phone?.trim() || "",
            category: (row.category?.trim() ||
              "College Students") as User["category"],
          }));
          resolve(users);
        },
        error: (error) => reject(error),
      });
    });
  } catch (error) {
    console.error("Error loading data:", error);
    throw error;
  }
};

// Similar update for loadBookedSeatData
export const loadBookedSeatData = async (
  source: string
): Promise<BookedSeatRecord[]> => {
  try {
    let csvText: string;

    if (source.includes("docs.google.com/spreadsheets")) {
      csvText = await loadGoogleSheetAsCSV(source);
    } else {
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error(`Failed to load CSV: ${response.statusText}`);
      }
      csvText = await response.text();
    }

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const records = results.data.map((row: any) => ({
            userId: parseInt(row.userId || row.user_id),
            seatNumber:
              row.seatNumber?.trim()?.toLowerCase() ||
              row.seat_number?.trim()?.toLowerCase() ||
              "",
            ticketGenerated:
              row.ticketGenerated || row.ticket_generated || "false",
            notes: row.notes?.trim() || "",
          }));
          resolve(records);
        },
        error: (error) => reject(error),
      });
    });
  } catch (error) {
    console.error("Error loading booked seat data:", error);
    throw error;
  }
};
```

### Update `App.tsx`

Change the data source URLs to Google Sheets:

```typescript
const hydrateFromCsv = useCallback(async () => {
  const [userData, bookedSeatData] = await Promise.all([
    // Replace with your Google Sheets URLs
    loadCSVData(
      "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit#gid=0"
    ),
    loadBookedSeatData(
      "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit#gid=123456"
    ),
  ]);

  // ... rest of the code
}, []);
```

---

## 🔄 Step 3: Auto-Refresh Feature

Add auto-refresh to check for new registrations every few minutes:

```typescript
// In App.tsx, add auto-refresh effect
useEffect(() => {
  // Auto-refresh every 2 minutes (120000ms)
  const intervalId = setInterval(() => {
    handleRefreshData();
  }, 120000);

  return () => clearInterval(intervalId);
}, [handleRefreshData]);
```

---

## 🔐 Step 4: Security Considerations

### For Production Use:

1. **Never expose API keys in frontend code**
2. **Create a backend API** (Node.js/Express) to:
   - Authenticate with Google Sheets API
   - Fetch data securely
   - Serve data to your frontend

### Backend Example (Node.js + Express):

```javascript
// server.js
const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");

const app = express();
app.use(cors());

const sheets = google.sheets("v4");

app.get("/api/users", async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "Users!A:E",
      auth: process.env.GOOGLE_API_KEY,
    });

    const rows = response.data.values;
    const users = rows.slice(1).map((row, index) => ({
      id: index + 1,
      name: row[1],
      email: row[2],
      phone: row[3],
      category: row[4],
    }));

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log("API running on port 3001"));
```

Then update your frontend to fetch from `http://localhost:3001/api/users`

---

## 📱 Step 5: Google Forms Integration

### Create Registration Form

1. Create a Google Form with fields:

   - Name (Short answer)
   - Email (Short answer)
   - Phone (Short answer)
   - Category (Multiple choice: VIP, Guests, Faculty, Degree Students, College Students)

2. Link responses to your Google Sheet

3. Share the form link for registrations

---

## ⚡ Quick Setup (Public Sheet Method)

If you want to test quickly without backend:

1. **Make your Google Sheet public** (read-only)
2. **Get the sheet URL**
3. **Update App.tsx:**

```typescript
const USERS_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit#gid=0";
const BOOKED_SEATS_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit#gid=1";

const hydrateFromCsv = useCallback(async () => {
  const [userData, bookedSeatData] = await Promise.all([
    loadCSVData(USERS_SHEET_URL),
    loadBookedSeatData(BOOKED_SEATS_SHEET_URL),
  ]);
  // ... rest
}, []);
```

---

## ✅ Testing

1. Add a test entry to your Google Sheet
2. Click **"🔄 Refresh CSV Data"** button
3. Verify the new entry appears in the system

---

## 🎓 For Your Sir

Tell your sir that:

1. **He can use Google Forms** to collect registrations
2. **Responses go directly to Google Sheets**
3. **The system auto-refreshes** every 2 minutes to show new registrations
4. **He can view all data** using the "📊 View CSV Data" button
5. **No manual CSV upload needed** - everything is automatic!

---

## 🚨 Important Notes

- **CORS Issues**: If you get CORS errors, you need a backend proxy
- **Rate Limits**: Google Sheets API has rate limits (100 requests per 100 seconds)
- **For large events**: Consider using a database (Firebase, MongoDB) instead
- **Real-time updates**: For instant updates, use Firebase Realtime Database or Socket.io

---

## 📚 Resources

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Papa Parse Documentation](https://www.papaparse.com/)
- [CORS Proxy Services](https://cors-anywhere.herokuapp.com/)

---

**Need help?** Let me know if you want me to set up the backend API or Firebase integration!
