import { defineStore } from 'pinia'
import axios from 'axios'

// Base URL for token generation API
const API_BASE = 'https://swsut62sse.execute-api.ap-south-1.amazonaws.com/prod'
// Base URL for content retrieval API
const CONTENT_API = 'https://tzab40im77.execute-api.ap-south-1.amazonaws.com/prod'

// Define a Pinia store named 'content'
export const useContentStore = defineStore('content', {
  state: () => ({
    token: '',          // Stores the generated token
    content: null,      // Stores fetched content
    loading: false,     // Indicates loading status
    error: null         // Holds error message if any
  }),


  actions: {
    // Generate token using user email
    async generateToken(email) {
      this.loading = true
      this.error = null
      try {
        // Make POST request to get token
        const res = await axios.post(`${API_BASE}/generateToken`, { email })
        this.token = res.data.token //received token
      } catch (err) {
        console.error(err);
        // Set error if request fails
        this.error = 'Token generation failed'
      } finally {
        // Reset loading status
        this.loading = false
      }
    },

    // Fetch content using the stored token
    async fetchContent() {
      if (!this.token) {
        // Do not proceed if token is missing
        this.error = 'Token not available'
        return
      }

      this.loading = true
      this.error = null
      try {
        // Make GET request to fetch content with token in header
        const res = await axios.get(`${CONTENT_API}/getContent`, {
          headers: {
            Authorization: `Bearer ${this.token}` // Pass token securely
          }
        })
        this.content = res.data.content // Store the received content
      } catch (err) {
        console.error(err);
        // Set error if request fails
        this.error = 'Content fetch failed'
      } finally {
        // Reset loading status
        this.loading = false
      }
    }
  },

  getters: {
    // Returns true if content is loaded and not currently loading
    isLoaded: (state) => !!state.content && !state.loading
  }
})
