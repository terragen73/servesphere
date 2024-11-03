const firebaseConfig = {
    apiKey: "AIzaSyApl5-gq5HsM0WX6vqso2po2fIoLr6q108",
    authDomain: "servesphere-463e1.firebaseapp.com",
    projectId: "servesphere-463e1",
    storageBucket: "servesphere-463e1.firebasestorage.app",
    messagingSenderId: "362741020270",
    appId: "1:362741020270:web:3189fa648b73043d84587f"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let totalExpenditure = 0;
let totalProfit = 0;
 

// Function to update totals in the DOM
function updateTotals() {
    document.getElementById('total-expenditure').innerText = totalExpenditure;
    document.getElementById('total-profit').innerText = totalProfit;
     
}

// Function to render transaction history as a table
async function renderTransactionHistory() {
    const transactionHistory = document.getElementById('transaction-history');
    transactionHistory.innerHTML = ''; // Clear the table before rendering

    const snapshot = await db.collection(`company/${sessionStorage.getItem("username")}/transactions`).get();
    snapshot.forEach(doc => {
        const transaction = doc.data();
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.name}</td>
            <td>${transaction.amount}</td>
            <td>${transaction.date.toDate().toLocaleDateString()}</td>
            <td>${transaction.type}</td>
        `;
        transactionHistory.appendChild(row);
    });
}

// Event listener for transaction form submission
document.getElementById('transaction-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const transactionName = document.getElementById('transaction-name').value;
    const transactionAmount = parseFloat(document.getElementById('transaction-amount').value);
    const transactionDate = document.getElementById('transaction-date').value;
    const transactionType = document.getElementById('transaction-type').value;

    if (transactionName && transactionAmount && transactionType) {
        // Add the new transaction to Firestore
        await db.collection(`company/${sessionStorage.getItem("username")}/transactions`).add({
            name: transactionName,
            amount: transactionAmount,
            date: new Date(transactionDate),
            type: transactionType
        });

        // Update total amounts
        if (transactionType === 'expenditure') {
            totalExpenditure += transactionAmount;
            
        } else if (transactionType === 'profit') {
            totalProfit += transactionAmount;
        }

        // Re-render the transaction history and update totals
        await renderTransactionHistory();
        updateTotals();

        // Clear the input fields
        document.getElementById('transaction-name').value = '';
        document.getElementById('transaction-amount').value = '';
        document.getElementById('transaction-type').value = '';
        document.getElementById('transaction-date').value = '';
    }
});

// Initial rendering on page load
window.onload = async function() {

    if(sessionStorage.getItem("username"))
    {
        
        await renderTransactionHistory();
        const snapshot = await db.collection(`company/${sessionStorage.getItem("username")}/transactions`).get();
        snapshot.forEach(doc => {
            const transaction = doc.data();
            if (transaction.type === 'expenditure') {
                totalExpenditure += transaction.amount;
                 
            } else if (transaction.type === 'profit') {
                totalProfit += transaction.amount;
            }
        });
        updateTotals();
    }else{
        
        window.location.href="sign_in.html"
    }
}