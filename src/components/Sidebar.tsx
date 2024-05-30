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
  return (<div className="sidebar h-100 d-flex flex-column gap-4 px-2 py-3 border-end border-1 border-light shadow-sm">
    <h3>My Health</h3>

    <div className="d-flex flex-column gap-2 px-2">
      {pages.map(page =>
        <div key={page.label}
          onClick={() => onChange(page)}
          className={cx('text-muted page-link', { 'fw-bold': active === page })}>
          {page.label}
        </div>
      )}
    </div>
  </div>);
}