import { Filter, measureFactory, filterFactory } from "@sisense/sdk-data";
import { LineChart, BarChart, PieChart, ScatterChart, BoxplotChart, HighchartsOptions, MemberFilterTile, DateRangeFilterTile } from "@sisense/sdk-ui";
import { DataSource, Rooms, Admissions, Doctors, Diagnosis, ER, Divisions } from "../healthcare";
import { useMemo, useState } from "react";

const sortSeries = (serie: { data: { y: number; }[]; "": any; }) => {
  serie.data = serie?.data?.sort((a: { y: number; }, b: { y: number; }) => b.y - a.y);
  return serie
}

const getCategoriesFromSortedSeries = (series: any) => {
  return series[0].data.map((data: any) => data.custom.xValue[0]);
}

export default function Charts() {
  const [categoryFilter, setCategoryFilter] = useState<Filter | null>(null);
  const [dateRangeFilter, setDateRangeFilter] = useState<Filter>(filterFactory.dateRange(Admissions.Admission_Time.Days));

  const filters = useMemo(() => categoryFilter ? [dateRangeFilter, categoryFilter] : [dateRangeFilter],
    [categoryFilter, dateRangeFilter]);

  return (<div className="d-flex flex-column gap-4 px-4 py-2">
    <div className="d-flex justify-content-between">
      <div className="d-flex flex-column gap-4">
        <h1>Insights</h1>
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

      <MemberFilterTile
        title={'Diagnosis'}
        dataSource={DataSource}
        attribute={Diagnosis.Description}
        filter={categoryFilter}
        onChange={setCategoryFilter}
      />

    </div>

    <div className="d-flex gap-3" style={{ minHeight: 350 }}>

    <div className="w-50">
        <h3>Division Usage</h3>

        <BarChart
          dataSet={DataSource}
          dataOptions={{
            category: [Divisions.Divison_name],
            value: [measureFactory.count(Admissions.ID, 'Total').sort(0)],
            breakBy: [],
          }}
          filters={filters}
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
        <h3>Room Admissions</h3>

        <BarChart
          dataSet={DataSource}
          dataOptions={{
            category: [Rooms.Room_number],
            value: [measureFactory.count(Admissions.ID, 'Total').sort(2)],
            breakBy: [],
          }}
          filters={filters}
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
          onBeforeRender={(options: HighchartsOptions) => {
            console.log('options', options);
            options.series = options?.series?.map(sortSeries);
            options.xAxis[0].categories = getCategoriesFromSortedSeries(options.series);
            return options;
          }}
        />
      </div>
    </div>
    <div className="" style={{ minHeight: 350 }}>
      <h3>Deaths over time</h3>
      <LineChart
        dataSet={DataSource}
        dataOptions={{
          category: [Admissions.Admission_Time.Months.format('MM/yyyy')],
          value: [measureFactory.count(Admissions.Death, 'Deaths')],
          breakBy: []
        }}
        filters={[filterFactory.equals(Admissions.Death, 'Yes'), ...filters]}
        styleOptions={
          {
            lineWidth: {
              width: "bold"
            }
          }
        }
      />
    </div>

    <div className="d-flex gap-3" style={{ minHeight: 350 }}>


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