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

## Running Standalone (no project install)

Assuming you have `npm` installed, you can use `npx` to run Verisimilitude bound to `localhost`, with the default configuration, on port `4444`:

```
npx verisimilitude@latest

-------------------------

gentlehacker@diff_engine ~ % npx verisimilitude@latest
Need to install the following packages:
verisimilitude@0.0.4
Ok to proceed? (y) y

Verisimilitude is receiving visitors at { address: '::1', family: 'IPv6', port: 4444 }
```

## Running Standalone (installed in your project)

Once you've installed Verisimilitude with the package manager of your choice, run the `verisimilitude` executable:

> [!CAUTION]
> Do not install versimilitude in your `dependencies`; It is only suitable for development. I implore you take heed of this warning.

```
npm install --save-dev verisimilitude@latest
npm exec verisimilitude

---------------------------------------------
gentlehacker@diff_engine npm install --save-dev verisimilitude@latest
gentlehacker@diff_engine npm exec verisimilitude
Verisimilitude is receiving visitors at { address: '::1', family: 'IPv6', port: 4444 }
```

## Setup

Require 

### Why?
Why not.

### No seriously, why.
User authentication often causes significant vexation during the testing process, which is only compounded by the use of external user authentication such as OAuth (eg _sign in with Google/Facebook_).

*Firstly*, automating these systems can be difficult-to-impossible, especially if the authentication service is completely external. While this can be mitigated through the use of a local, containerized OAuth provider during development (such as the splendid (Keycloak)[https://www.keycloak.org/]), this is not the only issue, as poor 

*Secondly*, authentication complicates the endowment of tests with the virtues of being Atomic, Rapid and Repeatable. Which is a shame, as fast, reliable tests bring much joy and delivery speed to all the ~~children~~ testers and developers. How, you may ask? Well, mocking authentication means you're no longer testing reality. Contrariwise, _not_ mocking authentication typically compels you to either retain a login session from the first test ran (introducing unwanted dependencies) or log in before _every_ test (introducing needless delay).

Verisimilitude takes the position that tests should have their own concerns, independent of login. As such, it provides an in-memory OAuth server with _just enough_ features to complete an OICD authentication flow, during which it blithely ignores most of the *MUST*s, *SHOULD*s and *WILL*s of the specification before returning you details for a completely fanciful user.

