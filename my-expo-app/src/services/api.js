import { Platform } from 'react-native';

/**
 * BASE API CONFIGURATION
 * 
 * Android Emulator: http://10.0.2.2:5000
 * iOS Simulator: http://localhost:5000
 * Physical Device: http://<YOUR_COMPUTER_IP>:5000
 */

// CHANGE THIS TO YOUR LOCAL IP ADDRESS IF TESTING ON A REAL PHONE
const BASE_URL = 'http://192.168.1.12:5000'; 

export const apiCall = async (endpoint, method = 'GET', data = null) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API Error');
    }

    return await response.json();
  } catch (error) {
    if (__DEV__) {
      console.log(`API Call Failed (${endpoint}):`, error.message);
      // Optional: Add an alert to see the error on a physical device without a debugger
      // alert(`Connection Error: ${error.message}\nURL: ${BASE_URL}${endpoint}`);
    }
    throw error;
  }
};

// Chat Services
export const logChatMessage = (chatData) => apiCall('/api/chat/log', 'POST', chatData);
export const getChatHistory = (userId) => apiCall(`/api/chat/history/${userId}`, 'GET');
export const askAI = (chatData) => apiCall('/api/chat/ask', 'POST', chatData);

// Expense Services
export const syncExpense = (expenseData) => apiCall('/api/expenses', 'POST', expenseData);
export const deleteExpenseSync = (id) => apiCall(`/api/expenses/${id}`, 'DELETE');

// User Services
export const registerUser = (userData) => apiCall('/api/users', 'POST', userData);
export const getUserProfile = (id) => apiCall(`/api/users/profile/${id}`, 'GET');
