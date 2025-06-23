# Google Indexing API - Vercel Kurulum Rehberi

Bu proje, Google Indexing API ile toplu URL indeksleme işlemlerini kolaylaştırır. Vercel üzerinde hızlıca deploy edebilirsiniz.

## Kurulum Adımları

### 1. Google Cloud Service Account Oluşturun
- Google Cloud Console'da yeni bir proje oluşturun.
- "Service Account" oluşturun ve JSON anahtarını indirin.
- Bu servisi Google Search Console'da ilgili mülkün sahibi olarak ekleyin.

### 2. Service Account Anahtarını Base64 ile Encode Edin
Terminalde şunu çalıştırın:
```sh
base64 service_account.json
```
Çıkan uzun stringi kopyalayın.

### 3. Vercel'de Ortam Değişkenlerini Ayarlayın
Vercel panelinde projenize girin ve aşağıdaki ortam değişkenlerini ekleyin:
- `GOOGLE_CLIENT_EMAIL` → service_account.json içindeki `client_email` değeri
- `GOOGLE_PRIVATE_KEY` → service_account.json içindeki `private_key` değeri (tüm satırı kopyalayın, Vercel otomatik olarak \n dönüşümünü yapar)

Alternatif olarak, tüm dosyayı base64 encode edip bir değişken olarak da saklayabilirsiniz (ör: `GOOGLE_SERVICE_ACCOUNT_JSON`).

### 4. Deploy Edin
Projeyi GitHub'a yükleyin veya fork'layın. Vercel'de yeni proje oluşturun ve repoyu seçin. Deploy işlemini başlatın.

### 5. Kullanım
API'ye POST isteği atarak toplu URL gönderebilirsiniz:
```
POST /api/index
{
  "urls": ["https://ornek.com/1", "https://ornek.com/2"]
}
```

Başarılı olursa Google Indexing API'ye iletilir.

---

Herhangi bir sorunda kodu veya ortam değişkenlerini kontrol edin. Google servis hesabınızın Search Console'da "Owner" olarak ekli olduğundan emin olun. 