import apiClient from './client'
import { API_ENDPOINTS } from '../utils/constants'

export async function getConversations() {
  return apiClient.get(API_ENDPOINTS.MESSAGES.MY_CHATS)
}

export async function getMessages(chatId) {
  return apiClient.get(`${API_ENDPOINTS.MESSAGES.MESSAGES}/${chatId}/messages`)
}

export async function sendMessage(chatId, payload) {
  return apiClient.post(`${API_ENDPOINTS.MESSAGES.MESSAGES}/${chatId}/messages`, {
    content: payload.text,
  })
}
