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
let suppliers = [];

// Function to render inventory list
async function renderInventory() {
    const inventoryList = document.getElementById('inventory-list');
    inventoryList.innerHTML = ''; // Clear the list before rendering

    const snapshot = await db.collection(`company/${sessionStorage.getItem("username")}/inventory`).get();
    snapshot.forEach(doc => {
        const item = doc.data();
        const card = document.createElement('div');
        card.className = 'progress-card';
        console.log(item)
        // Set the fill amount for the progress circle based on the item quantity
        const radius = 40; // Radius of the circle
        const circumference = 2 * Math.PI * radius; // Calculate circumference
        console.log(item.quantity / item.totalResource)
        const fillAmount = ((item.quantity / item.totalResource) * circumference).toFixed(2); // Calculate fill amount

        // Card content with progress indicator and item details
        card.innerHTML = `
            <h2>${item.name}</h2>
            <div class="progress-circle">
                <svg width="100" height="100">
                    <circle class="circle-bg" cx="50" cy="50" r="${radius}"></circle>
                    <circle class="circle-fill" cx="50" cy="50" r="${radius}" style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${circumference - fillAmount};"></circle>
                </svg>
                <div class="percentage">
                    <h3>${Math.round((item.quantity / item.totalResource) * 100)}%</h3>
                </div>
            </div>
            <div class="details">
                <p class="quantity">Used Quantity: ${item.quantity}</p>
                <p class="supplier">Supplier: ${item.supplier}</p>
            </div>
        `;


        // Highlight low stock items
        if ((item.quantity / item.totalResource) * 100 > 90) { // Assume 90% is the low stock threshold
            card.classList.add('low-stock');
        }

        inventoryList.appendChild(card);
    });
}

// Function to render suppliers
function renderSuppliers() {
    const supplierList = document.getElementById('supplier-list');
    supplierList.innerHTML = ''; // Clear the list before rendering

    suppliers.forEach((supplier, index) => {
        const li = document.createElement('li');
        li.className = 'supplier-item';
        li.textContent = supplier;

        // Button to remove supplier
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'remove-supplier';
        removeButton.onclick = () => removeSupplier(index); // Pass the index to remove supplier

        li.appendChild(removeButton);
        supplierList.appendChild(li);
    });
}

 
function removeSupplier(index) {
    suppliers.splice(index, 1);
    renderSuppliers();
}
 
document.getElementById('inventory-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const itemName = document.getElementById('item-name').value;
    const itemQuantity = parseInt(document.getElementById('item-quantity').value);
    const itemSupplier = document.getElementById('item-supplier').value;

    if (itemName && itemQuantity && itemSupplier) {
        try {
            
            const existingItemSnapshot = await db.collection(`company/${sessionStorage.getItem("username")}/inventory`).where('name', '==', itemName).get();

            if (!existingItemSnapshot.empty) {
               
                existingItemSnapshot.forEach(async (doc) => {
                    const existingItem = doc.data();
                    const newQuantity = existingItem.quantity;
                    const newTotalResource = existingItem.totalResource; // Assuming total resources do not change

                    await db.collection('inventory').doc(doc.id).update({
                        quantity: newQuantity,
                        totalResource: newTotalResource
                    });

                    console.log("Item updated successfully");
                });
            } else {
                // First time adding the item; set total resources equal to quantity
                await db.collection(`company/${sessionStorage.getItem("username")}/inventory`).add({
                    name: itemName,
                    quantity: 0,
                    supplier: itemSupplier,
                    totalResource: itemQuantity // Set total resources to the initial quantity
                });
                console.log("Item added successfully");
            }

            // Re-render the inventory list
            await renderInventory();
        } catch (error) {
            console.error("Error updating/adding item: ", error);
        }
    }

    // Clear the input fields
    document.getElementById('item-name').value = '';
    document.getElementById('item-quantity').value = '';
    document.getElementById('item-supplier').value = '';
});

// Event listener for supplier form submission
document.getElementById('supplier-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const supplierName =prompt("Enter the supplier name");

    if (supplierName) {
        suppliers.push(supplierName);
        renderSuppliers();
        await populateSupplierOptions();
    }
});

 
function populateSupplierOptions() {
    const supplierSelect = document.getElementById('item-supplier');
    supplierSelect.innerHTML = '<option value="" disabled selected>Select Supplier</option>'; // Reset options

    suppliers.forEach(supplier => {
        const option = document.createElement('option');
        option.value = supplier; // Set the value of the option
        option.textContent = supplier; // Set the display text
        supplierSelect.appendChild(option); // Add the option to the select
    });
}

 
window.onload = async function() {
    if(sessionStorage.getItem("username"))
    {

        const snapshot = await db.collection(`company/${sessionStorage.getItem("username")}/suppliers`).get();
        snapshot.forEach(doc => {
            suppliers.push(doc.data().name);
        });
        await populateSupplierOptions();
        await renderInventory();
        await renderSuppliers();
    }else{
        window.location.replace="sign_in.html"
    }
}
