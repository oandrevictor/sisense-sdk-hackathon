import { measureFactory, filterFactory } from "@sisense/sdk-data";
import { LineChart, BarChart, PieChart, ScatterChart, BoxplotChart } from "@sisense/sdk-ui";
import { DataSource, Rooms, Admissions, Doctors, Diagnosis, ER } from "../healthcare";

export default function Charts() {
  return (<div className="d-flex flex-column gap-4 px-4 py-2">
    <h1>Hackaton</h1>

    <div className="d-flex gap-3" style={{ minHeight: 350 }}>
      <div className="w-50">
        <h3>Admissions per room</h3>

        <BarChart
          dataSet={DataSource}
          dataOptions={{
            category: [Rooms.Room_number],
            value: [measureFactory.count(Admissions.ID, 'Total').sort(2)],
            breakBy: []
          }}
        />
      </div>

      <div className="w-50">
        <h3>Patients per doctor</h3>

        <BarChart
          dataSet={DataSource}
          dataOptions={{
            category: [Doctors.Name],
            value: [measureFactory.count(Admissions.ID, 'Total')],
            breakBy: []
          }} />
      </div>
    </div>

    <div className="d-flex gap-3" style={{ minHeight: 350 }}>
      <div className="w-50">
        <h3>Deaths over time</h3>
        <LineChart
          dataSet={DataSource}
          dataOptions={{
            category: [Admissions.Admission_Time.Months.format('MM/YYYY')],
            value: [measureFactory.count(Admissions.Death, 'Deaths')],
            breakBy: []
          }}
          filters={[filterFactory.equals(Admissions.Death, 'Yes')]}
        />
      </div>

      <div style={{ height: 300, width: 800 }}>
        <h3>Deaths per disease</h3>

        <PieChart
          dataSet={DataSource}

          dataOptions={{
            category: [Diagnosis.Description],
            value: [measureFactory.aggregate(Admissions.Death, 'count', 'Deaths')],
          }}
        />
      </div>
    </div>

    <div className="d-flex gap-3" style={{ minHeight: 350 }}>
      <div style={{ width: '30%' }}>
        <h3>Diseases status</h3>

        <ScatterChart
          dataSet={DataSource}
          dataOptions={{
            x: Diagnosis.Description,
            y: measureFactory.count(Diagnosis.Description, 'Cases'),
            breakByColor: Admissions.Death
          }}
        />
      </div>

      <div style={{ width: '30%' }}>
        <h3>Time of stay per disease</h3>

        <BoxplotChart
          dataSet={DataSource}
          dataOptions={{
            category: [Diagnosis.Description],
            value: [{ column: Admissions.TimeofStay, name: 'Time of Stay' }],
            boxType: 'iqr',
            outliersEnabled: true,
          }}
        />
      </div>

      <div style={{ width: '30%' }}>
        <h3>ER Waiting time</h3>

        <BoxplotChart
          dataSet={DataSource}
          dataOptions={{
            category: [ER.Date.Months.format('MM/YYYY')],
            value: [{ column: ER.Waitingtime, name: 'Time of Stay' }],
            boxType: 'iqr',
            outliersEnabled: true,
          }}
        />
      </div>
    </div>

    <div>
      <div style={{ width: '30%' }}>
        <h3>ER Cases Over Time</h3>

        <LineChart
          dataSet={DataSource}
          dataOptions={{
            category: [ER.Date.Months.format('MM/YYYY')],
            value: [measureFactory.count(ER.ID, 'Total')],
            breakBy: [Diagnosis.Description]
          }} />
      </div>
    </div>

  </div>);
}