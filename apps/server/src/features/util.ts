import type { FeatureHost, FeatureRoute } from '@palcms/shared';
import type { ZodType, ZodTypeDef } from 'zod';

/** Une fonctionnalité du CMS : ses routes et, si besoin, un démarrage / arrêt (tâches de fond, écouteurs). */
export interface Feature {
  routes?: FeatureRoute[];
  start?(): void;
  stop?(): void;
}

export type FeatureFactory = (host: FeatureHost, bus: FeatureBus) => Feature;

/** Erreur HTTP renvoyée telle quelle au navigateur (la passerelle lit "status"). */
export function httpError(status: number, message: string): Error & { status: number } {
  return Object.assign(new Error(message), { status });
}

export function parseBody<T>(schema: ZodType<T, ZodTypeDef, unknown>, data: unknown): T {
  const res = schema.safeParse(data ?? {});
  if (res.success) return res.data;
  const flat = res.error.flatten();
  throw httpError(400, (Object.values(flat.fieldErrors).flat() as string[])[0] ?? flat.formErrors[0] ?? 'Données invalides');
}

type ProEvents = {
  'backup:done': { name: string; tag: string };
  'backup:failed': { tag: string; error: string };
  'restart:warning': { minutes: number };
  'restart:done': { updated: boolean };
  'restart:failed': { error: string };
  'update:done': Record<string, never>;
  /** Arrêt voulu (redémarrage programmé, restauration…) : ce n'est pas un crash. */
  intentional: Record<string, never>;
};

/** Petit bus interne aux fonctionnalités (ex. sauvegardes → Discord). */
export class FeatureBus {
  private listeners = new Map<string, Set<(d: unknown) => void>>();
  on<E extends keyof ProEvents>(event: E, fn: (d: ProEvents[E]) => void): () => void {
    let s = this.listeners.get(event);
    if (!s) this.listeners.set(event, (s = new Set()));
    s.add(fn as (d: unknown) => void);
    return () => s!.delete(fn as (d: unknown) => void);
  }
  emit<E extends keyof ProEvents>(event: E, data: ProEvents[E]): void {
    for (const fn of this.listeners.get(event) ?? []) {
      try {
        fn(data);
      } catch (e) {
        console.error(`[features] ${event}`, e);
      }
    }
  }
}

/** Minuterie qui ne bloque pas l'arrêt du processus et survit aux erreurs. */
export function every(ms: number, fn: () => unknown): () => void {
  const t = setInterval(() => {
    Promise.resolve()
      .then(fn)
      .catch((e) => console.error('[features] tâche de fond :', e));
  }, ms);
  t.unref?.();
  return () => clearInterval(t);
}

export const errorText = (e: unknown) => (e instanceof Error ? e.message : String(e));

/** Date locale du VPS au format AAAA-MM-JJ. */
export function localDay(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
