import * as uuid from 'uuid'
import { AddEbookRequest } from '../requests/AddEbookRequest'
import {EbooksDAL} from '../dataLayer/ebooksDAL'
import { EbookItem } from '../models/EbookItem'
import { UpdateEbookRequest } from '../requests/UpdateEbookRequest'


const ebooksDAL = new EbooksDAL()


export async function addEbookBL( newEbook: AddEbookRequest, userId: string): Promise<EbookItem> {

    const ebookId = uuid.v4()

    return await ebooksDAL.addEbookDAL({
        ebookId,
        userId,
        ...newEbook,
    }

    )
}

export async function getEbooksBL(userId: string): Promise<any> {
    return await ebooksDAL.getEbooksDAL(userId)
}

export async function updateEbookBL(ebookId: string, updateEbookRequest:UpdateEbookRequest): Promise<any> {
    return await ebooksDAL.updateEbookDAL(ebookId, updateEbookRequest)
}

export async function updateEbookAttachmentUrlBL(ebookId: string, url:string): Promise<any> {
    return await ebooksDAL.updateEbookAttachmentUrlDAL(ebookId, url)
}

export async function deleteEbookBL(ebookId: string): Promise<any> {
    return await ebooksDAL.deleteEbookDAL(ebookId)
}

