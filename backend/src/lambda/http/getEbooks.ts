import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { getEbooksBL } from '../../businessLogic/ebooks'


import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const logger = createLogger('Logger')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  // Get the current user id
  const userId = event.requestContext.authorizer.principalId
  logger.info("User id =", userId)
  
  // Get all ebooks for the current user
  const todos = await getEbooksBL(userId)
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: todos
    })
  }
}
