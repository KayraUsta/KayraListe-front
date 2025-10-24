<template>
  <q-page class="modern-page">
<br><br><br>

    <!-- Modern Arama -->
    <div class="row justify-center q-mb-xl q-px-md">
      <div class="col-12 col-md-8 col-lg-6">
        <q-input
          v-model="searchQuery"
          placeholder="Ürün ara..."
          outlined
          clearable
          class="modern-search"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="purple-4" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Ürün Sayısı -->
    <div class="text-center q-mb-lg">
      <div class="product-count-chip">
        <q-icon name="inventory_2" size="24px" class="q-mr-sm" />
        <span class="gradient-chip-text">{{ filteredProducts.length }} Ürün</span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="row justify-center q-my-xl">
      <q-spinner-dots color="purple-4" size="50px" />
    </div>

    <!-- Aktif Ürün Listesi -->
    <div v-else-if="filteredProducts.length > 0" class="row q-col-gutter-lg">
      <!-- Sol Taraf - Ürünler -->
      <div class="col-12 col-lg-9">
        <div class="row q-col-gutter-lg justify-center">
          <div
            v-for="product in filteredProducts"
            :key="product._id || product.id"
            class="col-12 col-sm-6 col-md-4"
          >
        <q-card class="modern-product-card" flat>
          <!-- Ürün Görseli -->
          <q-img
            :src="product.image"
            ratio="1"
            style="height: 180px;"
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
                <q-icon name="broken_image" size="50px" />
              </div>
            </template>
            
            <!-- Satışta Badge -->
            <div class="absolute-top-right q-ma-md">
              <div class="gradient-badge">SATIŞ</div>
            </div>
          </q-img>

          <q-card-section>
            <!-- Ürün Adı -->
            <div class="text-h6 text-weight-bold ellipsis-2-lines q-mb-sm text-grey-9">
              {{ product.name }}
            </div>
            
            <!-- Ürün Fiyatı -->
            <div class="text-h5 price-gradient text-weight-bold">
              {{ formatPrice(product.price) }}
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="text-center q-pa-md">
            <q-btn
              flat
              icon="image"
              @click="showProductDetails(product)"
              class="full-width gradient-button"
            >
              <span class="gradient-button-text">Resmi Gör</span>
            </q-btn>
          </q-card-section>
        </q-card>
          </div>
        </div>
      </div>

      <!-- Sağ Taraf - İletişim Kartı -->
      <div class="col-12 col-lg-2" style="max-width: 180px;">
        <div class="contact-sidebar sticky-contact">
          <q-card flat class="contact-card">
            <!-- SVG Logo -->
            <q-card-section class="text-center q-pa-md">
              <div class="logo-container q-mb-sm">
                <svg viewBox="0 0 100 100" class="krkit-logo">
                  <defs>
                    <linearGradient id="techGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#00ff88;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#00cc66;stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
                      <stop offset="50%" style="stop-color:#16213e;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#0f3460;stop-opacity:1" />
                    </linearGradient>
                  </defs>
                  <!-- Gri-yeşil-mavi arka plan -->
                  <rect width="100" height="100" fill="url(#logoBg)" rx="15"/>
                  <!-- Teknoloji yeşili K harfi -->
                  <text x="50" y="70" font-family="Arial, sans-serif" font-size="55" font-weight="bold" fill="url(#techGreen)" text-anchor="middle">K</text>
                </svg>
              </div>
              <div class="text-h6 text-weight-bold text-grey-9">
                KRKIT
              </div>
            </q-card-section>

            <q-separator dark />

            <!-- İletişim Mesajı -->
            <q-card-section class="q-pa-md">
              <div class="text-body2 text-weight-bold text-grey-9 text-center q-mb-sm" style="line-height: 1.6;">
                Bizimle<br>
                İletişime<br>
                Geçin
              </div>
              <div class="text-caption text-grey-6 text-center q-mb-md" style="line-height: 1.5; font-size: 11px;">
                Sorularınız<br>
                için<br>
                bize<br>
                ulaşın
              </div>

              <!-- Instagram Butonu -->
              <q-btn
                unelevated
                style="background: linear-gradient(135deg, #E1306C 0%, #C13584 100%); color: white; font-size: 10px; padding: 8px 4px;"
                icon="fab fa-instagram"
                size="sm"
                class="full-width q-mb-sm contact-btn"
                href="https://instagram.com/krkitbilisim"
                target="_blank"
              >
                <q-tooltip>Instagram'da Takip Et</q-tooltip>
              </q-btn>

              <!-- Telefon Butonu -->
              <q-btn
                unelevated
                style="background: linear-gradient(135deg, #00ff88 0%, #00cc66 100%); color: #1a1a1a; font-size: 10px; padding: 8px 4px;"
                icon="phone"
                size="sm"
                class="full-width contact-btn"
                href="tel:05465803521"
              >
                <q-tooltip>Hemen Ara</q-tooltip>
              </q-btn>
            </q-card-section>

            <q-separator dark />

            <!-- Ek Bilgi -->
            <q-card-section class="q-pa-sm text-center">
              <div class="text-caption text-grey-6" style="font-size: 11px;">
                7/24 Destek
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Ürün Bulunamadı -->
    <div v-else class="text-center q-pa-xl empty-state">
      <q-icon name="search_off" size="120px" color="purple-4" />
      <div class="text-h4 text-grey-9 q-mt-md text-weight-bold">
        {{ searchQuery ? 'Sonuç Bulunamadı' : 'Ürün Yok' }}
      </div>
      <div class="text-h6 text-grey-5 q-mt-sm">
        {{ searchQuery ? 'Farklı bir arama deneyin' : 'Yakında yeni ürünler eklenecek' }}
      </div>
    </div>

    <!-- Resim Görüntüleme Dialog - Tam Ekran -->
    <q-dialog v-model="detailDialog" maximized>
      <q-card class="fullscreen-image-dialog">
        <q-card-section class="q-pa-none fullscreen-image-container">
          <q-img
            v-if="selectedProduct"
            :src="selectedProduct.image"
            fit="contain"
            class="fullscreen-image"
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
                <q-icon name="broken_image" size="120px" />
              </div>
            </template>
          </q-img>
        </q-card-section>
        
        <q-card-actions class="fullscreen-close-btn">
          <q-btn 
            unelevated 
            color="grey-9" 
            icon="close" 
            label="Kapat" 
            size="lg"
            class="modern-btn" 
            v-close-popup 
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { productAPI } from '../services/api'

export default {
  name: 'CustomerViewPage',
  setup() {
    const $q = useQuasar()
    const products = ref([])
    const loading = ref(false)

    const searchQuery = ref('')
    const detailDialog = ref(false)
    const selectedProduct = ref(null)

    // Sadece aktif ürünleri filtrele
    const activeProducts = computed(() => {
      return products.value.filter(p => p.active)
    })

    // Arama ile filtreleme
    const filteredProducts = computed(() => {
      let filtered = activeProducts.value

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(query)
        )
      }

      return filtered
    })

    const formatPrice = (price) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    }

    const showProductDetails = (product) => {
      selectedProduct.value = product
      detailDialog.value = true
    }

    // API'den ürünleri getir
    const fetchProducts = async () => {
      loading.value = true
      try {
        const response = await productAPI.getActive()
        products.value = response.data.data
      } catch (error) {
        console.error('Ürünler yüklenemedi:', error)
        $q.notify({
          type: 'negative',
          message: 'Ürünler yüklenemedi',
          caption: error.response?.data?.message || error.message
        })
      } finally {
        loading.value = false
      }
    }

    // Sayfa yüklendiğinde ürünleri getir
    onMounted(() => {
      fetchProducts()
    })

    return {
      searchQuery,
      filteredProducts,
      detailDialog,
      selectedProduct,
      loading,
      formatPrice,
      showProductDetails,
      fetchProducts
    }
  }
}
</script>

<style scoped>
.modern-page {
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 50%, #e8e8e8 100%);
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.gradient-title {
  background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modern-search {
  border-radius: 50px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.modern-search :deep(.q-field__control) {
  background: rgba(102, 126, 234, 0.08);
  border-radius: 50px;
  transition: all 0.3s ease;
}

.modern-search:hover :deep(.q-field__control) {
  background: rgba(102, 126, 234, 0.15);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.modern-search :deep(.q-field__control):before {
  border-color: rgba(102, 126, 234, 0.3);
}

.modern-search:hover :deep(.q-field__control):before {
  border-color: rgba(102, 126, 234, 0.5);
}

.modern-search :deep(.q-field__native),
.modern-search :deep(.q-field__input) {
  color: #1a1a1a !important;
}

.modern-search :deep(::placeholder) {
  color: rgba(0, 0, 0, 0.4) !important;
  opacity: 1;
}

.modern-search :deep(input::placeholder) {
  color: rgba(0, 0, 0, 0.4) !important;
}

.modern-product-card {
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(102, 126, 234, 0.15);
  border-radius: 20px;
  height: 100%;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.modern-badge {
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 4px 12px;
  font-size: 0.7rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.price-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modern-btn {
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Gradient Chip (Ürün Sayısı) */
.product-count-chip {
  display: inline-flex;
  align-items: center;
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.product-count-chip .q-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-chip-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 1px;
}

/* Gradient Badge (SATIŞ) */
.gradient-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 700;
  letter-spacing: 1.5px;
  font-size: 0.75rem;
  padding: 6px 12px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

/* Gradient Button (Resmi Gör) */
.gradient-button {
  border-radius: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  transition: all 0.3s ease;
  border: none;
}

.gradient-button-text {
  color: white !important;
  font-weight: 700;
  letter-spacing: 1px;
  font-size: 1.1rem;
}

.gradient-button :deep(.q-icon) {
  color: white;
}

.gradient-button:hover {
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  transform: translateY(-2px);
  background: linear-gradient(135deg, #7c8bf5 0%, #8a5db8 100%) !important;
}

.modern-dialog {
  background: #ffffff;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.image-dialog {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.image-dialog .q-img {
  background: #f5f5f5;
}

.fullscreen-image-dialog {
  background: #000000;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}

.fullscreen-image-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.fullscreen-image {
  width: 100%;
  height: 100%;
}

.fullscreen-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.fullscreen-close-btn .q-btn {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.empty-state {
  background: #ffffff;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.ellipsis-2-lines {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 3em;
}

/* İletişim Kartı */
.contact-sidebar {
  width: 100%;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.sticky-contact {
  position: sticky;
  top: 80px;
}

.contact-card {
  background: #ffffff;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(0, 255, 136, 0.2);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 255, 136, 0.15);
  max-width: 180px;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.krkit-logo {
  width: 80px;
  height: 80px;
  filter: drop-shadow(0 2px 8px rgba(0, 255, 136, 0.2));
}

.contact-btn {
  border-radius: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  text-transform: none;
}

.contact-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

/* Font Awesome için */
.q-icon.fab {
  font-family: 'Font Awesome 5 Brands' !important;
}

/* Responsive */
@media (max-width: 1023px) {
  .sticky-contact {
    position: relative;
    top: 0;
    margin-bottom: 32px;
  }
}
</style>
