import { rand, randAirline, randAnimal, randBoolean, randColor, randEmail, randFirstName, randFood, randFullAddress, randJobType, randLastName, randLocale, randPastDate, randPersonTitle, randPhoneNumber, randProgrammingLanguage, randSuperheroName, randTimeZone, randUrl } from "@ngneat/falso";
import { nanoid } from "nanoid";
import { StoredUser } from "../userStore";
import gaussian from "gaussian";

export const StandardClaims: Record<string, Function> = {
    "sub": () => {
        return nanoid();
    },
    "name": (user_details?: Record<string, string>) => {
        let name = [];
        if (user_details) {
            if (randBoolean()) {
                name.push(randPersonTitle());
            }

            const given_name = user_details.given_name;
            const middle_name = user_details.middle_name;
            const family_name = user_details.family_name;

            if (given_name) { name.push(given_name); }
            if (middle_name) { name.push(middle_name); }
            if (family_name) { name.push(family_name); }
        }

        return name.join(" ");
    },
    "given_name": () => {
        const times = new Array<string>(random_name_n());
        return (times.reduce((prev, current) => {
            return prev.concat(` ${randFirstName({ withAccents: true })}`);
        }, "")
        );
    },
    "family_name": () => {
        get_n_names(() => { return randLastName({ withAccents: true }); });
    },
    "middle_name": () => {
        get_n_names(() => { return randFirstName({ withAccents: true }); });
    },
    "nickname": () => {
        return rand([
            () => { return randAnimal(); },
            () => { return randFood(); },
            () => { return randSuperheroName(); },
            () => { return randAirline(); },
        ])();
    },
    "preferred_username": () => {
        const adjective = rand([randProgrammingLanguage, randColor, randAirline]);

        // Typescript was displeased that these take different Optional Options.
        const noun = rand([
            () => { return randAnimal(); },
            () => { return randFood(); },
            () => { return randSuperheroName(); },
            () => { return randJobType(); },
        ]);
        return `${adjective()}${noun()}`;
    },
    "profile": () => {
        return randUrl();
    },
    "picture": () => {
        return randUrl();
    },
    "website": () => {
        return randUrl();
    },
    "email": () => {
        return randEmail();
    },
    "email_verified": () => {
        return randBoolean();
    },
    "birthdate": () => {
        return randPastDate({ length: 13 });
    },
    "zoneinfo": () => {
        randTimeZone();
    },
    "locale": () => {
        randLocale();
    },
    "phone_number": () => {
        randPhoneNumber();
    },
    "phone_number_verified": () => {
        randBoolean();
    },
    "address": () => {
        randFullAddress({ includeCounty: true, includeCountry: true });
    }
};

export function random_name_n() {
    let distribution = gaussian(0, 1.69)
    return Math.floor(Math.abs(distribution.random(1)[0]))
}

export function get_n_names(nameFunction: Function) {
    const times = new Array<string>(random_name_n())
    return (times.reduce((prev, current) => {
        return prev.concat(` ${nameFunction()}`)
    }, ""))
}