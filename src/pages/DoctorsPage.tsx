import { filterFactory, measureFactory } from "@sisense/sdk-data";
import { DataPoint, PieChart, Table } from "@sisense/sdk-ui";
import { useState } from "react";
import { Admissions, DataSource, Divisions, Doctors } from "../healthcare";

export default function DoctorsPage() {
  const [division, setDivision] = useState('');

  const handleFilter = (point: DataPoint) => {
    const value = point.seriesValue || point.categoryValue;
    if (value) setDivision(division => value === division ? '' : value as string);
    return null;
  };

  return <div className="d-flex flex-column px-3 py-4 bg-white rounded shadow-sm overflow-hidden">
    <div className="d-flex gap-5">
      <div className="w-50" style={{ minHeight: 500 }}>
        <h5>Doctors {division ? `(${division})` : ''}</h5>

        <Table
          dataSet={DataSource}
          styleOptions={{
            header: {
              color: {
                textColor: 'black',
                enabled: true
              },
            },
            columns: {
              width: 'auto'
            }
          }}
          dataOptions={{
            columns: [
              Doctors.ID,
              Doctors.Name,
              Doctors.Surname,
              Doctors.Specialty,
              measureFactory.count(Admissions.ID, `Cases`).sort(2),
            ],
          }}
          filters={division ? [filterFactory.equals(Divisions.Divison_name, division)] : []} />
      </div>

      <div style={{ width: 450 }} >
        <h5>Cases per Division</h5>

        <PieChart
          dataSet={DataSource}
          dataOptions={{
            category: [Divisions.Divison_name],
            value: [measureFactory.sum(Admissions.ID, 'Cases')],
          }}
          onDataPointClick={handleFilter} />
      </div>
    </div>
  </div>;
}