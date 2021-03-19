import 'source-map-support/register'


import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { AddEbookRequest } from '../../requests/AddEbookRequest'
import { addEbookBL } from '../../businessLogic/ebooks'
import { createLogger } from '../../utils/logger'

const logger = createLogger('Logger')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newEbook: AddEbookRequest = JSON.parse(event.body)
  logger.info('Caller event', event)

  // get the user ID from the authorizer
  const userId = event.requestContext.authorizer.principalId
  logger.info('User ID', userId)

  // create the new todo 
  const newItem = await addEbookBL(newEbook, userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}

