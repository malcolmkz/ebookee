import { apiEndpoint } from '../config'
import { Ebook } from '../types/Ebook';
import { AddEbookRequest } from '../types/AddEbookRequest';
import Axios from 'axios'
import { UpdateEbookRequest } from '../types/UpdateEbookRequest';

export async function getEbooks(idToken: string): Promise<Ebook[]> {
  console.log('Fetching ebooks')

  const response = await Axios.get(`${apiEndpoint}/ebooks`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Ebooks:', response.data)
  return response.data.items
}

export async function addEbook(
  idToken: string,
  newEbook: AddEbookRequest
): Promise<Ebook> {
  const response = await Axios.post(`${apiEndpoint}/ebooks`,  JSON.stringify(newEbook), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchEbook(
  idToken: string,
  ebookId: string,
  updatedEbook: UpdateEbookRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/ebooks/${ebookId}`, JSON.stringify(updatedEbook), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteEbook(
  idToken: string,
  ebookId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/ebooks/${ebookId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  ebookId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/ebooks/${ebookId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
