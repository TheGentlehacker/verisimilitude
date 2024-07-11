import { Verisimilitude } from "./index"

const run_server = async () => {
    const vs_server = await Verisimilitude({})
    await vs_server.onwards()
}

run_server()