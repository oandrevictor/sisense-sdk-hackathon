import { Filter, filterFactory, measureFactory } from "@sisense/sdk-data";
import { DateRangeFilterTile } from "@sisense/sdk-ui";
import { useMemo, useState } from "react";
import Select from 'react-select';
import { ChartWithBreakdown, Granularity } from "../components/ChartWithBreakdown";
import MetricsBar from "../components/MetricsBar";
import { Admissions, DataSource, ER } from "../healthcare";
import Page from "../components/Page";

const granOptions = [
  { value: 'Days', label: 'Days' },
  { value: 'Weeks', label: 'Weeks' },
  { value: 'Months', label: 'Months' },
  { value: 'Quarters', label: 'Quarters' },
  { value: 'Years', label: 'Years' }
];


export default function Home() {
  const [categoryFilter, setCategoryFilter] = useState<Filter | null>(null);
  const [dateRangeFilter, setDateRangeFilter] = useState<Filter>(filterFactory.dateRange(Admissions.Admission_Time.Days));
  const [granularity, setGranularity] = useState<Granularity>('Months');

  const filters = useMemo(() => categoryFilter ? [dateRangeFilter, categoryFilter] : [dateRangeFilter],
    [categoryFilter, dateRangeFilter]);

  return (<Page title="Insights">
    <div className="header-with-filters d-flex justify-content-between">
      <MetricsBar />

      <div className="d-flex align-items-end justify-content-end gap-1" >
        <DateRangeFilterTile
          title="Date Range"
          dataSource={DataSource}
          attribute={Admissions.Admission_Time.Months}
          filter={dateRangeFilter}
          onChange={(filter) => {
            setDateRangeFilter(filter);
          }}
        />
        <div className="d-flex gap-2 gran-select align-items-center"> <span className="text-light">Grouped by</span> <Select options={granOptions} defaultValue={granOptions[2]} onChange={(e) => setGranularity((gran) => e?.value ? e.value as Granularity : gran)} /> </div>
      </div>
    </div>

    <div>
      <ChartWithBreakdown filters={filters} granularity={granularity} title="Patients" value={measureFactory.count(Admissions.ID, 'Admissions')} relatedPage="Patients" category={Admissions.Admission_Time} />
    </div>

    <div>
      <ChartWithBreakdown filters={filters} granularity={granularity} title="ER Cases" value={measureFactory.count(ER.ID, 'Total')} relatedPage="ER" category={ER.Date} />
    </div>

    <div>
      <ChartWithBreakdown filters={filters} granularity={granularity} title="Deaths" fixedFilter={filterFactory.equals(Admissions.Death, 'Yes')} value={measureFactory.count(Admissions.Death, 'Deaths')} category={Admissions.Admission_Time} />
    </div>

  </Page>);
}