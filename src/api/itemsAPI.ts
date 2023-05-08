import {Item, ItemAny, ItemSubtask, ItemSubtaskAny} from "../types/Item";
import axios, {AxiosRequestConfig, AxiosResponse} from "axios";

const axiosItemsConfig: AxiosRequestConfig = {
    baseURL: 'http://localhost:3004',
}

export const serverAPI = axios.create(axiosItemsConfig)

export const serverFetchItems = async (): Promise<Item[]> => {
    return await serverAPI.get('items')
        .then((response: AxiosResponse<Item[]>) => {
            return response.data
        })
}

export const serverFetchById = async (id: string): Promise<Item> => {
    return await serverAPI.get(`items/${id}`)
        .then((response: AxiosResponse<Item>) => {
            return response.data
        })
}

export const serverPostItem = async (item: Item): Promise<Item> => {
    return await serverAPI.post('items', item)
        .then((response: AxiosResponse<Item>) => {
            return response.data
        })
}

export const serverDeleteItem = async (id: string): Promise<{}> => {
    return await serverAPI.delete(`items/${id}`)
        .then((response: AxiosResponse<Item>) => {
            return response.data
        })
}

export const serverUpdateItem = async (id: string, updatedFields: ItemAny): Promise<Item> => {
    return await serverAPI.patch(`items/${id}`, updatedFields)
        .then((response: AxiosResponse<Item>) => {
            return response.data
        })
}

export const serverFetchSubtasks = async (item_id: string): Promise<ItemSubtask[]> => {
    return await serverAPI.get(`items/${item_id}`)
        .then((response: AxiosResponse<Item>) => {
            return response.data.subtasks
        })
}

export const serverCreateSubtask = async (item_id: string, subtask: ItemSubtask): Promise<Item> => {

    const subtasks = await serverFetchSubtasks(item_id)

    const edited_sub = [...subtasks, subtask]

    return await serverAPI.patch(`items/${item_id}`, {subtasks: edited_sub})
        .then((response: AxiosResponse<Item>) => {
            return response.data
        })
}

export const serverDeleteSubtask = async (item_id: string, subtask_id: string): Promise<Item> => {

    const subtasks = await serverFetchSubtasks(item_id)

    const edited_sub = subtasks.filter(task => task.id !== subtask_id)

    return await serverAPI.patch(`items/${item_id}`, {subtasks: edited_sub})
        .then((response: AxiosResponse<Item>) => {
            return response.data
        })
}

export const serverUpdateSubtask = async (item_id: string, subtask_id: string, updatedFields: ItemSubtaskAny): Promise<Item> => {

    const subtasks = await serverFetchSubtasks(item_id)
    const edited_sub = subtasks.map(task => task.id !== subtask_id ? task : {...task, ...updatedFields})
    return await serverAPI.patch(`items/${item_id}`, {subtasks: edited_sub})
        .then((response: AxiosResponse<Item>) => {
            return response.data
        })
}

export const change_API_path = (): void => {
    const warning_text: HTMLParagraphElement = document.createElement('p')
    warning_text.innerText = "Fetching data from remote server"
    warning_text.style.color = "#838383"
    warning_text.style.fontSize = "12px";
    warning_text.style.position = "fixed";
    warning_text.style.bottom = "5px";
    warning_text.style.right = "5px";
    warning_text.style.textAlign = "right"

    document.body.append(warning_text)

    serverAPI.defaults.baseURL = "https://brainy-hem-lion.cyclic.app"
}