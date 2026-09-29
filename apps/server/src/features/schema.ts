import type { HostMigration, HostModuleDef, Permission } from '@palcms/shared';

const MODERATOR: Permission[] = ['server.players', 'server.logs', 'server.moderation', 'server.announce', 'site.members'];
const EDITOR: Permission[] = ['site.pages', 'site.news'];

export const MIGRATIONS: HostMigration[] = [
  {
    id: 'core:002-features',
    sql: `
      ALTER TABLE users ADD COLUMN admin_role_id INTEGER;

      CREATE TABLE pro_roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE COLLATE NOCASE,
        permissions TEXT NOT NULL,
        builtin INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL
      );
      INSERT INTO pro_roles (name, permissions, builtin, created_at) VALUES
        ('Administrateur', '["*"]', 1, 0),
        ('Modérateur', '${JSON.stringify(MODERATOR)}', 1, 0),
        ('Rédacteur', '${JSON.stringify(EDITOR)}', 1, 0);

      CREATE TABLE pro_audit (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ts INTEGER NOT NULL,
        user_id INTEGER,
        username TEXT,
        action TEXT NOT NULL,
        target TEXT,
        details TEXT
      );
      CREATE INDEX idx_pro_audit_ts ON pro_audit(ts);

      CREATE TABLE pro_player_daily (
        uid TEXT NOT NULL,
        day TEXT NOT NULL,
        level INTEGER NOT NULL,
        playtime_seconds INTEGER NOT NULL,
        PRIMARY KEY (uid, day)
      );

      CREATE TABLE pro_map_poi (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        icon TEXT NOT NULL DEFAULT 'pin',
        color TEXT NOT NULL DEFAULT '#f59e0b',
        x REAL NOT NULL,
        y REAL NOT NULL,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE pro_whitelist (
        uid TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        added_at INTEGER NOT NULL,
        added_by TEXT
      );

      CREATE TABLE pro_bans (
        uid TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        reason TEXT NOT NULL DEFAULT '',
        banned_at INTEGER NOT NULL,
        banned_by TEXT
      );

      CREATE TABLE pro_announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT NOT NULL,
        run_at INTEGER NOT NULL,
        repeat TEXT NOT NULL DEFAULT 'none',
        last_sent_at INTEGER,
        created_by TEXT,
        created_at INTEGER NOT NULL
      );
    `,
  },
];

export const MODULES: HostModuleDef[] = [
  {
    id: 'map',
    name: 'Carte en temps réel (publique)',
    description: 'Carte avec la position des joueurs. Désactivé : seuls les admins la voient.',
    area: 'public',
    toggleable: true,
    defaultEnabled: true,
  },
  {
    id: 'player-stats',
    name: 'Statistiques des joueurs',
    description: 'Graphiques d’évolution (niveau, temps de jeu) sur les profils.',
    area: 'public',
    toggleable: true,
    defaultEnabled: true,
  },
  {
    id: 'backups',
    name: 'Sauvegardes',
    description: 'Sauvegardes automatiques et restauration.',
    area: 'server',
    toggleable: false,
    defaultEnabled: true,
  },
  {
    id: 'schedules',
    name: 'Programmation',
    description: 'Redémarrages programmés, mises à jour et annonces planifiées.',
    area: 'server',
    toggleable: false,
    defaultEnabled: true,
  },
  {
    id: 'moderation',
    name: 'Modération',
    description: 'Expulsions, bannissements et liste blanche.',
    area: 'server',
    toggleable: false,
    defaultEnabled: true,
  },
  {
    id: 'rcon',
    name: 'Console RCON',
    description: 'Commandes admin du serveur depuis le panel.',
    area: 'server',
    toggleable: false,
    defaultEnabled: true,
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Notifications sur un salon Discord (webhook).',
    area: 'site',
    toggleable: false,
    defaultEnabled: true,
  },
  {
    id: 'themes',
    name: 'Thèmes avancés',
    description: 'Police, fond et CSS personnalisé du site public.',
    area: 'site',
    toggleable: false,
    defaultEnabled: true,
  },
];
