# Verisimilitude
---
Verisimilitude is your trusted confidant, an OIDC assistant making tests faster, easier & more efficacious via an in-memory implementation executing the functions of an OpenID Provider. Poorly.

### What is it good for?
Such an excellent question! Verisimilitude is suitable for an exciting range of functions, including:
* Test Acceleration
* ...

### What is it not good for?
Oh heavens, most everything. I shouldn't rely on it for any of the following:
* Actual user authentication
* Testing OAuth clients
* Critical infrastructure protection
* Emotional Support
* Paying back that money it owes, it's very sorry, could it beg your indulgence just a little longer?

### Why?
Why not.

### No seriously, why.
User authentication often causes significant vexation during the testing process, which is only compounded by the use of external user authentication such as OAuth (eg _sign in with Google/Facebook_).

*Firstly*, automating these systems can be difficult-to-impossible, especially if the authentication service is completely external. While this can be mitigated through the use of a local, containerized OAuth provider during development (such as the splendid (Keycloak)[https://www.keycloak.org/]), this is not the only issue, as...

*Secondly*, authentication complicates the endowment of tests with the virtues of being Atomic, Rapid and Repeatable. Which is a shame, as fast, reliable tests bring much joy and delivery speed to all the ~~children~~ testers and developers. How, you may ask? Well, mocking authentication means you're no longer testing reality. Contrariwise, _not_ mocking authentication typically compels you to either retain a login session from the first test ran (introducing unwanted dependencies) or log in before _every_ test (introducing needless delay).

Verisimilitude takes the position that tests should have their own concerns, independent of login. As such, it provides an in-memory OAuth server with _just enough_ features to complete an OICD authentication flow, during which it blithely ignores most of the *MUST*s, *SHOULD*s and *WILL*s of the specification before returning you details for a completely fanciful user.

## Making use of Verisimilitude

### Installation and Setup

```npm install --save-dev verisimilitude```