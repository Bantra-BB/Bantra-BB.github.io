# Nmap Cheat-Sheet

Sık kullanılan tarama komutları.

## Temel Taramalar

```bash
nmap 10.10.10.10                 # basit tarama
nmap -sV -sC 10.10.10.10         # sürüm + varsayılan scriptler
nmap -p- 10.10.10.10             # tüm portlar
nmap -A 10.10.10.10              # agresif (OS, sürüm, script)
```

## Çıktıyı Kaydetme

```bash
nmap -oN sonuc.txt 10.10.10.10
```

| Bayrak | Anlamı |
|--------|--------|
| -sV | Servis sürümü |
| -sC | Varsayılan scriptler |
| -p- | Tüm portlar |
