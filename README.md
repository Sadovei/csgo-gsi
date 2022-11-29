## Important Notes

- Install the `GSI Config` and `Game Mod` on the **Main Observer PC**
- Install and run this `GSI Server` project on a separate PC from the main observer to improve performance

## Config Setup

Make sure that Dota 2 is not running during the installation process.

### GSI Config Installation

Copy `resources\gamestate_integration_pgl.cfg` to `<steam apps directory>\dota 2 beta\game\dota\cfg\gamestate_integration`. _If `gamestate_integration` does not exist, just create a new folder._

### Game Mod Installation

1.  Create a new folder called `pgl_mod` inside `<steam apps directory>\dota 2 beta\game`
2.  Copy `resources\pak01_dir.vpk` inside the `pgl_mod` folder
3.  Edit the file `<steam apps directory>\dota 2 beta\game\dota\gameinfo.gi` and add the following lines on the `SearchPaths` section:

        Game				pgl_mod  // <-- ADD THIS LINE
        Game				dota
        Game				core

        Mod					pgl_mod // <-- ADD THIS LINE
        Mod					dota

# Project Setup

- **We will be using `yarn` instead of `npm`**

Install `Yarn` by running `npm install --global yarn`

- **Install dependencies**

Run `yarn install`

- **Start Dev Server**

Run `yarn dev`

- **Server Address**

Copy the GSI Server address and port displayed on the console. This will be used on the Overlay APP setup.


CSGO - 2022

BACKEND
    1. Proiectul se gaseste cu numele csgo-gsi-v2 pe github.
    2. necesita un fisier .env prin care se specifica tipul de stream(A sau B), unde isi seteaza portul definit, 4400 sau 4600.
    3. In fisierul index al folderului Vmix, trebuie setat ip-ul unde se gasesc camerele jucatorilor.
    4. Comunicarea cu parser-ul se face tot pe baza fisierului .env, unde parserul trebuie sa fie pe 4500, respectiv 4700.
    5. De verificat pe viitor, MVP si diferenta de ADR de la clientii diferiti(main si igdir)

FRONTEND
    1. Proiectul se gaseste cu numele CSGO-HUD-2021 pe github.
    2. In interiorul proiectului se afla toate versiunile de HUD + cele complementare, de unde isi trag informatiile din acelasi loc.
    3. Necesita tot un fisier .env, prin care se specifica stream-ul, mai exact de pe ce port sa-si ia datele necesare.
    4. In package.json, se specifica in homepage, locul unde o sa fie build-uit proiectul final, pentru a rula corespunzator.

Pentru a pune HUD-ul pe un pc, este nevoie de aplicatia ELECTRON unde se pune adresa HUD-ului cu argumentul (.../?client=main), iar in csgo,
sa fie instalat cfg-ul aferent clientului ales in browser.( in exemplul anterior cfg-ul de main-obs).
