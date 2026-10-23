import { Link, useLocation } from "react-router-dom";
import { FaXTwitter, FaGithub, FaMedium } from "react-icons/fa6";
import Logo from "../Brand/Logo";
import { appNav } from "../../utils/navigation";

const columns = [
  {
    title: "Product",
    links: [
      ...appNav.map(({ label, path }) => ({ label, to: path })),
      { label: "Pricing", to: "/fees" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation", to: "/https/introduction" },
      { label: "Launch Token API", to: "/https/pump-launch-token" },
      { label: "Wallet Generator", to: "/tools/wallet-generator" },
      { label: "Vanity Grinder", to: "/tools/vanity-grinder" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Privacy", to: "/privacy" },
      { label: "Contact", href: "mailto:contact@pumpagent.com" },
    ],
  },
];

const socials = [
  { label: "Pump Agent on X", href: "https://x.com/PumpAgent", icon: FaXTwitter },
  { label: "Pump Agent on GitHub", href: "https://github.com/PumpAgent", icon: FaGithub },
  { label: "Pump Agent on Medium", href: "https://medium.com/@PumpAgent", icon: FaMedium },
];

const Footer = () => {
  const { search } = useLocation();

  return (
    <footer className="border-t border-line bg-canvas">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-[14px] leading-6 text-fg-muted">
              The pump.fun API for builders and traders. Launch, bundle, and
              trade Solana tokens from one key.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-[12px] font-semibold uppercase tracking-wider text-fg-subtle">
                {column.title}
              </p>
              <ul className="mt-4 flex flex-col gap-2.5 text-[14px]">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <a href={link.href} className="text-fg-muted hover:text-fg transition-colors">
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={`${link.to}${search}`}
                        className="text-fg-muted hover:text-fg transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-line flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[13px] text-fg-subtle">
            © {new Date().getFullYear()} Pump Agent. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            {socials.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="grid place-items-center w-9 h-9 rounded-md text-fg-subtle hover:text-fg hover:bg-surface-2 transition-colors"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
