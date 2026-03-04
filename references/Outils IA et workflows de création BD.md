# Outils IA et workflows de création BD

> Documentation technique pour le projet AmazighComics — tous les outils, workflows et choix techniques pour créer une BD webtoon avec l'IA.

---

## 1. Plateformes IA dédiées BD/Webtoon

| Outil | Prix | Qualité | Cohérence perso | Bulles/Layout | Idéal pour |
|---|---|---|---|---|---|
| **Dashtoon** | Gratuit 100 img/jour | 8/10 | 8/10 | Intégré | Script → publication complète |
| **Anifusion** | Gratuit / 10-50$/mo | 8/10 | 7/10 | Intégré | Manga pro (Amazon KDP) |
| **KomikoAI** | 8-42$/mo | 8/10 | 7/10 | Intégré + animation | Anime + comics animés |
| **LlamaGen** | 100% gratuit | 6/10 | 5/10 | Basique | Prototypage rapide |
| **AI Comic Factory** | Open source | 6/10 | 4/10 | Auto-généré | Devs, self-hosting |
| **Jenova AI** | Freemium | 7/10 | 7/10 | Vertical scroll | Webtoon séries |

### Détails par plateforme

**Dashtoon**
- Pipeline complet : script-to-comic, storyboard-to-comic
- Character library avec cohérence intégrée
- Inpainting pour retouches ciblées
- Revenue sharing 50/50 après 10 épisodes gratuits
- Idéal pour publier directement sur leur plateforme

**Anifusion**
- Multi-backend : Flux Schnell, SDXL, et autres
- Character Sheet multi-angle pour cohérence
- Export 4K print-ready
- Bon pour Amazon KDP et publication pro

**KomikoAI**
- Canvas infini pour la composition
- 15+ modèles animation (Veo 3, Kling, Hailuo)
- Keyframe-to-animation pour BD animée
- Le plus avancé pour du contenu animé

**LlamaGen**
- Zéro signup, accès instantané
- 100K+ utilisateurs
- Basique mais parfait pour prototyper rapidement
- Aucune cohérence de personnages entre images

**AI Comic Factory**
- GitHub : `jbilcke-hf/ai-comic-factory`
- Stack : Next.js + LLM + SDXL
- Self-hostable, 100% contrôle
- Bon pour les devs qui veulent customiser

**Jenova AI**
- Spécialisé webtoon vertical
- Identity embedding multi-épisodes
- Conçu pour les séries avec personnages récurrents

---

## 2. Stable Diffusion / FLUX — Workflows locaux

### Meilleurs modèles pour style BD/manga

- **AAM XL AnimeMix** (SDXL) — top anime, très polyvalent
- **Anything V5** (SD 1.5) — portraits anime détaillés
- **MeinaMix** (SD 1.5) — vibrant, peu de prompting nécessaire
- **Blue_Pencil-XL** (SDXL) — linework propre, idéal webtoon
- **FLUX.2 Digital Comic Art** — trigger word `d1g1t4l`
- **RetroComicFlux** — LoRA FLUX style rétro BD franco-belge

### Pipeline ControlNet (croquis → BD)

1. **Line Art ControlNet** → préserve les détails du croquis
2. **Pose ControlNet** → verrouille la position du corps
3. **Depth ControlNet** → maintient la structure spatiale
4. Combiner avec un checkpoint manga + style LoRA

L'ordre est important : Line Art d'abord pour la structure, Pose pour les personnages, Depth pour la profondeur.

### ComfyUI workflows testés par la communauté

- "Easy Consistent Characters for Comics (No LoRA Training!)" — OpenArt
- "Consistent Character Maker (Comics Strip) V3" — OpenArt
- "Consistent Character Creator 3.0" — RunComfy (modèle Qwen Image Edit)

**Chaîne type :**
```
Reference Image → IPAdapter FaceID → ControlNet (Pose) → SDXL → Style LoRA → Rendu
```

---

## 3. Cohérence des personnages — Le vrai défi

| Méthode | Fidélité | Flexibilité | Facilité | VRAM | Setup |
|---|---|---|---|---|---|
| **IPAdapter FaceID** | Moyenne | Haute | Facile | 6 GB | Minutes |
| **InstantID** | Haute (82-86%) | Moyenne-Haute | Moyen | 8-12 GB | Minutes |
| **PuLID** | Très haute | Basse-Moyenne | Difficile | 12 GB+ | Minutes |
| **LoRA entraîné** | La meilleure | La meilleure | Difficile | 12-24 GB | Heures |
| **Prompt seul** | Basse | Haute | Facile | Aucun | Aucun |

### Notes

- **LoRA** = gold standard pour BD sérialisée. 20-40 images, 800-1000 steps, ~1h training. La meilleure cohérence sur des dizaines de pages.
- **InstantID** = meilleur rapport qualité/facilité pour la production. Bonne fidélité sans entraînement.
- **PuLID + FLUX** = plus haute fidélité mais le plus exigeant en ressources. Réservé aux machines puissantes.
- **IPAdapter** = bon pour prototypage rapide, mais dérive sur les séquences longues (10+ images).
- **Prompt seul** = oublie. Impossible de maintenir la cohérence sur une BD.

---

## 4. Pipeline text-to-comic automatisé

Possible mais avec des limites claires :

1. LLM parse le script → descriptions de cases + dialogues + layout
2. Image model génère chaque case avec references perso
3. Layout engine compose la page (gouttières, flow)
4. Placement des bulles + texte
5. Export web ou print

**Qualité actuelle :**
- Images individuelles : 7-8/10
- Cohérence par page : 6-7/10
- Cohérence sur 10+ pages : 4-5/10 sans LoRA

Le goulot d'étranglement reste la cohérence des personnages sur de longues séquences.

---

## 5. Workflow recommandé pour AmazighComics

**En tant que dessinateur qui sait dessiner, voici le pipeline optimal :**

1. **Toi** → croquis/storyboard de chaque case (papier ou tablette)
2. **IA (Stable Diffusion + ControlNet)** → transforme tes croquis en rendus stylisés
3. **IA (IPAdapter ou LoRA)** → cohérence des personnages récurrents
4. **Toi** → retouches manuelles (expressions, détails kabyles, bijoux, motifs)
5. **Clip Studio Paint** → lettrage, bulles, export final
6. **Site web (notre POC)** → publication et lecture

### Avantage de ce workflow

Tu gardes le contrôle artistique total (composition, storytelling) tout en accélérant x5-10 la production grâce à l'IA pour le rendu et la colorisation.

---

## 6. API de génération d'images (pour le site)

| Service | Prix | Vitesse | Modèles | Setup |
|---|---|---|---|---|
| **Together AI (FLUX.1 schnell)** | Gratuit 3 mois | ~2s/image | FLUX.1 | REST API simple |
| **Hugging Face Inference API** | Gratuit (limité) | Variable | Multiples | SDK Python/JS |
| **Replicate** | ~$0.00025/s | 3-5s | SDXL, FLUX, etc. | API REST |
| **SD WebUI local** | Gratuit | Dépend GPU | Tous | `--api` flag |
| **ComfyUI local** | Gratuit | Dépend GPU | Tous | Node-based |

Pour le POC : Together AI est le meilleur choix (gratuit, rapide, API simple).
Pour la production : ComfyUI local si tu as un GPU, sinon Replicate.

---

## 7. Lecteurs webtoon open source existants

- **react-comic-viewer** (`piro0919/react-comic-viewer`) — composant React léger, zoom, swipe, lazy load
- **Yomikiru** (`mienaiyami/yomikiru`) — Electron + React + TypeScript, scroll seamless
- **Open Webtoon Reader** — Vue.js client-serveur, lecture online + offline

### Pattern standard d'implémentation

```
IntersectionObserver + preloading 2-5 images ahead + skeleton placeholders
```

C'est ce qu'on implémente dans notre POC.

---

## 8. Options pour les images placeholder du POC

| Approche | Effort | Rendu | Coût |
|---|---|---|---|
| **CSS/SVG pur** | Minimal | Stylisé, zéro deps, motifs berbères | Gratuit |
| **@napi-rs/canvas** (Node.js) | Moyen | PNG générés avec texte/gradients | Gratuit |
| **Together AI (FLUX.1)** | Faible | Vrai rendu BD via API | Gratuit 3 mois |
| **Dashtoon/LlamaGen** | Aucun | Depuis plateforme | Gratuit |

**Choix pour le POC : CSS/SVG pur** — zéro dépendances, motifs berbères intégrés, parfait pour valider le lecteur avant d'avoir les vrais dessins.
