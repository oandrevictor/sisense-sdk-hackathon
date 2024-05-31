import { Filter, filterFactory, measureFactory } from "@sisense/sdk-data";
import { DateRangeFilterTile, Table } from "@sisense/sdk-ui";
import { useRef, useState } from "react";
import { DropdownButton, Form, InputGroup } from "react-bootstrap";
import ReactSelect from "react-select";
import { Admissions, DataSource, Patients } from "../healthcare";
import { CURRENCY } from "../utils/Formats";

const genderFilterOptions = [
  {
    label: 'Male',
    value: 'Male'
  },
  {
    label: 'Female',
    value: 'Female'
  }
]

export default function PatientsPage() {
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState<null | any>(null);
  const [dateRangeFilter, setDateRangeFilter] = useState<Filter>(filterFactory.dateRange(Admissions.Admission_Time.Days));

  const debounce = useRef(0);

  function debounceSearch(search: string) {
    const DEBOUNCE = 350;

    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => setSearch(search), DEBOUNCE);
  };

  return (<div className="px-4">
    <div className="d-flex align-items-end justify-content-between">
      <h1>Patients</h1>

      <div className="pb-2">
        <span className="text-black-50 body-xs">Admitted in</span>
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
    </div>

    <div className="d-flex px-3 py-4 bg-white rounded shadow-sm overflow-hidden gap-2">
      <div className="flex-grow-1">
        <h5>Patients</h5>

        <div className="d-flex gap-4 px-3">
          <InputGroup>
            <Form.Control placeholder="Search for user" aria-label="Search for user" onChange={(event) => debounceSearch(event.target.value)} />
          </InputGroup>

          <DropdownButton title="Filters">
            <div className="bg-white rounded px-2 py-2">

              <div className="body-xs fw-bold">Gender</div>
              <ReactSelect
                isClearable
                isSearchable={false}
                value={genderFilter}
                options={genderFilterOptions}
                onChange={option => setGenderFilter(option || null)} />
            </div>
          </DropdownButton>
        </div>

        <Table
          dataSet={DataSource}
          styleOptions={{
            height: 800,
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
              Patients.ID,
              Patients.FullName.sort(1),
              Patients.Gender,
              Patients.DOB,
              {
                column: measureFactory.sum(Admissions.Cost_of_admission, 'Total Spent'),
                ...CURRENCY
              },
              measureFactory.count(Admissions.ID, 'Admissions'),
            ],
          }}
          filters={[
            ...(search ? [filterFactory.contains(Patients.FullName, search)] : []),
            ...(genderFilter ? [filterFactory.equals(Patients.Gender, genderFilter.value)] : []),
            dateRangeFilter
          ]} />
      </div>
    </div>
  </div>);
}