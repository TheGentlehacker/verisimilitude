import { AddressInfo } from "node:net"
import { Verisimilitude } from "./index"

const run_server = async () => {
    const {server, host, port} = Verisimilitude({})

    try {
        await server.listen({
            port: port,
            host: host,
            listenTextResolver: (address) => { return `Verisimilitude is receiving visitors at ${address}`}
        })

        const server_details = server.server.address() as AddressInfo
        console.log("Verisimilitude is receiving %s callers at port %d of %s", server_details.family, server_details.port, server_details.address)
    } catch ( err ) {
        console.log("Something went wrong")
        console.log(err)
        server.log.error(err)
        process.exit(1)
    }
}

run_server()