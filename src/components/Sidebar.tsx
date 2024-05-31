import cx from 'classnames';

export type Page = any & {
  label: string;
}

type Props = {
  pages: Page[];
  active: Page;
  onChange: (page: Page) => void;
}

export default function Sidebar({ pages, active, onChange }: Props) {
  return (<div className="sidebar h-100 d-flex flex-column gap-5 py-3 border-end border-1 border-gray shadow-sm noprint">
    <h3 className="text-center">
      CareInsights
    </h3>

    <div className="d-flex flex-column flex-grow-1 gap-3 px-3">
      {pages.map(page =>
        <div key={page.label}
          onClick={() => onChange(page)}
          className={cx('text-muted page-link d-flex align-items-center gap-2', { 'fw-bold': active === page })}>
          {page.icon}
          <span>{page.label}</span>
        </div>
      )}

      <div className="d-flex flex-grow-1 w-100 border-top border-1 border-gray mb-auto mt-3" />

      <div className="body-xs text-black-50">
        by Andre Andrade & Eric Santos
      </div>
    </div>
  </div>);
}