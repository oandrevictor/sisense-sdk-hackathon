import cx from 'classnames';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa6';

type Props = {
  title: string;
  value: string | number;

  secondary: {
    title: string;
    value: string | number;
    positive: boolean;
  }
}

export default function Metric({ title, value, secondary }: Props) {
  return <div className="metric ps-3 pt-2 pb-3 pe-5 rounded shadow border border-1 border-light bg-light">
    <div className="d-flex align-items-end gap-2">
      <div className="fs-2 fw-bold">{value}</div>
      <div className="pb-2 body-s text-muted fw-bold">{title}</div>
    </div>

    <div className="mt-1 d-flex align-items-center">
      <div className={cx('body-s', { 'text-danger': !secondary.positive, 'text-success': secondary.positive })}>
        {secondary.positive ? '+' : ''}{secondary.value}
      </div>

      <div className={cx('body-xs ms-1', { 'text-danger': !secondary.positive, 'text-success': secondary.positive })}>
        {secondary.positive ? <FaArrowUp /> : <FaArrowDown />}
      </div>

      <div className="body-xs ms-2">{secondary.title}</div>
    </div>
  </div>
}