/*
 * THE LEGEND OF LEGIONA — MINECRAFT SKIN AVATAR HELPER
 * /gov/assets/js/avatar.js
 *
 * Shared helper for rendering a citizen/founder's Minecraft skin avatar
 * anywhere a username/IGN/gamertag is shown across the gov portal
 * (gov index founders, citizenship apply/status, admin dashboard).
 * Uses the same tabavatars.net "helm" render already relied on by
 * systems/id/id-card.html, so behaviour is identical everywhere.
 *
 * Usage:
 *   <span class="mc-avatar" data-mc-avatar>
 *     <img class="mc-avatar-img" alt="">
 *     <span class="mc-avatar-ph">?</span>
 *   </span>
 *
 *   mcSetAvatar(wrapperEl, username, platform, fallbackText)
 *   — or —
 *   mcAvatarUrl(username, platform, type)  // just the URL, e.g. for CSS backgrounds
 */
(function () {
  function mcAvatarUrl(username, platform, type) {
    if (!username) return '';
    type = type || 'helm';
    var bedrock = (platform === 'bedrock') ? '&platform=bedrock' : '';
    return 'https://tabavatars.net/avatar/?username=' + encodeURIComponent(username) + '&type=' + type + bedrock;
  }

  // wrapperEl: an element containing .mc-avatar-img and (optionally) .mc-avatar-ph
  function mcSetAvatar(wrapperEl, username, platform, fallbackText, type) {
    if (!wrapperEl) return;
    var img = wrapperEl.querySelector('.mc-avatar-img');
    var ph  = wrapperEl.querySelector('.mc-avatar-ph');
    if (!img) return;

    if (ph && fallbackText !== undefined) ph.textContent = fallbackText;

    username = (username || '').trim();
    if (!username) {
      img.style.display = 'none';
      img.removeAttribute('src');
      if (ph) ph.style.display = 'flex';
      return;
    }

    img.crossOrigin = 'anonymous';
    img.alt = username + "'s Minecraft skin";
    img.onload = function () { img.style.display = 'block'; if (ph) ph.style.display = 'none'; };
    img.onerror = function () { img.style.display = 'none'; if (ph) ph.style.display = 'flex'; };
    img.src = mcAvatarUrl(username, platform, type);
  }

  window.mcAvatarUrl = mcAvatarUrl;
  window.mcSetAvatar = mcSetAvatar;
})();
