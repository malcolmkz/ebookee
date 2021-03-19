import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { EbookItem } from '../models/EbookItem'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { UpdateEbookRequest } from '../requests/UpdateEbookRequest'



const AWSX = AWSXRay.captureAWS(AWS)

export class EbooksDAL{

    constructor(
        private readonly docClient: DocumentClient = new AWSX.DynamoDB.DocumentClient(),
        private readonly ebooksTable = process.env.EBOOKS_TABLE,
        private readonly userIdIndex = process.env.USER_ID_INDEX
        ) {
        }

    async addEbookDAL(ebook: EbookItem): Promise<EbookItem> {
        await this.docClient.put({
            TableName: this.ebooksTable,
            Item: ebook
        }).promise()
        
        return ebook
    }


    async getEbooksDAL(userId: string): Promise<AWS.DynamoDB.DocumentClient.ItemList> {
  
        const result = await this.docClient.query({
          TableName: this.ebooksTable,
          IndexName: this.userIdIndex,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId
          },
          ScanIndexForward: false
        }).promise()
      
        return result.Items
    }

    async updateEbookDAL(ebookId: string, updatedEbookRequest:UpdateEbookRequest): Promise<AWS.DynamoDB.DocumentClient.UpdateItemOutput> {
        return await this.docClient.update({
            TableName: this.ebooksTable,
            Key:{
              "ebookId": ebookId
             },
            UpdateExpression: "set title = :title, author = :author, publisher = :publisher",
            ExpressionAttributeValues:{
                ":title": updatedEbookRequest.title,
                ":author": updatedEbookRequest.author,
                ":publisher": updatedEbookRequest.publisher
            },
          ReturnValues:"UPDATED_NEW"
        }).promise()
    }

    async updateEbookAttachmentUrlDAL(ebookId: string, url:string): Promise<AWS.DynamoDB.DocumentClient.UpdateItemOutput> {
        return await this.docClient.update({
            TableName: this.ebooksTable,
            Key:{
              "ebookId": ebookId
             },
            UpdateExpression: "set attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues:{
                ":attachmentUrl":url
        },
          ReturnValues:"UPDATED_NEW"
        }).promise()
    }

    async deleteEbookDAL(ebookId: string): Promise<AWS.DynamoDB.DocumentClient.DeleteItemOutput>{
        return await this.docClient.delete({
          Key: { "ebookId": ebookId},
          TableName : this.ebooksTable
        })
        .promise()
    }
}
    

