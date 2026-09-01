/**
 * Feature flags — hide UI that has no real backend yet.
 * social / followers / privateServers stay off until APIs exist.
 */
export const features = Object.freeze({
  auth: true,
  profileDrawer: true,
  achievementsCatalog: true,
  wiki: true,
  search: true,
  news: true,
  social: false,
  followers: false,
  avatarCustomization: false,
  /** Public server browser API does not exist yet (lobbies are code-based in-game). */
  publicServers: false,
  privateServers: false,
  notifications: false,
});
