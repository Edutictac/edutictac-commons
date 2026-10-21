// Preserve provider identifiers and local/Tailnet links; accept navigable URLs only.
export function resourceAssignment(resource, groupId, location = window.location) {
  if (typeof resource.external_id !== 'string' || !resource.external_id) throw new Error('invalid_resource');
  const raw = resource.play_url || resource.source_url || resource.reuse_url || resource.download_url || '';
  let launchUrl = '';
  if (raw) {
    const url = new URL(raw, location.origin);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('invalid_resource_url');
    const local = host => ['localhost', '127.0.0.1', '[::1]', '::1'].includes(host);
    if (local(url.hostname) && !local(location.hostname)) {
      url.hostname = location.hostname;
      if (url.port === '8086' && location.port === '18082') url.port = '18086';
    }
    launchUrl = url.toString();
  }
  const appId = ['edutictac-play', 'eduhoot'].includes(resource.provider) ? resource.provider : 'resource';
  return {group_id: groupId, app_id: appId,
    activity_id: appId === 'edutictac-play' && resource.external_id.startsWith('edutictac-play:') ? resource.external_id.slice('edutictac-play:'.length) : resource.external_id,
    title: resource.title || resource.external_id, launch_url: launchUrl};
}
