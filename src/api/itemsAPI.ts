import {dataFetch} from "./api";
import {Item} from "../types/Item";
import {JSONbinResponse} from "../types/JSONbinResponse";

// Localhost server
let localDB = dataFetch('http://localhost:3004')

// JSON bin server
const jsonbinAPI = dataFetch('https://api.jsonbin.io/v3/b')

// Functions for localhost server
export let load_items = async (): Promise<Item[]> => {
    return await localDB<Item[]>('items');
}

export let load_item_by_id = async (id: string): Promise<Item> => {
    return await localDB<Item>(`items/${id}`);
}

export let post_item = async (item: Item): Promise<Item> => {
    return await localDB<Item>('items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item)
    })
}

export let delete_item = async (id: string): Promise<{}> => {

    return await localDB<{}>('items/' + id, {
        method: 'DELETE'
    })
}

export let update_item = async (id: string, item: Item): Promise<Item> => {
    return await localDB<Item>('items/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item)
    })
}

// If Localhost server is unavailable, then the functions are replaced to fetch data from JSONbin
export const change_API_path = (): void => {
    const warning_text: HTMLParagraphElement = document.createElement('p')
    warning_text.innerText = "Using JSONbin API to store tasks. \n It may take time to fetch data."
    warning_text.style.opacity = "0.3"
    warning_text.style.fontSize = "12px";
    warning_text.style.position = "fixed";
    warning_text.style.bottom = "5px";
    warning_text.style.right = "5px";
    warning_text.style.textAlign = "right"

    document.body.append(warning_text)

    load_items = async (): Promise<Item[]> => {
        return await jsonbinAPI<JSONbinResponse>('643d4670ace6f33a220cf2db', {
            method: 'GET',
            headers: {
                'X-Master-Key': '$2b$10$KaHvykHsLNyRLB/SubZcF.j3TnmR./yJ5VVyqOcikmTeBJ6BTBeEK'
            }
        }).then((response: JSONbinResponse) => response.record.items)
    }

    load_item_by_id = async (id: string): Promise<Item> => {
        return await jsonbinAPI<JSONbinResponse>('643d4670ace6f33a220cf2db', {
            method: 'GET',
            headers: {
                'X-Master-Key': '$2b$10$KaHvykHsLNyRLB/SubZcF.j3TnmR./yJ5VVyqOcikmTeBJ6BTBeEK'
            }
        }).then((response: JSONbinResponse) => {
            const index: number = response.record.items.findIndex((item: Item): boolean => item.id === id)
            return response.record.items[index]
        })
    }

    post_item = async (item: Item): Promise<Item> => {

        const items: Item[] = await load_items()

        return await jsonbinAPI<JSONbinResponse>('643d4670ace6f33a220cf2db', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': '$2b$10$KaHvykHsLNyRLB/SubZcF.j3TnmR./yJ5VVyqOcikmTeBJ6BTBeEK'
            },
            body: JSON.stringify({items: [...items, item]})
        }).then(() => item)
    }

    delete_item = async (id: string): Promise<{}> => {

        let items: Item[] = await load_items()

        items = items.filter((item: Item): boolean => item.id !== id)

        return await jsonbinAPI<JSONbinResponse>('643d4670ace6f33a220cf2db', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': '$2b$10$KaHvykHsLNyRLB/SubZcF.j3TnmR./yJ5VVyqOcikmTeBJ6BTBeEK'
            },
            body: JSON.stringify({items: [...items]})
        }).then(() => ({}))
    }

    update_item = async (id: string, item: Item): Promise<Item> => {

        let items: Item[] = await load_items()

        items = items.map((task: Item): Item => task.id === id ? item : task)

        return await jsonbinAPI<JSONbinResponse>('643d4670ace6f33a220cf2db', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': '$2b$10$KaHvykHsLNyRLB/SubZcF.j3TnmR./yJ5VVyqOcikmTeBJ6BTBeEK'
            },
            body: JSON.stringify({items: [...items]})
        }).then((response: JSONbinResponse) => {
            const index: number = response.record.items.findIndex((item: Item): boolean => item.id === id)
            return response.record.items[index]
        })
    }
}