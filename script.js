document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('budget-form');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const budgetItemsContainer = document.getElementById('budget-items');
    const totalAmountElement = document.getElementById('total-amount');
    const printButton = document.getElementById('print-button');

    const getBudgetItems = () => JSON.parse(localStorage.getItem('budgetItems')) || [];

    const setBudgetItems = (items) => localStorage.setItem('budgetItems', JSON.stringify(items));

    const addBudgetItem = (item) => {
        const items = getBudgetItems();
        items.push(item);
        setBudgetItems(items);
        renderBudgetItems();
    };

    const removeBudgetItem = (index) => {
        const items = getBudgetItems();
        items.splice(index, 1);
        setBudgetItems(items);
        renderBudgetItems();
    };

    const calculateTotalAmount = () => {
        const items = getBudgetItems();
        const total = items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        totalAmountElement.textContent = total.toFixed(2);
    };

    const renderBudgetItems = () => {
        const items = getBudgetItems();
        budgetItemsContainer.innerHTML = '';
        items.forEach((item, index) => {
            const row = document.createElement('tr');

            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = item.description;
            row.appendChild(descriptionCell);

            const amountCell = document.createElement('td');
            amountCell.textContent = item.amount;
            row.appendChild(amountCell);

            const actionsCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => removeBudgetItem(index));
            actionsCell.appendChild(deleteButton);
            row.appendChild(actionsCell);

            budgetItemsContainer.appendChild(row);
        });
        calculateTotalAmount();
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const description = descriptionInput.value;
        const amount = parseFloat(amountInput.value);

        if (description && amount) {
            addBudgetItem({ description, amount });
            descriptionInput.value = '';
            amountInput.value = '';
        }
    });

    printButton.addEventListener('click', () => {
        const printContent = document.getElementById('expense-table').outerHTML;
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write('<html><head><title>Print Budget Tracker</title>');
        printWindow.document.write('<style>table { width: 100%; border-collapse: collapse; } th, td { padding: 10px; border: 1px solid #ddd; text-align: left; } th { background: #f4f4f4; }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    });

    renderBudgetItems();
});

