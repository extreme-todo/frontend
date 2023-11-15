export const mockLocalStorage = (
  func: jest.Mock<any>,
  func2?: jest.Mock<any>,
) => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: func,
      removeItem: jest.fn(),
      setItem: func2,
    },
    writable: true,
  });
};
