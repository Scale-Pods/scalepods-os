import type { AppManifest } from "@/lib/types/manifest";

export const manifest: AppManifest = {
  id: "marketing-content-os",
  name: "Content OS",
  pod: "marketing",
  description: "AI content engine: research, strategy, studios, maker-checker approval, UGC & video, publishing and analytics",
  icon: "Megaphone",
  basePath: "/marketing/content-os",
  nav: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Brand Profile", path: "/brand-profile" },
    {
      label: "Research",
      path: "/research",
      children: [
        { label: "Trends", path: "/research/trends" },
        { label: "Trend Alerts", path: "/research/trend-alerts" },
        { label: "Intelligence", path: "/research/intelligence" },
      ],
    },
    { label: "Strategy", path: "/strategy" },
    {
      label: "Create",
      path: "/create",
      children: [
        { label: "Content Factory", path: "/create/content-factory" },
        { label: "AI Studio", path: "/create/ai-studio" },
        { label: "Carousel Studio", path: "/create/carousel-studio" },
        { label: "Video Studio", path: "/create/video-studio" },
        { label: "UGC & Video Library", path: "/create/ugc-videos" },
      ],
    },
    {
      label: "Review",
      path: "/review",
      children: [
        { label: "Drafts", path: "/review/drafts" },
        { label: "Creative Review", path: "/review/creative-review" },
        { label: "Board", path: "/review/board" },
      ],
    },
    {
      label: "Publish",
      path: "/publish",
      children: [
        { label: "Calendar", path: "/publish/calendar" },
        { label: "Publishing", path: "/publish/publishing" },
        { label: "Blog", path: "/publish/blog" },
      ],
    },
    { label: "Analytics", path: "/analytics" },
    { label: "Settings", path: "/settings" },
  ],
  requiredPlan: "basic",
  permissions: ["marketing.read", "marketing.write"],
  dashboardWidgets: ["marketing.content-awaiting-review"],
  featureFlags: [],
  status: "basic",
};
