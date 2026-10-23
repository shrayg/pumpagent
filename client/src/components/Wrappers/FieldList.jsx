import { useState } from "react";
import { ChevronDown } from "lucide-react";

const badgeTones = {
  required: "bg-accent-soft text-accent",
  optional: "bg-surface-3 text-fg-subtle",
  type: "bg-surface-2 text-const font-mono",
};

const Badge = ({ tone, children }) => (
  <span className={`px-1.5 py-0.5 rounded text-[11.5px] font-medium select-none ${badgeTones[tone]}`}>
    {children}
  </span>
);

const FieldDetails = ({ field }) => {
  const copies = Array.isArray(field.copy) ? field.copy : [field.copy];
  const properties = field.list?.properties ?? [];

  return (
    <div className="px-4 pb-4 text-[14px] leading-6 text-fg-muted font-normal">
      {copies.map((copy, index) => (
        <p key={index}>{copy}</p>
      ))}
      {properties.length > 0 && (
        <>
          {field.list.value && (
            <div className="mt-3">
              <Badge tone="type">{field.list.value}</Badge>
            </div>
          )}
          <ul className="mt-3 flex flex-col gap-2">
            {properties.map((property, index) => (
              <li key={index} className="flex items-start gap-2 rounded-md bg-surface-2 px-3 py-2">
                <Badge tone="type">{property.type}</Badge>
                <span>{property.copy}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

const FieldList = ({ title, fields, showRequirement = false }) => {
  const [expanded, setExpanded] = useState({});
  const toggle = (index) => setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));

  return (
    <section className={`${title ? "mt-6" : "mt-2"} first:mt-0`}>
      {title && (
        <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-fg-subtle">
          {title}
        </h2>
      )}
      <div className="rounded-lg border border-line bg-surface divide-y divide-line overflow-hidden lg:max-w-md">
        {fields.map((field, index) => (
          <div key={field.title}>
            <button
              type="button"
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-surface-2 transition-colors cursor-pointer"
              onClick={() => toggle(index)}
              aria-expanded={!!expanded[index]}
            >
              <span className="font-mono text-[13px] text-fg truncate">{field.title}</span>
              <span className="flex items-center gap-1.5 shrink-0">
                {showRequirement && field.required && (
                  <Badge tone={field.required === "required" ? "required" : "optional"}>
                    {field.required}
                  </Badge>
                )}
                <Badge tone="type">{field.type}</Badge>
                <ChevronDown
                  className={`w-4 h-4 text-fg-subtle transition-transform ${
                    expanded[index] ? "rotate-180" : ""
                  }`}
                />
              </span>
            </button>
            {expanded[index] && <FieldDetails field={field} />}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FieldList;
