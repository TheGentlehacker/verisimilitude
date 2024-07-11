import { AddressInfo } from "net";
import { VerisimilitudeConfigOptions } from "./util/zodTypes";
import { VerisimilitudeEngine } from "./verisimilitude";

export const Verisimilitude = async ( config?: VerisimilitudeConfigOptions ) => {
    const {vs_server, host, port} = await VerisimilitudeEngine(config)

    return {
        onwards: async () => {
            try {
                await vs_server.listen({
                    port: port,
                    host: host,
                })
        
                const server_details = vs_server.server.address() as AddressInfo
                console.log("Verisimilitude is receiving %s callers at port %d of %s", server_details.family, server_details.port, server_details.address)
            } catch ( err ) {
                console.log("Something went wrong")
                console.log(err)
                vs_server.log.error(err)
                process.exit(1)
            }
        }
    }

}