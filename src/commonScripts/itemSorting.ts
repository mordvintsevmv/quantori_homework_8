import {Item} from "../types/Item";

export enum SortType {
    TITLE_DECREASING,
    TITLE_INCREASING,

    DATE_COMPLETE_DECREASING,
    DATE_COMPLETE_INCREASING,

    DATE_CREATE_DECREASING,
    DATE_CREATE_INCREASING,
}

export const sortItems = (item1: Item, item2: Item, type?: SortType): number => {
    switch (type) {

        case SortType.TITLE_INCREASING:
            return item1.title.localeCompare(item2.title)
        case SortType.TITLE_DECREASING:
            return item2.title.localeCompare(item1.title)

        case SortType.DATE_COMPLETE_INCREASING:
            return +new Date(item1.date_complete) - +new Date(item2.date_complete)
        case SortType.DATE_COMPLETE_DECREASING:
            return +new Date(item2.date_complete) - +new Date(item1.date_complete)

        case SortType.DATE_CREATE_INCREASING:
            return +new Date(item1.date_created) - +new Date(item2.date_created)
        case SortType.DATE_CREATE_DECREASING:
        default:
            return +new Date(item2.date_created) - +new Date(item1.date_created)
    }
}