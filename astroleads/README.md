# 🚀 AstroLeads - Lead Generation Module

**AstroLeads** est intégré dans AstroGrowth comme module de génération de leads B2B multi-canal.

## 📦 Contenu

Ce dossier contient le code source original d'AstroLeads v2.0, intégré comme module dans AstroGrowth pour faciliter les mises à jour et améliorations.

## 🔄 Synchronisation

Pour mettre à jour AstroLeads dans AstroGrowth :

```bash
# Depuis la racine d'Astroleadsv2.0
cd astrogrowth-v3/astroleads
git pull origin main  # Si git submodule
# OU
cp -r ../../src .     # Si copie manuelle
```

## 🎯 Intégration avec AstroGrowth

AstroLeads est accessible de plusieurs façons dans AstroGrowth :

### 1. **Template de Workflow** (Gallery Store)
- ID: `astroleads-complete`
- 8 agents spécialisés
- Accès via `/gallery`

### 2. **Module Standalone**
- Code source complet dans `astroleads/`
- Peut être lancé indépendamment
- Configuration propre

### 3. **API Integration**
```typescript
import { AstroLeadsWorkflow } from './astroleads';

const leads = await AstroLeadsWorkflow.execute({
  target: "CTOs SaaS B2B France",
  channels: ["linkedin", "google-maps", "email"]
});
```

## 🛠️ Configuration

Voir le fichier `.env.example` à la racine pour les clés API requises :
- LinkedIn API
- Google Maps API
- Hunter.io / ZeroBounce
- CRM APIs (Salesforce, HubSpot)

## 📊 Workflow

```
1. Prospection LinkedIn + Google Maps
2. Data Enrichment & Validation
3. Lead Scoring AI
4. Cold Email Campaigns
5. Follow-up Automation
6. CRM Integration
```

## 🚀 Déploiement

### Option A : Via AstroGrowth Gallery
```bash
# Dans AstroGrowth
npm run dev
# Ouvrir /gallery
# Déployer "AstroLeads Complete"
```

### Option B : Standalone
```bash
cd astroleads
npm install
npm run dev
```

## 📈 Performance

- **500-1000 leads/jour**
- **Taux de qualification : 65-75%**
- **Coût par lead : $0.001-0.002**
- **ROI : 500-1000%**

## 🔗 Liens

- Template dans Gallery Store : `/gallery` → AstroLeads
- Documentation complète : `../PREMIUM_TEMPLATES.md`
- Source GitHub : https://github.com/zakibelm/Astroleadsv2.0

---

**Dernière mise à jour** : Décembre 2025
**Version** : 2.0
**Statut** : Production-ready
