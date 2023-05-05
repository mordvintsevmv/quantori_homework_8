import {Item, ItemAny} from "../types/Item";
import axios, {AxiosRequestConfig, AxiosResponse} from "axios";

const axiosItemsConfig: AxiosRequestConfig = {
    baseURL: 'http://localhost:3004',
}

export const serverAPI = axios.create(axiosItemsConfig)

export let serverFetchItems = async (): Promise<Item[]> => {
    return await serverAPI.get('items')
        .then((response: AxiosResponse<Item[]>) => {
            return response.data
        })
}

export let serverFetchById = async (id: string): Promise<Item> => {
    return await serverAPI.get(`items/${id}`)
        .then((response: AxiosResponse<Item>) => {
            return response.data
        })
}

export let serverPostItem = async (item: Item): Promise<Item> => {
    return await serverAPI.post('items', item)
        .then((response: AxiosResponse<Item>) => {
            return response.data
        })
}

export let serverDeleteItem = async (id: string): Promise<{}> => {
    return await serverAPI.delete(`items/${id}`)
        .then((response: AxiosResponse<Item>) => {
            return response.data
        })
}

export let serverUpdateItem = async (id: string, updatedFields: ItemAny): Promise<Item> => {
    return await serverAPI.patch(`items/${id}`, updatedFields)
        .then((response: AxiosResponse<Item>) => {
            return response.data
        })
}

export const change_API_path = (): void => {
    const warning_text: HTMLParagraphElement = document.createElement('p')
    warning_text.innerText = "Fetching data from remote server"
    warning_text.style.opacity = "0.3"
    warning_text.style.fontSize = "12px";
    warning_text.style.position = "fixed";
    warning_text.style.bottom = "5px";
    warning_text.style.right = "5px";
    warning_text.style.textAlign = "right"

    document.body.append(warning_text)

    serverAPI.defaults.baseURL = "https://brainy-hem-lion.cyclic.app"
}