#!/usr/bin/env node
// Faux palctl pour le développement : même interface que scripts/palctl, mais ne touche à rien.
// Il simule l'installation (avec délais) et le service palworld via tools/.dev-data/state.json.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { DEV_DIR, INI_FILE, LOG_FILE, appendLog, readState, writeState } from '../dev-state.mjs';

const BACKUP_DIR = path.join(DEV_DIR, 'backups');
const BACKUP_RE = /^palworld-\d{8}-\d{6}-(manual|auto|prerestart|preupdate|prerestore)\.tar\.gz$/;

const FAST = process.env.PALCTL_FAST === '1';
const sleep = (ms) => new Promise((r) => setTimeout(r, FAST ? 0 : ms));
const out = (s) => process.stdout.write(s + '\n');
const die = (msg, code = 2) => {
  process.stderr.write(`palctl: ${msg}\n`);
  process.exit(code);
};

const [cmd, ...args] = process.argv.slice(2);
const state = readState();

async function main() {
  switch (cmd) {
    case 'install-deps': {
      for (const l of [
        "==> Activation du dépôt multiverse et de l'architecture i386",
        'Hit:1 http://archive.ubuntu.com/ubuntu noble InRelease',
        'Reading package lists... Done',
        '==> Installation de steamcmd et lib32gcc-s1',
        'Setting up lib32gcc-s1 (14.2.0-4ubuntu2) ...',
        'Setting up steamcmd:i386 (0~20180105-5) ...',
        "==> Création de l'utilisateur steam",
        '✔ Dépendances installées (simulation)',
      ]) {
        out(l);
        await sleep(350);
      }
      state.depsInstalled = true;
      break;
    }
    case 'install-palworld': {
      if (!state.depsInstalled) die('steamcmd absent : lancer install-deps avant', 3);
      out('Redirecting stderr to /home/steam/Steam/logs/stderr.txt');
      out('[  0%] Checking for available updates...');
      await sleep(400);
      for (let p = 0; p <= 100; p += 8) {
        out(` Update state (0x61) downloading, progress: ${Math.min(p, 100).toFixed(2)} (${Math.round(p * 38.5)}000000 / 3850000000)`);
        await sleep(250);
      }
      out(" Success! App '2394010' fully installed.");
      out('==> steamclient.so copié dans ~/.steam/sdk64');
      state.palworldInstalled = true;
      break;
    }
    case 'update-palworld':
      out(" Success! App '2394010' already up to date.");
      break;
    case 'write-service': {
      const [port, players] = args;
      state.service.port = Number(port);
      state.service.players = Number(players);
      out(`==> /etc/systemd/system/palworld.service écrit (port ${port}, ${players} joueurs)`);
      break;
    }
    case 'service': {
      const action = args[0];
      const s = state.service;
      if (action === 'is-active' || action === 'status') {
        out(s.active ? 'active' : 'inactive');
        if (!s.active) process.exit(3);
        break;
      }
      if (action === 'enable') {
        s.enabled = true;
        out('Created symlink /etc/systemd/system/multi-user.target.wants/palworld.service');
        break;
      }
      if (action === 'start' || action === 'restart') {
        if (!state.palworldInstalled) die('Palworld non installé', 5);
        if (!fs.existsSync(INI_FILE)) die('PalWorldSettings.ini absent', 5);
        await sleep(600);
        s.active = true;
        appendLog(action === 'restart' ? 'Server restarted' : 'Server started');
        appendLog('Running Palworld dedicated server on :' + s.port);
        break;
      }
      if (action === 'stop') {
        await sleep(400);
        s.active = false;
        appendLog('Server stopped');
        break;
      }
      die(`action inconnue : ${action}`);
      break;
    }
    case 'firewall-open':
      out(`Rule added (${args[0]}/udp)`);
      break;
    case 'write-config': {
      const chunks = [];
      for await (const c of process.stdin) chunks.push(c);
      const content = Buffer.concat(chunks).toString('utf8');
      if (content.length > 65536) die('configuration trop grande');
      if (!content.startsWith('[/Script/Pal.PalGameWorldSettings]') || !content.includes('OptionSettings=(')) die('configuration invalide');
      fs.writeFileSync(INI_FILE, content);
      out('==> PalWorldSettings.ini mis à jour');
      break;
    }
    case 'read-config':
      if (!fs.existsSync(INI_FILE)) die('PalWorldSettings.ini introuvable', 3);
      process.stdout.write(fs.readFileSync(INI_FILE, 'utf8'));
      break;
    case 'logs': {
      const n = Number(args[0]) || 100;
      const lines = fs.existsSync(LOG_FILE) ? fs.readFileSync(LOG_FILE, 'utf8').trim().split('\n') : ['-- No entries --'];
      out(lines.slice(-n).join('\n'));
      break;
    }
    case 'tail-logs': {
      const events = ['Player joined', 'Autosave completed', 'Player left', 'Tick rate stable (60 FPS)', 'Base camp worker idle'];
      for (;;) {
        await sleep(3000);
        const line = `${new Date().toISOString()} palworld[4242]: ${events[Math.floor(Math.random() * events.length)]}`;
        fs.appendFileSync(LOG_FILE, line + '\n');
        out(line);
      }
    }
    case 'backup-create': {
      if (!['manual', 'auto', 'prerestart', 'preupdate', 'prerestore'].includes(args[0])) die('type de sauvegarde invalide');
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
      const d = new Date();
      const p = (n) => String(n).padStart(2, '0');
      const name = `palworld-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}-${args[0]}.tar.gz`;
      await sleep(500);
      fs.writeFileSync(path.join(BACKUP_DIR, name), zlib.gzipSync(`Sauvegarde simulée du ${d.toISOString()}\n`.repeat(2000)));
      out(name);
      break;
    }
    case 'backup-list': {
      if (!fs.existsSync(BACKUP_DIR)) break;
      const files = fs.readdirSync(BACKUP_DIR).filter((f) => BACKUP_RE.test(f)).sort().reverse();
      for (const f of files) {
        const st = fs.statSync(path.join(BACKUP_DIR, f));
        out(`${f}\t${st.size}\t${(st.mtimeMs / 1000).toFixed(3)}`);
      }
      break;
    }
    case 'backup-restore':
    case 'backup-delete':
    case 'backup-download': {
      if (!BACKUP_RE.test(args[0] ?? '')) die('nom de sauvegarde invalide');
      const file = path.join(BACKUP_DIR, args[0]);
      if (!fs.existsSync(file)) die('sauvegarde introuvable');
      if (cmd === 'backup-delete') {
        fs.rmSync(file);
        out(`==> ${args[0]} supprimée`);
      } else if (cmd === 'backup-download') {
        process.stdout.write(fs.readFileSync(file));
      } else {
        const wasActive = state.service.active;
        state.service.active = false;
        await sleep(800);
        appendLog(`World restored from ${args[0]}`);
        state.service.active = wasActive;
        out(`==> Monde restauré depuis ${args[0]}`);
      }
      break;
    }
    default:
      die(`commande inconnue : ${cmd ?? '(vide)'}`);
  }
  writeState(state);
}

await main();
