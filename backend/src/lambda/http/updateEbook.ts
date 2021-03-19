import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateEbookRequest } from '../../requests/UpdateEbookRequest'
import { updateEbookBL } from '../../businessLogic/ebooks'
import { createLogger } from '../../utils/logger'

const logger = createLogger('Logger')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const ebookId = event.pathParameters.ebookId
  const updatedEbook: UpdateEbookRequest = JSON.parse(event.body)

  logger.info(`updating TODO : ${ebookId}`)
  await updateEbookBL(ebookId, updatedEbook)

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
    })
  }
}

