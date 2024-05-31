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
  return (<nav className="navbar sidebar navbar-expand-lg py-3">
    <div className="container-fluid">
      <a className="navbar-brand" href="#"><b>Care</b>Insights</a>

      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse border-start border-1 border-gray ps-3 ms-1" id="navbarText">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {pages.map(page =>
            <li className="nav-item" key={page.label}>
              <a onClick={() => onChange(page)}
                className={cx('text-muted page-link d-flex align-items-center gap-2 ms-2 me-2', { 'fw-bold': active === page })}>
                {page.icon}
                <span>{page.label}</span>
              </a>
            </li>
          )}
        </ul>

        <span className="navbar-text text-muted fs-6">
          by André Andrade & Eric Santos
        </span>
      </div>
    </div>
  </nav>


  );
}