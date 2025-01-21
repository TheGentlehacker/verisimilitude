import { z } from "zod";

export const authCodeResponse = z.object({
    access_token: z.string(),
    token_type: z.string(),
    expires_in: z.number(),
    refresh_token: z.string()
})

export const responseTypeEnum = z.enum(["code", "token", "id_token"])
export const responseTypes = z.union([responseTypeEnum, z.array(responseTypeEnum)])

const oicdWellKnown = z.object({
    issuer: z.string().url(),
    authorization_endpoint: z.string(),
    token_endpoint: z.string(),
    userinfo_endpoint: z.string(),
    jwks_uri: z.string().url(),
    response_types_supported: z.string()
})

// TODO ACR claim, AZP claim
export const oidcAuthParamsValidator = z.object({
    response_type: z.literal("code", {message: "MUST be `code` for the Authorization Code Flow"}),
    scope: z.string().includes("openid", {message: "Scope MUST contain `openid`"}),
    client_id: z.string(),
    redirect_uri: z.string().url(),
    state: z.optional(z.string()),
    max_age: z.optional(z.number()),
    nonce: z.optional(z.string()),
    claims: z.optional(z.array(z.string()))
})

// TODO implement the rest of the optional properties as listed
// https://openid.net/specs/openid-connect-core-1_0.html#IDToken
export const oicdIDTokenParamsValidator = z.object({
    iss: z.string(),
    sub: z.string(),
    aud: z.string(),
    exp: z.number().positive().int().finite(),
    iat: z.number().positive().int().finite(),
    auth_time: z.optional(z.number().positive().int().finite()),
    nonce: z.optional(z.string()),
})

export const LoggerValidator = z.object({
    debug: z.function().args(z.string()).returns(z.void()),
    info: z.function().args(z.string()).returns(z.void()),
    warn: z.function().args(z.string()).returns(z.void()),
    error: z.function().args(z.string()).returns(z.void()),
    fatal: z.function().args(z.string()).returns(z.void()),
})

export const LoggerConfigValidator = LoggerValidator.partial()

export const defaultClaimsValidator = z.object({
    profile: z.optional(z.array(z.string())),
    email: z.optional(z.array(z.string())),
    address: z.optional(z.array(z.string())),
    phone: z.optional(z.array(z.string())),
})

export const VerisimilitudeConfigValidator = z.object({
    allowInProduction: z.boolean(),
    issuer: z.string().url(),
    endpoints: z.object({
        authorization: z.string(),
        token: z.string(),
        userinfo: z.string(),
        jwks: z.string().url(),
    }),
    responseTypesSupported: responseTypes,
    requestParams: oidcAuthParamsValidator.omit({redirect_uri: true}),
    defaultClaims: defaultClaimsValidator,
    logger: LoggerValidator,
    server: z.object({
        host: z.string(),
        port: z.number().gt(1024).lt(65535)
    }),
    client: z.object({
        id: z.string(),
        secret: z.string()
    })
})

export const VerisimilitudeConfigOptionsZod = VerisimilitudeConfigValidator.partial()

export const oicdTokenRequestParamsValidator = z.object({
    grant_type: z.literal("authorization_code"),
    code: z.string(),
    redirect_uri: z.optional(z.string().url())
})

export const oicdClaimsValidator = z.object({
    sub: z.string(),

})

export type DefaultClaimsType = z.infer<typeof defaultClaimsValidator>
export type LoggerType = z.infer<typeof LoggerValidator>
export type OICDAuthParams = z.infer<typeof oidcAuthParamsValidator>
export type OICDResponseTypes = z.infer<typeof responseTypes>
export type OICDIDTokenParams = z.infer<typeof oicdIDTokenParamsValidator>
export type OICDIDTokenRequestParams = z.infer<typeof oicdTokenRequestParamsValidator>
export type OICDWellKnownType = z.infer<typeof oicdWellKnown>
export type VerisimilitudeConfig = z.infer<typeof VerisimilitudeConfigValidator>
export type VerisimilitudeConfigOptions = z.infer<typeof VerisimilitudeConfigOptionsZod>