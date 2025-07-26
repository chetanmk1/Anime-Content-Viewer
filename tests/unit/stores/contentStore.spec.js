import { setActivePinia, createPinia } from 'pinia'
import { useContentStore } from '@/stores/contentStore'
import axios from 'axios'

// Silence expected error logs
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => { })
})

afterAll(() => {
  console.error.mockRestore()
})

// Mock axios
jest.mock('axios')

describe('contentStore', () => {
  let store

  beforeEach(() => {
    // Initialize Pinia
    setActivePinia(createPinia())
    store = useContentStore()

    // Reset mocks before each test
    axios.post.mockReset()
    axios.get.mockReset()
  })

  // Test 1: Store Initialization
  it('initializes with empty state', () => {
    expect(store.token).toBe('')
    expect(store.content).toBeNull()
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  // Test 2: generateToken Success
  describe('generateToken', () => {
    it('successfully generates token', async () => {
      const mockToken = 'test-token-123'
      axios.post.mockResolvedValue({ data: { token: mockToken } })

      await store.generateToken('test@example.com')

      expect(axios.post).toHaveBeenCalledWith(
        'https://swsut62sse.execute-api.ap-south-1.amazonaws.com/prod/generateToken',
        { email: 'test@example.com' }
      )
      expect(store.token).toBe(mockToken)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    // Test 3: generateToken Failure
    it('handles token generation failure', async () => {
      axios.post.mockRejectedValue(new Error('API error'))

      await store.generateToken('test@example.com')

      expect(store.error).toBe('Token generation failed')
      expect(store.loading).toBe(false)
    })
  })

  // Test 4: fetchContent Success
  describe('fetchContent', () => {
    it('successfully fetches content with valid token', async () => {
      store.token = 'valid-token'
      const mockContent = { title: 'Test Content' }
      axios.get.mockResolvedValue({ data: { content: mockContent } })

      await store.fetchContent()

      expect(axios.get).toHaveBeenCalledWith(
        'https://tzab40im77.execute-api.ap-south-1.amazonaws.com/prod/getContent',
        {
          headers: {
            Authorization: 'Bearer valid-token'
          }
        }
      )
      expect(store.content).toEqual(mockContent)
      expect(store.loading).toBe(false)
    })

    // Test 5: fetchContent without token
    it('rejects without token', async () => {
      store.token = ''
      await store.fetchContent()

      expect(store.error).toBe('Token not available')
      expect(axios.get).not.toHaveBeenCalled()
    })

    // Test 6: fetchContent Failure
    it('handles content fetch failure', async () => {
      store.token = 'valid-token'
      axios.get.mockRejectedValue(new Error('API error'))

      await store.fetchContent()

      expect(store.error).toBe('Content fetch failed')
      expect(store.loading).toBe(false)
    })
  })

  // Test 7: isLoaded Getter
  describe('isLoaded', () => {
    it('returns true when content exists and not loading', () => {
      store.content = { some: 'content' }
      store.loading = false
      expect(store.isLoaded).toBe(true)
    })

    it('returns false when loading', () => {
      store.content = { some: 'content' }
      store.loading = true
      expect(store.isLoaded).toBe(false)
    })

    it('returns false when no content', () => {
      store.content = null
      store.loading = false
      expect(store.isLoaded).toBe(false)
    })
  })
})
