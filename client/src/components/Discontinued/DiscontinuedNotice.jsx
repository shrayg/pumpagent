import { Link, useLocation } from "react-router-dom";
import { FaGithub } from "react-icons/fa6";
import { Helmet } from "react-helmet";
import { LogoMark } from "../Brand/Logo";
import { GITHUB_REPO_URL } from "../../utils/navigation";

const DiscontinuedNotice = () => {
  const { search } = useLocation();

  return (
    <div className="relative flex-1 flex items-center justify-center px-4 py-16 font-normal">
      <Helmet>
        <title>Pump Agent · Project discontinued</title>
      </Helmet>
      <div className="absolute inset-0 hero-glow pointer-events-none" />
      <section
        className="relative w-full max-w-[440px] rounded-2xl border border-line bg-surface p-8 shadow-2xl shadow-black/50"
        role="alert"
        aria-labelledby="discontinued-title"
      >
        <LogoMark className="w-9 h-9" />
        <h1 id="discontinued-title" className="mt-6 text-2xl text-fg">
          Sorry, this project has been discontinued
        </h1>
        <p className="mt-3 text-[14px] leading-6 text-fg-muted">
          Pump Agent is no longer supported. Sign-in, sign-up, the dashboard,
          and the apps have been turned off.
        </p>
        <p className="mt-3 text-[14px] leading-6 text-fg-muted">
          The full source code is open source on GitHub, so you're free to
          browse it, fork it, and run it yourself.
        </p>

        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 w-full h-10 rounded-lg bg-accent text-accent-ink text-[14px] font-semibold hover:bg-accent-hover flex justify-center items-center gap-2 transition-colors"
        >
          <FaGithub className="w-4 h-4" /> View the source on GitHub
        </a>
        <Link
          to={`/${search}`}
          className="mt-3 w-full h-10 rounded-lg border border-line text-[14px] font-medium text-fg-muted hover:text-fg hover:bg-surface-2 flex justify-center items-center transition-colors"
        >
          Back to home
        </Link>
      </section>
    </div>
  );
};

export default DiscontinuedNotice;
