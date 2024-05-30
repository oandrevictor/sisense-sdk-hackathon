import { filterFactory, measureFactory } from "@sisense/sdk-data";
import { BoxplotChart, DataPoint, LineChart, PieChart } from "@sisense/sdk-ui";
import { Admissions, DataSource, Diagnosis } from "../healthcare";
import { useState } from "react";

export default function DiagnosisPage() {
  const [diagnosis, setDiagnosis] = useState('');

  const handleFilter = (point: DataPoint) => {
    const value = point.seriesValue || point.categoryValue;
    if (value) setDiagnosis(value === diagnosis ? '' : value as string);
    return null;
  };

  return <div className="d-flex flex-column px-3 py-3 bg-white rounded shadow-sm overflow-hidden">
    <div className="w-100" style={{ minHeight: 350 }}>
      <h5>Diagnosis evolution over time</h5>

      <LineChart
        dataSet={DataSource}
        dataOptions={{
          category: [Admissions.Admission_Time.Months.format('MM/yyyy')],
          value: [measureFactory.count(Admissions.ID, 'Total')],
          breakBy: [Diagnosis.Description]
        }}
        filters={diagnosis ? [filterFactory.equals(Diagnosis.Description, diagnosis)] : []}
        onDataPointClick={handleFilter}
      />
    </div>

    <div className="d-flex mt-5">
      <div className="flex-grow-1" style={{ minHeight: 350 }}>
        <h5>Time of stay per diagnosis</h5>

        <BoxplotChart
          dataSet={DataSource}
          dataOptions={{
            category: [Diagnosis.Description],
            value: [{ 
              column: Admissions.TimeofStay, 
              name: 'Time of Stay' ,
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
          filters={diagnosis ? [filterFactory.equals(Diagnosis.Description, diagnosis)] : []}
        />
      </div>

      <div style={{ width: 500 }}>
        <h5>Deaths by Diagnosis</h5>

        <PieChart
          dataSet={DataSource}
          dataOptions={{
            category: [Diagnosis.Description],
            value: [measureFactory.aggregate(Admissions.Death, 'count', 'Deaths')],
          }}
          onDataPointClick={handleFilter}
        />
      </div>
    </div>
  </div>;
}