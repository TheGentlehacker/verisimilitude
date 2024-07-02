import { ZodError } from "zod";
import { OICDAuthParams, OICDWellKnownType, VerisimilitudeConfig, oidcAuthParamsValidator } from "./util/zodTypes";
import { getCode } from "./userStore";

export interface OICDResponsesType {
    well_known: OICDWellKnownType,
    do_authorization: (params: OICDAuthParams) => URL | {code: number, errors: string}
}

export const OICDResponses = (config: VerisimilitudeConfig): OICDResponsesType => {
    const responseConfig = config

    function well_known(): OICDWellKnownType {
        return {
            issuer: responseConfig.issuer,
            ...responseConfig.endpoints,
        }
    }

     function do_auth(params: OICDAuthParams) {
        try {
            oidcAuthParamsValidator.parse(params)

            const redirect_uri = new URL(params.redirect_uri) as URL
            console.debug("Auth redirect_uri param ", redirect_uri)
            
            if (params.state) {
                const state = params.state
                console.debug("Auth state param ", state)
                redirect_uri.searchParams.set("state", state)            
            }
    
            const providedState = params.state || config.requestParams.state
            const providedClientID = params.client_id || config.requestParams.client_id
    
            const newCode = getCode({state: providedState, client: providedClientID})
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

    return {
        well_known: well_known(),
        do_authorization: do_auth
    }
}