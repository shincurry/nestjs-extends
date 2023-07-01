module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: [
    '.d.ts',
  ],
  collectCoverageFrom: [
    './src/**/*.ts',
  ],
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.ts$": "ts-jest",
  },
};