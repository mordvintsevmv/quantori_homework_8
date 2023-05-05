export interface Item {
    id: string,
    isChecked: boolean,
    title: string,
    tag: string[],
    description: string,
    subtasks: ItemSubtask[],
    date_complete: string,
    date_created: string
}

export interface ItemAny {
    isChecked?: boolean,
    title?: string,
    tag?: string[],
    description?: string,
    subtasks?: ItemSubtask[],
    date_complete?: string,
    date_created?: string
}

export interface ItemSubtask {
    id: string,
    title: string,
    isChecked: boolean
}

export interface ItemSubtaskAny {
    title?: string,
    isChecked?: boolean
}