import { HiArrowSmLeft } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import { blogPaths } from "../../utils/blognavpaths";
import { useEffect } from "react";

const BlogNav = () => {
  const navigate = useNavigate();
  const search = useLocation().search;
  const path = useLocation().pathname.split("/").slice(-2).join("/");
  const { prev, next } = blogPaths[path];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  return (
    <div
      className={`flex ${
        prev && next ? "justify-between" : "justify-end"
      } items-center py-5 md:py-10 select-none gap-2`}
    >
      {prev && (
        <div
          className="flex p-2 flex-col text-[14px] gap-4  py-4 border-1 min-w-35 lg:w-60 border-gray-800 rounded-md px-4 cursor-pointer transition hover:border-green-900"
          onClick={() => navigate(`${prev.path}${search}`)}
        >
          <span className="text-gray-700 pl-2">Previous</span>
          <span className="flex gap-1 text-greener">
            <HiArrowSmLeft /> {prev.title}
          </span>
        </div>
      )}
      {next && (
        <div
          className="flex items-end p-2 flex-col text-[14px] gap-4  py-4 border-1 min-w-35 lg:w-60 border-gray-800 px-4 rounded-md  cursor-pointer transition hover:border-green-900"
          onClick={() => {
            if (!next.path) return;
            navigate(`${next.path}${search}`);
          }}
        >
          <span className="text-gray-700 pl-2">Next</span>
          <span className="flex gap-1 text-greener">
            {next.title} <HiArrowSmLeft className="transform rotate-180" />
          </span>
        </div>
      )}
    </div>
  );
};

export default BlogNav;
