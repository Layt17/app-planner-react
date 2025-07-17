export interface TgAppDataI {
  queryId: string | null;
  user: {
    username: string | null;
    firstName: string | null;
    lastName: string | null;
    languageCode: string | null;
    isPremium: string | null;
  };
}
