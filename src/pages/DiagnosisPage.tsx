import { Filter, filterFactory, measureFactory } from "@sisense/sdk-data";
import { BoxplotChart, DataPoint, DateRangeFilterTile, LineChart, PieChart } from "@sisense/sdk-ui";
import { Admissions, DataSource, Diagnosis } from "../healthcare";
import { useState } from "react";
import DiagnosisMetricsBar from "../components/DiagnosisMetricsBar";
import Page from "../components/Page";

export default function DiagnosisPage() {
  const [diagnosis, setDiagnosis] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState<Filter>(filterFactory.dateRange(Admissions.Admission_Time.Days));

  const handleFilter = (point: DataPoint) => {
    const value = point.seriesValue || point.categoryValue;
    if (value) setDiagnosis(diagnosis => value === diagnosis ? '' : value as string);
    return null;
  };

  return <Page title="Diagnosis">
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
        <h5>{diagnosis ? diagnosis : 'Diagnosis'} Occurrences Over Time</h5>

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
          <h5>Time of stay {diagnosis ? `for ${diagnosis}` : 'per diagnosis'}</h5>

          <BoxplotChart
            dataSet={DataSource}
            styleOptions={{ height: 400 }}
            dataOptions={{
              category: [Diagnosis.Description],
              value: [{
                column: Admissions.TimeofStay,
                name: 'Time of Stay',
                numberFormatConfig: {
                  name: 'Currency',
                  decimalScale: 0,
                  prefix: false,
                  symbol: ' minutes'
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
            styleOptions={{ height: 400, width: 500 }}
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
  </Page>;
}