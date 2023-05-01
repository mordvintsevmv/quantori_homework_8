import {Item} from "./Item";

export interface JSONbinResponse {
    record: {
        items: Item[],
    },
    metadata: {
        id: string,
        createdAt: string,
        private: boolean
    }
}

