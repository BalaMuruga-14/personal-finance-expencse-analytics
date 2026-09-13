/* ================================
   TRANSACTION DATA
================================ */

let transactions =
    JSON.parse(
        localStorage.getItem("transactions")
    ) || [];


/* ================================
   USER DISPLAY
================================ */

const userDisplay =
    document.getElementById("userDisplay");

const username =
    localStorage.getItem("username") || "bala";

if (userDisplay) {

    userDisplay.textContent =
        "👤 " + username;

}


/* ================================
   FORM
================================ */

const form =
    document.getElementById("transactionForm");


form.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const description =
            document
                .getElementById("description")
                .value
                .trim();


        const amount =
            Number(
                document
                    .getElementById("amount")
                    .value
            );


        const type =
            document
                .getElementById("type")
                .value;


        const category =
            document
                .getElementById("category")
                .value;


        const date =
            document
                .getElementById("date")
                .value;


        if (
            !description ||
            amount <= 0 ||
            !type ||
            !category ||
            !date
        ) {

            alert(
                "Please enter all transaction details."
            );

            return;

        }


        const transaction = {

            id: Date.now(),

            description: description,

            amount: amount,

            type: type,

            category: category,

            date: date

        };


        transactions.push(transaction);


        saveData();


        form.reset();


        displayTransactions();

        updateDashboard();

        updateBudget();

        updateCharts();


        alert(
            "Transaction added successfully!"
        );

    }
);


/* ================================
   SAVE DATA
================================ */

function saveData() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


/* ================================
   DASHBOARD
================================ */

function updateDashboard() {

    let income = 0;

    let expense = 0;


    transactions.forEach(
        function(transaction) {

            if (
                transaction.type === "income"
            ) {

                income += Number(
                    transaction.amount
                );

            }


            if (
                transaction.type === "expense"
            ) {

                expense += Number(
                    transaction.amount
                );

            }

        }
    );


    const balance =
        income - expense;


    const savings =
        income - expense;


    document.getElementById(
        "totalIncome"
    ).textContent =
        "₹" +
        income.toLocaleString("en-IN");


    document.getElementById(
        "totalExpense"
    ).textContent =
        "₹" +
        expense.toLocaleString("en-IN");


    document.getElementById(
        "balance"
    ).textContent =
        "₹" +
        balance.toLocaleString("en-IN");


    document.getElementById(
        "transactionCount"
    ).textContent =
        transactions.length;


    document.getElementById(
        "dashboardSavings"
    ).textContent =
        "₹" +
        savings.toLocaleString("en-IN");


    const budget =
        Number(
            localStorage.getItem(
                "monthlyBudget"
            )
        ) || 0;


    document.getElementById(
        "dashboardBudget"
    ).textContent =
        "₹" +
        budget.toLocaleString("en-IN");

}


/* ================================
   DISPLAY TRANSACTIONS
================================ */

function displayTransactions(
    list = transactions
) {

    const table =
        document.getElementById(
            "transactionTable"
        );


    table.innerHTML = "";


    if (list.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6"
                    style="text-align:center;">
                    No transactions found.
                </td>
            </tr>
        `;

        return;

    }


    list.forEach(
        function(transaction) {

            const row =
                document.createElement("tr");


            const typeText =
                transaction.type === "income"
                    ? "Income"
                    : "Expense";


            row.innerHTML = `

                <td>
                    ${transaction.description}
                </td>

                <td>
                    ₹${Number(
                        transaction.amount
                    ).toLocaleString("en-IN")}
                </td>

                <td>
                    ${typeText}
                </td>

                <td>
                    ${transaction.category}
                </td>

                <td>
                    ${transaction.date}
                </td>

                <td>

                    <button
                        class="delete-btn"
                        onclick="deleteTransaction(
                            ${transaction.id}
                        )"
                    >
                        Delete
                    </button>

                </td>

            `;


            table.appendChild(row);

        }
    );

}


/* ================================
   DELETE TRANSACTION
================================ */

function deleteTransaction(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmDelete) {

        return;

    }


    transactions =
        transactions.filter(
            function(transaction) {

                return transaction.id !== id;

            }
        );


    saveData();


    displayTransactions();

    updateDashboard();

    updateBudget();

    updateCharts();

}


/* ================================
   SEARCH
================================ */

document
    .getElementById("search")
    .addEventListener(
        "input",
        function() {

            const searchText =
                this.value
                    .toLowerCase()
                    .trim();


            const filtered =
                transactions.filter(
                    function(transaction) {

                        return (

                            transaction
                                .description
                                .toLowerCase()
                                .includes(searchText)

                            ||

                            transaction
                                .category
                                .toLowerCase()
                                .includes(searchText)

                            ||

                            transaction
                                .type
                                .toLowerCase()
                                .includes(searchText)

                        );

                    }
                );


            displayTransactions(
                filtered
            );

        }
    );


/* ================================
   BUDGET
================================ */

let monthlyBudget =
    Number(
        localStorage.getItem(
            "monthlyBudget"
        )
    ) || 0;


/* SAVE BUDGET */

function saveBudget() {

    const budgetInput =
        document.getElementById(
            "budget"
        ).value;


    const budget =
        Number(budgetInput);


    if (
        budgetInput === "" ||
        budget < 0
    ) {

        alert(
            "Please enter a valid budget."
        );

        return;

    }


    monthlyBudget = budget;


    localStorage.setItem(
        "monthlyBudget",
        monthlyBudget
    );


    updateBudget();

    updateDashboard();


    alert(
        "Monthly budget saved successfully!"
    );

}


/* UPDATE BUDGET */

function updateBudget() {

    let totalExpense = 0;

    let totalIncome = 0;


    transactions.forEach(
        function(transaction) {

            if (
                transaction.type === "expense"
            ) {

                totalExpense += Number(
                    transaction.amount
                );

            }


            if (
                transaction.type === "income"
            ) {

                totalIncome += Number(
                    transaction.amount
                );

            }

        }
    );


    const remaining =
        monthlyBudget - totalExpense;


    const savings =
        totalIncome - totalExpense;


    document.getElementById(
        "budgetAmount"
    ).textContent =
        "₹" +
        monthlyBudget.toLocaleString("en-IN");


    document.getElementById(
        "budgetUsed"
    ).textContent =
        "₹" +
        totalExpense.toLocaleString("en-IN");


    document.getElementById(
        "remainingBudget"
    ).textContent =
        "₹" +
        remaining.toLocaleString("en-IN");


    document.getElementById(
        "totalSavings"
    ).textContent =
        "₹" +
        savings.toLocaleString("en-IN");


    const warning =
        document.getElementById(
            "budgetWarning"
        );


    if (monthlyBudget === 0) {

        warning.textContent =
            "ℹ️ Set a monthly budget to monitor your spending.";

    }

    else if (
        totalExpense > monthlyBudget
    ) {

        warning.textContent =
            "⚠️ Warning: You have exceeded your monthly budget!";

    }

    else {

        const percentage =
            (
                totalExpense /
                monthlyBudget
            ) * 100;


        if (percentage >= 80) {

            warning.textContent =
                "⚠️ Warning: You have used more than 80% of your budget!";

        }

        else {

            warning.textContent =
                "✅ Your spending is within the monthly budget.";

        }

    }

}


/* ================================
   CHARTS
================================ */

let categoryChart;

let monthlyChart;

let incomeExpenseChart;


/* UPDATE ALL CHARTS */

function updateCharts() {

    updateCategoryChart();

    updateMonthlyChart();

    updateIncomeExpenseChart();

    updateAnalyticsSummary();

}


/* CATEGORY CHART */

function updateCategoryChart() {

    const categoryData = {};


    transactions.forEach(
        function(transaction) {

            if (
                transaction.type === "expense"
            ) {

                if (
                    !categoryData[
                        transaction.category
                    ]
                ) {

                    categoryData[
                        transaction.category
                    ] = 0;

                }


                categoryData[
                    transaction.category
                ] += Number(
                    transaction.amount
                );

            }

        }
    );


    const categories =
        Object.keys(categoryData);


    const amounts =
        Object.values(categoryData);


    if (categoryChart) {

        categoryChart.destroy();

    }


    categoryChart =
        new Chart(
            document.getElementById(
                "categoryChart"
            ),
            {

                type: "pie",

                data: {

                    labels: categories,

                    datasets: [

                        {

                            label:
                                "Expenses",

                            data:
                                amounts

                        }

                    ]

                },

                options: {

                    responsive: true,

                    plugins: {

                        legend: {

                            position:
                                "bottom"

                        },

                        title: {

                            display: true,

                            text:
                                "Expense Distribution by Category"

                        }

                    }

                }

            }
        );

}


/* MONTHLY CHART */

function updateMonthlyChart() {

    const monthlyData = {};


    transactions.forEach(
        function(transaction) {

            if (
                transaction.type === "expense"
            ) {

                const month =
                    transaction.date.substring(
                        0,
                        7
                    );


                if (
                    !monthlyData[month]
                ) {

                    monthlyData[month] = 0;

                }


                monthlyData[month] += Number(
                    transaction.amount
                );

            }

        }
    );


    const months =
        Object.keys(monthlyData);


    const amounts =
        Object.values(monthlyData);


    if (monthlyChart) {

        monthlyChart.destroy();

    }


    monthlyChart =
        new Chart(
            document.getElementById(
                "monthlyChart"
            ),
            {

                type: "bar",

                data: {

                    labels: months,

                    datasets: [

                        {

                            label:
                                "Monthly Expenses",

                            data:
                                amounts

                        }

                    ]

                },

                options: {

                    responsive: true,

                    scales: {

                        y: {

                            beginAtZero: true

                        }

                    },

                    plugins: {

                        title: {

                            display: true,

                            text:
                                "Monthly Expense Analysis"

                        }

                    }

                }

            }
        );

}


/* INCOME VS EXPENSE */

function updateIncomeExpenseChart() {

    let income = 0;

    let expense = 0;


    transactions.forEach(
        function(transaction) {

            if (
                transaction.type === "income"
            ) {

                income += Number(
                    transaction.amount
                );

            }


            if (
                transaction.type === "expense"
            ) {

                expense += Number(
                    transaction.amount
                );

            }

        }
    );


    if (incomeExpenseChart) {

        incomeExpenseChart.destroy();

    }


    incomeExpenseChart =
        new Chart(
            document.getElementById(
                "incomeExpenseChart"
            ),
            {

                type: "bar",

                data: {

                    labels: [
                        "Income",
                        "Expense"
                    ],

                    datasets: [

                        {

                            label:
                                "Amount",

                            data: [
                                income,
                                expense
                            ]

                        }

                    ]

                },

                options: {

                    responsive: true,

                    scales: {

                        y: {

                            beginAtZero: true

                        }

                    },

                    plugins: {

                        title: {

                            display: true,

                            text:
                                "Income vs Expense"

                        }

                    }

                }

            }
        );

}


/* ================================
   ANALYTICS SUMMARY
================================ */

function updateAnalyticsSummary() {

    let totalExpense = 0;

    const categoryData = {};


    transactions.forEach(
        function(transaction) {

            if (
                transaction.type === "expense"
            ) {

                totalExpense += Number(
                    transaction.amount
                );


                if (
                    !categoryData[
                        transaction.category
                    ]
                ) {

                    categoryData[
                        transaction.category
                    ] = 0;

                }


                categoryData[
                    transaction.category
                ] += Number(
                    transaction.amount
                );

            }

        }
    );


    let highestCategory = "-";

    let highestAmount = 0;


    Object.keys(categoryData).forEach(
        function(category) {

            if (
                categoryData[category] >
                highestAmount
            ) {

                highestAmount =
                    categoryData[category];

                highestCategory =
                    category;

            }

        }
    );


    document.getElementById(
        "highestCategory"
    ).textContent =
        highestCategory;


    document.getElementById(
        "analyticsExpense"
    ).textContent =
        "₹" +
        totalExpense.toLocaleString("en-IN");

}


/* ================================
   EXPORT CSV
================================ */

function exportCSV() {

    if (
        transactions.length === 0
    ) {

        alert(
            "No transactions available to export."
        );

        return;

    }


    let csv =
        "Description,Amount,Type,Category,Date\n";


    transactions.forEach(
        function(transaction) {

            csv +=
                `"${transaction.description}",` +
                `"${transaction.amount}",` +
                `"${transaction.type}",` +
                `"${transaction.category}",` +
                `"${transaction.date}"\n`;

        }
    );


    const blob =
        new Blob(
            [csv],
            {
                type: "text/csv"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;


    link.download =
        "finance_transactions.csv";


    link.click();


    URL.revokeObjectURL(url);

}


/* ================================
   CLEAR ALL DATA
================================ */

function clearAllData() {

    if (
        transactions.length === 0
    ) {

        alert(
            "There is no transaction data to clear."
        );

        return;

    }


    const confirmation =
        confirm(
            "Are you sure you want to delete ALL transactions?"
        );


    if (!confirmation) {

        return;

    }


    transactions = [];


    localStorage.removeItem(
        "transactions"
    );


    displayTransactions();

    updateDashboard();

    updateBudget();

    updateCharts();


    alert(
        "All transaction data has been cleared."
    );

}


/* ================================
   LOGOUT
================================ */

function logout() {

    localStorage.removeItem(
        "loggedIn"
    );

    localStorage.removeItem(
        "username"
    );


    window.location.href =
        "login.html";

}


/* ================================
   INITIAL LOAD
================================ */

displayTransactions();

updateDashboard();

updateBudget();

updateCharts();