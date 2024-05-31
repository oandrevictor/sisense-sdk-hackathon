import { ColumnChart, DateRangeFilterTile, StyledMeasureColumn } from "@sisense/sdk-ui"
import { Fragment } from "react/jsx-runtime"
import { Admissions, DataSource, Diagnosis, Divisions, Doctors, Rooms } from "../healthcare"
import { CalculatedMeasureColumn, Column, DateDimension, Filter, LevelAttribute, MeasureColumn, filterFactory, measureFactory } from "@sisense/sdk-data"
import { useState } from "react"
import cx from 'classnames';

type Props = {
    filters: Filter[];
    title: string;
    fixedFilter?: Filter;
    value: MeasureColumn | CalculatedMeasureColumn | StyledMeasureColumn;
    granularity: Granularity;
    relatedPage?: string;
}

export type Granularity = 'Days' | 'Weeks' | 'Months' | 'Quarters' | 'Years';

const getForGranularity = (dimension: DateDimension, granularity: Granularity): LevelAttribute => dimension[granularity];

const formatString = {
    Days: 'MM/dd/yyyy',
    Weeks: 'MMM dd',
    Months: 'MMM yyyy',
    Quarters: 'MMM yyyy',
    Years: 'yyyy'
}

const titleWithGranularityInfo = (title: string, granularity: Granularity) => {
const granWithoutPlural = granularity.slice(0, -1);
return granularity === 'Weeks' ? `${title} (the week of)` : `${title} (${granWithoutPlural})`;
}

export const ChartWithBreakdown = ({ filters, title, fixedFilter, value, granularity, relatedPage }: Props) => {
    const [breakdownBy, setBreakdownBy] = useState<Column | null>(null);
    const [dateRangeFilter, setDateRangeFilter] = useState<Filter>(filterFactory.dateRange(Admissions.Admission_Time.Days));

    const isActive = (breakdown: Column | null) => breakdownBy?.name === breakdown?.name;

    return <Fragment>
        <div className="card shadow border border-1 border-light">

            <div className="card-body">
                <div className="d-flex filters justify-content-between">
            <h4 className="card-title">{title}</h4>
            
            </div>

                <ul className="nav nav-pills " style={{ fontSize: '0.8rem' }}>
                    <li className="px-2 py-2 nav-item">Break down by:</li>
                    <li className="nav-item">
                        <a className={cx('nav-link', { active: isActive(null) })} aria-current="page" href="#" onClick={() => setBreakdownBy(null)}>Nothing</a>
                    </li>
                    <li className="nav-item">
                        <a className={cx('nav-link', { active: isActive(Diagnosis.Description) })} href="#" onClick={() => setBreakdownBy(Diagnosis.Description)}>Diagnosis</a>
                    </li>
                    <li className="nav-item">
                        <a className={cx('nav-link', { active: isActive(Divisions.Divison_name) })} href="#" onClick={() => setBreakdownBy(Divisions.Divison_name)}>Division</a>
                    </li>
                    <li className="nav-item">
                        <a className={cx('nav-link', { active: isActive(Doctors.Name) })} href="#" onClick={() => setBreakdownBy(Doctors.Name)}>Doctor</a>
                    </li>
                    <li className="nav-item">
                        <a className={cx('nav-link', { active: isActive(Rooms.Room_number) })} href="#" onClick={() => setBreakdownBy(Rooms.Room_number)}>Room</a>
                    </li>
                </ul>
                <div className="d-flex gap-3">
                    <div className="" style={{ width: '100%' }}>
                        <ColumnChart
                            dataSet={DataSource}
                            dataOptions={{
                                category: [getForGranularity(Admissions.Admission_Time, granularity).format(formatString[granularity])],
                                value: [value],
                                breakBy: breakdownBy ? [breakdownBy] : []
                            }}
                            filters={[fixedFilter, ...filters].filter(f => f !== null && f != undefined) as Filter[]}
                            styleOptions={
                                {

                                    height: 420,
                                    subtype: 'column/stackedcolumn',
                                    legend: {
                                        enabled: true,
                                        position: 'top'
                                    },
                                    xAxis: {
                                        title: {
                                            enabled: true,
                                            text: titleWithGranularityInfo('Admission Date', granularity)
                                        }
                                    },
                                }
                            }
                        />
                    </div>
                </div>
                
            </div>
            {relatedPage ?
            <div className="card-footer bg-lightblue text-white">
      <small className="">Check more information about {relatedPage} by clicking here.</small>
    </div> : null}
        </div>
    </Fragment>
}