import type { FeatureHost, HostDatabase } from '@palcms/shared';
import { config } from '../config';
import { db, runMigrations, settings } from '../db';
import { events } from '../core/events';
import { modules } from '../core/modules';
import { realtime } from '../core/realtime';
import { getExternalServer, getServerMode, getSiteSettings, saveSiteSettings } from '../core/site';
import { readConfigValues, updateConfig } from '../palworld/configService';
import { palctlRawStream, runPalctl } from '../palworld/palctl';
import { poller, publicPlayerId } from '../palworld/poller';
import { palworld } from '../palworld/restClient';
import { restartServer, serviceState, startServer, stopServer } from '../palworld/service';

/** Services du cœur du CMS confiés aux fonctionnalités. */
export function createFeatureHost(): FeatureHost {
  return {
    version: config.version,
    basePath: config.basePath,
    publicUrl: config.publicUrl,
    db: db as unknown as HostDatabase,
    settings,
    runMigrations,
    events,
    realtime: {
      broadcast: (channel, msg) => realtime.broadcast(channel, msg),
      setSnapshot: (channel, key, fn) => realtime.setSnapshot(channel, key, fn),
    },
    palworld: {
      announce: (m) => palworld.announce(m),
      kick: (u, m) => palworld.kick(u, m),
      ban: (u, m) => palworld.ban(u, m),
      unban: (u) => palworld.unban(u),
      save: () => palworld.save(),
    },
    palctl: (args, opts) => runPalctl(args, opts),
    palctlStream: (args) => palctlRawStream(args),
    server: {
      mode: getServerMode,
      external: getExternalServer,
      state: () => serviceState(),
      start: () => startServer(),
      stop: () => stopServer(),
      restart: () => restartServer(),
      status: () => poller.getStatus(),
      onlinePlayers: () => poller.getOnlineRaw(),
      leaderboardRows: () =>
        db
          .prepare<[], { public_id: string; name: string; level: number; online: number; playtime_seconds: number }>(
            'SELECT public_id, name, level, online, playtime_seconds FROM players',
          )
          .all(),
      publicPlayerId,
      readConfig: () => readConfigValues(),
      updateConfig: (values, restart) => updateConfig(values, restart),
    },
    site: { get: getSiteSettings, save: saveSiteSettings },
    modules: { isEnabled: (id) => modules.isEnabled(id) },
    log: (message) => console.log(`[features] ${message}`),
  };
}
