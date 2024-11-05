// Authentication state management
let isAuthenticated = false;
let currentUser = null;

// DOM Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const startCampaignBtn = document.getElementById('start-campaign');
const pauseCampaignBtn = document.getElementById('pause-campaign');

// Initialize the popup
document.addEventListener('DOMContentLoaded', async () => {
  // Check if campaign is running
  chrome.storage.local.get(['campaignActive', 'dailyStats'], (result) => {
    if (result.campaignActive) {
      startCampaignBtn.disabled = true;
      pauseCampaignBtn.disabled = false;
    }
    
    if (result.dailyStats) {
      document.getElementById('connections-count').textContent = result.dailyStats.connectionsCount;
      document.getElementById('followups-count').textContent = result.dailyStats.followupsCount;
    }
  });

  const auth = await checkAuthStatus();
  updateUI(auth);
});

// Check authentication status
async function checkAuthStatus() {
  try {
    const response = await fetch('https://your-api.com/auth/status', {
      credentials: 'include'
    });
    const data = await response.json();
    isAuthenticated = data.authenticated;
    currentUser = data.user;
    return data;
  } catch (error) {
    console.error('Auth check failed:', error);
    return { authenticated: false };
  }
}

// Update UI based on auth status
function updateUI(auth) {
  if (auth.authenticated) {
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    loadDashboardData();
  } else {
    loginSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
  }
}

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('https://your-api.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    const data = await response.json();
    if (data.success) {
      isAuthenticated = true;
      currentUser = data.user;
      updateUI({ authenticated: true });
    } else {
      alert('Login failed. Please check your credentials.');
    }
  } catch (error) {
    console.error('Login failed:', error);
    alert('Login failed. Please try again.');
  }
});

// Handle logout
logoutBtn.addEventListener('click', async () => {
  try {
    await fetch('https://your-api.com/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    isAuthenticated = false;
    currentUser = null;
    updateUI({ authenticated: false });
  } catch (error) {
    console.error('Logout failed:', error);
  }
});

// Campaign Controls
startCampaignBtn.addEventListener('click', async () => {
  const connectionMsg = document.getElementById('connection-message').value;
  const followupMsg = document.getElementById('followup-message').value;
  const dailyLimit = document.getElementById('daily-limit').value;

  chrome.runtime.sendMessage({
    type: 'START_CAMPAIGN',
    data: {
      connectionMessage: connectionMsg,
      followupMessage: followupMsg,
      dailyLimit: parseInt(dailyLimit),
      filters: {
        keywords: '',
        location: '',
        industry: ''
      }
    }
  });

  startCampaignBtn.disabled = true;
  pauseCampaignBtn.disabled = false;
});

pauseCampaignBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'PAUSE_CAMPAIGN' });
  startCampaignBtn.disabled = false;
  pauseCampaignBtn.disabled = true;
});

// Load dashboard data
async function loadDashboardData() {
  chrome.storage.local.get(['dailyStats'], (result) => {
    if (result.dailyStats) {
      document.getElementById('connections-count').textContent = result.dailyStats.connectionsCount;
      document.getElementById('followups-count').textContent = result.dailyStats.followupsCount;
    }
  });
}