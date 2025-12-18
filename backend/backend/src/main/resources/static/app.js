const API_BASE = '/api'; 

document.addEventListener('DOMContentLoaded', async () => {
    await loadUsers(); // Load dropdown first
    loadSubscriptions(); // Load list
    loadLedger(); // Load debts
});

// --- 1. User Management (Simulated Login) ---
async function loadUsers() {
    try {
        const res = await fetch(`${API_BASE}/users`);
        const users = await res.json();
        
        const select = document.getElementById('currentUserSelect');
        const consumerDiv = document.getElementById('consumer-checkboxes');
        
        // Populate Header Dropdown
        select.innerHTML = users.map(u => 
            `<option value="${u.id}">${u.name}</option>`
        ).join('');

        // Populate "Shared With" Checkboxes
        consumerDiv.innerHTML = users.map(u => `
            <label class="checkbox-item">
                <input type="checkbox" value="${u.id}"> ${u.name}
            </label>
        `).join('');

    } catch (e) { console.error("Error loading users", e); }
}

// --- 2. Subscription CRUD ---

// LOAD (Read)
async function loadSubscriptions() {
    const res = await fetch(`${API_BASE}/subscriptions`);
    const subs = await res.json();
    const container = document.getElementById('sub-list');
    
    container.innerHTML = subs.map(sub => `
        <div class="sub-card">
            <div class="card-top">
                <div class="service-name">${sub.name}</div>
                <div>
                    <button onclick="editSubscription('${sub.id}')" class="icon-btn"><i class="fa-solid fa-pen"></i></button>
                    <button onclick="deleteSubscription('${sub.id}')" class="icon-btn delete"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
            <div class="service-cost">$${sub.amount.toFixed(2)}</div>
            <div class="renewal-date">Owner: ${getUserName(sub.payerId)}</div>
        </div>
    `).join('');
}

// CREATE & UPDATE
document.getElementById('sub-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('edit-sub-id').value;
    const isEdit = !!id;
    const currentUser = document.getElementById('currentUserSelect').value;
    
    // Get checked consumers
    const checkboxes = document.querySelectorAll('#consumer-checkboxes input:checked');
    const consumerIds = Array.from(checkboxes).map(cb => cb.value);

    const payload = {
        name: document.getElementById('name').value,
        amount: parseFloat(document.getElementById('amount').value),
        payerId: currentUser, 
        cycle: "MONTHLY",
        firstBillingDate: new Date().toISOString().split('T')[0],
        consumerIds: consumerIds
    };

    const url = isEdit ? `${API_BASE}/subscriptions/${id}` : `${API_BASE}/subscriptions`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert(isEdit ? 'Updated!' : 'Created!');
            resetForm();
            loadSubscriptions();
            loadLedger();
        } else {
            const err = await res.json();
            alert('Error: ' + err.message); // Using our GlobalExceptionHandler message!
        }
    } catch (error) {
        alert("Server Error");
    }
});

// EDIT (Populate Form)
window.editSubscription = async (id) => {
    // Ideally fetch single sub, but for MVP we filter from UI or reload
    const res = await fetch(`${API_BASE}/subscriptions/${id}`);
    const sub = await res.json();

    document.getElementById('edit-sub-id').value = sub.id;
    document.getElementById('name').value = sub.name;
    document.getElementById('amount').value = sub.amount;
    document.getElementById('save-btn').innerText = "Update Subscription";
    document.getElementById('cancel-btn').style.display = 'inline-block';
    
    // Note: Populating checkboxes for edit requires looping through sub.consumers
    // Skipped for brevity in MVP, but ask if you need it.
};

// DELETE
window.deleteSubscription = async (id) => {
    if(!confirm("Delete this subscription?")) return;
    
    await fetch(`${API_BASE}/subscriptions/${id}`, { method: 'DELETE' });
    loadSubscriptions();
    loadLedger();
};

// CANCEL EDIT
document.getElementById('cancel-btn').addEventListener('click', resetForm);

function resetForm() {
    document.getElementById('sub-form').reset();
    document.getElementById('edit-sub-id').value = '';
    document.getElementById('save-btn').innerText = "Save Subscription";
    document.getElementById('cancel-btn').style.display = 'none';
}

// --- 3. Ledger Logic ---
async function loadLedger() {
    const list = document.getElementById('ledger-list');
    list.innerHTML = 'Loading...';
    
    const res = await fetch(`${API_BASE}/ledger`);
    const debts = await res.json();
    
    if (debts.length === 0) {
        list.innerHTML = '<p class="text-muted">No active debts.</p>';
        return;
    }

    list.innerHTML = debts.map(debt => `
        <div class="card" style="background: rgba(255,255,255,0.05); margin-bottom:10px; padding:10px;">
            <div style="display:flex; justify-content:space-between;">
                <strong>${debt.debtorName}</strong>
                <span style="color:#ef4444;">owes $${debt.amount}</span>
            </div>
            <div style="font-size:0.8rem; color:#aaa;">
                to ${debt.creditorName} for ${debt.description}
            </div>
        </div>
    `).join('');
}

// Helper to find name (You might need a map for efficiency, but this works for MVP)
function getUserName(id) {
    // In a real app, we'd map ID to Name. 
    // For now, returning ID or you can fetch User object.
    const sel = document.getElementById('currentUserSelect');
    const opt = sel.querySelector(`option[value="${id}"]`);
    return opt ? opt.innerText : 'Unknown';
}