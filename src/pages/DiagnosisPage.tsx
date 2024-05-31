import { Filter, filterFactory, measureFactory } from "@sisense/sdk-data";
import { BoxplotChart, DataPoint, DateRangeFilterTile, LineChart, PieChart } from "@sisense/sdk-ui";
import { Admissions, DataSource, Diagnosis } from "../healthcare";
import { useState } from "react";
import DiagnosisMetricsBar from "../components/DiagnosisMetricsBar";

export default function DiagnosisPage() {
  const [diagnosis, setDiagnosis] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState<Filter>(filterFactory.dateRange(Admissions.Admission_Time.Days));

  const handleFilter = (point: DataPoint) => {
    const value = point.seriesValue || point.categoryValue;
    if (value) setDiagnosis(value === diagnosis ? '' : value as string);
    return null;
  };

  return <div className="d-flex flex-column gap-4 px-4">
    <h1>Diagnosis</h1>

    <div className="d-flex justify-content-between align-items-end">
      <DiagnosisMetricsBar />

      <DateRangeFilterTile
        title="Date Range"
        dataSource={DataSource}
        attribute={Admissions.Admission_Time.Days}
        filter={dateRangeFilter}
        onChange={(filter) => {
          setDateRangeFilter(filter);
        }}
      />
    </div>

    <div className="d-flex flex-column px-3 py-4 bg-white rounded shadow-sm overflow-hidden">
      <div className="w-100">
        <h5>Diagnosis Occurrences Over Time</h5>

        <LineChart
          dataSet={DataSource}
          styleOptions={{ height: 300 }}
          dataOptions={{
            category: [Admissions.Admission_Time.Months.format('MM/yyyy')],
            value: [measureFactory.count(Admissions.ID, 'Total')],
            breakBy: [Diagnosis.Description]
          }}
          filters={
            diagnosis ? [filterFactory.equals(Diagnosis.Description, diagnosis), dateRangeFilter] : [dateRangeFilter]
          }
          onDataPointClick={handleFilter}
        />
      </div>

      <div className="d-flex mt-2">
        <div className="flex-grow-1">
          <h5>Time of stay per diagnosis</h5>

          <BoxplotChart
            dataSet={DataSource}
            styleOptions={{ height: 300 }}
            dataOptions={{
              category: [Diagnosis.Description],
              value: [{
                column: Admissions.TimeofStay,
                name: 'Time of Stay',
                numberFormatConfig: {
                  name: 'Numbers',
                  decimalScale: 0,
                  prefix: false,
                  symbol: 'days'
                }
              }],
              boxType: 'iqr',
              outliersEnabled: true,
            }}
            filters={diagnosis ? [filterFactory.equals(Diagnosis.Description, diagnosis), dateRangeFilter] : [dateRangeFilter]}
          />
        </div>

        <div>
          <h5>Deaths by Diagnosis</h5>

          <PieChart
            dataSet={DataSource}
            styleOptions={{ height: 300, width: 400 }}
            dataOptions={{
              category: [Diagnosis.Description],
              value: [measureFactory.aggregate(Admissions.Death, 'count', 'Deaths')],
            }}
            onDataPointClick={handleFilter}
            filters={[dateRangeFilter]}
          />
        </div>
      </div>
    </div>
  </div>;
}