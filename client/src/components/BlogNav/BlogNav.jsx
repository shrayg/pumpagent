import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { blogPaths } from "../../utils/blognavpaths";
import { useEffect } from "react";

const BlogNav = () => {
  const { pathname, search } = useLocation();
  const path = pathname.split("/").slice(-2).join("/");
  const { prev, next } = blogPaths[path] ?? {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  const cardClass =
    "group flex flex-col gap-1.5 flex-1 sm:max-w-[48%] rounded-lg border border-line px-5 py-4 hover:border-accent-line hover:bg-surface transition-colors";

  return (
    <nav
      className={`flex flex-col sm:flex-row gap-3 mt-16 pt-8 border-t border-line select-none ${
        prev ? "justify-between" : "justify-end"
      }`}
      aria-label="Previous and next pages"
    >
      {prev && (
        <Link to={`${prev.path}${search}`} className={cardClass}>
          <span className="text-[12px] text-fg-subtle">Previous</span>
          <span className="flex items-center gap-1.5 text-[14px] font-medium text-fg group-hover:text-accent">
            <ArrowLeft className="w-4 h-4" /> {prev.title}
          </span>
        </Link>
      )}
      {next?.path && (
        <Link to={`${next.path}${search}`} className={`${cardClass} items-end text-right`}>
          <span className="text-[12px] text-fg-subtle">Next</span>
          <span className="flex items-center gap-1.5 text-[14px] font-medium text-fg group-hover:text-accent">
            {next.title} <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      )}
    </nav>
  );
};

export default BlogNav;
