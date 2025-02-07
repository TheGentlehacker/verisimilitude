import { SpecificationDefaultClaims } from "./util/default_claims"
import { VerisimilitudeConfig } from "./util/zodTypes"

export const defaultConfig: VerisimilitudeConfig = {
    allowInProduction: false,
    issuer: "http://localhost:4444",
    endpoints: {
        authorization: "/my_card_sir",
        token: "/kindly_give_me_a_token",
        userinfo: "/who_is_this_fellow",
        jwks: "/letter_of_introduction.json"
    },
    requestParams: {
        client_id: "a_very_good_friend_and_client_of_mine",
    },
    responseTypesSupported: "code",
    defaultClaims: SpecificationDefaultClaims,
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
    },
    client: {
        id: "a_very_good_friend",
        secret: "allhushhush"
    }

}

