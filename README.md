<<<<<<< HEAD
markdown


# TUSHAR — Monthly Budget Calculator 2026
A modern, responsive, and lightweight personal finance management web application designed for students and professionals to track monthly budgets, daily expenses, and savings targets across all 12 months of 2026.
Built with **semantic HTML5**, **vanilla CSS3**, and **pure JavaScript (ES6+)** with **LocalStorage** persistence and interactive **Chart.js** data visualization.
---
## 1. Project Purpose
Managing monthly college allowances, gym subscriptions, high-protein diets (paneer, oats, soya chunks), travel, study materials, and mobile recharges can be challenging. 
This application provides:
- A clean, calm pastel interface to record and categorize everyday expenses in Indian Rupees (**₹**).
- Real-time calculations for **Allocated Budget**, **Total Expenses**, **Remaining Balance**, and **Potential Savings**.
- Visual feedback via **Circular Progress Rings** that dynamically change color from mint green to caution orange and alert red as spending approaches limits.
- Complete data separation across **all 12 months of 2026**.
- Zero dependencies on backend servers or paid APIs—everything runs instantly in any modern web browser.
---
## 2. Key Features
- **12-Month Partitioned State (2026)**:
  - Independent monthly budgets (default ₹9,000 for January 2026) and optional savings targets.
  - Seamless month-to-month switching with complete data isolation.
- **Four Summary Metric Cards**:
  - **Monthly Budget**: Displays assigned funds with Indian number formatting (`₹9,000`).
  - **Total Expenses**: Aggregates all transactions for the active month.
  - **Remaining Balance**: Shows spendable funds left; automatically alerts with an overspent deficit notice if expenses exceed budget.
  - **Potential Savings**: Tracks unspent funds and monitors progress against an optional monthly savings goal.
- **Four Circular Progress Rings**:
  - **Ring 1 (Budget Used)**: Animated SVG ring calculating `(Total Expenses / Monthly Budget) × 100%` with adaptive color changes (Mint <75%, Amber 75-99%, Soft Red ≥100%).
  - **Ring 2 (Remaining Budget)**: Percentage of budget available to spend safely.
  - **Ring 3 (Top Expense Share)**: Proportional share of your highest-spending category.
  - **Ring 4 (Savings Target)**: Progress toward your personal monthly savings target.
- **8 Predefined Categories + Subcategory Suggestion Chips**:
  - 🏋️ **Gym**: Gym membership, protein shaker, dumbbells, gym gloves, supplements.
  - 🥗 **Food & Diet**: Paneer, oats, soya chunks, milk & curd, bananas, peanut butter, veggies.
  - 🚌 **Travel**: Metro card recharge, bus pass, auto fare, petrol, cab ride.
  - 📱 **Mobile & Internet**: Jio/Airtel recharge, hostel Wi-Fi, data booster.
  - 📚 **Education**: Reference books, notebooks & pens, exam fees, courses.
  - 🛍️ **Shopping & Personal**: Clothes, grooming, laundry, essentials.
  - 🎬 **Entertainment**: Movies, streaming subscriptions, weekend outings.
  - 📦 **Other**: Miscellaneous campus expenses.
  - *Custom Category Creator* included!
- **Daily Expense Entry Form**:
  - Strict date validation ensuring expenses can only be saved to the currently selected month and year.
  - Subcategory suggestion chips that auto-populate the expense title with one click.
- **Expense History Table**:
  - Real-time instant search by title and note.
  - Category filter dropdown.
  - Date sorting toggle (Newest First / Oldest First).
  - Edit Modal with pre-filled inputs and validation.
  - Delete Modal with confirmation dialog.
- **Smart Budget Warning Banners**:
  - 50% Threshold: Moderate spending notice.
  - 75% Threshold: Gentle warning.
  - 90% Threshold: High alert banner.
  - >100% Threshold: Overspent critical banner.
- **Data Portability**:
  - **Export to CSV**: Instant download formatted with UTF-8 BOM for Microsoft Excel & Google Sheets.
  - **Reset Month**: Reset current month's expenses and budget back to defaults with confirmation.
---
## 3. Project Structure
Monthly-Budget-Calculator/ ├── index.html # HTML5 structure, semantic layouts, SVG rings, modals ├── style.css # Vanilla CSS3, pastel design system, responsive breakpoints ├── script.js # Vanilla JS state manager, calculations, LocalStorage, Chart.js └── README.md # Complete documentation and setup guide



All file paths are relative and self-contained.
---
## 4. How to Open the Project in VS Code
1. **Launch VS Code**.
2. Click on **File > Open Folder...** (or press `Ctrl + K, Ctrl + O` on Windows).
3. Navigate to the project directory:
C:\Users\Tushar.gemini\antigravity\scratch\Monthly-Budget-Calculator



4. Click **Select Folder**.
5. You will see the four project files (`index.html`, `style.css`, `script.js`, `README.md`) in the VS Code File Explorer sidebar.
---
## 5. How to Run Using VS Code Live Server
Running the application through a local web server like Live Server prevents browser CORS restrictions when loading scripts and icons.
### Step-by-Step Installation:
1. In VS Code, click on the **Extensions** icon on the left sidebar (or press `Ctrl + Shift + X`).
2. In the search bar, type `Live Server`.
3. Locate **Live Server** by *Ritwick Dey* and click **Install**.
4. Once installed, open `index.html` in your editor.
5. Right-click anywhere inside `index.html` and choose **"Open with Live Server"** (or click the **"Go Live"** button on the bottom status bar).
6. Your default web browser will automatically open:
http://127.0.0.1:5500/index.html



---
## 6. How LocalStorage Works
All application data is persisted directly in your browser's **Web Storage API** under the key `tushar_budget_calculator_2026`.
### Data Schema:
```json
{
"customCategories": ["Health & Supplements"],
"months": {
 "2026-01": {
   "budget": 9000,
   "savingsTarget": 2000,
   "expenses": [
     {
       "id": "exp-1",
       "title": "Monthly Gym Membership",
       "amount": 1000,
       "category": "Gym",
       "date": "2026-01-02",
       "note": "College campus fitness club renewal"
     }
   ]
 },
 "2026-02": {
   "budget": 9000,
   "savingsTarget": 2000,
   "expenses": []
 }
}
=======
markdown


# TUSHAR — Monthly Budget Calculator 2026
A modern, responsive, and lightweight personal finance management web application designed for students and professionals to track monthly budgets, daily expenses, and savings targets across all 12 months of 2026.
Built with **semantic HTML5**, **vanilla CSS3**, and **pure JavaScript (ES6+)** with **LocalStorage** persistence and interactive **Chart.js** data visualization.
---
## 1. Project Purpose
Managing monthly college allowances, gym subscriptions, high-protein diets (paneer, oats, soya chunks), travel, study materials, and mobile recharges can be challenging. 
This application provides:
- A clean, calm pastel interface to record and categorize everyday expenses in Indian Rupees (**₹**).
- Real-time calculations for **Allocated Budget**, **Total Expenses**, **Remaining Balance**, and **Potential Savings**.
- Visual feedback via **Circular Progress Rings** that dynamically change color from mint green to caution orange and alert red as spending approaches limits.
- Complete data separation across **all 12 months of 2026**.
- Zero dependencies on backend servers or paid APIs—everything runs instantly in any modern web browser.
---
## 2. Key Features
- **12-Month Partitioned State (2026)**:
  - Independent monthly budgets (default ₹9,000 for January 2026) and optional savings targets.
  - Seamless month-to-month switching with complete data isolation.
- **Four Summary Metric Cards**:
  - **Monthly Budget**: Displays assigned funds with Indian number formatting (`₹9,000`).
  - **Total Expenses**: Aggregates all transactions for the active month.
  - **Remaining Balance**: Shows spendable funds left; automatically alerts with an overspent deficit notice if expenses exceed budget.
  - **Potential Savings**: Tracks unspent funds and monitors progress against an optional monthly savings goal.
- **Four Circular Progress Rings**:
  - **Ring 1 (Budget Used)**: Animated SVG ring calculating `(Total Expenses / Monthly Budget) × 100%` with adaptive color changes (Mint <75%, Amber 75-99%, Soft Red ≥100%).
  - **Ring 2 (Remaining Budget)**: Percentage of budget available to spend safely.
  - **Ring 3 (Top Expense Share)**: Proportional share of your highest-spending category.
  - **Ring 4 (Savings Target)**: Progress toward your personal monthly savings target.
- **8 Predefined Categories + Subcategory Suggestion Chips**:
  - 🏋️ **Gym**: Gym membership, protein shaker, dumbbells, gym gloves, supplements.
  - 🥗 **Food & Diet**: Paneer, oats, soya chunks, milk & curd, bananas, peanut butter, veggies.
  - 🚌 **Travel**: Metro card recharge, bus pass, auto fare, petrol, cab ride.
  - 📱 **Mobile & Internet**: Jio/Airtel recharge, hostel Wi-Fi, data booster.
  - 📚 **Education**: Reference books, notebooks & pens, exam fees, courses.
  - 🛍️ **Shopping & Personal**: Clothes, grooming, laundry, essentials.
  - 🎬 **Entertainment**: Movies, streaming subscriptions, weekend outings.
  - 📦 **Other**: Miscellaneous campus expenses.
  - *Custom Category Creator* included!
- **Daily Expense Entry Form**:
  - Strict date validation ensuring expenses can only be saved to the currently selected month and year.
  - Subcategory suggestion chips that auto-populate the expense title with one click.
- **Expense History Table**:
  - Real-time instant search by title and note.
  - Category filter dropdown.
  - Date sorting toggle (Newest First / Oldest First).
  - Edit Modal with pre-filled inputs and validation.
  - Delete Modal with confirmation dialog.
- **Smart Budget Warning Banners**:
  - 50% Threshold: Moderate spending notice.
  - 75% Threshold: Gentle warning.
  - 90% Threshold: High alert banner.
  - >100% Threshold: Overspent critical banner.
- **Data Portability**:
  - **Export to CSV**: Instant download formatted with UTF-8 BOM for Microsoft Excel & Google Sheets.
  - **Reset Month**: Reset current month's expenses and budget back to defaults with confirmation.
---
## 3. Project Structure
Monthly-Budget-Calculator/ ├── index.html # HTML5 structure, semantic layouts, SVG rings, modals ├── style.css # Vanilla CSS3, pastel design system, responsive breakpoints ├── script.js # Vanilla JS state manager, calculations, LocalStorage, Chart.js └── README.md # Complete documentation and setup guide



All file paths are relative and self-contained.
---
## 4. How to Open the Project in VS Code
1. **Launch VS Code**.
2. Click on **File > Open Folder...** (or press `Ctrl + K, Ctrl + O` on Windows).
3. Navigate to the project directory:
C:\Users\Tushar.gemini\antigravity\scratch\Monthly-Budget-Calculator



4. Click **Select Folder**.
5. You will see the four project files (`index.html`, `style.css`, `script.js`, `README.md`) in the VS Code File Explorer sidebar.
---
## 5. How to Run Using VS Code Live Server
Running the application through a local web server like Live Server prevents browser CORS restrictions when loading scripts and icons.
### Step-by-Step Installation:
1. In VS Code, click on the **Extensions** icon on the left sidebar (or press `Ctrl + Shift + X`).
2. In the search bar, type `Live Server`.
3. Locate **Live Server** by *Ritwick Dey* and click **Install**.
4. Once installed, open `index.html` in your editor.
5. Right-click anywhere inside `index.html` and choose **"Open with Live Server"** (or click the **"Go Live"** button on the bottom status bar).
6. Your default web browser will automatically open:
http://127.0.0.1:5500/index.html



---
## 6. How LocalStorage Works
All application data is persisted directly in your browser's **Web Storage API** under the key `tushar_budget_calculator_2026`.
### Data Schema:
```json
{
"customCategories": ["Health & Supplements"],
"months": {
 "2026-01": {
   "budget": 9000,
   "savingsTarget": 2000,
   "expenses": [
     {
       "id": "exp-1",
       "title": "Monthly Gym Membership",
       "amount": 1000,
       "category": "Gym",
       "date": "2026-01-02",
       "note": "College campus fitness club renewal"
     }
   ]
 },
 "2026-02": {
   "budget": 9000,
   "savingsTarget": 2000,
   "expenses": []
 }
}
>>>>>>> 57d7feda4aa3efa2791f8d72c16559fcc055f52d
}