import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  ArrowLeftRight,
  ArrowRight,
  Check,
  Coins,
  KeyRound,
  LineChart,
  Rocket,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import StructuredData from "../../SEO/StructuredData";
import { AuthContext } from "../../../utils/AuthProvider";
import codeTheme from "../../../utils/codeTheme";
import { appNav, endpointCount } from "../../../utils/navigation";

const heroCode = `const API = "https://api.pumpagent.com";

const res = await fetch(\`\${API}/pump-single-buy\`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
  },
  body: JSON.stringify({
    recipient: wallet.publicKey,
    ca: "93xHZCea…W9pdEpump",
    solIn: "0.15",
  }),
});

const { serializedTransaction } = await res.json();
// Sign locally: your private key never leaves this file.`;

const heroResponse = `{
  "serializedTransaction": "AQAAAAAAAAAAAAAAAAAAAAAA…"
}`;

const stats = [
  { value: endpointCount, label: "Documented API endpoints" },
  { value: appNav.length, label: "Trading apps built on the API" },
  { value: 20, label: "Wallets per launch bundle" },
  { value: 0, label: "Private keys sent to our servers" },
];

const features = [
  {
    icon: Rocket,
    title: "Launch and bundle",
    copy: "Upload metadata to IPFS, create the token, and buy from up to 20 wallets in a single bundle.",
  },
  {
    icon: ArrowLeftRight,
    title: "Trade pump.fun and DEX",
    copy: "Single and multi-wallet buys and sells, dump-all, and bumps, on the bonding curve or after migration.",
  },
  {
    icon: Wallet,
    title: "Wallet operations",
    copy: "Generate up to 1,000 wallets per request, fund up to 50 in one transaction, and build lookup tables.",
  },
  {
    icon: LineChart,
    title: "Market data",
    copy: "Candles, token info, bonding-curve progress, and DEX-paid status for any mint.",
  },
  {
    icon: ShieldCheck,
    title: "Keys stay local",
    copy: "Endpoints return serialized transactions. You sign with your own keypair and send through your RPC.",
  },
  {
    icon: Coins,
    title: "Earn on every trade",
    copy: "Attach an optional fee to the transactions you build and claim earnings from your dashboard.",
  },
];

const steps = [
  {
    title: "Create a free account",
    copy: "Pick a username and password. Every account starts on the free Apprentice tier.",
  },
  {
    title: "Copy your API key",
    copy: "Your key lives in the dashboard. Send it in the x-api-key header.",
  },
  {
    title: "Build, sign, send",
    copy: "Call an endpoint, sign the returned transaction locally, and submit it to Solana.",
  },
];

const tiers = [
  {
    name: "Apprentice",
    price: "Free",
    cadence: "forever",
    highlight: false,
    perks: [
      "Access to every endpoint",
      "Standard rate limits",
      "Claim fee earnings at no cost",
      "5% of referral fees",
    ],
  },
  {
    name: "Alchemist",
    price: "$199",
    cadence: "one-time, lifetime",
    highlight: true,
    perks: [
      "Increased rate limits",
      "30% lower platform fees",
      "Priority technical support",
      "10% of referral fees",
    ],
  },
];

const SectionHeading = ({ eyebrow, title, copy }) => (
  <div className="max-w-2xl">
    <p className="text-[13px] font-semibold text-accent">{eyebrow}</p>
    <h2 className="mt-3 text-3xl md:text-4xl text-fg">{title}</h2>
    {copy && <p className="mt-4 text-[16px] leading-7 text-fg-muted">{copy}</p>}
  </div>
);

const ButtonLink = ({ to, variant = "primary", children }) => (
  <Link
    to={to}
    className={`inline-flex h-11 items-center gap-2 px-5 rounded-lg text-[14px] font-semibold transition-colors ${
      variant === "primary"
        ? "bg-accent text-accent-ink hover:bg-accent-hover"
        : "border border-line-strong text-fg hover:bg-surface-2"
    }`}
  >
    {children}
  </Link>
);

export default function Home() {
  const { search } = useLocation();
  const { user } = useContext(AuthContext);
  const startPath = user ? `/dashboard${search}` : `/signin${search}`;

  return (
    <div className="text-fg font-normal text-base">
      <StructuredData />

      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 hero-glow pointer-events-none" />
        <div className="absolute inset-0 grid-fade pointer-events-none" />

        <div className="relative container-page pt-20 pb-20 md:pt-28 md:pb-28 grid gap-14 lg:grid-cols-[1fr_1.05fr] items-center">
          <div>
            <span className="inline-flex items-center gap-2 h-7 px-3 rounded-full border border-line bg-surface/70 text-[12.5px] text-fg-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Solana · pump.fun · DEX
            </span>
            <h1 className="mt-6 text-[44px] leading-[1.05] md:text-6xl md:leading-[1.02] text-fg">
              The pump.fun API for builders and traders
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-7 text-fg-muted">
              Launch tokens, bundle buys across wallets, and trade on pump.fun
              and DEX pools with one REST API. Pump Agent returns unsigned
              transactions, so your private keys never leave your code.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink to={startPath}>
                {user ? "Open dashboard" : "Get your API key"}
                <ArrowRight className="w-4 h-4" />
              </ButtonLink>
              <ButtonLink to={`/https/introduction${search}`} variant="secondary">
                Read the docs
              </ButtonLink>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-fg-subtle">
              {["Free to start", "No private keys sent", "Client and server examples"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-accent" /> {item}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="rounded-xl border border-line bg-surface shadow-2xl shadow-black/60 overflow-hidden">
            <div className="flex items-center justify-between h-11 px-4 border-b border-line bg-surface-2">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-line-strong" />
                <span className="w-2.5 h-2.5 rounded-full bg-line-strong" />
                <span className="w-2.5 h-2.5 rounded-full bg-line-strong" />
              </div>
              <span className="font-mono text-[11.5px] text-fg-subtle">buy.js</span>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-accent-soft text-accent">
                POST /pump-single-buy
              </span>
            </div>
            <SyntaxHighlighter
              language="javascript"
              style={codeTheme}
              customStyle={{ margin: 0, padding: "18px 20px", background: "transparent" }}
            >
              {heroCode}
            </SyntaxHighlighter>
            <div className="border-t border-line bg-canvas/60">
              <div className="flex items-center gap-2 px-5 pt-3 text-[11.5px] font-mono text-fg-subtle">
                <span className="text-accent">200</span> Response
              </div>
              <SyntaxHighlighter
                language="json"
                style={codeTheme}
                customStyle={{ margin: 0, padding: "8px 20px 16px", background: "transparent" }}
              >
                {heroResponse}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <dl className="container-page grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`py-8 px-4 md:px-6 border-line ${index % 2 === 1 ? "border-l" : ""} ${
                index === 2 ? "lg:border-l" : ""
              } ${index >= 2 ? "border-t lg:border-t-0" : ""}`}
            >
              <dt className="text-[13px] text-fg-subtle">{stat.label}</dt>
              <dd className="mt-2 text-3xl font-semibold tracking-tight text-fg">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="container-page py-24">
        <SectionHeading
          eyebrow="Platform"
          title="Everything a pump.fun launch needs"
          copy="One key covers token creation, multi-wallet trading, wallet management, and market data. Each endpoint ships with client and server examples."
        />
        <div className="mt-14 grid gap-px rounded-xl overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="bg-canvas p-7 hover:bg-surface transition-colors">
              <span className="grid place-items-center w-10 h-10 rounded-lg border border-line bg-surface text-accent">
                <feature.icon className="w-5 h-5" />
              </span>
              <h3 className="mt-5 text-[16px] text-fg">{feature.title}</h3>
              <p className="mt-2 text-[14px] leading-6 text-fg-muted">{feature.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface/40">
        <div className="container-page py-24">
          <SectionHeading
            eyebrow="Apps"
            title="Trade without writing code"
            copy="The same API powers three apps you can use from the browser."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {appNav.map((app) => (
              <Link
                key={app.path}
                to={`${app.path}${search}`}
                className="group flex flex-col rounded-xl border border-line bg-canvas p-7 hover:border-accent-line transition-colors"
              >
                <span className="grid place-items-center w-11 h-11 rounded-lg bg-accent-soft text-accent">
                  <app.icon className="w-5 h-5" />
                </span>
                <h3 className="mt-6 text-[18px] text-fg">{app.label}</h3>
                <p className="mt-2 text-[14px] leading-6 text-fg-muted flex-1">{app.description}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-accent">
                  Open {app.label}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-24 grid gap-14 lg:grid-cols-2 items-start">
        <SectionHeading
          eyebrow="Get started"
          title="From sign-up to first transaction in minutes"
          copy="No SDK to install. Any language that can send an HTTP request and sign a Solana transaction works."
        />
        <ol className="flex flex-col gap-4">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-5 rounded-xl border border-line bg-surface p-6">
              <span className="grid place-items-center shrink-0 w-8 h-8 rounded-full border border-accent-line text-accent text-[13px] font-semibold">
                {index + 1}
              </span>
              <div>
                <h3 className="text-[16px] text-fg">{step.title}</h3>
                <p className="mt-1.5 text-[14px] leading-6 text-fg-muted">{step.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-line">
        <div className="container-page py-24">
          <SectionHeading
            eyebrow="Pricing"
            title="Free to build. Pay once to scale."
            copy="Platform fees apply per transaction. See the full breakdown on the pricing page."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2 max-w-4xl">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-xl border p-8 ${
                  tier.highlight ? "border-accent-line bg-accent-soft" : "border-line bg-surface"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-[18px] text-fg">{tier.name}</h3>
                  {tier.highlight && (
                    <span className="text-[11.5px] font-semibold px-2 py-1 rounded-full bg-accent text-accent-ink">
                      Best value
                    </span>
                  )}
                </div>
                <p className="mt-5 flex items-baseline gap-2">
                  <span className="text-4xl font-semibold tracking-tight text-fg">{tier.price}</span>
                  <span className="text-[14px] text-fg-subtle">{tier.cadence}</span>
                </p>
                <ul className="mt-7 flex flex-col gap-3 text-[14px] text-fg-muted">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-accent shrink-0" /> {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Link
            to={`/fees${search}`}
            className="mt-8 inline-flex items-center gap-1.5 text-[14px] font-medium text-accent hover:text-accent-hover"
          >
            Compare fees per endpoint <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="container-page pb-24">
        <div className="relative overflow-hidden rounded-2xl border border-line bg-surface px-8 py-14 md:px-14 md:py-16">
          <div className="absolute inset-0 hero-glow pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl text-fg">Ship your next launch with Pump Agent</h2>
              <p className="mt-4 text-[16px] leading-7 text-fg-muted">
                Create an account, grab your key, and send your first request today.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink to={startPath}>
                <KeyRound className="w-4 h-4" />
                {user ? "Open dashboard" : "Get your API key"}
              </ButtonLink>
              <ButtonLink to={`/https/introduction${search}`} variant="secondary">
                Read the docs
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
