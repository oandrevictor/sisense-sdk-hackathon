import { QueryResultData, filterFactory, measureFactory } from "@sisense/sdk-data";
import { useExecuteQuery } from "@sisense/sdk-ui";
import { Admissions, DataSource, Diagnosis, ER } from "../healthcare";
import Metric from "./Metric";
import { FaBedPulse, FaClipboardList, FaCross, FaFolder } from "react-icons/fa6";

function pullNumbers(data: QueryResultData | undefined, loading: boolean) {
  const value = loading ? 0 : data?.rows[0][1].data || 0;
  const update = loading ? 0 : data?.rows[1][1].data - value;
  const status = update > 0;

  return [value, update, status];
}

export default function MetricsBar() {
  const { data: diagData, isLoading: diagLoading } = useExecuteQuery({
    dataSource: DataSource,
    dimensions: [Admissions.Admission_Time.Weeks],
    measures: [measureFactory.count(Diagnosis.ID, 'total')],
    filters: [filterFactory.dateFrom(Admissions.Admission_Time.Weeks, '2013-06-13T00:00:00')],
  });
  const [diagnosis, diagnosisUpdate, diagnosisStatus] = pullNumbers(diagData, diagLoading);

  const { data: erData, isLoading: erLoading } = useExecuteQuery({
    dataSource: DataSource,
    dimensions: [ER.Date.Months],
    measures: [measureFactory.count(ER.ID, 'total')],
    filters: [filterFactory.dateFrom(ER.Date.Months, '2013-05-01T00:00:00')],
  });
  const [erAdmissions, erUpdate, erStatus] = pullNumbers(erData, erLoading);

  const { data: admissionsData, isLoading: admissionsLoading } = useExecuteQuery({
    dataSource: DataSource,
    dimensions: [Admissions.Admission_Time.Months],
    measures: [measureFactory.count(Admissions.ID, 'total')],
    filters: [filterFactory.dateFrom(Admissions.Admission_Time.Months, '2013-05-01T00:00:00')],
  });
  const [admissions, admissionsUpdate, admissionsStatus] = pullNumbers(admissionsData, admissionsLoading);

  const { data: tosData, isLoading: tosLoading } = useExecuteQuery({
    dataSource: DataSource,
    dimensions: [Admissions.Admission_Time.Months],
    measures: [measureFactory.average(Admissions.TimeofStay, 'avg stay')],
    filters: [filterFactory.dateFrom(Admissions.Admission_Time.Months, '2013-05-01T00:00:00')],
  });
  const [timeOfStay, tosUpdate, tosStatus] = pullNumbers(tosData, tosLoading);

  const metrics = [
    {
      title: 'Admissions',
      value: admissions,
      icon: <FaFolder className="text-primary" />,
      secondary: {
        title: 'Since last month',
        value: admissionsUpdate,
        positive: admissionsStatus
      }
    },
    {
      title: 'ER Admissions',
      value: erAdmissions,
      icon: <FaCross className="text-danger" />,
      secondary: {
        title: 'Since last Month',
        value: erUpdate,
        positive: erStatus
      }
    },
    {
      title: 'Diagnosis',
      value: diagnosis,
      icon: <FaClipboardList className="" />,
      secondary: {
        title: 'Since last week',
        value: diagnosisUpdate,
        positive: diagnosisStatus
      }
    },
    {
      title: 'Avg Days of Stay',
      value: Math.round(timeOfStay),
      icon: <FaBedPulse className="text-secondary" />,
      secondary: {
        title: 'Since last month',
        value: Math.round(tosUpdate),
        positive: tosStatus
      }
    }
  ]

  return <div className="d-flex gap-3">
    {metrics.map(metric => <Metric {...metric} key={metric.title} />)}
  </div>
}