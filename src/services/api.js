import axios from 'axios'

// API Base URL - Production ve Development için otomatik seçim
const API_URL = process.env.VUE_APP_API_URL || 'https://umutuygulama.onrender.com/api'

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Ürün API'leri
export const productAPI = {
  // Tüm ürünleri getir
  getAll: (params = {}) => api.get('/products', { params }),
  
  // Sadece aktif ürünleri getir
  getActive: () => api.get('/products/active'),
  
  // Tek ürün getir
  getById: (id) => api.get(`/products/${id}`),
  
  // Yeni ürün ekle
  create: (data) => api.post('/products', data),
  
  // Ürün güncelle
  update: (id, data) => api.put(`/products/${id}`, data),
  
  // Aktif/Pasif toggle
  toggle: (id) => api.patch(`/products/${id}/toggle`),
  
  // Ürün sil
  delete: (id) => api.delete(`/products/${id}`)
}

// Resim yükleme API'si
export const uploadAPI = {
  // Resim yükle (Base64)
  uploadImage: (base64Image) => api.post('/upload', { image: base64Image }),
  
  // Resim sil
  deleteImage: (publicId) => api.delete(`/upload/${publicId}`)
}

export default api
