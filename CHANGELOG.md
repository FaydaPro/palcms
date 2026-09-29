# Changelog

## 1.1.0

**Données du monde** (lecture des sauvegardes avec `sav_cli`, serveur installé par PalCMS)
- Inventaire, Pals (talents, passifs, chanceux, alpha) et guilde de chaque joueur dans le panel
- Recherche d'un objet chez tous les joueurs
- Pages publiques Guildes (membres, niveau, bases) et Paldex du serveur (espèces, raretés, meilleurs collectionneurs)
- « Mon personnage » dans le profil des joueurs inscrits
- Carte : calques des bases de guildes, points de voyage rapide et tours de boss

**Surveillance**
- Jauges FPS, temps de frame, joueurs, bases, processeur, mémoire, disque
- Alertes avec seuils réglables (FPS bas, mémoire, disque, API injoignable, crash), aussi envoyées sur Discord
- Historique sur 24 h, 7 jours et 30 jours ; sauvegarde du monde en un clic ; arrêt propre avec compte à rebours
- Statistiques de fréquentation : heures de pointe, joueurs uniques, nouveaux joueurs, joueurs qui reviennent
- Page publique de disponibilité (30 jours, fréquentation par heure, prochain redémarrage)

**Événements et préréglages**
- Préréglages prêts à l'emploi (Détente, Normal, Difficile, taux x2, taux x3) et préréglages personnalisés
- Événements programmés (ex. week-end XP x3) : réglages appliqués au début, anciens réglages remis à la fin, joueurs prévenus en jeu
- Calendrier public et compte à rebours sur l'accueil
- Import / export de la configuration (sans les mots de passe)

**Modération**
- Avertissements, notes privées, bannissements temporaires levés automatiquement, historique par joueur
- Anti-triche léger : montées de niveau anormales, quantités d'objets suspectes
- Signalements et suggestions envoyés par les joueurs depuis le site, avec réponse de l'équipe

**Mises à jour**
- Mise à jour automatique du serveur Palworld dès qu'une nouvelle version sort (annonces, sauvegarde, redémarrage)
- Mise à jour de PalCMS en un clic depuis le panel

## 1.0.2

## 1.0.2

- Installation : sur un VPS tout neuf, le script attend la fin des mises à jour automatiques d'Ubuntu au lieu de s'arrêter sur « Could not get lock /var/lib/dpkg/lock-frontend »

## 1.0.1

- Démo en ligne sur GitHub Pages : le site public et le panel admin avec des données fictives, sans serveur. Mise à jour automatique à chaque push sur `main`
- Captures d'écran dans le README

## 1.0.0

Première version.

**Installation**
- Une commande sur Ubuntu 22.04 / 24.04 (`install.sh`) : IP ou domaine, racine ou sous-chemin (`/cms`), HTTPS avec Let's Encrypt, auto-signé ou sans
- Assistant web protégé par un jeton à usage unique
- Au choix : installer un nouveau serveur Palworld, connecter un serveur existant, ou juste le site (serveur à connecter plus tard)
- `palcms-config` pour changer l'adresse, le chemin ou le HTTPS après coup
- Crossplay : le serveur apparaît dans la liste des serveurs communautaires (Xbox, Game Pass PC et PS5 ne peuvent pas se connecter par IP)

**Site public**
- Accueil, actus, pages, menu modifiable, thème clair / sombre
- Statut et joueurs connectés en temps réel
- Carte en direct avec la position des joueurs et des points d'intérêt
- Classement (niveau, temps de jeu, ancienneté, constructions)
- Profils de joueurs avec graphiques
- Comptes joueurs via Steam (validés automatiquement) ou par email (validés par l'équipe)

**Panel admin**
- Serveur : tableau de bord, démarrage / arrêt / redémarrage, éditeur de `PalWorldSettings.ini`, joueurs, logs en direct, sauvegardes auto avec restauration, redémarrages programmés avec annonces, mises à jour SteamCMD, annonces en jeu, kick / ban / whitelist, console RCON
- Site : pages, actus, menu, apparence, thèmes, carte, webhooks Discord, modules, membres
- Équipe avec rôles (Administrateur, Modérateur, Rédacteur + rôles perso) et journal des actions

**Sécurité**
- Le CMS ne tourne pas en root, les actions système passent par `palctl` (liste blanche de commandes)
- Protection CSRF, HTML nettoyé côté serveur, vérification des images, mots de passe hachés (scrypt)
