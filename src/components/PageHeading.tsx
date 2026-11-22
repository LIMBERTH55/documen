import type { ReactNode } from "react";

interface PageHeadingProps {
  icon?: ReactNode;
  eyebrow?: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
  meta?: ReactNode;
}

export function PageHeading({
  icon,
  eyebrow,
  title,
  description,
  actions,
  meta,
}: PageHeadingProps) {
  return (
    <header className="page-heading">
      <div className="page-heading__content">
        {icon ? <div className="page-heading__icon">{icon}</div> : null}
        <div className="page-heading__text">
          {eyebrow ? <div className="page-heading__eyebrow">{eyebrow}</div> : null}
          <h1>{title}</h1>
          {description ? <p>{description}</p> : null}
          {meta ? <div className="page-heading__meta">{meta}</div> : null}
        </div>
      </div>
      {actions ? <div className="page-heading__actions">{actions}</div> : null}
    </header>
  );
}
