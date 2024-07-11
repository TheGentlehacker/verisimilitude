import { DefaultClaimsType } from "./zodTypes";

export const SpecificationDefaultClaims: DefaultClaimsType = {
    /**
     * Default claims (mostly) for the Profile scope, as specified in the specification.
     * 
     * @see {@link https://openid.net/specs/openid-connect-core-1_0.html#ScopeClaims}
     * 
     * @remarks
     * 
     * After much consideration, `gender` has been included here, with a caveat.
     * You are requesting information from an external system, which may have a
     * different understanding of the concept. Thus, the automatic generation
     * of gender values does not hew to any list of enums... and neither do 
     * most other values, for that matter.
     *  
     */
    profile: [
        "name", "family_name", "given_name", "middle_name",
        "nickname", "preferred_username", "profile", "picture", "website", 
        "gender", "birthdate", "zoneinfo", "locale", "updated_at",
    ],
    email: ["email", "email_verified"],
    address: ["address"],
    phone: ["phone_number", "phone_number_verified"]
}