import { filterFactory, measureFactory } from "@sisense/sdk-data";
import { useExecuteQuery } from "@sisense/sdk-ui";
import { FaClipboardList } from "react-icons/fa6";
import { Admissions, DataSource, Diagnosis } from "../healthcare";
import Metric from "./Metric";
import { pullNumbers } from "./MetricsBar";

export default function DiagnosisMetricsBar() {
  const { data: diagData, isLoading: diagLoading } = useExecuteQuery({
    dataSource: DataSource,
    dimensions: [Admissions.Admission_Time.Weeks],
    measures: [measureFactory.count(Diagnosis.ID, 'total')],
    filters: [filterFactory.dateFrom(Admissions.Admission_Time.Weeks, '2013-06-13T00:00:00')],
  });
  const [diagnosis, diagnosisUpdate, diagnosisStatus] = pullNumbers(diagData, diagLoading);

  const metrics = [{
    title: 'Diagnosis',
    value: diagnosis,
    icon: <FaClipboardList className="" />,
    secondary: {
      title: 'Since last week',
      value: diagnosisUpdate,
      positive: diagnosisStatus
    }
  }];

  return <div className="d-flex gap-3">
    {metrics.map(metric => <Metric {...metric} key={metric.title} />)}
  </div>;
}