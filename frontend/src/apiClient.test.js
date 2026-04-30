const originalEnv = process.env;

afterEach(() => {
  jest.resetModules();
  process.env = originalEnv;
});

test("uses localhost backend by default", () => {
  jest.resetModules();
  process.env = { ...originalEnv };
  delete process.env.REACT_APP_API_BASE_URL;

  const { default: apiClient, API_BASE_URL } = require("./apiClient");

  expect(API_BASE_URL).toBe("http://localhost:5001");
  expect(apiClient.defaults.baseURL).toBe("http://localhost:5001");
});

test("uses REACT_APP_API_BASE_URL when configured", () => {
  jest.resetModules();
  process.env = {
    ...originalEnv,
    REACT_APP_API_BASE_URL: "https://api.example.com",
  };

  const { default: apiClient, API_BASE_URL } = require("./apiClient");

  expect(API_BASE_URL).toBe("https://api.example.com");
  expect(apiClient.defaults.baseURL).toBe("https://api.example.com");
});
