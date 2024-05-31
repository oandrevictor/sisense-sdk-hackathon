import { ColumnChart, StyledMeasureColumn } from "@sisense/sdk-ui"
import { Fragment } from "react/jsx-runtime"
import { DataSource, Diagnosis, Divisions, Doctors, ER, Rooms } from "../healthcare"
import { CalculatedMeasureColumn, Column, DateDimension, Filter, LevelAttribute, MeasureColumn } from "@sisense/sdk-data"
import { useEffect, useState } from "react"
import cx from 'classnames';
import { CSVLink } from "react-csv";
import { FaDownload } from 'react-icons/fa6';

type Props = {
    filters: Filter[];
    title: string;
    fixedFilter?: Filter;
    value: MeasureColumn | CalculatedMeasureColumn | StyledMeasureColumn;
    granularity: Granularity;
    relatedPage?: string;
    category: DateDimension;
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

const columns = (category, value, breakdownBy) => {
    const cols = [category.name, value.name];
    if (breakdownBy) {
        cols.push(breakdownBy.name);
    }
    return cols;
};

const rows = (series: any) => {
    return series.map((serie: any) => {
        return serie.data.map((data: any) => {
            return series.length > 1 ? [data.custom.xValue[0], data.y, serie.name] : [data.custom.xValue[0], data.y];
        });
    }).flat();

}

export const ChartWithBreakdown = ({ filters, title, fixedFilter, value, granularity, relatedPage, category }: Props) => {
    const [breakdownBy, setBreakdownBy] = useState<Column | null>(null);
    const [groupBy, setGroupBy] = useState<Column>(getForGranularity(category, granularity).format(formatString[granularity]));
    const isActive = (breakdown: Column | null) => breakdownBy?.name === breakdown?.name;
    const isGroupedBy = (group: Column | null) => groupBy?.name === group?.name;
    const [chartData, setChartData] = useState(null);
    const [csvKeys, setCsvKeys] = useState("");
    const [csvData, setCsvData] = useState([]);

    useEffect(() => {
        if (chartData) {
            setCsvData([columns(groupBy, value, breakdownBy), ...rows(chartData.series)]);
        }
    }, [chartData]);


    useEffect(() => {
        if ((groupBy as DateDimension).expression.indexOf('Calendar') > -1) {
            setGroupBy(getForGranularity(category, granularity).format(formatString[granularity]));
        }
    }, [granularity]);

    return <Fragment>
        <div className="card shadow border border-1 border-light">
            <div className="card-body">
                <div className="d-flex filters justify-content-between">
                    <h4 className="card-title">{title}</h4>
                    <CSVLink data={csvData}><button type="button"className="btn btn-secondary" style={{fontSize: '0.7rem'}} data-bs-toggle="modal" data-bs-target="#csvModal">Export as csv <FaDownload/></button></CSVLink>
                </div>

                <ul className="nav nav-pills " style={{ fontSize: '0.8rem' }}>
                    <li className="px-2 py-2 nav-item">grouped by</li>
                    <div className="btn-group" role="group" aria-label="Basic outlined example" >
                        <button type="button" className={cx("btn btn-outline-secondary btn-filter", { active: isGroupedBy(getForGranularity(category, granularity).format(formatString[granularity])) })} aria-current="page" onClick={() => setGroupBy(getForGranularity(category, granularity).format(formatString[granularity]))}>Date</button>
                        <button type="button" className={cx("btn btn-outline-secondary btn-filter", { active: isGroupedBy(Diagnosis.Description) })} onClick={() => setGroupBy(Diagnosis.Description)}>Diagnosis</button>
                        <button type="button" className={cx("btn btn-outline-secondary btn-filter", { active: isGroupedBy(Divisions.Divison_name) })} onClick={() => setGroupBy(Divisions.Divison_name)}>Division</button>
                        <button type="button" className={cx("btn btn-outline-secondary btn-filter", { active: isGroupedBy(Doctors.Name) })} onClick={() => setGroupBy(Doctors.Name)}>Doctor</button>
                        <button type="button" className={cx("btn btn-outline-secondary btn-filter", { active: isGroupedBy(Rooms.Room_number) })} onClick={() => setGroupBy(Rooms.Room_number)}>Room</button>
                        <button type="button" className={cx("btn btn-outline-secondary btn-filter", { active: isGroupedBy(ER.Waitingtime) })} onClick={() => setGroupBy(ER.Waitingtime)}>Waiting time</button>
                    </div>
                    <li className="px-2 py-2 nav-item">and broken down by</li>
                    <div className="btn-group" role="group" aria-label="Basic outlined example" >
                        <button type="button" className={cx("btn btn-outline-secondary btn-filter", { active: isActive(null) })} aria-current="page" onClick={() => setBreakdownBy(null)}>Nothing</button>
                        <button type="button" className={cx("btn btn-outline-secondary btn-filter", { active: isActive(Diagnosis.Description) })} onClick={() => setBreakdownBy(Diagnosis.Description)}>Diagnosis</button>
                        <button type="button" className={cx("btn btn-outline-secondary btn-filter", { active: isActive(Divisions.Divison_name) })} onClick={() => setBreakdownBy(Divisions.Divison_name)}>Division</button>
                        <button type="button" className={cx("btn btn-outline-secondary btn-filter", { active: isActive(Doctors.Name) })} onClick={() => setBreakdownBy(Doctors.Name)}>Doctor</button>
                        <button type="button" className={cx("btn btn-outline-secondary btn-filter", { active: isActive(Rooms.Room_number) })} onClick={() => setBreakdownBy(Rooms.Room_number)}>Room</button>
                        <button type="button" className={cx("btn btn-outline-secondary btn-filter", { active: isActive(ER.Waitingtime) })} onClick={() => setBreakdownBy(ER.Waitingtime)}>Waiting time</button>
                    </div>
                </ul>

                <div className="d-flex gap-3">
                    <div className="" style={{ width: '100%' }}>
                        <ColumnChart
                            dataSet={DataSource}
                            dataOptions={{
                                category: [groupBy],
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
                                        position: 'right'
                                    },
                                    xAxis: {
                                        title: {
                                            enabled: false,
                                            text: titleWithGranularityInfo('Admission Date', granularity)
                                        }
                                    },
                                }
                            }
                            onBeforeRender={(data) => {
                                if (csvKeys === `${groupBy.name},${value.name}${breakdownBy ? `,${breakdownBy.name}` : ''},${data?.series?.length}`) return data;
                                setChartData(data);
                                setCsvKeys(`${groupBy.name},${value.name}${breakdownBy ? `,${breakdownBy.name}` : ''},${chartData?.series?.length}`);
                                return data;
                            }}
                        />
                    </div>
                </div>
                <ul className="nav nav-pills " style={{ fontSize: '0.8rem' }}>

                </ul>
            </div>

            {relatedPage ?
                <div className="card-footer bg-lightblue text-white">
                    <small className="">Check more information about {relatedPage} by clicking here.</small>
                </div> : null}
        </div>
    </Fragment>
}