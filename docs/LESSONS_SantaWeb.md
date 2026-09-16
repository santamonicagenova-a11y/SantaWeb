# LESSONS — SantaWeb

Solo regole anti-errore, mai cronaca di sessione (quella è nel CHANGELOG). Riletto in apertura sessione.

- Le modifiche a `menu-admin.html` (e più in generale al pannello admin) vanno fatte direttamente sul branch `main`, non su un branch feature separato — anche quando l'harness propone di default un branch dedicato per la sessione. Se l'harness assegna un branch diverso, mergiare (fast-forward quando possibile) su `main` e pushare lì prima di chiudere il task — correzione dell'utente (2026-09-16).
- Questa sessione gira in un ambiente cloud isolato (container remoto): non ha accesso al filesystem locale dell'utente (es. cartelle Windows tipo `D:\...`). Gli "archivi export" locali che l'utente mantiene come backup del repo vanno aggiornati dall'utente stesso (pull/sync) o tramite un meccanismo esplicito da concordare — Claude non può scrivere lì direttamente (osservazione del 2026-09-16, da confermare con l'utente se emergono soluzioni).
