// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock URL.createObjectURL which is not available in jsdom
global.URL.createObjectURL = jest.fn(() => 'mock-url')
global.URL.revokeObjectURL = jest.fn()
