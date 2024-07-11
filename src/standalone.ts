import { Verisimilitude } from "./index"

const run_server = async () => {
    const {server, host, port} = Verisimilitude({})

    try {
        await server.listen({
            port: port,
            host: host,
            listenTextResolver: (address) => { return `Verisimilitude is receiving visitors at ${address}`}
        })

        console.log("Verisimilitude is receiving visitors at", server.server.address())
    } catch ( err ) {
        console.log("Something went wrong")
        console.log(err)
        server.log.error(err)
        process.exit(1)
    }
}

run_server()