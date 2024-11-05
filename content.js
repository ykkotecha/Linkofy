// LinkedIn DOM Helper
const LinkedInHelper = {
  async waitForElement(selector, timeout = 5000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const element = document.querySelector(selector);
      if (element) return element;
      await new Promise(r => setTimeout(r, 100));
    }
    throw new Error(`Element ${selector} not found within ${timeout}ms`);
  },

  getProfileInfo() {
    const nameElement = document.querySelector('h1.text-heading-xlarge');
    const titleElement = document.querySelector('div.text-body-medium');
    const locationElement = document.querySelector('.pv-text-details__left-panel .text-body-small');
    
    return {
      name: nameElement?.textContent?.trim() || '',
      title: titleElement?.textContent?.trim() || '',
      location: locationElement?.textContent?.trim() || '',
      firstName: nameElement?.textContent?.trim()?.split(' ')[0] || ''
    };
  },

  async clickConnect() {
    try {
      const connectButton = await this.waitForElement('button[aria-label*="Connect"]');
      if (connectButton && !connectButton.disabled) {
        connectButton.click();
        return true;
      }
    } catch (error) {
      console.error('Failed to click connect button:', error);
    }
    return false;
  },

  async sendMessage(message, profileInfo) {
    try {
      const messageInput = await this.waitForElement('textarea[name="message"]');
      if (messageInput) {
        // Replace template variables
        const personalizedMessage = message
          .replace(/{{firstName}}/g, profileInfo.firstName)
          .replace(/{{name}}/g, profileInfo.name)
          .replace(/{{title}}/g, profileInfo.title)
          .replace(/{{location}}/g, profileInfo.location);

        messageInput.value = personalizedMessage;
        messageInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        const sendButton = await this.waitForElement('button[aria-label="Send now"]');
        if (sendButton) {
          sendButton.click();
          return true;
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
    return false;
  },

  async isProfileRelevant(filters) {
    if (!filters) return true;

    const profileInfo = this.getProfileInfo();
    const { title, location } = profileInfo;

    if (filters.keywords && !title.toLowerCase().includes(filters.keywords.toLowerCase())) {
      return false;
    }

    if (filters.location && !location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }

    return true;
  }
};

// Listen for commands from background script
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  try {
    switch (message.type) {
      case 'SEND_CONNECTION':
        const profileInfo = LinkedInHelper.getProfileInfo();
        const isRelevant = await LinkedInHelper.isProfileRelevant(message.data.filters);
        
        if (isRelevant) {
          const connected = await LinkedInHelper.clickConnect();
          if (connected) {
            await new Promise(r => setTimeout(r, 1000));
            const messageSent = await LinkedInHelper.sendMessage(
              message.data.connectionMessage,
              profileInfo
            );
            sendResponse({ 
              success: messageSent, 
              profileInfo,
              action: 'connection_sent'
            });
          }
        }
        break;

      case 'SEND_FOLLOWUP':
        const followupInfo = LinkedInHelper.getProfileInfo();
        const followupSent = await LinkedInHelper.sendMessage(
          message.data.followupMessage,
          followupInfo
        );
        sendResponse({ 
          success: followupSent,
          profileInfo: followupInfo,
          action: 'followup_sent'
        });
        break;

      case 'GET_PROFILE_INFO':
        const info = LinkedInHelper.getProfileInfo();
        sendResponse({ success: true, data: info });
        break;
    }
  } catch (error) {
    console.error('Content script error:', error);
    sendResponse({ success: false, error: error.message });
  }
  return true;
});