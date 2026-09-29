# Mentions tierces

## Carte de Palpagos — `apps/web/public/map-palpagos.jpg`

- **Contenu** : carte officielle de Palpagos (texture `T_WorldMap`), réduite de 8192 à 4096 px (JPEG, qualité 80).
- **Droits** : **© Pocketpair, Inc.** Ce fichier n'est **pas** couvert par la licence MIT de PalCMS.
- **Source** : [LukeHollandDev/palworld-live-map](https://github.com/LukeHollandDev/palworld-live-map), fichier `assets/palworld/maps/palpagos.jpg`. SHA-256 de l'original : `9961632d5c38a0a67fd18713fa63af0ac6f192e71fadeb5ba53ae696b8914dd1`.
- **Calibration** (coordonnées monde `[maxX, maxY, minX, minY]`) : `[349400, 724400, -1099400, -724400]`.

Si Pocketpair demande le retrait de ce fichier, il suffit de le supprimer. Le CMS affiche alors une carte neutre, et chaque admin peut importer sa propre image depuis le panel (*Gestion du site > Carte*).

## Conversions de coordonnées — `packages/shared/src/mapCoords.ts`

- La conversion des coordonnées vers l'image reprend la convention de calibration de [palworld-live-map](https://github.com/LukeHollandDev/palworld-live-map) (licence MIT, © 2026 Luke Holland).
- La conversion vers les coordonnées affichées en jeu reprend la formule de [palworld-coord](https://github.com/palworldlol/palworld-coord) (licence MIT).

## Marques

Palworld est une marque de Pocketpair, Inc. PalCMS est un projet indépendant, sans lien avec Pocketpair : il n'est ni affilié, ni approuvé, ni sponsorisé par cette société.

## Dépendances

Les bibliothèques utilisées (Fastify, React, Leaflet, TipTap, Tailwind CSS, better-sqlite3…) sont distribuées sous leurs propres licences open source. Ces licences sont incluses dans leurs paquets respectifs, dans `node_modules`.
