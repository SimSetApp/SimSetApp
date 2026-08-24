import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const setupId = body.setup_id;
    const shareUrl = body.share_url || null;
    if (!setupId) return Response.json({ error: 'setup_id is required' }, { status: 400 });

    const webhookUrl = user.discord_webhook_url;
    if (!webhookUrl || !/^https:\/\//.test(webhookUrl)) {
      return Response.json({ error: 'No Discord webhook configured. Add one in your Profile settings.' }, { status: 400 });
    }

    const setup = await base44.entities.SavedSetup.get(setupId);
    if (!setup) return Response.json({ error: 'Setup not found' }, { status: 404 });

    const authorName = user.display_name || user.full_name || (user.email ? user.email.split('@')[0] : 'A sim racer');

    const fields = [];
    fields.push({ name: 'Sim', value: setup.sim_title || '—', inline: true });
    fields.push({ name: 'Car', value: setup.car || '—', inline: true });
    if (setup.track) fields.push({ name: 'Track', value: String(setup.track).slice(0, 1024), inline: true });

    const highlights = ['rear_wing', 'front_splitter', 'brake_bias', 'tc1', 'tc', 'diff_power', 'arb_front', 'arb_rear'];
    const params = setup.parameters || {};
    const paramLines = [];
    for (const key of highlights) {
      const v = params[key];
      if (v !== undefined && v !== null && v !== '') {
        paramLines.push(`**${key}**: ${v}`);
      }
    }
    if (paramLines.length > 0) {
      fields.push({ name: 'Key Parameters', value: paramLines.join('\n').slice(0, 1024), inline: false });
    }
    if (shareUrl) {
      fields.push({ name: 'Open Setup', value: `[View full setup →](${shareUrl})`, inline: false });
    }

    const description = setup.notes
      ? String(setup.notes).slice(0, 400)
      : `New ${setup.sim_title || ''} setup for the ${setup.car || 'car'}${setup.track ? ' at ' + setup.track : ''}.`;

    const embed = {
      title: `🏁 ${setup.title}`.slice(0, 256),
      description,
      color: 0x4f46e5,
      fields,
      footer: { text: `Shared via SimSetApp by ${authorName}`.slice(0, 256) },
      timestamp: new Date().toISOString(),
    };
    if (shareUrl) embed.url = shareUrl;

    const discordRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });

    if (!discordRes.ok) {
      const errText = await discordRes.text().catch(() => '');
      console.error('Discord webhook rejected:', discordRes.status, errText);
      return Response.json({ error: `Discord rejected the message (status ${discordRes.status}). Check your webhook URL in Profile settings.`, details: errText.slice(0, 200) }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error('share-to-discord error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}