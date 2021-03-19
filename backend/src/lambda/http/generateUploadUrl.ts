import 'source-map-support/register'
import * as AWS  from 'aws-sdk'

import { createLogger } from '../../utils/logger'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { updateEbookAttachmentUrlBL } from '../../businessLogic/ebooks'


const bucketName = process.env.EBOOKS_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const logger = createLogger('Logger')
  const ebookId = event.pathParameters.ebookId
  const ebookKey = `${ebookId}.epub`

  // DONE: Return a presigned URL to upload a file for a TODO item with the provided id

  const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })
  
  const signedURL = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: ebookKey,
    Expires: urlExpiration
  })

  await updateEbookAttachmentUrlBL(ebookId,`https://${bucketName}.s3.amazonaws.com/${ebookId}.epub`)

  logger.info(`signed URL ${signedURL}`)
  logger.info("Generating an S3 signed URL")
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: signedURL
    })
  }
}
