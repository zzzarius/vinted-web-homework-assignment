export const authorizedFetch = jest.fn().mockImplementation(async () => {
  return {
    ok: true,
    json: async () => ({ photos: [] })
  };
});
