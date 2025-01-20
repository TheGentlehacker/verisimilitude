import { ZodError } from "zod";
import { DefaultClaimsType, OICDAuthParams, OICDIDTokenRequestParams, OICDWellKnownType, VerisimilitudeConfig, oicdTokenRequestParamsValidator, oidcAuthParamsValidator } from "./util/zodTypes";
import { StoredUser, getCode, user_by_code } from "./userStore";
import * as jose from 'jose'
import { StandardClaims } from "./util/standard_claims";

export interface OICDResponsesType {
    well_known: OICDWellKnownType,
    do_authorization: (params: OICDAuthParams) => URL | {code: number, errors: string},
    get_id_token: (params: OICDIDTokenRequestParams) => any
}

export const OICDResponses = (config: VerisimilitudeConfig): OICDResponsesType => {
    const responseConfig = config
    const logger = config.logger

    function well_known(): OICDWellKnownType {
        const ep = responseConfig.endpoints
        return {
            issuer: responseConfig.issuer,
            authorization_endpoint: new URL(ep.authorization, responseConfig.issuer).toString(),
            token_endpoint: new URL(ep.token, responseConfig.issuer).toString(),
            userinfo_endpoint: new URL(ep.authorization, responseConfig.issuer).toString(),
            jwks_uri: new URL(ep.jwks, responseConfig.issuer).toString(),
        }
    }

    function do_auth(params: OICDAuthParams) {
        try {
            oidcAuthParamsValidator.parse(params)

            const redirect_uri = new URL(params.redirect_uri) as URL
            
            if (params.state) {
                const state = params.state
                console.debug("Auth state param ", state)
                redirect_uri.searchParams.set("state", state)            
            }
    
            const provided_state = params.state || config.requestParams.state
            const provided_client_id = params.client_id || config.requestParams.client_id
            const provided_scopes = params.scope || config.requestParams.scope
    
            const newCode = getCode({
                state: provided_state, 
                client_id: provided_client_id, 
                scope: provided_scopes.split(" ")
            })

            redirect_uri.searchParams.set("code", newCode)
    
            return redirect_uri
        } catch (err) {
            const knownerr = err as ZodError
            const error_json = {
                error: "Invalid Request",
                issues: knownerr.errors.map((e) => { return {
                    parameter: e.path[0],
                    issue: e.message
                }})
            }

            //TODO Maybe make these real error cores according to the docs?
            //https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth
            return ({
                code: 400, 
                errors: JSON.stringify(error_json)
            })
        }
    }

    async function id_token(params: OICDIDTokenRequestParams) {
        try {
            oicdTokenRequestParamsValidator.parse(params)

            const user = user_by_code({code: params.code})

            const user_claim_data = process_claims(user)
            const standard_claims = process_standard_claims(user)

            user.user_details = {...user_claim_data.claim_data,  ...user.user_details}
            const claims = {
                ...user_claim_data.claim_data,
                ...standard_claims
            }

            logger.debug(`Responding to code ${params.code} with the following claims`)
            logger.debug(JSON.stringify(claims))

            const signingKey = new TextEncoder().encode(responseConfig.client.secret)
            const alg = "HS256"
            const jwt = await new jose.SignJWT(claims)
                .setProtectedHeader({alg})
                .sign(signingKey)

            logger.debug("Signed ID_token ", jwt)

            return {
                token_type: "Bearer",
                id_token: jwt,
                access_token: "five",
                refresh_token: "HowEfficatious",
                expires_in: 2400
            }

        } catch (err) {
            logger.warn("Could not issue ID token")
            const knownerr = err as ZodError
            logger.warn(knownerr.toString())

            const error_json = {
                error: "Invalid Request",
                issues: knownerr.errors.map((e) => { return {
                    parameter: e.path[0],
                    issue: e.message
                }})
            }

            //TODO Maybe make these real error cores according to the docs?
            //https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth
            return ({
                code: 400, 
                errors: JSON.stringify(error_json)
            })
        }
    }

    function process_claims(user: StoredUser) {
        const skipped_claims: Array<string> = [];
        const claim_data: Record<string, string | number> = {}

        const claims = user.request_details?.scope?.map((scope) => {
            const keyedScope = scope as keyof DefaultClaimsType
            if (responseConfig.defaultClaims[keyedScope]) {
                return responseConfig.defaultClaims[keyedScope]
            }
        }).filter((record) => {
            return (record && record.length != 0)
        }).flat() as Array<string>

        claims.forEach((claim) => {
            if (user.user_details && user.user_details[claim]) {
                console.log("User details already defined for ", claim)
                console.log(user.user_details[claim])
                claim_data[claim] = user.user_details[claim]
            } else if (StandardClaims[claim]) {
                console.log("Standard claim exists for ", claim)
                claim_data[claim] = StandardClaims[claim]()
                console.log(claim_data[claim])
            } else {
                skipped_claims.push(claim);
            }
            })
    
        if (skipped_claims) {
            logger.info("Skipped unfulfillable claims: ", skipped_claims);
            return {claim_data: claim_data, skipped_claims: skipped_claims}
        } else {
            return {claim_data: claim_data}
        }
    }
    
    function process_standard_claims(user: StoredUser) {
        const current_time = Math.round(Date.now() / 1000)

        const claims: Record<string, string | number> = {
            iss: responseConfig.issuer,
            sub: user.user_details?.sub || "FAKESUB",
            aud: responseConfig.client.id,
            exp: current_time + 2400,
            iat: current_time,
            // auth_time: current_time - 200
        }

        if (user.request_details?.nonce) {claims.nonce = user.request_details.nonce}

        return claims
    }

    return {
        well_known: well_known(),
        do_authorization: do_auth,
        get_id_token: id_token
    }
}

