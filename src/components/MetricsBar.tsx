import { QueryResultData, filterFactory, measureFactory } from "@sisense/sdk-data";
import { useExecuteQuery } from "@sisense/sdk-ui";
import { FaBedPulse, FaClipboardList, FaFolder } from "react-icons/fa6";
import { Admissions, DataSource, Diagnosis, ER } from "../healthcare";
import Metric from "./Metric";
import { PAST_MONTH_DATE_START, PAST_WEEK_DATE_START } from "../utils/DateUtils";

export function pullNumbers(data: QueryResultData | undefined, loading: boolean) {
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
    filters: [filterFactory.dateFrom(Admissions.Admission_Time.Weeks, PAST_WEEK_DATE_START)],
  });
  const [diagnosis, diagnosisUpdate, diagnosisStatus] = pullNumbers(diagData, diagLoading);

  const { data: erData, isLoading: erLoading } = useExecuteQuery({
    dataSource: DataSource,
    dimensions: [ER.Date.Months],
    measures: [measureFactory.count(ER.ID, 'total')],
    filters: [filterFactory.dateFrom(ER.Date.Months, PAST_MONTH_DATE_START)],
  });
  const [erAdmissions, erUpdate, erStatus] = pullNumbers(erData, erLoading);

  const { data: admissionsData, isLoading: admissionsLoading } = useExecuteQuery({
    dataSource: DataSource,
    dimensions: [Admissions.Admission_Time.Months],
    measures: [measureFactory.count(Admissions.ID, 'total')],
    filters: [filterFactory.dateFrom(Admissions.Admission_Time.Months, PAST_MONTH_DATE_START)],
  });
  const [admissions, admissionsUpdate, admissionsStatus] = pullNumbers(admissionsData, admissionsLoading);

  const metrics = [
    {
      title: 'Admissions',
      value: admissions,
      icon: <FaFolder className="text-secondary" />,
      secondary: {
        title: 'Since last month',
        value: admissionsUpdate,
        positive: admissionsStatus
      }
    },
    {
      title: 'ER Admissions',
      value: erAdmissions,
      icon: <FaBedPulse className="text-secondary" />,
      secondary: {
        title: 'Since last Month',
        value: erUpdate,
        positive: erStatus
      }
    },
    {
      title: 'Diagnosis',
      value: diagnosis,
      icon: <FaClipboardList className="text-secondary" />,
      secondary: {
        title: 'Since last week',
        value: diagnosisUpdate,
        positive: diagnosisStatus
      }
    }
    
  ]

  return <div className="d-flex gap-3">
    {metrics.map(metric => <Metric {...metric} key={metric.title} />)}
  </div>
}