import { randAddress, randAvatar, randEmail, randFullName } from "@ngneat/falso"
import { nanoid } from "nanoid"
import gaussian from "gaussian"


// export interface StoredUser {
//     state?: string,
//     client?: string,
//     name
// }

export interface RequestDetails {
    state?: string,
    client_id?: string,
    nonce?: string,
    scope?: Array<string>
}

export type StoredUser = {
    request_details?: RequestDetails,
    user_details?: Record<string, string | number>
}

export const UserStore: Record<string, StoredUser> = {}

export const getCode = (request_details: RequestDetails) => {
    const newCode = nanoid()
    UserStore[newCode] =  {request_details} 

    return newCode
} 

export const user_by_code = ({code}: {code: string}) => {
    console.log(`Retrieving ${code} from UserStore`)
    console.log(UserStore)
    let user = UserStore[code]

    if (!user) {
        // user = {}
        UserStore[code] = user = {}
    } else if(! user.user_details) {
        user.user_details = {
            name: randFullName(),
            email: randEmail()
        }
    }

    return user
}

