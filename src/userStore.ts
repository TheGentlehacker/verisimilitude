import { nanoid } from "nanoid"


export interface StoredUser {
    state?: string,
    client?: string
}

export const UserStore: Record<string, StoredUser> = {

}

export const getCode = ({state, client}: StoredUser) => {
    const newCode = nanoid()
    UserStore["code"] = {state: state, client: client}

    return newCode
} 