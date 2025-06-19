import {useContext} from "react";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {selectSelectedItem, updateSelectedItem} from "../redux/selectedItemSlice";
import {PluginContext} from "../context";
import {NoteType, SelectedItemType} from "../../base/enum";
import {DateTime} from "luxon";
import SelectedItem from "../../entity/SelectedItem";
import StatisticLabel from "./StatisticLabel";


function MonthItem({showYear, showMonth}: { showYear: number, showMonth: number }) {

    const dispatch = useAppDispatch();
    const selectedItem = useAppSelector(selectSelectedItem);
    const plugin = useContext(PluginContext)!;

    // 每个月份都可能被选中，提前创建对象以便更新
    const newSelectItem = new SelectedItem();
    newSelectItem.type = SelectedItemType.MONTH_ITEM;
    newSelectItem.date = DateTime.local(showYear, showMonth);

    // 被选中和未被选中月份的背景颜色不同
    let bodyStyle = "year-view-month-item d-unselected-item";
    if (selectedItem.type === SelectedItemType.MONTH_ITEM && selectedItem.date.year === showYear && selectedItem.date.month === showMonth) {
        bodyStyle = "year-view-month-item d-selected-item";
    }

    return <div className={bodyStyle} onClick={() => dispatch(updateSelectedItem(newSelectItem))}
                onDoubleClick={() => plugin.noteController.openNoteBySelectedItem(newSelectItem)}>
        <div>{showMonth}月</div>
        {
            plugin.database.setting.shouldDisplayWordCount
                ? <StatisticLabel date={DateTime.local(showYear, showMonth)} noteType={NoteType.MONTHLY}/>
                : <></>
        }
    </div>
}

function QuarterItem({showYear, showQuarter}: { showYear: number, showQuarter: number }) {

    const dispatch = useAppDispatch();
    const selectedItem = useAppSelector(selectSelectedItem);
    const plugin = useContext(PluginContext)!;

    // 每个月份都可能被选中，提前创建对象以便更新
    const newSelectItem = new SelectedItem();
    newSelectItem.type = SelectedItemType.QUARTER_ITEM;
    newSelectItem.date = DateTime.local(showYear, showQuarter * 3 - 2);

    // 被选中和未被选中月份的背景颜色不同
    let bodyStyle = "year-view-quarter-item d-unselected-item";
    if (selectedItem.type === SelectedItemType.QUARTER_ITEM && selectedItem.date.year === showYear && selectedItem.date.quarter === showQuarter) {
        bodyStyle = "year-view-quarter-item d-selected-item";
    }

    return <div className={bodyStyle} onClick={() => dispatch(updateSelectedItem(newSelectItem))}
                onDoubleClick={() => plugin.noteController.openNoteBySelectedItem(newSelectItem)}>
        <div>{plugin.viewController.parseQuarterName(showQuarter)}</div>
        {
            plugin.database.setting.shouldDisplayWordCount
                ? <StatisticLabel date={DateTime.local(showYear, showQuarter * 3 - 2)} noteType={NoteType.QUARTERLY}/>
                : <></>
        }
    </div>
}

function YearViewRow({showYear, showQuarter}: { showYear: number, showQuarter: number }) {
    return <div className="calendar-view-row">
        <QuarterItem showYear={showYear} showQuarter={showQuarter}/>
        <MonthItem showYear={showYear} showMonth={showQuarter * 3 - 2}/>
        <MonthItem showYear={showYear} showMonth={showQuarter * 3 - 1}/>
        <MonthItem showYear={showYear} showMonth={showQuarter * 3}/>
    </div>
}

export default function YearView({showYear}: { showYear: number }) {
    return <div className="calendar-view-body">
        <YearViewRow showYear={showYear} showQuarter={1}/>
        <YearViewRow showYear={showYear} showQuarter={2}/>
        <YearViewRow showYear={showYear} showQuarter={3}/>
        <YearViewRow showYear={showYear} showQuarter={4}/>
    </div>
}
