export type Role = "user" | "admin" | "scanner";

export type Slide = {
  id: string;
  role: Role;
  title: string;
  /** Path under /public */
  src: string;
  /** Flat captures: add device frame styling so they read like phone UI */
  deviceFrame?: boolean;
};

export const userSlides: Slide[] = [
  { id: "u1", role: "user", title: "Splash", src: "/images/user-01-splash-screen.png" },
  { id: "u11", role: "user", title: "Sign in", src: "/images/user-11-sign-in.png" },
  { id: "u3", role: "user", title: "Home — stamp card", src: "/images/user-03-home-stamps.png" },
  { id: "u2", role: "user", title: "Home — spotlight & stamps", src: "/images/user-02-home-spotlight.png" },
  { id: "u10", role: "user", title: "Spotlight — article", src: "/images/user-10-spotlight-article.png" },
  { id: "u4", role: "user", title: "Barcode — scan at till", src: "/images/user-04-barcode.png" },
  { id: "u5", role: "user", title: "Rewards — offer list", src: "/images/user-05-rewards-matcha.png" },
  { id: "u6", role: "user", title: "Barcode — reward added", src: "/images/user-06-barcode-reward-added.png" },
  { id: "u7", role: "user", title: "Rewards — free drinks", src: "/images/user-07-rewards-free-drinks.png" },
  { id: "u8", role: "user", title: "Settings", src: "/images/user-08-settings.png" },
  { id: "u9", role: "user", title: "Profile", src: "/images/user-09-profile.png" },
  { id: "u12", role: "user", title: "Rewards — use at till", src: "/images/user-12-rewards-use-till.png" },
  { id: "u13", role: "user", title: "Reward code entry", src: "/images/user-13-reward-code.png" },
  { id: "u14", role: "user", title: "Reward code — success", src: "/images/user-14-reward-code-success.png" },
  { id: "u15", role: "user", title: "Rewards — all offers", src: "/images/user-15-rewards-all.png" },
];

export const adminSlides: Slide[] = [
  { id: "a1", role: "admin", title: "Home — activity dashboard", src: "/images/admin-01-home-dashboard.png" },
  { id: "a2", role: "admin", title: "Scan — till flow", src: "/images/admin-02-scan.png" },
  { id: "a3", role: "admin", title: "Customers", src: "/images/admin-03-customers.png" },
  { id: "a4", role: "admin", title: "Customer — overview", src: "/images/admin-04-customer-overview.png" },
  { id: "a5", role: "admin", title: "Customer — stamps", src: "/images/admin-05-customer-stamps.png" },
  { id: "a6", role: "admin", title: "Customer — rewards", src: "/images/admin-06-customer-rewards.png" },
  { id: "a7", role: "admin", title: "Customer — campaigns", src: "/images/admin-07-customer-campaigns.png" },
  { id: "a8", role: "admin", title: "Campaigns", src: "/images/admin-08-campaigns-list.png" },
  { id: "a9", role: "admin", title: "Campaign — details", src: "/images/admin-09-campaign-details.png" },
  { id: "a10", role: "admin", title: "Campaign — stats", src: "/images/admin-10-campaign-stats.png" },
  { id: "a11", role: "admin", title: "Campaign — customers", src: "/images/admin-11-campaign-customers.png" },
  { id: "a12", role: "admin", title: "Settings — admin tools", src: "/images/admin-12-settings-admin.png" },
  { id: "a13", role: "admin", title: "Spotlight — list", src: "/images/admin-13-spotlight-list.png" },
  { id: "a14", role: "admin", title: "Spotlight — editor", src: "/images/admin-14-add-spotlight.png" },
  { id: "a15", role: "admin", title: "Spotlight — crop image", src: "/images/admin-15-edit-spotlight-image.png" },
  { id: "a16", role: "admin", title: "Spotlight stats", src: "/images/admin-16-spotlight-stats.png" },
  { id: "a17", role: "admin", title: "Spotlight stats — readers", src: "/images/admin-17-spotlight-stats-users.png" },
  { id: "a18", role: "admin", title: "Home — date range", src: "/images/admin-18-home-date-range.png" },
  { id: "a19", role: "admin", title: "Campaigns — filter", src: "/images/admin-19-campaigns-filter.png" },
  { id: "a20", role: "admin", title: "Add campaign — type", src: "/images/admin-20-add-campaign-type.png" },
  { id: "a21", role: "admin", title: "Add campaign — promo code", src: "/images/admin-21-add-campaign-promo.png" },
  { id: "a22", role: "admin", title: "Campaigns — live list", src: "/images/admin-22-campaigns-two-live.png" },
  { id: "a23", role: "admin", title: "Loyalty settings", src: "/images/admin-23-loyalty-settings.png", deviceFrame: true },
  { id: "a24", role: "admin", title: "Locations settings", src: "/images/admin-24-locations-settings.png", deviceFrame: true },
  { id: "a25", role: "admin", title: "Location", src: "/images/admin-25-location.png", deviceFrame: true },
  { id: "a26", role: "admin", title: "Team", src: "/images/admin-26-team.png", deviceFrame: true },
  { id: "a27", role: "admin", title: "Add team member", src: "/images/admin-27-add-team-member.png", deviceFrame: true },
];

export const scannerSlides: Slide[] = [
  { id: "s1", role: "scanner", title: "Scanner — view", src: "/images/scanner-01-view.png", deviceFrame: true },
  { id: "s2", role: "scanner", title: "Scanner — camera", src: "/images/scanner-02-camera.png" },
  { id: "s3", role: "scanner", title: "Scanner — after scan", src: "/images/scanner-03-after-scan.png" },
];

export function getSlides(role: Role): Slide[] {
  if (role === "user") return userSlides;
  if (role === "scanner") return scannerSlides;
  return adminSlides;
}
