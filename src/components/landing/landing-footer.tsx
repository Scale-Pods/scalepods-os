import { BrandLogo } from "@/components/shared/brand-logo";

const SITE = "https://www.scalepods.co";
const CURRENT_YEAR = 2026;

const WHATSAPP_URL = `https://wa.me/919867271848?text=${encodeURIComponent(
  "Hi ScalePods! I'm interested in discussing custom workflow automation solutions for my business."
)}`;

interface FooterLink {
  label: string;
  href: string;
}

// Content and link targets mirror the footer on scalepods.co.
const SOLUTIONS: FooterLink[] = [
  { label: "Sales Automation", href: "/solution/sales-workflow-automation" },
  { label: "Ops Automation", href: "/solution/ops-workflow-automation" },
  { label: "Manufacturing AI", href: "/solution/ai-automation-for-manufacturing" },
  { label: "Real Estate AI", href: "/solution/ai-automation-for-real-estate" },
  { label: "HR Automation", href: "/solution/hr-workflow-automation" },
  { label: "Marketing Automation", href: "/solution/marketing-workflow-automation" },
];

const CASE_STUDIES: FooterLink[] = [
  { label: "Lotus Manor Dubai", href: "/case-study/lotus-manor-real-estate-sales-automation-dubai" },
  { label: "ZV Steels India", href: "/case-study/zv-steels-recruitment-automation-tool" },
  { label: "A Squared Dubai", href: "/case-study/asquared-real-estate-sales-automation-dubai" },
  { label: "Lootah Group Dubai", href: "/case-study/lootah-group-procurement-workflow-automation" },
  { label: "Macro Media USA", href: "/case-study/macro-media-finance-workflow-automation" },
  { label: "Bennett Realty USA", href: "/case-study/bennett-realty-growth-os" },
  { label: "Victory Energy USA", href: "/case-study/victory-energy-business-automation" },
  { label: "Ryan Schwartz USA", href: "/case-study/ryan-schwartz-fub-crm-automation" },
];

const COMPANY: FooterLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Resources", href: "/resources" },
  { label: "AI Masterclass", href: "/ai-business-automation-webinar" },
  { label: "Blog & Insights", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

const LEGAL: FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "AI & LLM Docs", href: "/llms.txt" },
];

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
      <path d="M7 10v7" />
      <circle cx="7" cy="6.8" r="0.7" fill="currentColor" />
      <path d="M11 17v-7m0 3.2c0-1.8 1.2-3.2 3-3.2s3 1.2 3 3.2V17" />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
      <path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3L3 21z" />
      <path d="M9 9.2c.2 2.3 2.5 4.6 5.1 5.4l1.3-1.2-1.9-1-.8.7c-.8-.4-1.6-1.2-2-2l.7-.8-1-1.9L9 9.2z" fill="currentColor" stroke="none" />
    </svg>
  );
}

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/scalepods.co/", Icon: InstagramIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/scalepods-co", Icon: LinkedinIcon },
  { label: "WhatsApp", href: WHATSAPP_URL, Icon: WhatsappIcon },
];

function LinkColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-foreground">{title}</h3>
      <ul className="space-y-3.5">
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={`${SITE}${l.href}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[15px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-white/10 px-4 pb-8 pt-16 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <div className="max-w-md">
            <a href={SITE} target="_blank" rel="noopener noreferrer" aria-label="ScalePods">
              <BrandLogo height={44} />
            </a>
            <p className="mt-8 text-[17px] leading-relaxed text-muted-foreground">
              Architecting the future of enterprise operations through autonomous Agentic AI ecosystems, enterprise process
              automation, and intelligent automation.
            </p>
            <div className="mt-8 flex items-center gap-4">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-12 items-center justify-center rounded-xl border border-white/10 bg-muted/40 text-foreground transition-colors hover:bg-muted"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3">
            <LinkColumn title="Solutions" links={SOLUTIONS} />
            <LinkColumn title="Case Studies" links={CASE_STUDIES} />
            <div className="col-span-2 sm:col-span-1">
              <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-foreground">Connect</h3>
              <a href="mailto:info@scalepods.co" className="text-[15px] font-semibold text-foreground hover:underline">
                info@scalepods.co
              </a>
            </div>
            <LinkColumn title="Company" links={COMPANY} />
            <LinkColumn title="Legal & AI" links={LEGAL} />
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-muted-foreground sm:flex-row">
          <span>© {CURRENT_YEAR} ScalePods AI Infrastructure. All rights reserved.</span>
          <span>Built for the future</span>
        </div>
      </div>
    </footer>
  );
}
