# Images du site AM

Toutes les images sont ici, dans des sous-dossiers clairs. Pour l'instant ce
sont des placeholders graphiques (fond noir/or avec le monogramme "AM") — tu
peux les remplacer par tes vraies photos **en gardant exactement le même nom
de fichier** (même si tu passes de `.svg` à `.jpg`/`.png`, il faudra alors
aussi changer l'extension dans `src/config/site.config.ts`, à l'endroit où
le produit référence son image).

## `products/` — photos produits

Trois photos par produit, nommées `<slug-du-produit>-<angle>.svg` :

- `-face` : le produit seul, à plat ou sur cintre
- `-porte` : le produit porté (sans visage identifiable si c'est une
  personne — cadrage sur le buste/le vêtement)
- `-detail` : un gros plan (matière, couture, logo...)

Le `<slug-du-produit>` correspond au champ `slug` de chaque produit dans
`src/config/site.config.ts` (ex. `t-shirt-col-polo-creme`).

Pour ajouter un nouveau produit : ajoute-le dans `site.config.ts`, dépose ses
3 photos ici avec le même schéma de nom, et renseigne les chemins dans
`images.face` / `images.porte` / `images.detail`.

## `hero/` — image ou vidéo de la page d'accueil

`hero-home.svg` : le fond plein écran de la page d'accueil. Tu peux le
remplacer par une photo (`hero-home.jpg`) ou une vidéo courte — dans ce
dernier cas, dis-le moi pour que j'adapte le composant Hero (actuellement
prévu pour une image).

## `brand/` — logo

`logo-am.svg` : le logo utilisé dans le header et le footer. Si tu as un
logo vectoriel définitif, dépose-le ici sous le même nom.
