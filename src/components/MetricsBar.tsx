import Metric from "./Metric";

const metrics = [
  {
    title: 'Doctors',
    value: '12',
    secondary: {
      title: 'Since last year',
      value: '-20',
      positive: false
    }
  },
  {
    title: 'ER Admissions',
    value: '80',
    secondary: {
      title: 'Since last week',
      value: '+10',
      positive: true
    }
  },
  {
    title: 'Diagnosis',
    value: '3',
    secondary: {
      title: 'Since last month',
      value: '-2',
      positive: false
    }
  }
]

export default function MetricsBar() {
  return <div className="d-flex gap-3">
    {metrics.map(metric => <Metric {...metric} key={metric.title} />)}
  </div>
}