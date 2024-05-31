import { Filter, measureFactory, filterFactory, Attribute, Column } from "@sisense/sdk-data";
import { LineChart, BarChart, PieChart, ScatterChart, BoxplotChart, HighchartsOptions, MemberFilterTile, DateRangeFilterTile, ColumnChart } from "@sisense/sdk-ui";
import { DataSource, Rooms, Admissions, Doctors, Diagnosis, ER, Divisions, Conditionstimeofstay } from "../healthcare";
import { useMemo, useState } from "react";
import { ChartWithBreakdown, Granularity } from "../components/ChartWithBreakdown";
import React from 'react';
import Select from 'react-select';
import MetricsBar from "../components/MetricsBar";

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

  return (<div className="d-flex flex-column gap-4 px-4">
    <div className="header-with-filters d-flex justify-content-between">
      <div>
        <h1 className="mb-4">Insights</h1>
        <div className="d-flex justify-content-between">
          <MetricsBar />
        </div>
      </div>
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
        <div className="d-flex gap-2 gran-select align-items-center"> <span className="text-light">grouped by</span> <Select options={granOptions} defaultValue={granOptions[2]} onChange={(e) => setGranularity((gran) => e?.value ? e.value as Granularity : gran)} /> </div>
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
   
  </div>);
}