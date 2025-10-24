<template>
  <q-page class="add-product-page" padding>
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <q-card flat class="modern-card">
          <q-card-section>
            <div class="text-h3 text-weight-bold gradient-title q-mb-sm">Yeni Ürün Ekle</div>
            <div class="text-body1 text-grey-4">Ürün bilgilerini doldurun</div>
          </q-card-section>

          <q-separator dark />

          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md">
              <!-- Ürün Görseli -->
              <div>
                <div class="text-body2 text-grey-4 q-mb-sm">Ürün Görseli</div>
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-sm-6">
                    <q-file
                      v-model="imageFile"
                      label="Cihazdan Seç"
                      accept="image/*"
                      dark
                      standout="bg-grey-9"
                      @update:model-value="handleImageUpload"
                    >
                      <template v-slot:prepend>
                        <q-icon name="upload" />
                      </template>
                    </q-file>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model="product.image"
                      label="veya URL Girin"
                      dark
                      standout="bg-grey-9"
                    >
                      <template v-slot:prepend>
                        <q-icon name="link" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

              <!-- Görsel Önizleme -->
              <div v-if="product.image" class="q-mt-md">
                <div class="text-caption text-grey-4 q-mb-sm">Görsel Önizleme:</div>
                <q-img
                  :src="product.image"
                  style="max-width: 300px; max-height: 200px; border-radius: 8px;"
                  fit="contain"
                  @error="imageError = true"
                >
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
                      <q-icon name="broken_image" size="50px" />
                    </div>
                  </template>
                </q-img>
              </div>

              <!-- Ürün Adı -->
              <q-input
                v-model="product.name"
                label="Ürün Adı"
                placeholder="Ürün adını girin..."
                dark
                standout="bg-grey-9"
                :rules="[val => !!val || 'Ürün adı gerekli']"
                class="custom-input"
              >
                <template v-slot:prepend>
                  <q-icon name="shopping_bag" />
                </template>
              </q-input>

              <!-- Ürün Fiyatı -->
              <q-input
                v-model.number="product.price"
                type="number"
                label="Ürün Fiyatı (TRY)"
                placeholder="0.00"
                dark
                standout="bg-grey-9"
                step="0.01"
                min="0"
                :rules="[
                  val => val !== null && val !== '' || 'Fiyat gerekli',
                  val => val >= 0 || 'Fiyat 0\'dan küçük olamaz'
                ]"
                class="custom-input"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_money" />
                </template>
              </q-input>

              <!-- Aktif/Pasif Durumu -->
              <div class="q-mt-md">
                <q-toggle
                  v-model="product.active"
                  label="Ürün Durumu"
                  color="purple-6"
                  :true-value="true"
                  :false-value="false"
                  size="lg"
                  dark
                >
                  <template v-slot:default>
                    <div class="q-ml-sm">
                      <div class="text-weight-medium text-white">
                        {{ product.active ? 'Aktif' : 'Pasif' }}
                      </div>
                      <div class="text-caption text-grey-4">
                        {{ product.active ? 'Ürün satışa sunulacak' : 'Ürün satışa sunulmayacak' }}
                      </div>
                    </div>
                  </template>
                </q-toggle>
              </div>

              <!-- Butonlar -->
              <div class="q-mt-lg q-gutter-sm">
                <q-btn
                  type="submit"
                  label="Ürünü Kaydet"
                  color="purple-6"
                  icon="save"
                  unelevated
                  :loading="loading"
                  class="modern-btn"
                />
                <q-btn
                  label="Temizle"
                  color="grey-8"
                  unelevated
                  @click="resetForm"
                  class="modern-btn"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>

        <!-- Eklenen Ürün Önizleme -->
        <q-card v-if="lastAddedProduct" class="q-mt-lg success-card" flat>
          <q-card-section>
            <div class="row items-center">
              <q-icon name="check_circle" size="32px" class="q-mr-md" />
              <div>
                <div class="text-h5 text-weight-bold text-white">Ürün Başarıyla Eklendi!</div>
                <div class="text-body1 text-grey-3">{{ lastAddedProduct.name }} - {{ formatPrice(lastAddedProduct.price) }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

export default {
  name: 'AddProductPage',
  setup() {
    const $q = useQuasar()
    
    const product = ref({
      image: '',
      name: '',
      price: null,
      active: true
    })

    const loading = ref(false)
    const imageError = ref(false)
    const lastAddedProduct = ref(null)
    const imageFile = ref(null)

    const formatPrice = (price) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    }

    const onSubmit = () => {
      loading.value = true
      
      // Simüle edilmiş kaydetme işlemi (2 saniye bekle)
      setTimeout(() => {
        // Burada normalde API'ye istek atılır
        console.log('Ürün kaydedildi:', product.value)
        
        // Son eklenen ürünü göster
        lastAddedProduct.value = { ...product.value }
        
        // Bildirim göster
        $q.notify({
          type: 'positive',
          message: 'Ürün başarıyla eklendi!',
          icon: 'check_circle',
          position: 'top'
        })
        
        // Formu temizle
        resetForm()
        loading.value = false
        
        // 3 saniye sonra başarı mesajını gizle
        setTimeout(() => {
          lastAddedProduct.value = null
        }, 3000)
      }, 2000)
    }

    const handleImageUpload = (file) => {
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          product.value.image = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    const resetForm = () => {
      product.value = {
        image: '',
        name: '',
        price: null,
        active: true
      }
      imageError.value = false
      imageFile.value = null
    }

    return {
      product,
      loading,
      imageError,
      lastAddedProduct,
      imageFile,
      onSubmit,
      resetForm,
      formatPrice,
      handleImageUpload
    }
  }
}
</script>

<style scoped>
.add-product-page {
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  min-height: 100vh;
}

.modern-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}

.gradient-title {
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

.success-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(102, 126, 234, 0.5);
  border-radius: 16px;
}

.custom-input :deep(.q-field__native),
.custom-input :deep(.q-field__input) {
  color: white !important;
}

.custom-input :deep(::placeholder) {
  color: rgba(255, 255, 255, 0.4) !important;
  opacity: 1;
}

.custom-input :deep(input::placeholder) {
  color: rgba(255, 255, 255, 0.4) !important;
}
</style>
