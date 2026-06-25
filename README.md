# 📊 Multi-Company Production Management System

A professional, scalable production management platform that serves multiple companies with complete data isolation. Built with React 19 and Firebase.

## 🎯 Key Features

### Multi-Tenant Architecture
- ✅ Support unlimited companies
- ✅ Complete data isolation per company
- ✅ Company-specific dashboards and reports
- ✅ Seamless company switching
- ✅ Scalable Firestore structure

### 6 User Roles with Granular Permissions

| Role | Permissions |
|------|-------------|
| **Super Admin** | Manage all companies, view all data, system administration |
| **Company Admin** | Manage company users, employees, and settings |
| **Supervisor** | Create & manage batches, add products & employees |
| **Ops Head** | Full access to company operations |
| **Quality Check** | View batches, download reports |
| **Worker** | Update production data, set timings |

### 5 Core Screens

1. **Dashboard** - Real-time KPIs and batch overview
   - Total/Running/Completed batches
   - Total products and employees
   - Today's batch count
   - Recent batches table

2. **Batches** - Production batch management
   - Create new batches (TABLE01-05)
   - Assign multiple SKUs per batch
   - Assign multiple workers
   - Track start/end times per SKU
   - Status updates (Pending, Running, Completed)
   - Filter by status

3. **Products (SKUs)** - Product catalog
   - Add/Edit/Delete SKUs
   - SKU codes and product names
   - Company-specific catalog

4. **Employees** - Workforce management
   - Add/Edit/Delete employees
   - Department assignment
   - Company-specific workforce

5. **Reports & Analytics** - Excel export
   - Production Report (Batch | Date | Status | SKU | Times | Qty | Workers)
   - Employee Performance Report (Name | Dept | Total Batches | Status)
   - Download history tracking

6. **Company Management** (Super Admin only)
   - Create new companies
   - Manage company administrators
   - View company statistics
   - User access control

### Authentication
- ✅ Email/Password with JWT
- ✅ Google Sign-In (OAuth)
- ✅ 7-day session persistence
- ✅ Company assignment on signup

### Design
- ✅ Professional blue accent color (#0055FF)
- ✅ Responsive mobile-first design
- ✅ Color-coded status (🟡 Pending, 🔵 Running, 🟢 Completed)
- ✅ TailwindCSS + modern UI
- ✅ Monospace fonts for technical IDs

## 🏗️ Data Model

```
Firestore Structure:

companies/
  ├── {companyId}
  │   ├── name: "Company Name"
  │   ├── industry: "Manufacturing"
  │   ├── createdAt: timestamp
  │   ├── batches/
  │   │   └── {batchId}
  │   │       ├── tableNumber: "TABLE01"
  │   │       ├── date: "2026-06-25"
  │   │       ├── status: "Running"
  │   │       ├── products: [{skuCode, targetQty, actualQty, startTime, endTime}]
  │   │       └── workers: [{workerId, name, department}]
  │   ├── products/
  │   │   └── {productId}
  │   │       ├── skuCode: "7R-PCH"
  │   │       └── productName: "7-Ring Pouch"
  │   └── employees/
  │       └── {employeeId}
  │           ├── name: "John Doe"
  │           └── department: "Production"
  │
users/
  └── {userId}
      ├── email: "user@company.com"
      ├── displayName: "John Doe"
      ├── role: "supervisor"
      └── companyAccess: [companyId1, companyId2]
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 16+
- Firebase project (free tier available)

### Steps

1. **Clone Repository**
```bash
git clone https://github.com/yogeshwaydande87/PRODUCUTION-SLIP.git
cd PRODUCUTION-SLIP
```

2. **Install Dependencies**
```bash
npm install
```

3. **Setup Firebase**
   - Go to [firebase.google.com](https://firebase.google.com)
   - Create new project
   - Enable Firestore Database (test mode)
   - Enable Authentication (Email/Password + Google)
   - Copy credentials to `.env.local`

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase config:
```
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender
REACT_APP_FIREBASE_APP_ID=your_app_id
```

4. **Run Development Server**
```bash
npm start
```

5. **Build for Production**
```bash
npm run build
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables from `.env.local`
5. Click Deploy ✨

### Self-Hosted

```bash
npm run build
# Deploy 'build' folder to your server
```

## 📝 Demo Credentials

```
Email: demo@company.com
Password: Demo123!
```

## 🔐 Firebase Security Rules

```javascript
// Firestore Rules (add to Firebase Console)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /companies/{companyId}/** {
      allow read, write: if request.auth.uid in get(/databases/$(database)/documents/users/$(request.auth.uid)).data.companyAccess;
    }
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
    }
  }
}
```

## 📊 Typical Workflow

### Super Admin
1. Login → Create new company
2. Invite company administrators
3. Monitor all company metrics

### Company Supervisor
1. Login → Select company from dropdown
2. Create production batch
3. Assign SKUs and workers
4. Monitor progress on dashboard

### Workers
1. Login → View assigned batches
2. Update quantity/timing as production progresses
3. Mark batch complete when done

### End of Day
1. Supervisor generates production report
2. Download Excel for management review
3. System maintains complete audit trail

## 🎨 Design Philosophy

- **Clean & Professional** - Enterprise-grade interface
- **Color-Coded Status** - Visual clarity for batch states
- **Mobile-First** - Works perfectly on phones and tablets
- **Data Isolation** - Each company's data completely separate
- **Scalable** - Designed to handle thousands of companies

## 📱 Responsive Design

- **Desktop (1024px+)** - Full sidebar + content
- **Tablet (768px+)** - Optimized layouts
- **Mobile (<768px)** - Hamburger menu + stacked cards

## 🐛 Troubleshooting

### Firebase Connection Issues
- Verify `.env.local` configuration
- Check Firebase security rules
- Ensure Firestore is in test mode initially

### Build Errors
- Delete `node_modules` and reinstall: `npm install`
- Clear cache: `npm cache clean --force`
- Check Node.js version: `node --version` (should be 16+)

## 📞 Support

For issues or feature requests, create an issue on GitHub.

## 📄 License

MIT License - Free for personal and commercial use.

---

**Built for multi-company manufacturing operations** ⚙️
