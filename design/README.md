# Design sources — internal, not part of the website

Art-direction exploration for the homepage. These files are **not** part of the
live site and nothing in `/` links to them.

- `Main.dc.html` — Direction A, "Field Notes" (Newsreader + Karla)
- `ConsultingRoom.dc.html` — Direction B, "Consulting Room" (EB Garamond + Archivo)
- `Atrium.dc.html` — Direction C, "Atrium" (Bodoni Moda + Jost)
- `canvas.json` — canvas layout and the notes shown beside each direction

Kept in version control as the record of why the site looks the way it does.

**Before the production cutover:** `amplify.yml` deploys the repository root with
`files: '**/*'`, so this folder would ship to the live site. Delete `design/` (or
move it out of the repo) once a direction is chosen and built.
