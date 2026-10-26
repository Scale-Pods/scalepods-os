import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Is my data isolated from other workspaces?",
    a: "Yes. Every business table carries an org_id and is enforced with Postgres Row-Level Security — no query can ever return another org's data, and switching orgs never leaks data between them.",
  },
  {
    q: "Which AI models power the agents?",
    a: "All calls go through one provider-agnostic service that supports Anthropic Claude, OpenAI and Google Gemini, routed per task — a cheap model for classification, a stronger model for drafting. Every call is logged with its model, tokens and cost.",
  },
  {
    q: "Can an AI agent send messages without approval?",
    a: "Each org chooses auto-send or draft-for-approval per agent. Anything that reaches a customer — an email, a WhatsApp message, an offer letter — respects that setting, with a maker-checker queue for anything pending review.",
  },
  {
    q: "What if I need a module nobody else has?",
    a: "Custom Studio shows exactly how: a client-specific module plugs in through the same manifest system every other app uses, without touching the shell.",
  },
  {
    q: "Which channels actually work today vs. are mocked?",
    a: "Email (SMTP/Resend + Gmail OAuth), WhatsApp Cloud API and Google Calendar are working adapters. AI voice calls, LinkedIn, and CRM sync (HubSpot/Zoho/Salesforce) ship as interfaces with a demo adapter, clearly labeled in the UI.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
