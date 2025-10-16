# 🎫 Ticket Naming Quick Reference

**Last Updated**: October 16, 2025

---

## 📋 Naming Convention

| Category             | Prefix | Pattern           | Example         | Count  |
| -------------------- | ------ | ----------------- | --------------- | ------ |
| **Degree Students**  | `D`    | `ticket_D{N}.pdf` | `ticket_D1.pdf` | 175    |
| **College Students** | `C`    | `ticket_C{N}.pdf` | `ticket_C1.pdf` | 381    |
| **Faculty**          | `F`    | `ticket_F{N}.pdf` | `ticket_F1.pdf` | future |
| **VIP**              | `V`    | `ticket_V{N}.pdf` | `ticket_V1.pdf` | future |
| **Guests**           | `G`    | `ticket_G{N}.pdf` | `ticket_G1.pdf` | future |
| **Parents**          | `P`    | `ticket_P{N}.pdf` | `ticket_P1.pdf` | future |

---

## 📧 Email Field Policy

| Category             | Email on Ticket | Reason                        |
| -------------------- | --------------- | ----------------------------- |
| Degree Students (D)  | ❌ No           | Privacy for degree recipients |
| College Students (C) | ✅ Yes          | Contact information           |
| Faculty (F)          | ✅ Yes          | Professional contact          |
| VIP (V)              | ❌ No           | Privacy protection            |
| Guests (G)           | ✅ Yes          | Event communication           |
| Parents (P)          | ✅ Yes          | Emergency contact             |

---

## 🚀 Quick Commands

### Generate All Tickets

```bash
npm run generate-tickets
```

### Filter by Category

```powershell
# Degree students only
Get-ChildItem tickets\ticket_D*.pdf

# College students only
Get-ChildItem tickets\ticket_C*.pdf

# Count by category
(Get-ChildItem tickets\ticket_D*.pdf).Count  # 175
(Get-ChildItem tickets\ticket_C*.pdf).Count  # 381
```

### Open Samples

```powershell
Start-Process tickets\ticket_D1.pdf   # Degree
Start-Process tickets\ticket_C1.pdf   # College
```

---

## 📊 Current Status

**Total Tickets**: 556

- Degree (D): 175 ✅
- College (C): 381 ✅

**Email Field**:

- Degree: ❌ Removed
- College: ✅ Present

**Format**: Single-page PDF, ~5.5KB each

---

## 📖 Full Documentation

See: `docs/TICKET_NAMING_UPDATE.md`
