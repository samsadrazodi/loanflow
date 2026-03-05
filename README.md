# LoanFlow 🚀

**Smart Loan Processing Dashboard**

A modern loan processing management system with role-based dashboards for Loan Processors and Loan Officers. Built to help you manage 20+ loans effortlessly.

---

## ✨ Features

### 👨‍💼 For Loan Processors (LOP):
- ⚡ **Urgent Tasks Dashboard** - See what needs immediate attention today
- 📅 **This Week View** - Upcoming deadlines at a glance  
- 📊 **Pipeline Kanban** - Visualize all loans across 6 stages
- ✅ **Task Management** - Mark complete, add notes, track follow-ups
- 📱 **Mobile-First** - Works perfectly on your phone

### 💼 For Loan Officers (LO):
- 💰 **Revenue Dashboard** - Track pipeline value and closing metrics
- 🔔 **Priority Alerts** - See loans needing your attention
- 📈 **Pipeline Overview** - High-level view of all stages
- 🎯 **Closing Timeline** - Track what's closing this week/month
- 🤝 **Borrower Status** - See responsiveness and activity

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Authentication)
- **Deployment**: Vercel
- **Security**: Row Level Security (RLS) for role-based access

---

# 📦 **COMPLETE DEPLOYMENT GUIDE**

Follow these steps to get LoanFlow live in **~15 minutes**

---

## **STEP 1: Create Supabase Project** ⏱️ 5 minutes

### 1.1 - Create New Project

1. Go to **[supabase.com](https://supabase.com)** and sign in (or create free account)
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: `loanflow`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your location
   - **Plan**: Free (perfect for demo)
4. Click **"Create new project"**
5. ⏳ Wait 2-3 minutes for setup to complete

### 1.2 - Create Authentication Users

1. In your Supabase dashboard, go to **Authentication** → **Users** (left sidebar)
2. Click **"Add user"** → **"Create new user"**

**Create User #1 (Loan Processor):**
   - Email: `sam@example.com`
   - Password: `demo123`
   - ✅ **IMPORTANT**: Check "Auto Confirm User"
   - Click "Create user"

**Create User #2 (Loan Officer):**
   - Email: `lo@example.com`
   - Password: `demo123`
   - ✅ **IMPORTANT**: Check "Auto Confirm User"
   - Click "Create user"

### 1.3 - Copy User IDs (CRITICAL!)

After creating both users:

1. Click on **sam@example.com** in the users list
2. Copy the **User UID** (looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)
3. Paste it somewhere safe (you'll need it in Step 2)
4. Go back and click on **lo@example.com**
5. Copy **their User UID** too
6. Save both UUIDs - you'll need them shortly!

### 1.4 - Get API Credentials

1. Click **⚙️ Project Settings** (bottom left)
2. Click **API** in the settings menu
3. You'll see two important values - **copy both**:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (long string under "Project API keys")
4. Save these somewhere - you'll need them in Step 3

---

## **STEP 2: Setup Database** ⏱️ 5 minutes

### 2.1 - Run Schema (Create Tables)

1. In Supabase, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open the file `supabase-schema.sql` (from the LoanFlow zip)
4. **Copy ALL the contents** and paste into the SQL Editor
5. Click **▶️ RUN** (bottom right corner)
6. You should see: ✅ **"Success. No rows returned"**

### 2.2 - Add Sample Data

1. Open the file `supabase-seed-data.sql` in a text editor
2. **FIND AND REPLACE** (this is critical!):
   
   Press `Ctrl+F` (or `Cmd+F` on Mac) and replace:
   
   - Find: `YOUR_LOP_USER_ID`
   - Replace with: **(paste sam@example.com's UUID here)**
   - Click "Replace All"
   
   Then:
   
   - Find: `YOUR_LO_USER_ID`
   - Replace with: **(paste lo@example.com's UUID here)**
   - Click "Replace All"

3. **Verify** the UUIDs are replaced (you should see real UUIDs, not "YOUR_...")
4. Go back to **SQL Editor** in Supabase
5. Click **"New query"**
6. **Copy ALL the edited contents** of `supabase-seed-data.sql`
7. Paste into SQL Editor
8. Click **▶️ RUN**
9. You should see: ✅ **"Success"** messages

### 2.3 - Verify Data Was Inserted

1. Go to **Table Editor** (left sidebar)
2. Click on **"loans"** table
3. You should see **22 loans** listed (Johnson, Chen, Davis, etc.)
4. If you see the loans, you're good! ✅

---

## **STEP 3: Deploy to Vercel** ⏱️ 5 minutes

### Option A: GitHub Upload (Recommended)

1. **Extract the LoanFlow.zip** file on your computer
2. Go to **[github.com](https://github.com)** and sign in
3. Click **"+"** → **"New repository"**
4. Repository name: `loanflow`
5. Make it **Public** or **Private** (your choice)
6. Click **"Create repository"**

7. **Upload files**:
   - Click **"uploading an existing file"**
   - Drag the **entire extracted loanflow folder contents** into GitHub
   - OR click "choose your files" and select all files
   - Scroll down and click **"Commit changes"**

8. Go to **[vercel.com](https://vercel.com)** and sign in (with GitHub)
9. Click **"Add New..."** → **"Project"**
10. Find your `loanflow` repository and click **"Import"**

11. **Add Environment Variables** (CRITICAL!):
    - Click "Environment Variables" section
    - Add Variable #1:
      - Name: `NEXT_PUBLIC_SUPABASE_URL`
      - Value: *(paste your Supabase Project URL)*
    - Add Variable #2:
      - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
      - Value: *(paste your Supabase anon key)*

12. Click **"Deploy"**
13. ⏳ Wait 2-3 minutes for deployment
14. 🎉 You'll get a URL like: `https://loanflow.vercel.app`

### Option B: Vercel CLI (For developers)

```bash
# Extract and navigate
unzip loanflow.zip
cd loanflow

# Install Vercel CLI (one time)
npm install -g vercel

# Deploy
vercel

# Add environment variables when prompted
# Then deploy to production:
vercel --prod
```

---

## **STEP 4: TEST YOUR APP!** ⏱️ 2 minutes

### 4.1 - Test as Loan Processor

1. Open your Vercel URL (e.g., `https://loanflow.vercel.app`)
2. Login with:
   - **Email**: `sam@example.com`
   - **Password**: `demo123`
3. ✅ You should see the **LOP Dashboard** with 5 urgent tasks

### 4.2 - Test as Loan Officer

1. Click **"Logout"**
2. Login with:
   - **Email**: `lo@example.com`
   - **Password**: `demo123`
3. ✅ You should see the **LO Dashboard** with revenue metrics

---

## **STEP 5: Share with Your Friend!** 📲

Send them:
```
Check out LoanFlow: https://your-url.vercel.app

Login: lo@example.com
Password: demo123

This is YOUR view as the loan officer!
```

---

## 🎯 **Demo Credentials**

| Role | Email | Password |
|------|-------|----------|
| **Loan Processor** | sam@example.com | demo123 |
| **Loan Officer** | lo@example.com | demo123 |

---

## 🐛 **Troubleshooting**

**"No loans showing"**
→ Check that you replaced the UUIDs in seed data SQL

**"Can't log in"**
→ Verify you created auth users and checked "Auto Confirm"

**"Environment variable not defined"**
→ Add them in Vercel Settings → Environment Variables → Redeploy

---

Built with ❤️ for loan processors everywhere
