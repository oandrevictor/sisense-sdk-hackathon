import { Filter, measureFactory, filterFactory, Attribute, Column } from "@sisense/sdk-data";
import { LineChart, BarChart, PieChart, ScatterChart, BoxplotChart, HighchartsOptions, MemberFilterTile, DateRangeFilterTile, ColumnChart } from "@sisense/sdk-ui";
import { DataSource, Rooms, Admissions, Doctors, Diagnosis, ER, Divisions, Conditionstimeofstay } from "../healthcare";
import { useMemo, useState } from "react";
import { ChartWithBreakdown } from "../components/ChartWithBreakdown";

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

    <div className="" style={{ minHeight: 350 }}>

      <ChartWithBreakdown filters={filters} title="Deaths over time" fixedFilter={filterFactory.equals(Admissions.Death, 'Yes')} value={measureFactory.count(Admissions.Death, 'Deaths')} />
    </div>
    <div>
      <ChartWithBreakdown filters={filters} title="Patients" value={measureFactory.count(Admissions.ID, 'Admissions')} />
    </div>

    <div className="d-flex gap-3" style={{ minHeight: 350 }}>

      <div className="card w-100">
        <div className="card-body">
          <h3 className="card-title">Room Admissions</h3>
          <div className="d-flex">
            <BarChart
              dataSet={DataSource}
              dataOptions={{
                category: [Rooms.Room_number],
                value: [measureFactory.count(Admissions.ID, 'Total').sort(1)],
                breakBy: [],
              }}
              filters={[filterFactory.topRanking(
                Rooms.Room_number,
                measureFactory.count(Admissions.ID, 'Total').sort(1),
                10), ...filters]}
              onBeforeRender={(options: HighchartsOptions) => {
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
                  },
                  xAxis: {
                    title: {
                      enabled: true,
                      text: 'Room'
                    }
                  },
                  height: 420
                }
              }
            />
            <div className="flex-1"> Insight</div>
          </div>
        </div>
      </div>


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
            },
            xAxis: {
              title: {
                enabled: true,
                text: 'Doctor'
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