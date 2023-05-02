import {dataFetch} from "./api";
import {Item} from "../types/Item";

let serverAPI = dataFetch('http://localhost:3004')

// Functions for localhost server
export let load_items = async (): Promise<Item[]> => {
    return await serverAPI<Item[]>('items_simple');
}

export let load_item_by_id = async (id: string): Promise<Item> => {
    return await serverAPI<Item>(`items_simple/${id}`);
}

export let post_item = async (item: Item): Promise<Item> => {
    return await serverAPI<Item>('items_simple', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item)
    })
}

export let delete_item = async (id: string): Promise<{}> => {

    return await serverAPI<{}>('items_simple/' + id, {
        method: 'DELETE'
    })
}

export let update_item = async (id: string, item: Item): Promise<Item> => {

    return await serverAPI<Item>('items_simple/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item)
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

    serverAPI = dataFetch('https://brainy-hem-lion.cyclic.app')
}