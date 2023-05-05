export interface Item {
    id: string,
    isChecked: boolean,
    title: string,
    tag: string[],
    date_complete: string,
    date_created: string
}

export interface ItemAny {
    id?: string,
    isChecked?: boolean,
    title?: string,
    tag?: string[],
    date_complete?: string,
    date_created?: string
}