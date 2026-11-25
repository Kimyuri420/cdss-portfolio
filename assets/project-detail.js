(() => {
  const hash = window.location.hash;
  if (!hash || hash === "#" || hash.startsWith("#:~:")) return;

  let id;
  try {
    id = decodeURIComponent(hash.slice(1));
  } catch {
    return;
  }
  if (document.getElementById(id)) return;

  // Old detail links can still reach their original sections.
  const detail = new URL("./engineering.html", window.location.href);
  detail.hash = hash;
  window.location.replace(detail);
})();
