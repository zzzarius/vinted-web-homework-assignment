export const authorizedFetch = jest.fn().mockImplementation(async (url: string, init?: RequestInit) => {
  return {
    ok: true,
    json: async () => ({ photos: [] })
  };
});
