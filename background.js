// Campaign state
let campaignActive = false;
let campaignSettings = null;
let dailyStats = {
  connectionsCount: 0,
  followupsCount: 0,
  lastReset: new Date().toISOString()
};

// Initialize or load saved state
chrome.storage.local.get(['dailyStats', 'campaignSettings', 'campaignActive'], (result) => {
  if (result.dailyStats) dailyStats = result.dailyStats;
  if (result.campaignSettings) campaignSettings = result.campaignSettings;
  if (result.campaignActive) {
    campaignActive = result.campaignActive;
    if (campaignActive) startCampaign();
  }
});

// Reset daily stats at midnight
function resetDailyStats() {
  const now = new Date();
  const lastReset = new Date(dailyStats.lastReset);
  
  if (now.getDate() !== lastReset.getDate()) {
    dailyStats = {
      connectionsCount: 0,
      followupsCount: 0,
      lastReset: now.toISOString()
    };
    chrome.storage.local.set({ dailyStats });
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const msToMidnight = tomorrow.getTime() - now.getTime();

  setTimeout(resetDailyStats, msToMidnight);
}

resetDailyStats();

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'START_CAMPAIGN':
      campaignActive = true;
      campaignSettings = message.data;
      chrome.storage.local.set({ 
        campaignActive,
        campaignSettings
      });
      startCampaign();
      break;

    case 'PAUSE_CAMPAIGN':
      campaignActive = false;
      chrome.storage.local.set({ campaignActive });
      break;

    case 'GET_STATS':
      sendResponse(dailyStats);
      break;
  }
});

// Campaign logic
async function startCampaign() {
  if (!campaignActive || !campaignSettings) return;

  try {
    // Get current LinkedIn tab or create one
    let [tab] = await chrome.tabs.query({ url: 'https://*.linkedin.com/search/results/people/*' });
    if (!tab) {
      tab = await chrome.tabs.create({ 
        url: 'https://www.linkedin.com/search/results/people/',
        active: false
      });
    }

    // Start connection requests if below daily limit
    if (dailyStats.connectionsCount < campaignSettings.dailyLimit) {
      const result = await sendConnectionRequest(tab.id);
      if (result?.success) {
        dailyStats.connectionsCount++;
        chrome.storage.local.set({ dailyStats });
        
        // Show notification
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'assets/icon128.png',
          title: 'Connection Request Sent',
          message: `Connection request sent to ${result.profileInfo.name}`
        });
      }
    }

    // Schedule next run (random interval between 3-7 minutes)
    if (campaignActive) {
      const nextRun = Math.floor(Math.random() * (7 - 3 + 1) + 3) * 60 * 1000;
      setTimeout(startCampaign, nextRun);
    }
  } catch (error) {
    console.error('Campaign error:', error);
    campaignActive = false;
    chrome.storage.local.set({ campaignActive });
  }
}

async function sendConnectionRequest(tabId) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, {
      type: 'SEND_CONNECTION',
      data: {
        connectionMessage: campaignSettings.connectionMessage,
        filters: campaignSettings.filters
      }
    }, resolve);
  });
}

// Error handling and rate limiting
function handleLinkedInError(error) {
  if (error.includes('rate limit')) {
    campaignActive = false;
    chrome.storage.local.set({ campaignActive });
    
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'assets/icon128.png',
      title: 'Campaign Paused',
      message: 'LinkedIn rate limit reached. Campaign will resume in 4 hours.'
    });

    // Wait for 4 hours before resuming
    setTimeout(() => {
      campaignActive = true;
      chrome.storage.local.set({ campaignActive });
      startCampaign();
    }, 4 * 60 * 60 * 1000);
  }
}