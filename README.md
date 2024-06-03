#  🧌 Project Magic The Gathering

<img width="1512" alt="Capture d’écran 2024-06-03 à 21 43 26" src="https://github.com/HamzaChl/manamasters-WPL/assets/91462821/3c92550f-81dd-446a-8b26-fac9f54d49c8">

## Projectbeschrijving

Gemeenschappelijk is een Express/Node.js applicatie met MongoDB als database. De applicatie stelt gebruikers in staat om projecten te kiezen en decks van kaarten te beheren, waarbij elke gebruiker zijn eigen decks heeft. De kaarten worden opgehaald via de Magic: The Gathering API.

## Functionaliteiten

- **Landing Page:** Gebruikers zien een overzicht van alle beschikbare projecten, inclusief naam en afbeelding.
- **Project Selectie:** Gebruikers kunnen een project kiezen, mits ze zijn ingelogd.
- **Inloggen:** Gebruikers moeten inloggen om toegang te krijgen tot de projectdetails.
- **Kaarten Zoeken:** Gebruikers kunnen kaarten zoeken via een zoekbalk, waarbij de eerste 10 kaarten met de zoekterm worden getoond.
- **Kaart Eigenschappen:** Verschillende randen voor Commons, Uncommons, Rares en Mythic Rares.
- **Kaart Vergroten:** Kaarten vergroten wanneer je erover hovert.
- **Kaart Toevoegen:** Gebruikers kunnen kaarten in hun decks toevoegen.
- **Deck Overzicht:** Gebruikers kunnen hun decks beheren, inclusief het toevoegen en verwijderen van kaarten.
- **Drawtest:** Gebruikers kunnen een drawtest uitvoeren om te zien hoe een deck presteert bij het trekken van kaarten.

## Installatie

Volg de onderstaande stappen om de applicatie lokaal te installeren en te draaien:

1. **Clone de repository:**
    ```bash
    git clone [URL van de repository]
    cd [naam van de repository]
    ```

2. **Installeer de benodigde dependencies:**
    ```bash
    npm install
    ```

3. **Start de applicatie:**
    ```bash
    npm start
    ```

De applicatie zal nu draaien op `http://localhost:3000`.

## Gebruik

1. **Landing Page:** Bezoek `http://localhost:3000` om de lijst van projecten te zien.
2. **Inloggen:** Klik op "Inloggen" en voer je gegevens in om toegang te krijgen tot de projectdetails.
3. **Project Selectie:** Klik op een project om de projectdetails te bekijken. Als je niet ingelogd bent, krijg je een melding om eerst in te loggen.
4. **Kaarten Zoeken:** Gebruik de zoekbalk om kaarten op te vragen. De eerste 10 kaarten met de zoekterm worden getoond. (BONUS) Pagina’s met alle resultaten worden weergegeven als er meer dan 10 kaarten zijn.
5. **Kaart Toevoegen aan Deck:** Klik op een kaart om deze te vergroten of een nieuwe pagina te openen. Voeg de kaart toe aan je deck.
6. **Deck Beheren:** Bekijk en beheer je decks via de decks pagina. Voeg kaarten toe, verwijder kaarten, en pas de hoeveelheden aan.
7. **Drawtest:** Voer een drawtest uit om te zien hoe je deck presteert bij het trekken van kaarten.


## Licentie

Dit project is gelicenseerd onder de MIT Licentie. Zie het [LICENSE](LICENSE) bestand voor meer informatie.

## Credits

Dit project is gemaakt door Manamasters: Imran, Charaf en Hamza, en is onderdeel van een schoolopdracht.

## API Documentatie

Voor meer informatie over de gebruikte API, bezoek de officiële [Magic: The Gathering API documentatie](https://api.magicthegathering.io/v1/cards).
