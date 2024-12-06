# E-Commerce Analytics Dashboard Monorepo

Welcome to the **E-Commerce Analytics Dashboard**, a monorepo-based application designed to provide insightful analytics for an e-commerce platform. This project includes both backend APIs and a responsive frontend dashboard to visualize sales data, product trends, and more.

[**Dashboard Preview**](images/dashboard.png)

[**Demo Video**](images/dashboard_video.webm)

---

## Project Overview

This project provides an **analytics dashboard** that enables e-commerce businesses to:
- View total sales and monthly trends.
- Analyze product-wise and category-wise performance.
- Visualize data with charts (bar charts, line charts, and doughnut charts).

Built with a **monorepo architecture**, the application includes:
- **Backend**: A Node.js/Express API with MongoDB as the database.
- **Frontend**: A Vue 3 + TailwindCSS dashboard with Chart.js for visualizations.

---

## Monorepo Structure

The project follows a **monorepo architecture** for modularity and scalability.


---

## Features

### Backend:
- **API Endpoints**:
  - Fetch all products, product sales, and trending products.
  - Aggregate sales data by category and month.
  - Calculate percentages for visualizations.

### Frontend:
- **Charts**:
  - **Bar Charts**: Percentage of sales per product and category.
  - **Doughnut Charts**: Distribution by top-performing categories.
  - **Line Charts**: Monthly sales trends.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Date Range Picker**: Filter analytics based on selected date ranges.

---

## API Endpoints

| Endpoint                        | HTTP Method | Description                              |
|---------------------------------|-------------|------------------------------------------|
| `/api/products`                 | GET         | Fetch all products.                     |
| `/api/products/:id`             | GET         | Fetch product details by ID.            |
| `/api/analytics/product_sales`  | GET         | Fetch aggregated sales data for products. |
| `/api/analytics/category_sales` | GET         | Fetch aggregated sales data by category. |
| `/api/analytics/total_sales`    | GET         | Fetch total and monthly sales data.      |
| `/api/analytics/trending_products` | GET      | Fetch trending products based on sales. |

---

## Frontend Overview

The **frontend dashboard** is built using **Vue 3** and styled with **TailwindCSS**. Data visualization is powered by **Chart.js**.

### Key Components:
1. **LineChart**: Displays monthly sales trends.
2. **BarChart01**: Illustrates percentage sales per product.
3. **DoughnutChart**: Shows category-wise sales distribution.

---

## Setup and Run Guide

### Prerequisites:
1. **Node.js** v16+  
2. **MongoDB**  
3. **Vercel CLI** (optional for deployment)

### Steps:

#### 1. Clone the repository:
```bash
git clone https://github.com/your-username/ecom-analytics-monorepo.git
cd ecom-analytics-monorepo
```

#### 2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

#### 3. Configure environment variables:
Create .env files in both backend and frontend directories.

**Backend .env:**

```bash
MONGO_URI=mongodb://localhost:27017/ecom-analytics
PORT=5000
```

**Frontend .env:**

```bash
VITE_BACKEND_URL=http://localhost:5000
```

#### 4. Start the development servers:
```bash
# Start backend
cd backend
npm run dev

# Start frontend
cd ../frontend
npm run dev

```
#### 5. Access the app:


Open `http://localhost:5173` in your browser.