/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  preset: "ts-jest",
  testEnvironment: "node",
  "testPathIgnorePatterns": ["/_testCommon.ts"]
};