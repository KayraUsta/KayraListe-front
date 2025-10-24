<template>
  <q-page class="modern-page">
<br><br><br>

    <!-- Modern Arama -->
    <div class="row justify-center q-mb-xl q-px-md">
      <div class="col-12 col-md-8 col-lg-6">
        <q-input
          v-model="searchQuery"
          placeholder="Ürün ara..."
          dark
          standout="bg-grey-9"
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
      <q-chip
        color="purple-9"
        text-color="white"
        icon="inventory_2"
        class="text-weight-medium"
      >
        {{ filteredProducts.length }} Ürün
      </q-chip>
    </div>

    <!-- Aktif Ürün Listesi -->
    <div v-if="filteredProducts.length > 0" class="row q-col-gutter-lg justify-center">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
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
              <q-badge color="purple-6" label="SATIŞ" class="modern-badge" />
            </div>
          </q-img>

          <q-card-section>
            <!-- Ürün Adı -->
            <div class="text-h6 text-weight-bold ellipsis-2-lines q-mb-sm text-white">
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
              unelevated
              color="purple-6"
              icon="visibility"
              label="Detayları Gör"
              @click="showProductDetails(product)"
              class="full-width modern-btn"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Ürün Bulunamadı -->
    <div v-else class="text-center q-pa-xl empty-state">
      <q-icon name="search_off" size="120px" color="purple-4" />
      <div class="text-h4 text-white q-mt-md text-weight-bold">
        {{ searchQuery ? 'Sonuç Bulunamadı' : 'Ürün Yok' }}
      </div>
      <div class="text-h6 text-grey-5 q-mt-sm">
        {{ searchQuery ? 'Farklı bir arama deneyin' : 'Yakında yeni ürünler eklenecek' }}
      </div>
    </div>

    <!-- Modern Ürün Detay Dialog -->
    <q-dialog v-model="detailDialog">
      <q-card class="modern-dialog" style="min-width: 400px; max-width: 600px">
        <q-img
          v-if="selectedProduct"
          :src="selectedProduct.image"
          style="max-height: 400px;"
          fit="contain"
        />

        <q-card-section v-if="selectedProduct" class="q-pa-lg">
          <div class="text-h3 text-weight-bold text-white q-mb-sm">{{ selectedProduct.name }}</div>
          <q-badge color="purple-6" label="SATIŞ" class="modern-badge" />
          
          <q-separator dark class="q-my-lg" />
          
          <div class="text-h2 price-gradient text-weight-bold q-mb-lg">
            {{ formatPrice(selectedProduct.price) }}
          </div>
          
          <div class="text-body1 text-grey-4">
            Premium kalitede ürün. Detaylı bilgi ve sipariş için bizimle iletişime geçin.
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn unelevated color="purple-6" label="Kapat" class="modern-btn" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'CustomerViewPage',
  setup() {
    // Örnek aktif ürünler (normalde API'den sadece aktif olanlar gelir)
    const products = ref([
      {
        id: 1,
        name: 'Klasik Tişört',
        price: 299.90,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        active: true
      },
      {
        id: 3,
        name: 'Sırt Çantası',
        price: 849.50,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        active: true
      },
      {
        id: 4,
        name: 'Kulaklık',
        price: 1599.00,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        active: true
      },
      {
        id: 6,
        name: 'Laptop Çantası',
        price: 599.00,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        active: true
      }
    ])

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

    return {
      searchQuery,
      filteredProducts,
      detailDialog,
      selectedProduct,
      formatPrice,
      showProductDetails
    }
  }
}
</script>

<style scoped>
.modern-page {
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.gradient-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modern-search {
  border-radius: 50px;
  backdrop-filter: blur(10px);
}

.modern-search :deep(.q-field__native),
.modern-search :deep(.q-field__input) {
  color: white !important;
}

.modern-search :deep(::placeholder) {
  color: rgba(255, 255, 255, 0.4) !important;
  opacity: 1;
}

.modern-search :deep(input::placeholder) {
  color: rgba(255, 255, 255, 0.4) !important;
}

.modern-product-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  height: 100%;
  overflow: hidden;
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

.modern-dialog {
  background: rgba(15, 12, 41, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
}

.empty-state {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.ellipsis-2-lines {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 3em;
}
</style>
