
import { Status } from './types';

// This is a mock service. In a real-world scenario, this would be a backend
// service that pings the URL to avoid CORS issues in the browser.
// We simulate a 95% uptime for demonstration purposes.
export const checkUrlStatus = async (url: string): Promise<{ status: Status.UP | Status.DOWN }> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const isUp = Math.random() > 0.05; 
      if (isUp) {
        resolve({ status: Status.UP });
      } else {
        resolve({ status: Status.DOWN });
      }
    }, 1000 + Math.random() * 1000);
  });
};
