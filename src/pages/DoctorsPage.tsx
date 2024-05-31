import { filterFactory, measureFactory } from "@sisense/sdk-data";
import { DataPoint, PieChart, Table, TreemapChart } from "@sisense/sdk-ui";
import { useState } from "react";
import { Admissions, DataSource, Divisions, Doctors } from "../healthcare";
import { CURRENCY } from "../utils/Formats";

export default function DoctorsPage() {
  const [division, setDivision] = useState('');

  const handleFilter = (point: DataPoint) => {
    const value = point.seriesValue || point.categoryValue;
    if (value) setDivision(division => value === division ? '' : value as string);
    return null;
  };

  return <div className="px-4">
    <h1>Doctors</h1>

    <div className="d-flex px-3 py-4 bg-white rounded shadow-sm overflow-hidden gap-2">
      <div className="flex-grow-1">
        <h5>Doctors {division ? `(${division})` : ''}</h5>

        <Table
          dataSet={DataSource}
          styleOptions={{
            height: 400,
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

      <div>
        <h5>Cases per Division</h5>

        <PieChart
          dataSet={DataSource}
          styleOptions={{ height: 400, width: 400 }}
          dataOptions={{
            category: [Divisions.Divison_name],
            value: [measureFactory.sum(Admissions.ID, 'Cases')],
          }}
          onDataPointClick={handleFilter} />
      </div>
    </div>

    <div className="d-flex flex-column mt-3 px-3 py-4 bg-white rounded shadow-sm overflow-hidden gap-2">
      <h5>Revenue per Division and Doctor</h5>
      <TreemapChart
        dataSet={DataSource}
        styleOptions={{ height: 450 }}
        dataOptions={{
          category: [Divisions.Divison_name, Doctors.FullName],
          value: [
            {
              column: measureFactory.sum(Admissions.Cost_of_admission, 'Revenue'),
              ...CURRENCY
            }
          ]
        }}
      />
    </div>
  </div>;
}