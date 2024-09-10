export const mockLocalStorage = (
  getItem: jest.Mock<any>,
  setItem?: jest.Mock<any>,
  removeItem?: jest.Mock<any>,
) => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: getItem,
      setItem: setItem,
      removeItem: removeItem,
    },
    writable: true,
  });
};
