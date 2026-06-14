# 📚 @xlsx

## 📌 Overview
- **Trigger**: `@xlsx`
- **Category**: For Students (Study, Writing & Office Productivity)
- **Purpose**: Write Excel formulas, analyze datasets, and create custom data charts.
- **Best For**: Math and science homework, lab data analysis, financial models, and managing spreadsheets.

---

## 🚀 How to Trigger
In your Promptimity AI chat, type:
```text
@xlsx [describe your dataset, formulas needed, or chart requirements]
```

---

## 💡 Key Capabilities & Features

- **Formula Architecture**: Expert formulation of complex Excel/Sheets formulas (e.g. `VLOOKUP`, `XLOOKUP`, `INDEX`/`MATCH`, `IFERROR`, nested logical statements, and array formulas).
- **Python openpyxl & pandas Scripts**: Generates clean Python code to programmatically read, write, manipulate, and format Excel files.
- **Data Visualization & Charts**: Guidelines on selecting and formatting the best charts (bar, line, scatter, pie) with proper axes labels, legend placements, and data series colors.
- **Pivot Tables & Data Analysis**: Guides you in summarizing massive datasets using Pivot Tables, filtering outliers, calculating standard deviations, and running regression trends.
- **Conditional Formatting Rules**: Suggests optimal rules for color scales, data bars, and highlighting specific text patterns or numerical thresholds.

---

## 🛠️ Real-world Examples

### Example 1: Multi-Criteria Lookup Formula
**Prompt:**
> `@xlsx I have a sheet named 'SalesData'. I need a formula that looks up the price of an item based on both the 'ProductID' in column A and the 'Region' in column B. How do I construct this using XLOOKUP or INDEX/MATCH?`

### Example 2: Programmatic Data Formatting with Openpyxl
**Prompt:**
> `@xlsx write a Python script using openpyxl that loads a spreadsheet, calculates the averages for column C through F, writes them in a bold 'Averages' row at the bottom, and applies a light blue background fill to that row.`

---

## 📘 Best Practices
1. **Always Use Absolute References**: Use the `$` sign (e.g. `$A$1`) when referencing cell ranges in formulas that will be dragged or copied across multiple rows/columns.
2. **Avoid Merged Cells**: Try to avoid merging cells in data tables as it can break formulas, sorting, and python data parsing libraries. Use 'Center Across Selection' instead.
3. **Format Numbers Appropriately**: Ensure all currency, percentage, and date fields have explicit, clean formatting rules so the sheet is easy to scan.
