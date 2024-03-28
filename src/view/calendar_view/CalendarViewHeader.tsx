import {useContext, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {selectSelectedItem, updateSelectedItem} from "../../redux/selectedItemSlice";
import {selectCalendarViewType, updateCalendarViewType} from "../../redux/calendarViewType";
import {DateTime} from "luxon";
import {ChevronLeft, ChevronRight} from 'lucide-react';
import SelectedItem from "../../entity/SelectedItem";
import {CalendarViewType, NoteType, SelectedItemType} from "../../base/enum";
import {MainControllerContext} from "../../base/context";

function YearItem() {

    const [hidden, setHidden] = useState(true);
    const dispatch = useAppDispatch();
    const selectedItem = useAppSelector(selectSelectedItem);
    const selectedDate = selectedItem.date;
    const mainController = useContext(MainControllerContext)!;

    // 有关联笔记的日期会使用一个点进行标注
    let dotStyle = "calendar-view-no-dot";
    if (mainController.hasNote(DateTime.local(selectedDate.year), NoteType.YEARLY)) {
        dotStyle = "calendar-view-dot";
    }

    const toLastYear = () => {
        const newSelectedItem = new SelectedItem();
        newSelectedItem.type = selectedItem.type;
        newSelectedItem.date = selectedDate.minus({years: 1});
        dispatch(updateSelectedItem(newSelectedItem));
    }

    const toNextYear = () => {
        const newSelectedItem = new SelectedItem();
        newSelectedItem.type = selectedItem.type;
        newSelectedItem.date = selectedDate.plus({years: 1});
        dispatch(updateSelectedItem(newSelectedItem));
    }

    return <div style={{display: "flex", alignItems: "center"}} onMouseEnter={() => setHidden(false)}
                onMouseLeave={() => setHidden(true)}>
        <ChevronLeft className="d-hover-color-blue d-icon" style={{visibility: hidden ? 'hidden' : 'visible'}}
                     onClick={toLastYear}/>
        <div className="calendar-header-item d-hover-bg-color-base-50"
             onDoubleClick={() => mainController.openFileByNoteType(DateTime.local(selectedDate.year), NoteType.YEARLY)}>
            <div>{selectedDate.year}年</div>
            <div className={dotStyle}></div>
        </div>
        <ChevronRight className="d-hover-color-blue d-icon" style={{visibility: hidden ? 'hidden' : 'visible'}}
                      onClick={toNextYear}/>
    </div>
}

function MonthItem() {

    const [hidden, setHidden] = useState(true);
    const dispatch = useAppDispatch();
    const selectedItem = useAppSelector(selectSelectedItem);
    const selectedDate = selectedItem.date;
    const mainController = useContext(MainControllerContext)!;

    // 有关联笔记的日期会使用一个点进行标注
    let dotStyle = "calendar-view-no-dot";
    if (mainController.hasNote(DateTime.local(selectedDate.year, selectedDate.month), NoteType.MONTHLY)) {
        dotStyle = "calendar-view-dot";
    }

    const toLastMonth = () => {
        const newSelectedItem = new SelectedItem();
        newSelectedItem.type = selectedItem.type;
        newSelectedItem.date = selectedDate.minus({months: 1});
        dispatch(updateSelectedItem(newSelectedItem));
    }

    const toNextMonth = () => {
        const newSelectedItem = new SelectedItem();
        newSelectedItem.type = selectedItem.type;
        newSelectedItem.date = selectedDate.plus({months: 1});
        dispatch(updateSelectedItem(newSelectedItem));
    }

    return <div style={{display: "flex", alignItems: "center"}} onMouseEnter={() => setHidden(false)}
                onMouseLeave={() => setHidden(true)}>
        <ChevronLeft className="d-hover-color-blue" style={{visibility: hidden ? 'hidden' : 'visible'}}
                     onClick={toLastMonth}/>
        <div className="calendar-header-item d-hover-bg-color-base-50"
             onDoubleClick={() => mainController.openFileByNoteType(DateTime.local(selectedDate.year, selectedDate.month), NoteType.MONTHLY)}>
            <div>{selectedDate.month}月</div>
            <div className={dotStyle}></div>
        </div>
        <ChevronRight className="d-hover-color-blue" style={{visibility: hidden ? 'hidden' : 'visible'}}
                      onClick={toNextMonth}/>
    </div>
}

function QuarterItem() {

    const [hidden, setHidden] = useState(true);
    const dispatch = useAppDispatch();
    const selectedItem = useAppSelector(selectSelectedItem);
    const selectedDate = selectedItem.date;
    const mainController = useContext(MainControllerContext)!;

    // 有关联笔记的日期会使用一个点进行标注
    let dotStyle = "calendar-view-no-dot";
    if (mainController.hasNote(DateTime.local(selectedDate.year, selectedDate.quarter * 3 - 2), NoteType.QUARTERLY)) {
        dotStyle = "calendar-view-dot";
    }

    const toLastQuarter = () => {
        const newSelectedItem = new SelectedItem();
        newSelectedItem.type = selectedItem.type;
        newSelectedItem.date = selectedDate.minus({months: 3});
        dispatch(updateSelectedItem(newSelectedItem));
    }

    const toNextQuarter = () => {
        const newSelectedItem = new SelectedItem();
        newSelectedItem.type = selectedItem.type;
        newSelectedItem.date = selectedDate.plus({months: 3});
        dispatch(updateSelectedItem(newSelectedItem));
    }

    return <div style={{display: "flex", alignItems: "center"}} onMouseEnter={() => setHidden(false)}
                onMouseLeave={() => setHidden(true)}>
        <ChevronLeft className="d-hover-color-blue d-icon" style={{visibility: hidden ? 'hidden' : 'visible'}}
                     onClick={toLastQuarter}/>
        <div className="calendar-header-item d-hover-bg-color-base-50"
             onDoubleClick={() => mainController.openFileByNoteType(DateTime.local(selectedDate.year, selectedDate.quarter * 3 - 2), NoteType.QUARTERLY)}>
            <div>{selectedDate.quarter}季度</div>
            <div className={dotStyle}></div>
        </div>
        <ChevronRight className="d-hover-color-blue d-icon" style={{visibility: hidden ? 'hidden' : 'visible'}}
                      onClick={toNextQuarter}/>
    </div>
}

function TodayItem() {

    const dispatch = useAppDispatch();
    const selectedItem = useAppSelector(selectSelectedItem);
    const selectedType = selectedItem.type;
    const selectedDate = selectedItem.date;

    const today = DateTime.now();

    let isSelected: boolean = false;
    if (selectedType === SelectedItemType.DAY_ITEM) {
        isSelected = selectedDate.year === today.year && selectedDate.month === today.month && selectedDate.day === today.day;
    }
    else if (selectedType === SelectedItemType.WEEK_INDEX_ITEM) {
        isSelected = selectedDate.year === today.year && selectedDate.weekNumber === today.weekNumber;
    }
    else if (selectedType === SelectedItemType.MONTH_ITEM) {
        isSelected = selectedDate.year === today.year && selectedDate.month === today.month;
    }
    else if (selectedType === SelectedItemType.QUARTER_ITEM) {
        isSelected = selectedDate.year === today.year && selectedDate.quarter === today.quarter;
    }
    else if (selectedType === SelectedItemType.YEAR_ITEM) {
        isSelected = selectedDate.year === today.year;
    }

    const clickCallback = () => {
        const newSelectedItem = new SelectedItem();
        newSelectedItem.type = selectedItem.type;
        newSelectedItem.date = today;
        dispatch(updateSelectedItem(newSelectedItem));
    }

    if (isSelected) {
        return <div className="d-bg-color-blue circular-label">今</div>
    }
    else {
        return <div className="d-hover-bg-color-base-50 circular-label" onClick={clickCallback}>今</div>
    }
}

function ViewSelector() {

    const dispatch = useAppDispatch();
    const calendarViewType = useAppSelector(selectCalendarViewType);
    const selectedItem = useAppSelector(selectSelectedItem);

    const clickMonthCallback = () => {
        dispatch(updateCalendarViewType(CalendarViewType.YEAR));

        const newSelectedItem = new SelectedItem();
        newSelectedItem.type = SelectedItemType.MONTH_ITEM
        newSelectedItem.date = selectedItem.date;
        dispatch(updateSelectedItem(newSelectedItem));
    }

    const clickYearCallback = () => {
        dispatch(updateCalendarViewType(CalendarViewType.MONTH));

        const newSelectedItem = new SelectedItem();
        newSelectedItem.type = SelectedItemType.DAY_ITEM
        newSelectedItem.date = selectedItem.date;
        dispatch(updateSelectedItem(newSelectedItem));
    }

    if (calendarViewType === CalendarViewType.MONTH) {
        return <div className="d-hover-bg-color-base-50 circular-label" onClick={clickMonthCallback}>月</div>
    }
    else {
        return <div className="d-hover-bg-color-base-50 circular-label" onClick={clickYearCallback}>年</div>
    }

}

export default function CalendarViewHeader() {
    return <div style={{
        height: "40px",
        display: "flex",
        justifyContent: "space-between"
    }}>
        <div style={{
            fontSize: "22.5px",
            display: "flex",
            flexGrow: 1,
        }}>
            <YearItem/>
            <MonthItem/>
            <QuarterItem/>
        </div>
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            flexBasis: "60px",
            alignItems: "center"
        }}>
            <TodayItem/>
            <ViewSelector/>
        </div>
    </div>
}