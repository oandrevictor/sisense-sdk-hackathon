import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  title: string;
  filters?: JSX.Element
}

export default function Page({ title, filters, children }: Props) {
  return (<div className="d-flex flex-column gap-4 px-4">
    <div className="d-flex flex-wrap justify-content-between">
      <h1>{title}</h1>

      {filters}
    </div>

    {children}
  </div>);
}