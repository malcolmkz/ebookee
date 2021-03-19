import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { deleteEbookBL } from '../../businessLogic/ebooks'

const logger = createLogger('Logger')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const {ebookId} = event.pathParameters
  logger.info(`event path parameters ${event.pathParameters}`)
  logger.info(`ebookId =  ${ebookId}`)

 await deleteEbookBL(ebookId)
 
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
    })
  } 
}
