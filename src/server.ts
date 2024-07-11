import Fastify, { FastifyInstance } from 'fastify'
import { VerisimilitudeConfig } from './util/zodTypes'
import type { OICDAuthParams, OICDIDTokenRequestParams } from './util/zodTypes'
import { OICDResponsesType } from './OICDResponses'
import fastifyFormbody from '@fastify/formbody'

export const FastifyServer = (config: VerisimilitudeConfig, responses: OICDResponsesType) => {
    const logger = config.logger
    const fastify: FastifyInstance = Fastify({logger: true})

    fastify.register(fastifyFormbody)

    fastify.get('/.well-known/openid-configuration', async function handler (request, reply) { 
        reply.code(200).send({...responses.well_known})
    }) 

    fastify.get<{
        Querystring: OICDAuthParams
    }>(config.endpoints.authorization_endpoint, async function handler (request, reply) {
        logger.debug(`GET ${config.endpoints.authorization_endpoint} called with query`, request.query)
        logger.debug(JSON.stringify(request.query))
        const reply_details = responses.do_authorization(request.query)

        if ("errors" in reply_details ) {
            reply
                .code(reply_details.code)
                .type("application/json")
                .send(reply_details.errors)
        } else {
            logger.debug("Sending authorization code")

            reply.redirect(reply_details.href)
        }
    })

    fastify.post<{
        Params: OICDAuthParams
    }>(config.endpoints.authorization_endpoint, async function handler (request, reply) {
        logger.debug(`POST ${config.endpoints.authorization_endpoint} called with params ${request.params}`)
        const reply_details = responses.do_authorization(request.params)

        if ("errors" in reply_details) {
            reply
                .code(reply_details.code)
                .type("application/json")
                .send(reply_details.errors)
        } else {
            reply.redirect(reply_details.href)
        }
    })

    fastify.post<{
        Body: OICDIDTokenRequestParams
    }>(config.endpoints.token_endpoint, async function handler (request, reply) {  // eslint-disable-line @typescript-eslint/no-unused-vars
        console.log("Requesting ID Token et al")
        const reply_details = await responses.get_id_token(request.body)

        if ("errors" in reply_details) {
            reply.code(reply_details.code).send(reply_details.errors)
        } else {
            console.log(reply_details)
            reply.code(200)
            .type("application/json")
            .send(reply_details)
        }
    })

    fastify.post(config.endpoints.userinfo_endpoint, async function handler (request, reply) {  // eslint-disable-line @typescript-eslint/no-unused-vars
        console.log("USERDAT")
        return {
            
        }
    })

    return fastify
}