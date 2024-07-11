import type { VerisimilitudeConfigOptions } from "./util/zodTypes"
import { OICDResponses } from "./OICDResponses"
import { FastifyServer } from "./server"
import { defaultConfig } from "./config"
import { assertNotProduction } from "./util/assert"

let port = 4444
let host = "localhost"

export const Verisimilitude = (config: VerisimilitudeConfigOptions) => {
    const mergedConfig = {...defaultConfig, ...config}
    assertNotProduction(mergedConfig)
    const responses = OICDResponses(mergedConfig)

    const server = FastifyServer(mergedConfig, responses)
    
    port = mergedConfig.server.port
    host = mergedConfig.server.host

    return {server: server, host: host, port: port}
}

// const run_server = async () => {
//     const server = Verisimilitude({})

//     try {
//         await server.listen({
//             port: port,
//             host: host,
//             listenTextResolver: (address) => { return `Verisimilitude is receiving visitors at ${address}`}
//         })

//         console.log("Verisimilitude is receiving visitors at", server.server.address())
//     } catch ( err ) {
//         console.log("Something went wrong")
//         console.log(err)
//         server.log.error(err)
//         process.exit(1)
//     }
// }

// run_server()