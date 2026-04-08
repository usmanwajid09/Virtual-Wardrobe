// Tab Switching
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        
        link.classList.add('active');
        const targetId = 'tab-' + link.getAttribute('data-tab');
        document.getElementById(targetId).classList.add('active');
    });
});

// Authentication Guard
const token = localStorage.getItem('styleiq_token');
if(!token) {
    window.location.href = '/login.html';
}

// API Integration Variables
const API_HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
};

// Fetch and Render Clothes
async function loadClothes() {
    try {
        const res = await fetch('/api/clothes', { headers: API_HEADERS });
        const data = await res.json();
        const grid = document.getElementById('clothes-grid');
        grid.innerHTML = ''; // Clear

        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'garment-card';
            card.innerHTML = `
                <div class="g-img" style="background-image: url('${item.image_url}'); background-size: cover; background-position: center;"></div>
                <div class="g-info">
                    <h4>${item.cloth_name}</h4>
                    <span>${item.type} • ${item.brand || 'Luxury'}</span>
                </div>
                <div class="g-actions">
                    <button class="btn-danger" onclick="deleteGarment(${item.cloth_id})">🗑️ Discard</button>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (err) {
        console.error('Failed to load clothes', err);
    }
}

// Fetch and Render Outfits
async function loadOutfits() {
    try {
        const res = await fetch('/api/outfits', { headers: API_HEADERS });
        const data = await res.json();
        const grid = document.getElementById('outfits-grid');
        grid.innerHTML = ''; // Clear

        data.forEach(item => {
            const isPremium = item.style_category === 'Formal' ? 'premium-outfit' : '';
            const card = document.createElement('div');
            card.className = `outfit-card ${isPremium}`;
            card.innerHTML = `
                <div class="o-tag">${item.season} - ${item.style_category}</div>
                <h3>${item.outfit_name}</h3>
                <p>AI generated composition perfectly matched to your wardrobe.</p>
                <button class="btn-secondary" onclick="alert('Outfit saved!')">Save Outfit</button>
            `;
            grid.appendChild(card);
        });
    } catch (err) {
        console.error('Failed to load outfits', err);
    }
}

// Add Garment Form Setup
const addForm = document.getElementById('add-cloth-form');
addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Fallback ununsplash/picsum generator to make pictures look realistic!
    const randomPic = `https://picsum.photos/400/400?random=${Math.random()}`;

    const newItem = {
        cloth_name: document.getElementById('add-name').value,
        type: document.getElementById('add-type').value,
        color: document.getElementById('add-color').value,
        brand: document.getElementById('add-brand').value,
        season: document.getElementById('add-season').value,
        image_url: randomPic
    };

    try {
        const res = await fetch('/api/clothes', {
            method: 'POST',
            headers: API_HEADERS,
            body: JSON.stringify(newItem)
        });
        
        if(res.ok) {
            document.getElementById('add-modal').style.display = 'none';
            addForm.reset();
            loadClothes(); // Re-render grid using API!
        }
    } catch (err) {
        console.error('Failed to post item', err);
    }
});

// Delete Garment Logic
async function deleteGarment(id) {
    if(!confirm("Are you sure you want to permanently discard this item?")) return;
    
    try {
        const res = await fetch(`/api/clothes/${id}`, {
            method: 'DELETE',
            headers: API_HEADERS
        });
        if(res.ok) {
            loadClothes(); // Re-render grid after deletion
        } else {
            alert('Error deleting item');
        }
    } catch (err) {
        console.error('Failed to delete', err);
    }
}

// Chatbot functionality
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatHistory = document.getElementById('chat-history');

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    appendMessage(userMessage, 'user');
    chatInput.value = '';

    const loadingId = appendMessage('...', 'ai', true);

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: API_HEADERS,
            body: JSON.stringify({ message: userMessage })
        });
        const data = await response.json();
        
        const msgEl = document.getElementById(loadingId);
        if(msgEl && data.reply) {
            msgEl.innerHTML = data.reply;
        } else {
            msgEl.innerHTML = "Sorry, I couldn't process that request.";
        }
    } catch (err) {
        document.getElementById(loadingId).innerText = "Connection error. Stylist offline.";
    }
});

function appendMessage(text, sender, isLoading = false) {
    const div = document.createElement('div');
    div.classList.add('msg', sender);
    div.innerHTML = text; 
    if (isLoading) {
        div.id = 'msg-' + Date.now();
    }
    chatHistory.appendChild(div);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    return div.id;
}

// Fetch and Render Events
async function loadEvents() {
    try {
        const res = await fetch('/api/events', { headers: API_HEADERS });
        const data = await res.json();
        const grid = document.getElementById('events-grid');
        grid.innerHTML = '';
        
        data.forEach(ev => {
            const dateObj = new Date(ev.event_date);
            const day = dateObj.getDate() || '15';
            const month = dateObj.toLocaleString('default', { month: 'short' }) || 'Nov';
            
            const row = document.createElement('div');
            row.className = 'event-row';
            row.innerHTML = `
                <div class="e-date">
                    <strong>${day}</strong><span>${month}</span>
                </div>
                <div class="e-details">
                    <h4>${ev.event_name}</h4>
                    <p>Location: ${ev.location} • Type: ${ev.type}</p>
                </div>
                <button class="btn-secondary" onclick="alert('Sent context to AI Stylist for this event!')">Generate Look</button>
            `;
            grid.appendChild(row);
        });
    } catch (err) {
        console.error('Failed to load events', err);
    }
}

// Initial API Loader
document.addEventListener('DOMContentLoaded', () => {
    loadClothes();
    loadOutfits();
    loadEvents();
});
