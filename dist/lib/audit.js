import { supabase } from './supabase.js';
export async function logAudit(payload) {
    try {
        const { action, entity, entityId, actorId, actorEmail, meta } = payload;
        await supabase.from('AuditLogs').insert([
            {
                Action: action,
                Entity: entity ?? null,
                EntityId: entityId ?? null,
                ActorId: actorId ?? null,
                ActorEmail: actorEmail ?? null,
                Meta: meta ? JSON.stringify(meta) : null,
            },
        ]);
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to write audit log', e);
    }
}
