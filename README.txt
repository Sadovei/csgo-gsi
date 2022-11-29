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
