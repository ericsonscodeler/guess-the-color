/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest'

const config: Config = {
  clearMocks: true,

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  coverageProvider: 'v8',

  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
}

export default config
