# OWASP Top 10 — Genel Bakış

## OWASP Top 10 nedir?
OWASP (Open Worldwide Application Security Project), web uygulama güvenliği
üzerine çalışan açık bir topluluktur. "Top 10", en kritik 10 web uygulama
güvenlik **riskini** derleyen, ~3-4 yılda bir güncellenen bir farkındalık
belgesidir.

## OWASP Top 10 — 2021

| # | Kategori | Kısa açıklama | Bu KB'deki karşılığı |
|---|----------|---------------|----------------------|
| A01 | Broken Access Control | Yetki kontrolünün eksik/yanlış olması | `idor/`, `Path Traversal/` |
| A02 | Cryptographic Failures | Zayıf/eksik şifreleme, hassas verinin korunmaması | `owasp-top10/02-cryptographic-failures` |
| A03 | Injection | Girdinin kod/sorgu olarak yorumlanması (**XSS dahil**) | `sql-injection/`, `xss/`, `command-injection/`, `ldap-injection/`, `ssi-injection/` |
| A04 | Insecure Design | Tasarım aşamasından gelen güvenlik eksikliği | `owasp-top10/03-insecure-design` |
| A05 | Security Misconfiguration | Hatalı/varsayılan yapılandırma, fazla izin | `web-server-misconfiguration/` |
| A06 | Vulnerable & Outdated Components | Güncel olmayan kütüphane/bileşen kullanımı | `owasp-top10/05-vulnerable-outdated-components` |
| A07 | Identification & Authentication Failures | Kimlik doğrulama ve oturum yönetimi hataları | `auth-attacks/`, `session-fixation/`, `session-cookie-poisoning/` |
| A08 | Software & Data Integrity Failures | Güvenilmeyen kaynaktan veri/güncelleme, bütünlük eksikliği | `insecure-deserialization/` |
| A09 | Security Logging & Monitoring Failures | Yetersiz loglama ve izleme, geç tespit | `owasp-top10/08-security-logging-monitoring-failures` |
| A10 | Server-Side Request Forgery (SSRF) | Sunucuya, saldırganın belirlediği isteği yaptırma | `ssrf/` |

> Not: Bir saldırı birden fazla kategoriye değebilir. Örneğin `csrf/` doğrudan
> Top 10 maddesi değildir ama "Broken Access Control / Insecure Design" ile
> ilişkilidir; `file-upload/` ve `web-shells/` çoğu zaman A03 + A04 + A08
> birleşiminde ortaya çıkar.

## 2025 güncellemesi (bilgi için)
Kasım 2025'te **OWASP Top 10:2025** yayımlandı. CEH v13 hâlâ 2021 tabanlı
olduğu için sınav çalışmanda **2021 listesi geçerli**; ancak güncel sürümü de
bilmekte fayda var:

| # | 2025 Kategorisi |
|---|-----------------|
| A01 | Broken Access Control |
| A02 | Security Misconfiguration |
| A03 | Software Supply Chain Failures *(yeni/genişletilmiş)* |
| A04 | Cryptographic Failures |
| A05 | Injection |
| A06 | Insecure Design |
| A07 | Authentication Failures |
| A08 | Software or Data Integrity Failures |
| A09 | Security Logging and Alerting Failures |
| A10 | Mishandling of Exceptional Conditions *(yeni)* |

**Öne çıkan değişiklikler:**
- Security Misconfiguration yükseldi (A05 → A02).
- "Vulnerable & Outdated Components", **Software Supply Chain Failures** adıyla
  genişletilip A03'e taşındı.
- Injection A03'ten A05'e indi.
- **SSRF** artık ayrı bir madde değil; ilgili kategoriler içine dahil edildi.
- A10 yeni bir kategori: **Mishandling of Exceptional Conditions** (hata/istisna
  durumlarının güvensiz yönetimi).
