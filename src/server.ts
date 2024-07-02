import Fastify, { FastifyInstance } from 'fastify'
import { VerisimilitudeConfig } from './util/zodTypes'
import type { OICDAuthParams } from './util/zodTypes'
import { OICDResponsesType } from './OICDResponses'

export const FastifyServer = (config: VerisimilitudeConfig, responses: OICDResponsesType) => {
    const logger = config.logger
    // const fastify: FastifyInstance = Fastify({logger: true})
    const fastify: FastifyInstance = Fastify({logger: true})

    fastify.get('/.well-known/openid-configuration', async function handler (request, reply) { 
        reply.code(200).send({...responses.well_known})
    }) 

    fastify.get<{
        Querystring: OICDAuthParams
    }>(config.endpoints.authorization_endpoint, async function handler (request, reply) {
        logger.debug(`GET ${config.endpoints.authorization_endpoint} called with query`, request.query)
        const reply_details = responses.do_authorization(request.query)

        if ("errors" in reply_details ) {
            reply.code(reply_details.code).send(reply_details.errors)
        } else {
            reply.redirect(reply_details.href)
        }
    })

    fastify.post<{
        Params: OICDAuthParams
    }>(config.endpoints.authorization_endpoint, async function handler (request, reply) {
        logger.debug(`POST ${config.endpoints.authorization_endpoint} called with params ${request.params}`)
        const reply_details = responses.do_authorization(request.params)

        if ("errors" in reply_details ) {
            reply.code(reply_details.code).send(reply_details.errors)
        } else {
            reply.redirect(reply_details.href)
        }
    })

    fastify.post(config.endpoints.token_endpoint, async function handler (request, reply) {  // eslint-disable-line @typescript-eslint/no-unused-vars
        return {

        }
    })

    fastify.post(config.endpoints.userinfo_endpoint, async function handler (request, reply) {  // eslint-disable-line @typescript-eslint/no-unused-vars
        return {
            
        }
    })

    return fastify
}