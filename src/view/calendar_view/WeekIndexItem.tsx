import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {selectSelectedItem, updateSelectedItem} from "../../redux/selectedItemSlice";
import {SelectedItemType} from "../../base/enum";
import SelectedItem from "../../entity/SelectedItem";
import {DateTime} from "luxon";

export default function WeekIndexItem({targetDay}: { targetDay: DateTime }) {
    let dispatch = useAppDispatch();
    let selectedItem = useAppSelector(selectSelectedItem);

    let itemStyle = "calendar-view-item d-hover-bg-color-base-50";
    let itemBodyStyle = "month-view-item-body";
    if (selectedItem.type === SelectedItemType.WEEK_INDEX_ITEM && selectedItem.date.weekNumber === targetDay.weekNumber) {
        itemStyle = "calendar-view-item d-bg-color-blue";
        itemBodyStyle = "month-view-item-body month-view-item-body-selected";
    }
    let newSelectItem = new SelectedItem();
    newSelectItem.type = SelectedItemType.WEEK_INDEX_ITEM;
    newSelectItem.date = targetDay;

    return <div className={itemStyle} onClick={() => dispatch(updateSelectedItem(newSelectItem))}>
        <div className={itemBodyStyle}>{targetDay.weekNumber}</div>
        <div className="calendar-view-no-dot">&nbsp;</div>
    </div>
}