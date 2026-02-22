# QuoteApp — Corrections CSS pour l'ajustement écran

## Résumé des corrections à appliquer dans ton `index.html`

Voici les **5 modifications CSS** à faire dans ta balise `<style>` :

---

### 1. `.app` — Fallback `vh` + suppression `overflow: hidden`

**Avant :**
```css
.app {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  max-width: 480px;
  margin: 0 auto;
  background: var(--bg);
  position: relative;
  overflow: hidden;
}
```

**Après :**
```css
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;           /* fallback pour navigateurs sans dvh */
  height: 100dvh;          /* viewport dynamique (Chrome/Safari récents) */
  max-width: 480px;
  margin: 0 auto;
  background: var(--bg);
  position: relative;
  overflow: clip;           /* empêche le bleed visuel sans bloquer le scroll interne */
}
```

> **Pourquoi :** `overflow: hidden` créait un contexte de scroll qui empêchait les enfants flex de scroller correctement sur certains mobiles. `overflow: clip` a le même effet visuel (pas de débordement) mais ne crée pas de scroll container. Le double `height` assure la compatibilité.

---

### 2. `.screen` — Forcer `min-height: 0` pour le scroll flex

**Avant :**
```css
.screen {
  display: none;
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.screen.active { display: flex; flex-direction: column; }
```

**Après :**
```css
.screen {
  display: none;
  flex: 1 1 0%;            /* base 0 pour que flex calcule la taille correctement */
  min-height: 0;           /* CRITIQUE : permet au conteneur flex de rétrécir */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.screen.active { display: flex; flex-direction: column; }
```

> **Pourquoi :** Sans `min-height: 0`, un enfant flex `flex:1` en colonne conserve sa taille de contenu intrinsèque comme minimum, donc il pousse le bottom-nav hors écran au lieu de scroller.

---

### 3. `.bottom-bar` — Retirer le double `safe-area` padding

**Avant :**
```css
.bottom-bar {
  padding: 12px 16px calc(var(--safe-bottom) + 12px);
  /* ... */
  flex-shrink: 0;
}
```

**Après :**
```css
.bottom-bar {
  padding: 12px 16px;      /* padding uniforme */
  /* ... */
  flex-shrink: 0;
}
```

> **Pourquoi :** La `.bottom-nav` juste en dessous applique déjà `padding-bottom: var(--safe-bottom)`. En ajoutant aussi le safe-area dans `.bottom-bar`, tu doubles l'espace perdu en bas sur iPhone (notch), ce qui compresse la zone de citation.

---

### 4. `#screen-filter` et `#screen-stats` — Ajouter un padding-bottom de sécurité

**Avant :**
```css
#screen-filter { padding: 18px; gap: 18px; }
#screen-stats  { padding: 18px; gap: 16px; }
```

**Après :**
```css
#screen-filter { padding: 18px 18px 32px; gap: 18px; }
#screen-stats  { padding: 18px 18px 32px; gap: 16px; }
#screen-history { padding: 18px 18px 32px; gap: 10px; }
```

> **Pourquoi :** Ces écrans scrollent verticalement. Sans padding-bottom supplémentaire, le dernier élément peut être masqué par le rebond du scroll ou trop collé à la bottom-nav.

---

### 5. `html, body` — Ajouter `overflow: hidden` au niveau racine

**Avant :**
```css
html, body {
  height: 100%;
  font-family: var(--font-mono);
  background: var(--bg);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
  overscroll-behavior: none;
}
```

**Après :**
```css
html, body {
  height: 100%;
  overflow: hidden;         /* empêche le double-scroll sur le body */
  font-family: var(--font-mono);
  background: var(--bg);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
  overscroll-behavior: none;
}
```

> **Pourquoi :** Sur mobile, si le `body` est scrollable en plus des `.screen`, tu obtiens un double-scroll et la barre d'URL qui apparaît/disparaît, ce qui change la hauteur du viewport en permanence.

---

## Récap rapide

| Élément | Problème | Fix |
|---|---|---|
| `.app` | `overflow:hidden` bloque le scroll flex + pas de fallback `vh` | `overflow:clip` + double height |
| `.screen` | Pas de `min-height:0` → pousse la nav hors écran | `flex: 1 1 0%` + `min-height:0` |
| `.bottom-bar` | Double `safe-area` avec `.bottom-nav` | Retirer `safe-area` du bottom-bar |
| Screens scrollables | Contenu coupé en bas | `padding-bottom: 32px` |
| `html, body` | Double-scroll + barre d'URL instable | `overflow: hidden` |
