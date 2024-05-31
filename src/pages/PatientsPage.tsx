import { filterFactory, measureFactory } from "@sisense/sdk-data";
import { PivotTable, Table } from "@sisense/sdk-ui";
import { useRef, useState } from "react";
import { Dropdown, DropdownButton, Form, InputGroup } from "react-bootstrap";
import { Admissions, DataSource, Patients } from "../healthcare";

export default function PatientsPage() {
  const [search, setSearch] = useState('');
  const debounce = useRef(0);

  function debounceSearch(search: string) {
    const DEBOUNCE = 350;

    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => setSearch(search), DEBOUNCE);
  }

  return (<div className="px-4">
    <h1>Patients</h1>

    <div className="d-flex px-3 py-4 bg-white rounded shadow-sm overflow-hidden gap-2">
      <div className="flex-grow-1">
        <h5>Patients</h5>

        <div className="d-flex gap-4 px-3">
          <InputGroup>
            {/* <InputGroup.Text id="user-search" /> */}
            <Form.Control placeholder="Search for user" aria-label="Search for user" onChange={(event) => debounceSearch(event.target.value)} />
          </InputGroup>

          <DropdownButton title="Filters">
            <Dropdown.Menu>

            </Dropdown.Menu>
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
                numberFormatConfig: {
                  symbol: '$',
                  name: 'Currency',
                  prefix: true
                }
              },
              measureFactory.count(Admissions.ID, 'Admissions'),
            ],
          }}
          filters={[
            ...(search ? [filterFactory.contains(Patients.FullName, search)] : [])
          ]} />
      </div>

      {/* <div>
        <h5>Summary</h5>

        <PivotTable 
          dataSet={DataSource}
          styleOptions={{ width: 400, height: 400 }}
          dataOptions={{
            rows: [

            ],
            columns: [
              {
                column: measureFactory.sum(Admissions.Cost_of_admission, 'Total Cost'),
                numberFormatConfig: {
                  symbol: '$',
                  prefix: true
                }
              }
            ]
          }}
        />
      </div> */}
    </div>
  </div>);
}