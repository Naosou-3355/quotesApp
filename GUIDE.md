# 📖 Guide complet — QuoteApp

## Ce que contient ce dossier

| Fichier | Rôle |
|---|---|
| `index.html` | L'application complète (tout-en-un) |
| `manifest.json` | Rend l'app installable sur iPhone/Android |
| `sw.js` | Service Worker — mode hors-ligne + cache intelligent |
| `convert_to_json.py` | Script de conversion Excel/CSV/TSV → JSON |
| `data.json` | Vos données (généré par le script) |
| `demo.html` | Version démo autonome (données intégrées, pas besoin de data.json) |
| `icon.jpg` | Icône de l'application |

---

## Étape 1 — Convertir vos données

Le script `convert_to_json.py` transforme votre fichier Google Sheets (exporté en Excel, CSV ou TSV) en `data.json` lisible par l'app.

### Exporter depuis Google Sheets

Deux options :

**Option A — Excel (recommandé)**
1. Ouvrez votre Google Sheets
2. **Fichier → Télécharger → Microsoft Excel (.xlsx)**
3. Le fichier se télécharge dans `~/Téléchargements`

**Option B — CSV**
1. **Fichier → Télécharger → Valeurs séparées par des virgules (.csv)**
2. ⚠️ Si vos phrases contiennent des virgules, préférez le format Excel ou TSV

### Lancer la conversion

Ouvrez le **Terminal** (`⌘ Espace` → tapez `Terminal` → Entrée) :

```bash
# 1. Aller dans le dossier du projet
cd ~/Downloads/quoteapp   # adaptez le chemin

# 2. Installer les dépendances (une seule fois)
pip3 install pandas openpyxl

# 3. Placer votre fichier exporté dans ce dossier, puis lancer :
python3 convert_to_json.py
```

Le script détecte automatiquement le fichier `.xlsx`, `.csv` ou `.tsv` présent dans le dossier.
Vous pouvez aussi spécifier un fichier : `python3 convert_to_json.py mon_fichier.xlsx`

→ Un fichier `data.json` est créé dans le même dossier.

> **Note Mac** : utilisez toujours `python3` et `pip3` (pas `python` / `pip`).

### Si le script n'est plus dans votre dossier

Le fichier `convert_to_json.py` est disponible dans le dépôt GitHub du projet. Téléchargez-le et placez-le dans le même dossier que votre fichier Excel/CSV.

### Format attendu des colonnes

Le Google Sheets doit contenir ces colonnes (les noms exacts sont importants) :

| Colonne | Obligatoire | Exemple |
|---|---|---|
| `Volume` | oui | Volume 1 |
| `Horodateur` | non | 22/04/2024 18:43 |
| `Insert quote` | oui | Ma vie est un GinTo de trop |
| `Insert name (e.g: John. D)` | oui | Hugo. C |
| `Insert location` | non | Paris |
| `Main category` | non | Absurde |
| `Second category` | non | Mention Honorifique |
| `Under alcohol ?` | non | Oui / Non |
| `Context` | non | Bar avec les potes |
| `Si wam, avec qui ?` | non | |

---

## Étape 2 — Héberger sur GitHub Pages (gratuit)

### Créer le dépôt
1. Allez sur [github.com](https://github.com) → créez un compte si nécessaire
2. **New repository** → nom : `quoteapp` → cochez **Public** → **Create repository**

### Uploader les fichiers

**Méthode simple (navigateur)** :
1. Dans votre dépôt, cliquez **Add file → Upload files**
2. Glissez-déposez : `index.html`, `manifest.json`, `sw.js`, `data.json`, `icon.jpg`
3. **Commit changes**

**Méthode Terminal** :
```bash
cd ~/Downloads/quoteapp
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE-PSEUDO/quoteapp.git
git push -u origin main
```

### Activer GitHub Pages
1. **Settings** → menu gauche **Pages**
2. Branch : **main** → dossier **/ (root)** → **Save**
3. ~2 minutes → URL : `https://VOTRE-PSEUDO.github.io/quoteapp/`

---

## Étape 3 — Installer sur iPhone

1. Ouvrez **Safari** (obligatoirement Safari, pas Chrome)
2. Allez sur votre URL GitHub Pages
3. Icône **Partager** (carré + flèche) → **Sur l'écran d'accueil**
4. Nommez → **Ajouter**

✅ L'app apparaît comme une vraie application, sans barre Safari !

---

## Étape 4 — Mettre à jour les données

1. Exportez à nouveau depuis Google Sheets (Excel ou CSV)
2. Lancez la conversion :
```bash
cd ~/Downloads/quoteapp
python3 convert_to_json.py
```
3. Uploadez le nouveau `data.json` sur GitHub :

**Navigateur** : dans le dépôt → cliquez sur `data.json` → icône crayon ou **Add file → Upload files**

**Terminal** :
```bash
git add data.json
git commit -m "Mise à jour données"
git push
```

→ L'app se met à jour automatiquement !

> Si l'app ne se rafraîchit pas sur iPhone, fermez-la complètement (swipe up) puis rouvrez. Le Service Worker utilise une stratégie network-first pour `data.json` : il essaie toujours de charger la version la plus récente.

---

## Personnalisation

### Nom de l'app
Dans `manifest.json` :
```json
"name": "VotreNom",
"short_name": "Court",
```
Dans `index.html`, cherchez `<title>QuoteApp</title>`.

### Couleur d'accent
Dans `index.html`, cherchez dans le CSS :
```css
--accent: #7c6af7;
```

---

## Questions fréquentes

**`python3` n'est pas trouvé ?**
→ Installez Python : [python.org/downloads](https://www.python.org/downloads/macos/) ou `brew install python`

**Mon CSV a des problèmes d'accents ?**
→ L'export Google Sheets est en UTF-8, ça devrait fonctionner. Le script gère aussi UTF-8 BOM, Latin-1 et CP1252 automatiquement.

**L'app ne se met pas à jour sur iPhone ?**
→ Fermez l'app complètement puis rouvrez. En dernier recours : **Réglages → Safari → Effacer historique et données de sites**.

**Icône personnalisée ?**
→ Remplacez `icon.jpg` par votre image. Pour un résultat optimal, créez aussi `icon-192.png` et `icon-512.png` et mettez à jour `manifest.json`.

**Ouvrir le Terminal sur Mac ?**
→ `⌘ Espace` → tapez `Terminal` → Entrée.
