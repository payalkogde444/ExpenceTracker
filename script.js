document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseNameInput = document.getElementById('expense-name');
    const expenseAmountInput = document.getElementById('expense-amount');
    const totalAmountMessage = document.getElementById('total-amount');
    const expenseList = document.getElementById('expense-list');
  
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let totalAmount = calculateTotal();
  
    renderExpenses();
    updateExpenses();
  
    // Handle form submission
    expenseForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const name = expenseNameInput.value.trim();
      const amount = parseFloat(expenseAmountInput.value.trim());
  
      if (name !== "" && !isNaN(amount) && amount > 0) {
        const newExpense = {
          id: Date.now(),
          name: name,
          amount: amount,
        };
  
        expenses.push(newExpense);
        saveToLocal();
        renderExpenses();
        updateExpenses();
  
        // Clear input fields
        expenseNameInput.value = "";
        expenseAmountInput.value = "";
      }
    });
  
    // Function to render the expenses list
    function renderExpenses() {
      expenseList.innerHTML = "";
  
      expenses.forEach((expense) => {
        const li = document.createElement('li');
        li.innerHTML = `
          ${expense.name} - $${expense.amount.toFixed(2)}
          <button data-id="${expense.id}" class="edit-btn">Edit</button>
          <button data-id="${expense.id}" class="delete-btn">Delete</button>
        `;
        expenseList.appendChild(li);
      });
    }
  
    // Function to calculate the total amount
    function calculateTotal() {
      return expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }
  
    // Function to update total amount display
    function updateExpenses() {
      totalAmount = calculateTotal();
      totalAmountMessage.textContent = totalAmount.toFixed(2);
    }
  
    // Function to save expenses to localStorage
    function saveToLocal() {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }
  
    // Event listener for delete and edit buttons
    expenseList.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn')) {
        const expenseId = Number(e.target.getAttribute('data-id'));
        expenses = expenses.filter(expense => expense.id !== expenseId);
        saveToLocal();
        renderExpenses();
        updateExpenses();
      }
      
      if (e.target.classList.contains('edit-btn')) {
        const expenseId = Number(e.target.getAttribute('data-id'));
        const expenseToEdit = expenses.find(expense => expense.id === expenseId);
  
        if (expenseToEdit) {
          expenseNameInput.value = expenseToEdit.name;
          expenseAmountInput.value = expenseToEdit.amount;
          
          // Remove the old entry
          expenses = expenses.filter(expense => expense.id !== expenseId);
          saveToLocal();
          renderExpenses();
          updateExpenses();
        }
      }
    });
  });
  