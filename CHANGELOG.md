# Changelog

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
