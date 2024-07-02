import { VerisimilitudeConfig } from "./util/zodTypes"

export const defaultConfig: VerisimilitudeConfig = {
    allowInProduction: false,
    issuer: "http://localhost",
    endpoints: {
        authorization_endpoint: "/my_card_sir",
        token_endpoint: "/kindly_give_me_a_token",
        userinfo_endpoint: "/who_is_this_fellow"
    },
    requestParams: {
        response_type: "code",
        scope: "openid email",
        client_id: "a_very_good_friend_and_client_of_mine",
        state: "botheration"
    },
    logger: {
        debug: (message: string) => {console.debug(message)},
        warn: (message: string) => {console.warn(message)},
        info: (message: string) => {console.info(message)},
        error: (message: string) => {console.error(message)},
        fatal: (message: string) => {console.error(message)}
    },
    server: {
        host: "localhost",
        port: 4444
    }

}