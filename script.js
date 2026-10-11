/**
 * ==============================================================================
 * TUSHAR — MONTHLY BUDGET CALCULATOR 2026
 * Pure Vanilla JavaScript Application Logic
 * ==============================================================================
 * Author: Tushar (B.Tech CSE)
 * Features:
 *   - 12-Month Partitioned State (2026)
 *   - LocalStorage Sync & Safe Recovery
 *   - Indian Rupee (₹) Currency Formatter
 *   - Dynamic SVG Circular Progress Rings
 *   - Chart.js Doughnut Breakdown
 *   - Category Progress Bars
 *   - Date Validation (Strict to Selected Month)
 *   - Edit & Delete Modals with Confirmation
 *   - Real-time Search & Filter
 *   - CSV Export & Reset Actions
 * ==============================================================================
 */

"use strict";

(function () {
  // ----------------------------------------------------------------------------
  // 1. CONSTANTS & DEFAULT CONFIGURATION
  // ----------------------------------------------------------------------------
  const YEAR = 2026;
  const STORAGE_KEY = "tushar_budget_calculator_2026";
  const CIRCLE_RADIUS = 56;
  const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS; // ~351.86

  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const MONTH_SHORT_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Default 8 Categories with Predefined Suggestion Chips
  const DEFAULT_CATEGORIES = {
    "Gym": ["Gym membership", "Protein shaker", "Dumbbells", "Gym gloves", "Supplements"],
    "Food & Diet": ["Paneer", "Oats", "Soya chunks", "Milk & Curd", "Bananas", "Peanut butter", "Eggs", "Veggies"],
    "Travel": ["Metro card recharge", "Bus pass", "Auto fare", "Petrol", "Cab ride"],
    "Mobile & Internet": ["Jio/Airtel recharge", "Hostel Wi-Fi", "Data booster", "Hotspot plan"],
    "Education": ["Reference book", "Notebooks & pens", "Exam fee", "Online course", "Photocopies"],
    "Shopping & Personal": ["T-Shirt", "Sneakers", "Face wash", "Haircut", "Laundry detergent"],
    "Entertainment": ["Movie ticket", "Netflix subscription", "Spotify", "Gaming café", "Weekend hangout"],
    "Other": ["Stationery", "Emergency printouts", "Medicine", "Miscellaneous"]
  };

  // Pastel Colors Palette for Chart & Categories
  const CATEGORY_COLORS = {
    "Gym": "#38b2ac",
    "Food & Diet": "#805ad5",
    "Travel": "#3182ce",
    "Mobile & Internet": "#dd6b20",
    "Education": "#4a5568",
    "Shopping & Personal": "#e53e3e",
    "Entertainment": "#d69e2e",
    "Other": "#718096"
  };

  // ----------------------------------------------------------------------------
  // 2. APPLICATION STATE
  // ----------------------------------------------------------------------------
  let appData = {};
  let currentMonthIndex = 0; // 0 = January, 11 = December
  let sortNewestFirst = true;
  let chartInstance = null;
  let pendingDeleteId = null;

  // ----------------------------------------------------------------------------
  // 3. DOM ELEMENT REFERENCES
  // ----------------------------------------------------------------------------
  const DOM = {
    // Navigation & Headers
    monthList: document.getElementById("monthList"),
    mobileMonthSelect: document.getElementById("mobileMonthSelect"),
    currentMonthYearDisplay: document.getElementById("currentMonthYearDisplay"),
    stepperMonthName: document.getElementById("stepperMonthName"),
    btnPrevMonth: document.getElementById("btnPrevMonth"),
    btnNextMonth: document.getElementById("btnNextMonth"),
    btnExportCSV: document.getElementById("btnExportCSV"),
    btnResetMonth: document.getElementById("btnResetMonth"),

    // Budget Controls
    budgetCardMonthName: document.getElementById("budgetCardMonthName"),
    monthlyBudgetInput: document.getElementById("monthlyBudgetInput"),
    btnEditBudget: document.getElementById("btnEditBudget"),
    btnSaveBudget: document.getElementById("btnSaveBudget"),
    btnCancelBudget: document.getElementById("btnCancelBudget"),
    budgetInputHelper: document.getElementById("budgetInputHelper"),

    // Savings Target Controls
    savingsTargetInput: document.getElementById("savingsTargetInput"),
    btnEditSavings: document.getElementById("btnEditSavings"),
    btnSaveSavings: document.getElementById("btnSaveSavings"),
    btnCancelSavings: document.getElementById("btnCancelSavings"),

    // Alert Banner
    budgetAlertBanner: document.getElementById("budgetAlertBanner"),
    alertTitle: document.getElementById("alertTitle"),
    alertMessage: document.getElementById("alertMessage"),
    alertIconWrapper: document.getElementById("alertIconWrapper"),

    // 4 Metric Summary Cards
    displayMonthlyBudget: document.getElementById("displayMonthlyBudget"),
    displayTotalExpenses: document.getElementById("displayTotalExpenses"),
    displayExpenseCount: document.getElementById("displayExpenseCount"),
    displayRemainingBalance: document.getElementById("displayRemainingBalance"),
    remainingBalanceTitle: document.getElementById("remainingBalanceTitle"),
    remainingBalanceNotice: document.getElementById("remainingBalanceNotice"),
    cardRemainingBalance: document.getElementById("cardRemainingBalance"),
    displayPotentialSavings: document.getElementById("displayPotentialSavings"),
    displaySavingsGoalStatus: document.getElementById("displaySavingsGoalStatus"),

    // 4 Progress Rings
    ringProgressUsed: document.getElementById("ringProgressUsed"),
    ringValueUsed: document.getElementById("ringValueUsed"),
    ringLabelUsed: document.getElementById("ringLabelUsed"),

    ringProgressRemaining: document.getElementById("ringProgressRemaining"),
    ringValueRemaining: document.getElementById("ringValueRemaining"),

    ringProgressTopCat: document.getElementById("ringProgressTopCat"),
    ringValueTopCat: document.getElementById("ringValueTopCat"),
    ringNameTopCat: document.getElementById("ringNameTopCat"),

    ringProgressSavings: document.getElementById("ringProgressSavings"),
    ringValueSavings: document.getElementById("ringValueSavings"),
    ringLabelSavings: document.getElementById("ringLabelSavings"),
    ringDescSavings: document.getElementById("ringDescSavings"),

    // Daily Expense Form
    expenseForm: document.getElementById("expenseForm"),
    expenseTitle: document.getElementById("expenseTitle"),
    expenseAmount: document.getElementById("expenseAmount"),
    expenseDate: document.getElementById("expenseDate"),
    expenseCategory: document.getElementById("expenseCategory"),
    expenseNote: document.getElementById("expenseNote"),
    quickChipsContainer: document.getElementById("quickChipsContainer"),
    quickChipsList: document.getElementById("quickChipsList"),
    btnOpenCustomCatModal: document.getElementById("btnOpenCustomCatModal"),

    // Validation Errors
    errorTitle: document.getElementById("errorTitle"),
    errorAmount: document.getElementById("errorAmount"),
    errorDate: document.getElementById("errorDate"),
    errorCategory: document.getElementById("errorCategory"),

    // Category Breakdown & Chart
    categoryChart: document.getElementById("categoryChart"),
    chartEmptyState: document.getElementById("chartEmptyState"),
    categoryBarsList: document.getElementById("categoryBarsList"),

    // Expense History
    expenseSearchInput: document.getElementById("expenseSearchInput"),
    expenseCategoryFilter: document.getElementById("expenseCategoryFilter"),
    btnSortDate: document.getElementById("btnSortDate"),
    sortOrderLabel: document.getElementById("sortOrderLabel"),
    expenseTableBody: document.getElementById("expenseTableBody"),
    emptyHistoryState: document.getElementById("emptyHistoryState"),
    emptyStateMsg: document.getElementById("emptyStateMsg"),

    // Modals
    editExpenseModal: document.getElementById("editExpenseModal"),
    editExpenseForm: document.getElementById("editExpenseForm"),
    editExpenseId: document.getElementById("editExpenseId"),
    editExpenseTitle: document.getElementById("editExpenseTitle"),
    editExpenseAmount: document.getElementById("editExpenseAmount"),
    editExpenseDate: document.getElementById("editExpenseDate"),
    editExpenseCategory: document.getElementById("editExpenseCategory"),
    editExpenseNote: document.getElementById("editExpenseNote"),
    editErrorTitle: document.getElementById("editErrorTitle"),
    editErrorAmount: document.getElementById("editErrorAmount"),
    editErrorDate: document.getElementById("editErrorDate"),
    editErrorCategory: document.getElementById("editErrorCategory"),
    btnCloseEditModal: document.getElementById("btnCloseEditModal"),
    btnCancelEdit: document.getElementById("btnCancelEdit"),

    deleteConfirmModal: document.getElementById("deleteConfirmModal"),
    deleteExpenseName: document.getElementById("deleteExpenseName"),
    deleteExpenseCost: document.getElementById("deleteExpenseCost"),
    btnCloseDeleteModal: document.getElementById("btnCloseDeleteModal"),
    btnCancelDelete: document.getElementById("btnCancelDelete"),
    btnConfirmDelete: document.getElementById("btnConfirmDelete"),

    customCatModal: document.getElementById("customCatModal"),
    customCatForm: document.getElementById("customCatForm"),
    customCatName: document.getElementById("customCatName"),
    customCatError: document.getElementById("customCatError"),
    btnCloseCatModal: document.getElementById("btnCloseCatModal"),
    btnCancelCustomCat: document.getElementById("btnCancelCustomCat"),

    resetConfirmModal: document.getElementById("resetConfirmModal"),
    resetMonthPromptName: document.getElementById("resetMonthPromptName"),
    btnCloseResetModal: document.getElementById("btnCloseResetModal"),
    btnCancelReset: document.getElementById("btnCancelReset"),
    btnConfirmReset: document.getElementById("btnConfirmReset"),

    toastContainer: document.getElementById("toastContainer")
  };

  // ----------------------------------------------------------------------------
  // 4. STORAGE & DATA MODEL INITIALIZATION
  // ----------------------------------------------------------------------------
  
  /**
   * Generates sample starting data for January 2026 so the dashboard
   * is instantly visually rich and demonstrates real calculations.
   */
  function createInitialSampleData() {
    const data = {
      customCategories: [],
      months: {}
    };

    // Initialize all 12 months with default budget of ₹9,000
    for (let m = 0; m < 12; m++) {
      const monthKey = `${YEAR}-${String(m + 1).padStart(2, "0")}`;
      data.months[monthKey] = {
        budget: 9000,
        savingsTarget: 2000,
        expenses: []
      };
    }

    // Populate realistic student sample expenses for January 2026
    const janKey = `${YEAR}-01`;
    data.months[janKey].expenses = [
      {
        id: "exp-1",
        title: "Monthly Gym Membership",
        amount: 1000,
        category: "Gym",
        date: "2026-01-02",
        note: "College campus fitness club renewal"
      },
      {
        id: "exp-2",
        title: "Paneer & Dairy",
        amount: 80,
        category: "Food & Diet",
        date: "2026-01-04",
        note: "250g fresh paneer for high protein diet"
      },
      {
        id: "exp-3",
        title: "Oats & Soya Chunks",
        amount: 320,
        category: "Food & Diet",
        date: "2026-01-07",
        note: "1kg Rolled Oats + Fortune Soya chunks"
      },
      {
        id: "exp-4",
        title: "Metro Smart Card Recharge",
        amount: 500,
        category: "Travel",
        date: "2026-01-10",
        note: "Commute between hostel and campus"
      },
      {
        id: "exp-5",
        title: "Mobile 84-Days Recharge",
        amount: 719,
        category: "Mobile & Internet",
        date: "2026-01-12",
        note: "1.5GB/day data plan"
      },
      {
        id: "exp-6",
        title: "Data Structures & Algorithms Book",
        amount: 650,
        category: "Education",
        date: "2026-01-16",
        note: "Textbook by Cormen / Reference guide"
      }
    ];

    return data;
  }

  /**
   * Loads persisted data from LocalStorage or bootstraps defaults.
   */
  function loadDataFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.months) {
          appData = parsed;
          for (let m = 0; m < 12; m++) {
            const key = `${YEAR}-${String(m + 1).padStart(2, "0")}`;
            if (!appData.months[key]) {
              appData.months[key] = { budget: 9000, savingsTarget: 2000, expenses: [] };
            }
          }
          if (!Array.isArray(appData.customCategories)) {
            appData.customCategories = [];
          }
          return;
        }
      }
    } catch (err) {
      console.warn("Could not parse LocalStorage data. Resetting to defaults.", err);
    }
    appData = createInitialSampleData();
    saveDataToStorage();
  }

  /**
   * Saves current state to LocalStorage safely.
   */
  function saveDataToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    } catch (err) {
      console.error("Failed to write to LocalStorage:", err);
      showToast("Storage quota exceeded or private mode active", "error");
    }
  }

  function getCurrentMonthKey() {
    return `${YEAR}-${String(currentMonthIndex + 1).padStart(2, "0")}`;
  }

  function getCurrentMonthData() {
    const key = getCurrentMonthKey();
    if (!appData.months[key]) {
      appData.months[key] = { budget: 9000, savingsTarget: 2000, expenses: [] };
    }
    return appData.months[key];
  }

  // ----------------------------------------------------------------------------
  // 5. FORMATTING & MATH UTILITIES
  // ----------------------------------------------------------------------------

  function formatINR(amount) {
    if (isNaN(amount) || amount === null) amount = 0;
    const num = Math.round(Number(amount) * 100) / 100;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: num % 1 === 0 ? 0 : 2
    }).format(num);
  }

  function formatFriendlyDate(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const day = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parts[0];
    return `${day} ${MONTH_SHORT_NAMES[month]} ${year}`;
  }

  function safePercentage(numerator, denominator) {
    if (!denominator || denominator <= 0) return 0;
    const res = (numerator / denominator) * 100;
    return isFinite(res) ? Math.max(0, Math.round(res * 10) / 10) : 0;
  }

  function setRingProgress(circleElement, percentage) {
    if (!circleElement) return;
    const pct = Math.min(Math.max(percentage, 0), 100);
    const offset = CIRCLE_CIRCUMFERENCE - (pct / 100) * CIRCLE_CIRCUMFERENCE;
    circleElement.style.strokeDashoffset = offset;
  }

  // ----------------------------------------------------------------------------
  // 6. TOAST NOTIFICATIONS & SANITIZATION
  // ----------------------------------------------------------------------------
  function showToast(message, type = "success") {
    if (!DOM.toastContainer) return;
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  function escapeHTML(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ----------------------------------------------------------------------------
  // 7. CORE CALCULATIONS & DASHBOARD RENDERING
  // ----------------------------------------------------------------------------

  function updateDashboard() {
    const monthData = getCurrentMonthData();
    const budget = Number(monthData.budget) || 0;
    const savingsTarget = Number(monthData.savingsTarget) || 0;
    const expenses = monthData.expenses || [];

    // 1. Calculations
    const totalExpenses = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const remainingBalance = budget - totalExpenses;
    const potentialSavings = Math.max(0, remainingBalance);
    const overspentAmount = Math.max(0, totalExpenses - budget);
    const isOverspent = totalExpenses > budget && budget > 0;

    // Percentages
    const budgetUsedPct = budget > 0 ? (totalExpenses / budget) * 100 : 0;
    const remainingBudgetPct = budget > 0 ? Math.max(0, (remainingBalance / budget) * 100) : 0;

    // Category Breakdown Calculation
    const categoryTotals = {};
    expenses.forEach((item) => {
      const cat = item.category || "Other";
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(item.amount);
    });

    // 2. Render Header & Month Labels
    const currentMonthLabel = `${MONTH_NAMES[currentMonthIndex]} ${YEAR}`;
    const currentShortLabel = `${MONTH_SHORT_NAMES[currentMonthIndex]} ${YEAR}`;
    DOM.currentMonthYearDisplay.textContent = currentMonthLabel;
    DOM.stepperMonthName.textContent = currentShortLabel;
    DOM.budgetCardMonthName.textContent = currentMonthLabel;
    document.querySelectorAll(".active-month-text").forEach(el => el.textContent = MONTH_NAMES[currentMonthIndex]);

    // Set Default Date in Add Expense Form to current selected month
    const defaultDay = String(Math.min(new Date().getDate(), 28)).padStart(2, "0");
    const monthStr = String(currentMonthIndex + 1).padStart(2, "0");
    DOM.expenseDate.value = `${YEAR}-${monthStr}-${defaultDay}`;
    DOM.expenseDate.min = `${YEAR}-${monthStr}-01`;
    const lastDay = new Date(YEAR, currentMonthIndex + 1, 0).getDate();
    DOM.expenseDate.max = `${YEAR}-${monthStr}-${String(lastDay).padStart(2, "0")}`;

    // 3. Render Budget Inputs
    DOM.monthlyBudgetInput.value = budget;
    DOM.savingsTargetInput.value = savingsTarget > 0 ? savingsTarget : "";

    // 4. Render Summary Cards
    DOM.displayMonthlyBudget.textContent = formatINR(budget);
    DOM.displayTotalExpenses.textContent = formatINR(totalExpenses);
    DOM.displayExpenseCount.textContent = `${expenses.length} transaction${expenses.length === 1 ? "" : "s"} recorded`;

    if (isOverspent) {
      DOM.remainingBalanceTitle.textContent = "Budget Deficit";
      DOM.displayRemainingBalance.textContent = formatINR(overspentAmount);
      DOM.cardRemainingBalance.className = "metric-card card-pink";
      DOM.remainingBalanceNotice.innerHTML = `<span class="card-overspent-badge">Overspent by ${formatINR(overspentAmount)}</span>`;
    } else {
      DOM.remainingBalanceTitle.textContent = "Remaining Balance";
      DOM.displayRemainingBalance.textContent = formatINR(potentialSavings);
      DOM.cardRemainingBalance.className = "metric-card card-pink";
      DOM.remainingBalanceNotice.textContent = "Available funds left to spend";
    }

    DOM.displayPotentialSavings.textContent = formatINR(potentialSavings);
    if (savingsTarget > 0) {
      const savingsMet = potentialSavings >= savingsTarget;
      DOM.displaySavingsGoalStatus.textContent = savingsMet
        ? `Target achieved! (Goal: ${formatINR(savingsTarget)})`
        : `Target: ${formatINR(savingsTarget)} (${formatINR(Math.max(0, savingsTarget - potentialSavings))} needed)`;
    } else {
      DOM.displaySavingsGoalStatus.textContent = "Unspent buffer saved";
    }

    // 5. Render Circular Progress Rings
    renderCircularRings(budget, totalExpenses, budgetUsedPct, remainingBudgetPct, categoryTotals, potentialSavings, savingsTarget);

    // 6. Render Dynamic Budget Alert Banner
    renderAlertBanner(budget, totalExpenses, budgetUsedPct, overspentAmount);

    // 7. Render Category Bars & Doughnut Chart
    renderCategoryAnalytics(categoryTotals, totalExpenses, budget);

    // 8. Render Expense History Table
    renderExpenseTable();

    // 9. Update Sidebar Month List
    renderMonthNavigation();
  }

  // ----------------------------------------------------------------------------
  // 8. PROGRESS RINGS RENDERER
  // ----------------------------------------------------------------------------
  function renderCircularRings(budget, totalExpenses, budgetUsedPct, remainingBudgetPct, categoryTotals, potentialSavings, savingsTarget) {
    // Ring 1: Budget Used
    const displayUsedPct = budget > 0 ? Math.round(budgetUsedPct) : 0;
    DOM.ringValueUsed.textContent = `${displayUsedPct}%`;

    DOM.ringProgressUsed.classList.remove("ring-mint", "ring-amber", "ring-pink");
    if (budget === 0) {
      DOM.ringLabelUsed.textContent = "No Budget";
      DOM.ringProgressUsed.classList.add("ring-mint");
      setRingProgress(DOM.ringProgressUsed, 0);
    } else if (budgetUsedPct >= 100) {
      DOM.ringLabelUsed.textContent = "Exceeded";
      DOM.ringProgressUsed.classList.add("ring-pink");
      setRingProgress(DOM.ringProgressUsed, 100);
    } else if (budgetUsedPct >= 75) {
      DOM.ringLabelUsed.textContent = "Caution";
      DOM.ringProgressUsed.classList.add("ring-amber");
      setRingProgress(DOM.ringProgressUsed, budgetUsedPct);
    } else {
      DOM.ringLabelUsed.textContent = "Healthy";
      DOM.ringProgressUsed.classList.add("ring-mint");
      setRingProgress(DOM.ringProgressUsed, budgetUsedPct);
    }

    // Ring 2: Remaining Budget
    const displayRemPct = budget > 0 ? Math.round(remainingBudgetPct) : 100;
    DOM.ringValueRemaining.textContent = `${displayRemPct}%`;
    setRingProgress(DOM.ringProgressRemaining, displayRemPct);

    // Ring 3: Top Category Proportion
    let topCatName = "None";
    let topCatAmount = 0;
    for (const [cat, amt] of Object.entries(categoryTotals)) {
      if (amt > topCatAmount) {
        topCatAmount = amt;
        topCatName = cat;
      }
    }
    const topCatPct = totalExpenses > 0 ? Math.round((topCatAmount / totalExpenses) * 100) : 0;
    DOM.ringValueTopCat.textContent = `${topCatPct}%`;
    DOM.ringNameTopCat.textContent = topCatAmount > 0 ? topCatName : "No Data";
    setRingProgress(DOM.ringProgressTopCat, topCatPct);

    // Ring 4: Savings Progress Ring
    if (savingsTarget > 0) {
      const savingsPct = Math.min(100, Math.round((potentialSavings / savingsTarget) * 100));
      DOM.ringValueSavings.textContent = `${savingsPct}%`;
      DOM.ringLabelSavings.textContent = potentialSavings >= savingsTarget ? "Achieved" : "In Progress";
      DOM.ringDescSavings.textContent = `Goal: ${formatINR(savingsTarget)}`;
      setRingProgress(DOM.ringProgressSavings, savingsPct);
    } else {
      DOM.ringValueSavings.textContent = "—";
      DOM.ringLabelSavings.textContent = "No Target";
      DOM.ringDescSavings.textContent = "Click 'Set Target' above";
      setRingProgress(DOM.ringProgressSavings, 0);
    }
  }

  // ----------------------------------------------------------------------------
  // 9. DYNAMIC BUDGET ALERT BANNER
  // ----------------------------------------------------------------------------
  function renderAlertBanner(budget, totalExpenses, budgetUsedPct, overspentAmount) {
    if (budget === 0) {
      DOM.budgetAlertBanner.className = "budget-alert-banner alert-moderate";
      DOM.alertTitle.textContent = "ℹ️ Monthly Budget Not Set";
      DOM.alertMessage.textContent = "Please set a monthly budget above to track and visualize your spending limit.";
      return;
    }

    if (totalExpenses > budget) {
      DOM.budgetAlertBanner.className = "budget-alert-banner alert-danger";
      DOM.alertTitle.textContent = "⛔ Critical Alert: Budget Exceeded!";
      DOM.alertMessage.textContent = `You have exceeded your ₹${budget.toLocaleString("en-IN")} budget by ${formatINR(overspentAmount)}. Please review non-essential expenses immediately.`;
    } else if (budgetUsedPct >= 90) {
      DOM.budgetAlertBanner.className = "budget-alert-banner alert-caution";
      DOM.alertTitle.textContent = "🚨 High Alert: Approaching Limit (90%+ Used)";
      DOM.alertMessage.textContent = `You have spent ${Math.round(budgetUsedPct)}% of your monthly budget. Only ${formatINR(budget - totalExpenses)} remaining.`;
    } else if (budgetUsedPct >= 75) {
      DOM.budgetAlertBanner.className = "budget-alert-banner alert-caution";
      DOM.alertTitle.textContent = "⚠️ Gentle Warning: 75%+ Budget Utilized";
      DOM.alertMessage.textContent = `You have utilized ${Math.round(budgetUsedPct)}% of your allocated budget. Plan remaining days prudently.`;
    } else if (budgetUsedPct >= 50) {
      DOM.budgetAlertBanner.className = "budget-alert-banner alert-moderate";
      DOM.alertTitle.textContent = "📊 Moderate Spending: Halfway Mark (50%+ Used)";
      DOM.alertMessage.textContent = `You are halfway through your budget (${Math.round(budgetUsedPct)}% spent). Remaining buffer is ${formatINR(budget - totalExpenses)}.`;
    } else {
      DOM.budgetAlertBanner.className = "budget-alert-banner alert-neutral";
      DOM.alertTitle.textContent = "✨ Great Job: Spending Well Within Budget";
      DOM.alertMessage.textContent = `Only ${Math.round(budgetUsedPct)}% of your budget has been utilized. You have plenty of comfortable buffer remaining.`;
    }
  }

  // ----------------------------------------------------------------------------
  // 10. CATEGORY ANALYTICS & CHART.JS
  // ----------------------------------------------------------------------------
  function renderCategoryAnalytics(categoryTotals, totalExpenses, budget) {
    const categories = Object.keys(categoryTotals);

    if (categories.length === 0 || totalExpenses === 0) {
      DOM.chartEmptyState.style.display = "block";
      DOM.categoryBarsList.innerHTML = `<p style="font-size:0.85rem;color:var(--text-muted);text-align:center;padding:20px 0;">No category data to display.</p>`;
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
      return;
    }

    DOM.chartEmptyState.style.display = "none";

    let barsHtml = "";
    categories.sort((a, b) => categoryTotals[b] - categoryTotals[a]);

    categories.forEach((cat) => {
      const amt = categoryTotals[cat];
      const shareOfTotal = safePercentage(amt, totalExpenses);
      const color = CATEGORY_COLORS[cat] || "#718096";

      barsHtml += `
        <div class="cat-bar-item">
          <div class="cat-bar-header">
            <span class="cat-bar-name">${escapeHTML(cat)}</span>
            <span class="cat-bar-amounts">${formatINR(amt)} &bull; ${shareOfTotal}% share</span>
          </div>
          <div class="cat-progress-track">
            <div class="cat-progress-fill" style="width: ${shareOfTotal}%; background-color: ${color};"></div>
          </div>
        </div>
      `;
    });
    DOM.categoryBarsList.innerHTML = barsHtml;

    const labels = categories;
    const dataValues = categories.map((cat) => categoryTotals[cat]);
    const backgroundColors = categories.map((cat) => CATEGORY_COLORS[cat] || "#a0aec0");

    if (chartInstance) {
      chartInstance.data.labels = labels;
      chartInstance.data.datasets[0].data = dataValues;
      chartInstance.data.datasets[0].backgroundColor = backgroundColors;
      chartInstance.update();
    } else if (typeof Chart !== "undefined") {
      const ctx = DOM.categoryChart.getContext("2d");
      chartInstance = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: labels,
          datasets: [
            {
              data: dataValues,
              backgroundColor: backgroundColors,
              borderWidth: 2,
              borderColor: "#ffffff",
              hoverOffset: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "68%",
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const val = context.raw || 0;
                  const pct = totalExpenses > 0 ? Math.round((val / totalExpenses) * 100) : 0;
                  return ` ${context.label}: ${formatINR(val)} (${pct}%)`;
                }
              }
            }
          }
        }
      });
    }
  }

  // ----------------------------------------------------------------------------
  // 11. EXPENSE HISTORY TABLE (SEARCH, FILTER & SORT)
  // ----------------------------------------------------------------------------
  function renderExpenseTable() {
    const monthData = getCurrentMonthData();
    let expenses = [...(monthData.expenses || [])];

    const searchQuery = (DOM.expenseSearchInput.value || "").trim().toLowerCase();
    if (searchQuery) {
      expenses = expenses.filter((item) => {
        const titleMatch = (item.title || "").toLowerCase().includes(searchQuery);
        const noteMatch = (item.note || "").toLowerCase().includes(searchQuery);
        return titleMatch || noteMatch;
      });
    }

    const catFilter = DOM.expenseCategoryFilter.value;
    if (catFilter && catFilter !== "ALL") {
      expenses = expenses.filter((item) => item.category === catFilter);
    }

    expenses.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortNewestFirst ? dateB - dateA : dateA - dateB;
    });

    if (expenses.length === 0) {
      DOM.expenseTableBody.innerHTML = "";
      DOM.emptyHistoryState.style.display = "block";
      if (searchQuery || catFilter !== "ALL") {
        DOM.emptyStateMsg.textContent = "No expenses match your search or filter criteria.";
      } else {
        DOM.emptyStateMsg.textContent = "You haven't added any expenses for this month yet. Use the form above to record your first expense!";
      }
      return;
    }

    DOM.emptyHistoryState.style.display = "none";

    let rowsHtml = "";
    expenses.forEach((item) => {
      const catClass = getCategoryPillClass(item.category);
      rowsHtml += `
        <tr data-id="${escapeHTML(item.id)}">
          <td>${formatFriendlyDate(item.date)}</td>
          <td class="expense-title-cell">${escapeHTML(item.title)}</td>
          <td><span class="cat-pill ${catClass}">${escapeHTML(item.category)}</span></td>
          <td class="text-right expense-amount-cell">${formatINR(item.amount)}</td>
          <td><span style="color:var(--text-muted);font-size:0.82rem;">${escapeHTML(item.note || "—")}</span></td>
          <td class="text-center">
            <div class="table-actions">
              <button type="button" class="btn-action btn-action-edit" data-edit-id="${escapeHTML(item.id)}" title="Edit Expense" aria-label="Edit Expense">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button type="button" class="btn-action btn-action-delete" data-delete-id="${escapeHTML(item.id)}" title="Delete Expense" aria-label="Delete Expense">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    DOM.expenseTableBody.innerHTML = rowsHtml;
  }

  function getCategoryPillClass(category) {
    switch (category) {
      case "Gym": return "cat-pill-gym";
      case "Food & Diet": return "cat-pill-food";
      case "Travel": return "cat-pill-travel";
      case "Mobile & Internet": return "cat-pill-mobile";
      case "Education": return "cat-pill-education";
      case "Shopping & Personal": return "cat-pill-shopping";
      case "Entertainment": return "cat-pill-entertainment";
      default: return "cat-pill-other";
    }
  }

  // ----------------------------------------------------------------------------
  // 12. SIDEBAR MONTH LIST & MOBILE SELECTOR
  // ----------------------------------------------------------------------------
  function renderMonthNavigation() {
    let navHtml = "";
    MONTH_NAMES.forEach((name, idx) => {
      const monthKey = `${YEAR}-${String(idx + 1).padStart(2, "0")}`;
      const mData = appData.months[monthKey];
      const count = mData && mData.expenses ? mData.expenses.length : 0;
      const isActive = idx === currentMonthIndex;

      navHtml += `
        <li class="month-item">
          <button type="button" class="month-btn ${isActive ? "active" : ""}" data-month-index="${idx}">
            <span>${name}</span>
            <span class="month-badge">${count}</span>
          </button>
        </li>
      `;
    });
    DOM.monthList.innerHTML = navHtml;

    let mobileOptions = "";
    MONTH_NAMES.forEach((name, idx) => {
      mobileOptions += `<option value="${idx}" ${idx === currentMonthIndex ? "selected" : ""}>${name} 2026</option>`;
    });
    DOM.mobileMonthSelect.innerHTML = mobileOptions;
  }

  function switchMonth(index) {
    if (index < 0 || index >= 12) return;
    currentMonthIndex = index;
    DOM.expenseSearchInput.value = "";
    DOM.expenseCategoryFilter.value = "ALL";
    updateDashboard();
  }

  // ----------------------------------------------------------------------------
  // 13. CATEGORIES DROPDOWNS & SUGGESTION CHIPS
  // ----------------------------------------------------------------------------
  function refreshCategoryDropdowns() {
    const allCategories = [...Object.keys(DEFAULT_CATEGORIES), ...(appData.customCategories || [])];

    const currentVal = DOM.expenseCategory.value;
    let mainOptions = '<option value="" disabled selected>-- Select a category --</option>';
    allCategories.forEach((cat) => {
      mainOptions += `<option value="${escapeHTML(cat)}">${escapeHTML(cat)}</option>`;
    });
    DOM.expenseCategory.innerHTML = mainOptions;
    if (currentVal && allCategories.includes(currentVal)) {
      DOM.expenseCategory.value = currentVal;
    }

    let filterOptions = '<option value="ALL">All Categories</option>';
    allCategories.forEach((cat) => {
      filterOptions += `<option value="${escapeHTML(cat)}">${escapeHTML(cat)}</option>`;
    });
    DOM.expenseCategoryFilter.innerHTML = filterOptions;

    let editOptions = "";
    allCategories.forEach((cat) => {
      editOptions += `<option value="${escapeHTML(cat)}">${escapeHTML(cat)}</option>`;
    });
    DOM.editExpenseCategory.innerHTML = editOptions;
  }

  function renderSuggestionChips(selectedCategory) {
    const suggestions = DEFAULT_CATEGORIES[selectedCategory];
    if (suggestions && suggestions.length > 0) {
      DOM.quickChipsContainer.style.display = "block";
      let chipsHtml = "";
      suggestions.forEach((item) => {
        chipsHtml += `<button type="button" class="chip-btn" data-chip-title="${escapeHTML(item)}">${escapeHTML(item)}</button>`;
      });
      DOM.quickChipsList.innerHTML = chipsHtml;
    } else {
      DOM.quickChipsContainer.style.display = "none";
      DOM.quickChipsList.innerHTML = "";
    }
  }

  // ----------------------------------------------------------------------------
  // 14. EVENT HANDLERS & FORM PROCESSING
  // ----------------------------------------------------------------------------

  DOM.monthList.addEventListener("click", (e) => {
    const btn = e.target.closest(".month-btn");
    if (btn) {
      const idx = parseInt(btn.dataset.monthIndex, 10);
      switchMonth(idx);
    }
  });

  DOM.mobileMonthSelect.addEventListener("change", (e) => {
    const idx = parseInt(e.target.value, 10);
    switchMonth(idx);
  });

  DOM.btnPrevMonth.addEventListener("click", () => {
    if (currentMonthIndex > 0) switchMonth(currentMonthIndex - 1);
    else switchMonth(11);
  });

  DOM.btnNextMonth.addEventListener("click", () => {
    if (currentMonthIndex < 11) switchMonth(currentMonthIndex + 1);
    else switchMonth(0);
  });

  DOM.btnEditBudget.addEventListener("click", () => {
    DOM.monthlyBudgetInput.removeAttribute("readonly");
    DOM.monthlyBudgetInput.focus();
    DOM.btnEditBudget.style.display = "none";
    DOM.btnSaveBudget.style.display = "inline-flex";
    DOM.btnCancelBudget.style.display = "inline-flex";
  });

  DOM.btnCancelBudget.addEventListener("click", () => {
    const monthData = getCurrentMonthData();
    DOM.monthlyBudgetInput.value = monthData.budget;
    DOM.monthlyBudgetInput.setAttribute("readonly", "true");
    DOM.btnEditBudget.style.display = "inline-flex";
    DOM.btnSaveBudget.style.display = "none";
    DOM.btnCancelBudget.style.display = "none";
  });

  DOM.btnSaveBudget.addEventListener("click", () => {
    const val = Number(DOM.monthlyBudgetInput.value);
    if (isNaN(val) || val < 0) {
      showToast("Budget must be a valid non-negative number", "error");
      return;
    }
    const monthData = getCurrentMonthData();
    monthData.budget = Math.round(val * 100) / 100;
    saveDataToStorage();
    DOM.monthlyBudgetInput.setAttribute("readonly", "true");
    DOM.btnEditBudget.style.display = "inline-flex";
    DOM.btnSaveBudget.style.display = "none";
    DOM.btnCancelBudget.style.display = "none";
    showToast(`Budget for ${MONTH_NAMES[currentMonthIndex]} updated to ${formatINR(monthData.budget)}`);
    updateDashboard();
  });

  DOM.btnEditSavings.addEventListener("click", () => {
    DOM.savingsTargetInput.removeAttribute("readonly");
    DOM.savingsTargetInput.focus();
    DOM.btnEditSavings.style.display = "none";
    DOM.btnSaveSavings.style.display = "inline-flex";
    DOM.btnCancelSavings.style.display = "inline-flex";
  });

  DOM.btnCancelSavings.addEventListener("click", () => {
    const monthData = getCurrentMonthData();
    DOM.savingsTargetInput.value = monthData.savingsTarget || "";
    DOM.savingsTargetInput.setAttribute("readonly", "true");
    DOM.btnEditSavings.style.display = "inline-flex";
    DOM.btnSaveSavings.style.display = "none";
    DOM.btnCancelSavings.style.display = "none";
  });

  DOM.btnSaveSavings.addEventListener("click", () => {
    const val = Number(DOM.savingsTargetInput.value);
    if (isNaN(val) || val < 0) {
      showToast("Savings target cannot be negative", "error");
      return;
    }
    const monthData = getCurrentMonthData();
    monthData.savingsTarget = Math.round(val * 100) / 100;
    saveDataToStorage();
    DOM.savingsTargetInput.setAttribute("readonly", "true");
    DOM.btnEditSavings.style.display = "inline-flex";
    DOM.btnSaveSavings.style.display = "none";
    DOM.btnCancelSavings.style.display = "none";
    showToast(`Savings target updated to ${formatINR(monthData.savingsTarget)}`);
    updateDashboard();
  });

  DOM.expenseCategory.addEventListener("change", (e) => {
    renderSuggestionChips(e.target.value);
  });

  DOM.quickChipsList.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip-btn");
    if (chip) {
      DOM.expenseTitle.value = chip.dataset.chipTitle;
      DOM.expenseAmount.focus();
    }
  });

  DOM.expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();

    DOM.errorTitle.textContent = "";
    DOM.errorAmount.textContent = "";
    DOM.errorDate.textContent = "";
    DOM.errorCategory.textContent = "";

    const title = DOM.expenseTitle.value.trim();
    const amount = Number(DOM.expenseAmount.value);
    const date = DOM.expenseDate.value;
    const category = DOM.expenseCategory.value;
    const note = DOM.expenseNote.value.trim();

    let hasError = false;

    if (!title) {
      DOM.errorTitle.textContent = "Please enter an expense title.";
      hasError = true;
    }

    if (isNaN(amount) || amount <= 0) {
      DOM.errorAmount.textContent = "Amount must be greater than ₹0.";
      hasError = true;
    }

    if (!category) {
      DOM.errorCategory.textContent = "Please choose a category.";
      hasError = true;
    }

    if (!date) {
      DOM.errorDate.textContent = "Please pick a date.";
      hasError = true;
    } else {
      const parts = date.split("-");
      const expYear = parseInt(parts[0], 10);
      const expMonth = parseInt(parts[1], 10) - 1;

      if (expYear !== YEAR || expMonth !== currentMonthIndex) {
        DOM.errorDate.textContent = `Date must belong to ${MONTH_NAMES[currentMonthIndex]} ${YEAR}.`;
        hasError = true;
      }
    }

    if (hasError) return;

    const newExpense = {
      id: "exp-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      title: title,
      amount: Math.round(amount * 100) / 100,
      category: category,
      date: date,
      note: note
    };

    const monthData = getCurrentMonthData();
    monthData.expenses.push(newExpense);
    saveDataToStorage();

    DOM.expenseTitle.value = "";
    DOM.expenseAmount.value = "";
    DOM.expenseNote.value = "";
    DOM.quickChipsContainer.style.display = "none";
    DOM.quickChipsList.innerHTML = "";

    showToast(`Added: ${newExpense.title} (${formatINR(newExpense.amount)})`);
    updateDashboard();
  });

  DOM.expenseSearchInput.addEventListener("input", renderExpenseTable);
  DOM.expenseCategoryFilter.addEventListener("change", renderExpenseTable);

  DOM.btnSortDate.addEventListener("click", () => {
    sortNewestFirst = !sortNewestFirst;
    DOM.sortOrderLabel.textContent = sortNewestFirst ? "Newest First" : "Oldest First";
    renderExpenseTable();
  });

  DOM.expenseTableBody.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".btn-action-edit");
    const deleteBtn = e.target.closest(".btn-action-delete");

    if (editBtn) {
      const id = editBtn.dataset.editId;
      openEditModal(id);
    } else if (deleteBtn) {
      const id = deleteBtn.dataset.deleteId;
      openDeleteModal(id);
    }
  });

  // ----------------------------------------------------------------------------
  // 15. MODAL WORKFLOWS (EDIT, DELETE, CUSTOM CAT, RESET)
  // ----------------------------------------------------------------------------

  function openEditModal(expenseId) {
    const monthData = getCurrentMonthData();
    const item = monthData.expenses.find((x) => x.id === expenseId);
    if (!item) return;

    DOM.editExpenseId.value = item.id;
    DOM.editExpenseTitle.value = item.title;
    DOM.editExpenseAmount.value = item.amount;
    DOM.editExpenseDate.value = item.date;
    DOM.editExpenseCategory.value = item.category;
    DOM.editExpenseNote.value = item.note || "";

    const monthStr = String(currentMonthIndex + 1).padStart(2, "0");
    DOM.editExpenseDate.min = `${YEAR}-${monthStr}-01`;
    const lastDay = new Date(YEAR, currentMonthIndex + 1, 0).getDate();
    DOM.editExpenseDate.max = `${YEAR}-${monthStr}-${String(lastDay).padStart(2, "0")}`;

    DOM.editErrorTitle.textContent = "";
    DOM.editErrorAmount.textContent = "";
    DOM.editErrorDate.textContent = "";
    DOM.editErrorCategory.textContent = "";

    DOM.editExpenseModal.classList.add("active");
  }

  function closeEditModal() {
    DOM.editExpenseModal.classList.remove("active");
  }

  DOM.btnCloseEditModal.addEventListener("click", closeEditModal);
  DOM.btnCancelEdit.addEventListener("click", closeEditModal);

  DOM.editExpenseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = DOM.editExpenseId.value;
    const title = DOM.editExpenseTitle.value.trim();
    const amount = Number(DOM.editExpenseAmount.value);
    const date = DOM.editExpenseDate.value;
    const category = DOM.editExpenseCategory.value;
    const note = DOM.editExpenseNote.value.trim();

    let hasError = false;
    if (!title) { DOM.editErrorTitle.textContent = "Title is required."; hasError = true; }
    if (isNaN(amount) || amount <= 0) { DOM.editErrorAmount.textContent = "Amount must be > 0."; hasError = true; }
    if (!category) { DOM.editErrorCategory.textContent = "Category is required."; hasError = true; }

    if (!date) {
      DOM.editErrorDate.textContent = "Date is required.";
      hasError = true;
    } else {
      const parts = date.split("-");
      if (parseInt(parts[0], 10) !== YEAR || parseInt(parts[1], 10) - 1 !== currentMonthIndex) {
        DOM.editErrorDate.textContent = `Date must belong to ${MONTH_NAMES[currentMonthIndex]} ${YEAR}.`;
        hasError = true;
      }
    }

    if (hasError) return;

    const monthData = getCurrentMonthData();
    const idx = monthData.expenses.findIndex((x) => x.id === id);
    if (idx !== -1) {
      monthData.expenses[idx] = {
        id,
        title,
        amount: Math.round(amount * 100) / 100,
        category,
        date,
        note
      };
      saveDataToStorage();
      closeEditModal();
      showToast("Expense updated successfully!");
      updateDashboard();
    }
  });

  function openDeleteModal(expenseId) {
    const monthData = getCurrentMonthData();
    const item = monthData.expenses.find((x) => x.id === expenseId);
    if (!item) return;

    pendingDeleteId = expenseId;
    DOM.deleteExpenseName.textContent = item.title;
    DOM.deleteExpenseCost.textContent = formatINR(item.amount);
    DOM.deleteConfirmModal.classList.add("active");
  }

  function closeDeleteModal() {
    pendingDeleteId = null;
    DOM.deleteConfirmModal.classList.remove("active");
  }

  DOM.btnCloseDeleteModal.addEventListener("click", closeDeleteModal);
  DOM.btnCancelDelete.addEventListener("click", closeDeleteModal);

  DOM.btnConfirmDelete.addEventListener("click", () => {
    if (!pendingDeleteId) return;
    const monthData = getCurrentMonthData();
    monthData.expenses = monthData.expenses.filter((x) => x.id !== pendingDeleteId);
    saveDataToStorage();
    closeDeleteModal();
    showToast("Expense deleted successfully!");
    updateDashboard();
  });

  DOM.btnOpenCustomCatModal.addEventListener("click", () => {
    DOM.customCatName.value = "";
    DOM.customCatError.textContent = "";
    DOM.customCatModal.classList.add("active");
    DOM.customCatName.focus();
  });

  function closeCustomCatModal() {
    DOM.customCatModal.classList.remove("active");
  }

  DOM.btnCloseCatModal.addEventListener("click", closeCustomCatModal);
  DOM.btnCancelCustomCat.addEventListener("click", closeCustomCatModal);

  DOM.customCatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = DOM.customCatName.value.trim();
    if (!name) {
      DOM.customCatError.textContent = "Please enter a category name.";
      return;
    }
    const all = [...Object.keys(DEFAULT_CATEGORIES), ...(appData.customCategories || [])];
    if (all.some((c) => c.toLowerCase() === name.toLowerCase())) {
      DOM.customCatError.textContent = "This category already exists.";
      return;
    }

    if (!appData.customCategories) appData.customCategories = [];
    appData.customCategories.push(name);
    CATEGORY_COLORS[name] = "#" + Math.floor(Math.random() * 16777215).toString(16);
    saveDataToStorage();
    refreshCategoryDropdowns();
    DOM.expenseCategory.value = name;
    closeCustomCatModal();
    showToast(`Added category: ${name}`);
  });

  DOM.btnResetMonth.addEventListener("click", () => {
    DOM.resetMonthPromptName.textContent = `${MONTH_NAMES[currentMonthIndex]} 2026`;
    DOM.resetConfirmModal.classList.add("active");
  });

  function closeResetModal() {
    DOM.resetConfirmModal.classList.remove("active");
  }

  DOM.btnCloseResetModal.addEventListener("click", closeResetModal);
  DOM.btnCancelReset.addEventListener("click", closeResetModal);

  DOM.btnConfirmReset.addEventListener("click", () => {
    const monthKey = getCurrentMonthKey();
    appData.months[monthKey] = {
      budget: 9000,
      savingsTarget: 2000,
      expenses: []
    };
    saveDataToStorage();
    closeResetModal();
    showToast(`Reset data for ${MONTH_NAMES[currentMonthIndex]} 2026`);
    updateDashboard();
  });

  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove("active");
      }
    });
  });

  // ----------------------------------------------------------------------------
  // 16. EXPORT CURRENT MONTH TO CSV
  // ----------------------------------------------------------------------------
  DOM.btnExportCSV.addEventListener("click", exportMonthToCSV);

  function exportMonthToCSV() {
    const monthData = getCurrentMonthData();
    const expenses = monthData.expenses || [];
    const monthName = MONTH_NAMES[currentMonthIndex];

    if (expenses.length === 0) {
      showToast(`No expenses to export for ${monthName} 2026`, "info");
      return;
    }

    let csvContent = "\uFEFF";
    csvContent += `Tushar Monthly Budget Calculator 2026 - ${monthName}\n`;
    csvContent += `Monthly Budget: ₹${monthData.budget || 0}\n`;
    csvContent += `Savings Goal: ₹${monthData.savingsTarget || 0}\n\n`;
    csvContent += "Transaction ID,Date,Title,Category,Amount (INR),Note\n";

    expenses.forEach((item) => {
      const row = [
        `"${item.id}"`,
        `"${item.date}"`,
        `"${(item.title || "").replace(/"/g, '""')}"`,
        `"${(item.category || "").replace(/"/g, '""')}"`,
        item.amount,
        `"${(item.note || "").replace(/"/g, '""')}"`
      ];
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Tushar_Budget_${monthName}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Exported ${monthName} 2026 to CSV!`);
  }

  // ----------------------------------------------------------------------------
  // 17. INITIAL APP BOOTSTRAP
  // ----------------------------------------------------------------------------
  function initApp() {
    loadDataFromStorage();
    refreshCategoryDropdowns();
    updateDashboard();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();