---
name: ccd
description: Continuous Code Delivery — CI/CD pipeline tasarımı, build automation ve release yönetimi
---

# 🔄 CCD (Continuous Code Delivery) Skill

Bu skill, sürekli entegrasyon, sürekli teslim ve release yönetimi süreçlerini yönetir.

---

## Sorumluluklar

1. **CI Pipeline**: Otomatik build, test ve lint kontrolleri
2. **CD Pipeline**: Otomatik deployment ve release
3. **Quality Gates**: Kalite kapıları tanımlama ve uygulama
4. **Environment Yönetimi**: Dev, staging, production ortam yönetimi
5. **Release Yönetimi**: Versiyonlama, tagging ve release notes

---

## Pipeline Aşamaları

```
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  COMMIT  │───►│  BUILD   │───►│   TEST   │───►│  DEPLOY  │───►│ MONITOR  │
│          │    │          │    │          │    │          │    │          │
│ • Push   │    │ • Lint   │    │ • Unit   │    │ • Stage  │    │ • Health │
│ • PR     │    │ • Build  │    │ • Integ. │    │ • Prod   │    │ • Perf   │
│          │    │ • Audit  │    │ • E2E    │    │ • Verify │    │ • Alerts │
└─────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
```

---

## Quality Gates

Her aşamada geçilmesi gereken kalite kapıları:

### Gate 1: Build
- [ ] Lint hatasız geçiyor
- [ ] TypeScript/Compile hatasız
- [ ] npm audit — kritik zafiyet yok
- [ ] Bundle size limiti aşılmamış

### Gate 2: Test
- [ ] Unit test coverage >= %80
- [ ] Tüm integration testler geçiyor
- [ ] E2E kritik akışlar geçiyor
- [ ] Performance benchmarklar karşılanıyor

### Gate 3: Deploy
- [ ] Staging'de smoke test geçiyor
- [ ] Rollback planı hazır
- [ ] Release notes yazılmış
- [ ] Breaking change bildirimi yapılmış

### Gate 4: Production
- [ ] Health check endpoint'i OK
- [ ] Error rate < %1
- [ ] Response time < threshold
- [ ] Feature flags doğru set edilmiş

---

## Versiyonlama (Semantic Versioning)

```
MAJOR.MINOR.PATCH
  │     │     │
  │     │     └── Bug fixes, backward compatible
  │     └──────── New features, backward compatible
  └────────────── Breaking changes
```

### Versiyon Artırma Kuralları
| Değişiklik Türü | Versiyon | Örnek |
|-----------------|----------|-------|
| Bug fix | PATCH | 1.0.0 → 1.0.1 |
| Yeni özellik (uyumlu) | MINOR | 1.0.0 → 1.1.0 |
| Breaking change | MAJOR | 1.0.0 → 2.0.0 |

---

## GitHub Actions Şablonu

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Build
        run: npm run build
      
      - name: Test
        run: npm run test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## Environment Yapılandırması

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│     DEV      │    │   STAGING   │    │  PRODUCTION  │
│              │    │             │    │              │
│ • Local dev  │───►│ • Pre-prod  │───►│ • Live env   │
│ • Mock data  │    │ • Test data │    │ • Real data  │
│ • Debug mode │    │ • QA access │    │ • Monitored  │
└─────────────┘    └─────────────┘    └─────────────┘
```

### Environment Variables

```bash
# .env.example
NODE_ENV=development
APP_NAME=[PROJECT_NAME]
APP_VERSION=0.1.0
API_BASE_URL=http://localhost:3000/api
LOG_LEVEL=debug

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=[DB_NAME]

# External Services
# THIRD_PARTY_API_KEY=xxx
# SMTP_HOST=xxx
```

---

## Release Checklist

```markdown
## Release v[X.Y.Z] Checklist

### Pre-Release
- [ ] Tüm CI pipeline'ları yeşil
- [ ] CHANGELOG.md güncel
- [ ] package.json version güncellendi
- [ ] Breaking change dokümanları hazır
- [ ] Migration guide hazır (major için)

### Release
- [ ] Release branch oluşturuldu
- [ ] Version tag oluşturuldu
- [ ] Staging'e deploy edildi
- [ ] QA onay verdi
- [ ] Production'a deploy edildi

### Post-Release
- [ ] Health check OK
- [ ] Monitoring dashboard kontrol edildi
- [ ] Release notes yayınlandı
- [ ] Stakeholder'lar bilgilendirildi
```

---

## Best Practices

1. **Automate everything**: Manuel adımları minimize et
2. **Fast feedback**: Pipeline mümkün olduğunca hızlı olmalı
3. **Fail fast**: Hata erken tespit edilmeli
4. **Immutable artifacts**: Build artifact'leri değiştirilmemeli
5. **Feature flags**: Büyük özellikleri flag arkasında deploy et
6. **Blue-green deploy**: Downtime'sız deployment
7. **Rollback planı**: Her zaman geri dönüş planı olmalı
