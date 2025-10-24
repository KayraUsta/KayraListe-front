<template>
  <q-page padding>
    <div class="text-h4 q-mb-md">Aktif Ürünler</div>
    <div class="text-body2 text-grey-7 q-mb-lg">
      Satışa sunulan ürünlerimizi görüntüleyin
    </div>

    <!-- Arama -->
    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <q-input
          v-model="searchQuery"
          label="Ürün Ara"
          outlined
          clearable
          dense
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card-section>
    </q-card>

    <!-- Ürün Sayısı -->
    <div class="q-mb-md text-grey-7">
      {{ filteredProducts.length }} aktif ürün bulundu
    </div>

    <!-- Aktif Ürün Listesi -->
    <div v-if="filteredProducts.length > 0" class="row q-col-gutter-md">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card class="product-card">
          <!-- Ürün Görseli -->
          <q-img
            :src="product.image"
            ratio="1"
            style="height: 220px;"
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
                <q-icon name="broken_image" size="50px" />
              </div>
            </template>
            
            <!-- Aktif Badge -->
            <div class="absolute-top-right q-ma-sm">
              <q-badge color="positive" label="Satışta" />
            </div>
          </q-img>

          <q-card-section>
            <!-- Ürün Adı -->
            <div class="text-h6 ellipsis-2-lines">{{ product.name }}</div>
            
            <!-- Ürün Fiyatı -->
            <div class="text-h5 text-primary text-weight-bold q-mt-sm">
              {{ formatPrice(product.price) }}
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions>
            <q-btn
              flat
              color="primary"
              icon="info"
              label="Detayları Gör"
              @click="showProductDetails(product)"
              class="full-width"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Ürün Bulunamadı -->
    <div v-else class="text-center q-pa-xl">
      <q-icon name="inventory_2" size="80px" color="grey-5" />
      <div class="text-h6 text-grey-7 q-mt-md">
        {{ searchQuery ? 'Arama sonucu bulunamadı' : 'Aktif ürün bulunmuyor' }}
      </div>
      <div class="text-body2 text-grey-6 q-mt-sm">
        {{ searchQuery ? 'Farklı bir arama terimi deneyin' : 'Şu anda satışta ürün bulunmamaktadır' }}
      </div>
    </div>

    <!-- Ürün Detay Dialog -->
    <q-dialog v-model="detailDialog">
      <q-card style="min-width: 400px; max-width: 500px">
        <q-card-section v-if="selectedProduct" class="q-pb-none">
          <div class="text-h5">{{ selectedProduct.name }}</div>
          <q-badge color="positive" label="Satışta" class="q-mt-xs" />
        </q-card-section>

        <q-card-section v-if="selectedProduct">
          <q-img
            :src="selectedProduct.image"
            style="max-height: 350px; border-radius: 8px;"
            fit="contain"
          />
          
          <div class="q-mt-lg">
            <div class="text-h4 text-primary text-weight-bold">
              {{ formatPrice(selectedProduct.price) }}
            </div>
            <div class="text-body1 text-grey-7 q-mt-md">
              Bu ürün şu anda satışa sunulmaktadır. Detaylı bilgi için lütfen bizimle iletişime geçin.
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Kapat" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ActiveProductsPage',
  setup() {
    // Örnek ürünler (normalde API'den gelir - sadece aktif olanlar)
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
.product-card {
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
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
