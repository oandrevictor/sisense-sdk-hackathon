import { measureFactory, filterFactory } from "@sisense/sdk-data";
import { LineChart, BarChart, PieChart, ScatterChart, BoxplotChart, HighchartsOptions } from "@sisense/sdk-ui";
import { DataSource, Rooms, Admissions, Doctors, Diagnosis, ER } from "../healthcare";

const sortSeries = (serie: { data: { y: number; }[]; "": any; }) => {
  serie.data = serie?.data?.sort((a: { y: number; }, b: { y: number; }) => b.y - a.y);
  return serie
}

const getCategoriesFromSortedSeries = (series: any) => {
  return series[0].data.map((data: any) => data.custom.xValue[0]);
}


export default function Charts() {
  return (<div className="d-flex flex-column gap-4 px-4 py-2">
    <h1>Hackaton</h1>

    <div className="d-flex gap-3" style={{ minHeight: 350 }}>
      <div className="w-50">
        <h3>Room Admissions</h3>

        <BarChart
          dataSet={DataSource}
          dataOptions={{
            category: [Rooms.Room_number],
            value: [measureFactory.count(Admissions.ID, 'Total')],
            breakBy: []
          }}
          onBeforeRender={(options: HighchartsOptions) => {
            console.log('options', options);
            options.series = options?.series?.map(sortSeries);
            options.xAxis[0].categories = getCategoriesFromSortedSeries(options.series);
            return options;
          }}
          styleOptions={
            {
              navigator: {
                enabled: false
              },
              legend: {
                enabled: false
              },
              yAxis: {
                title: {
                  enabled: true,
                  text: 'Admissions'
                }
              }
            }
          }
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
          }}
          styleOptions={
            {
              navigator: {
                enabled: false
              },
              legend: {
                enabled: false
              },
              yAxis: {
                title: {
                  enabled: true,
                  text: 'Patients'
                }
              }
            }
          }
           />
      </div>
    </div>

    <div className="d-flex gap-3" style={{ minHeight: 350 }}>
      <div className="w-50">
        <h3>Deaths over time</h3>
        <LineChart
          dataSet={DataSource}
          dataOptions={{
            category: [Admissions.Admission_Time.Months.format('MM/yyyy')],
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
            category: [ER.Date.Months.format('MM/yyyy')],
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
            category: [ER.Date.Months.format('MM/yyyy')],
            value: [measureFactory.count(ER.ID, 'Total')],
            breakBy: [Diagnosis.Description]
          }} />
      </div>
    </div>

  </div>);
}