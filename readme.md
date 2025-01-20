# Verisimilitude
---
Verisimilitude is your trusted confidant, an OIDC assistant making tests faster, easier & more efficacious via an in-memory implementation executing the functions of an OpenID Provider. Poorly.

### What is it good for?
Such an excellent question! Verisimilitude is suitable for an exciting range of functions, including:
* Test Acceleration
* OIDC Development Support
* ...

### What is it not good for?
Oh heavens, most everything. I shouldn't rely on it for any of the following:
* Actual user authentication
* Testing OAuth clients
* Critical infrastructure protection
* Emotional Support
* Paying back that money it owes, it's very sorry, could it beg your indulgence just a little longer?

# Getting Started with Verisimilitude

Verisimilitude is ready to use as soon as it's delivered from your preferred Software Atelier. Here's what you'll need to do.

### Firstly, run Verisimilitude standalone
```
npx verisimilitude@latest
``` 
> [!TIP]
> Verisimilitude is ready when you see the text such as `Verisimilitude is receiving IPv6 callers at port 4444 of ::1`

### Secondly, configure your project to use Verisimilitude as an OIDC provider.
While this step depends on the particulars of your application, at the _very_ least you'll need to configure:

* The `Issuer`, which is the address and port which Verisimilitude reported upon starting
* Your `Client ID`, which defaults to `a_very_good_friend`
* Your `Client Secret`, which defaults to `hushhush` 

For instance, here is how you might configure a SvelteKit project using [Auth.JS](https://authjs.dev/):

```typescript
import { SvelteKitAuth } from "@auth/sveltekit"

export const { handle, signIn } = SvelteKitAuth({
    providers: [
        ({
            id: "verisimilitude",
            name: "Verisimilitude",
            type: "oidc",
            issuer: "http://localhost:4444",
            clientId: 'a_very_good_friend',
            clientSecret: 'hushhush',
            client: {
                id_token_signed_response_alg: "HS256"
            }    
        })
    ]
})
```
### You are now well prepared.
When you or your automated tests log in with Verisimilitude, you'll be sped through the authentication process lickety-split, ending up with a lovely, valid session for a completely imaginary user whose details have all been generated on the fly.

# Installation and Usage
## Running Standalone (no project install)

Assuming you have `npm` installed, you can use `npx` to run Verisimilitude bound to `localhost`, with the default configuration, on port `4444`:

```
npx verisimilitude@latest

-------------------------

gentlehacker@diff_engine ~ % npx verisimilitude@latest
Need to install the following packages:
verisimilitude@0.0.4
Ok to proceed? (y) y

Verisimilitude is receiving IPv6 callers at port 4444, ::1
```

## Running Standalone (installed in your project)

Once you've installed Verisimilitude with the package manager of your choice, run the `verisimilitude` executable:

> [!CAUTION]
> Do not install verisimilitude in your `dependencies`; It is only suitable for development. I implore you take heed of this warning.

```
npm install --save-dev verisimilitude@latest
npm exec verisimilitude

---------------------------------------------
gentlehacker@diff_engine npm install --save-dev verisimilitude@latest
gentlehacker@diff_engine npm exec verisimilitude
Verisimilitude is receiving IPv6 callers at port 4444, ::1
```

## Running as part of your project

You can also run Verisimilitude integrated into your project. This mode still starts a server (Verisimilitude uses [Fastify](https://fastify.dev) internally) but makes it easier to supply config and spin up tests etc.

All you need do is require `Verisimilitude`, optionally configure it, and await the `onwards` method:

```typescript
import { Verisimilitude } from "./index"

const run_server = async () => {
    const vs_server = await Verisimilitude({})
    await vs_server.onwards()
}

run_server()
```

## Configuration & Customization 

`Verisimilitude` is exceedingly considerate and would never dream of preventing you from exercising OIDC as you wish. As such, the function takes a single object of type `VerisimilitudeConfigOptions` from which you can change most of the non-protocol-specific behaviour.

```typescript
const run_server = async () => {
    const vs_server = await Verisimilitude({
        server: {
            host: "dev.difference_engine.local",
            port: "6323"
        }
    })
}
```

### Options

| Object | Nested Property | Purpose | Default |
| ------- | :----------: |:---------: | :--------: |
| `allowInProduction` | | Preventing foolish mistakes | `false` |
| `issuer` | | Issuer value to list under `.well_known` | `http://localhost:4444` | 
| `endpoints` | | Path to host OIDC Endpoints |  |
| | `authorization` | Path for user authorization | `/my_card_sir` |
|| `token` | Path for ID & Access Token generation | `/kindly_give_me_a_token` |
|| `userinfo` | Path for user info | `/who_is_this_fellow` |
|| `jwks` | Path for JWKS document | `/letter_of_introduction.json` |
| `requestParams` | | | _see below_ |
| `defaultClaims` | | | _see below_ |
| `logger` | | Integrate with custom logger | _see below_ |
| `server` | | Configure the server address |  |
| | ` host` | Server Hostname | `localhost` |
| | `port` | Server Port | `4444` |
| `client` | | Client access details | | 
| | `id` | Client ID | `a_very_good_friend` |
| | `secret` | Client Secret | `allhushhush` |

#### requestParams
Coming soon

#### defaultClaims
Coming soon

#### logger
Coming soon

## Why?
Why not.

### No seriously, why.
User authentication often causes significant vexation during the testing process, which is only compounded by the use of external user authentication such as OAuth (eg _sign in with Google/Facebook_).

*Firstly*, automating these systems can be difficult-to-impossible, especially if the authentication service is completely external. While this can be mitigated through the use of a local, containerized OAuth provider during development (such as the splendid [Keycloak](https://www.keycloak.org/)), these still require substantial setup and comprise a fairly heavy dependency to include during development and CI/CD.

*Secondly*, authentication complicates the endowment of tests with the virtues of being Atomic, Rapid and Repeatable. Which is a shame, as fast, reliable tests bring much joy and delivery speed to all the ~~children~~ testers and developers. How, you may ask? Well, mocking authentication means you're no longer testing reality. Contrariwise, _not_ mocking authentication typically compels you to either retain a login session from the first test ran (introducing unwanted dependencies) or log in before _every_ test (introducing needless delay).

Verisimilitude takes the position that tests which aren't specifically login tests have their own concerns. As such, it provides an in-memory OAuth server with _just enough_ features to complete an OICD authentication flow, during which it blithely ignores most of the *MUST*s, *SHOULD*s and *WILL*s of the specification before returning you details for a completely fanciful user.

# Help! I am receiving a Vexatious Response.

## Running in production is inadvisable. Should you insist, add 'allowInProduction: true' to your config, and may the angels spare you.`

Yes indeed; Read the error, and don't do that.

### I insist, my good hacker, I insist!

_sigh_ Very well. If you set the `allowInProduction` config value to `true`, you can disable environment checks altogether, although I must say it seems very ill-advised.

```typescript
const run_server = async () => {
    const vs_server = await Verisimilitude({
        allowInProduction: true
    })
}
```