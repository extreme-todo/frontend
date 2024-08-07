export const mockLocalStorage = (
  func: jest.Mock<any>,
  func2?: jest.Mock<any>,
  func3?: jest.Mock<any>,
) => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: func,
      setItem: func2,
      removeItem: func3,
    },
    writable: true,
  });
};
