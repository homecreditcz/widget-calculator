# Home Credit online kalkulačka – návod k nasazení

> Zpět na [přehled](../README.md).

> Tuto kalkulačku mohou využít pouze vázaní partneři. Pro nevázané partnery ("tipaře") slouží standalone varianta kalkulačky - více info např. [zde](https://github.com/homecreditcz/oneclick-api/wiki/Produk%C4%8Dn%C3%AD-prost%C5%99ed%C3%AD))

Kalkulačka (jejíž kód běží v prohlížeči zákazníka) potřebuje získat data o možných splátkách. Pomocí HTTP GET volá příslušné API endpointy Home Creditu. Tyto požadavky musí obsahovat HTTP hlavičku s odpovídajícím API klíčem.

## Varianty nasazení

Kalkulačku můžete do e-shopu nasadit dvěma způsoby. V obou případech se na stránce používá stejný prvek `<hc-calc>`, stejné parametry i stejná funkce pro zpracování výsledku – liší se jen tím, **odkud se načítá soubor `app.js`** (krok 4).

| | **A) Hostováno u HC (doporučeno)** | **B) Soubor na serveru e-shopu** |
|---|---|---|
| Kde je `app.js` | na serveru Home Creditu (`https://kalkulacka.cdn.homecredit.cz/app.js`) | na vašem webovém serveru |
| Aktualizace kalkulačky | automaticky, do několika minut od vydání | ručně – novou verzi musíte nahrát sami |
| Fonty | kalkulačka si je načte sama | přidáváte do hlavičky stránky |
| Vhodné pro | většinu e-shopů | e-shopy, které nesmí načítat skripty z cizí domény (např. kvůli interním bezpečnostním pravidlům) |

- **Nevíte? Zvolte variantu A.** Nasazení je jednodušší a o aktualizace se nemusíte starat – novou verzi kalkulačky (opravy, úpravy textů, nové funkce) vydává HC a e-shop ji začne používat bez jakékoliv úpravy na své straně.
- **Variantu B** zvolte jen tehdy, pokud potřebujete mít plnou kontrolu nad tím, jaký kód na vašich stránkách běží.

Kroky 1–3 jsou pro obě varianty **úplně stejné**, krok 4 se liší.

## Úprava webových stránek e-shopu

Na stránku s produkty, u kterých si zákazník může zvolit nákup na splátky, je třeba:

### 1. Přidat tlačítko (či obdobný prvek) „Nákup na splátky“

Tlačítko vyvolá kalkulačku pro dané zboží. HTML element bude mít nastavené zpracování události `onclick` – spuštění pomocné funkce `showCalc()`.

```html
<button onclick="showCalc()">Nákup na splátky</button>
```

### 2. Naimplementovat pomocnou funkci `showCalc()`

Funkce obsahuje údaje potřebné pro zobrazení kalkulačky.

- `productSetCode` – konstanta dodaná HC
  - pro testovací účely:
    - CZ: ***COCHCONL***
    - SK: ***COCHCONL***

> Tento parametr udává produktovou sadu Home Creditu, která se má pro výpočet použít. Pokud je zboží zařazeno do speciální akce (např. „Za 0 %“), na kterou se vztahuje kalkulace pod akční produktovou sadou, je potřeba v tomto kroku použít tuto sadu. **Je žádoucí, aby ve správě produktů e-shopu bylo možné tuto vlastnost jednoduše nastavovat (alternativou je mít tuto možnost např. pro vybranou kategorii produktů). Výběr konkrétního produktu pak vede na použití akční produktové sady (`productSetCode`) při inicializaci kalkulačky.**

- `price` – cena daného zboží (košíku) v haléřích / centech
- `language` – jazyk, ve kterém kalkulačka běží: `cs-CZ` nebo `sk-SK`. Pokud není zadán, použije se čeština.
- `downPayment` – výše akontace v haléřích / centech, může být 0
- `fixDownPayment` – vypnutí podpory volitelné akontace
- `dataCalculatorBaseUrl` – pevně daná URL dodaná HC
  - pro testovací účely:
    - CZ: `https://apicz-test.homecredit.cz/verdun-train/public/v1/calculator/`
    - SK: `https://apisk-test.homecredit.sk/verdun-train/public/v1/calculator/`
  - na produkčním prostředí:
    - CZ: `https://api.homecredit.cz/public/v1/calculator/`
- `apiKey` – API klíč, konstanta dodaná HC
  - pro testovací účely:
    - CZ: ***calculator_test_key*** / ***calculator_test_key_dp*** (s podporou akontace)
    - SK: ***calculator_test_key*** / ***calculator_test_key_dp*** (s podporou akontace)
  - na produkčním prostředí:
    - obdržíte od zodpovědné osoby z HC po schválení vaší implementace
- `callback` – JS funkce, která se zavolá, když si zákazník zvolí některou z nabízených možností splácení (v příkladu `processCalcResult`, viz krok 3).
- `debug` – zapnutí ladicího režimu (`app.debug = true`), který pomáhá při implementaci a hledání případných chyb.
- `isModal` – zda se má kalkulačka zobrazit v modálním okně, nebo se má vykreslit do elementu, do kterého ji vložíte (viz `appendChild` níže).
- `hideHeader` – zda se má skrýt hlavička kalkulačky (logo Home Creditu, nadpis a křížek pro zavření).
- `document.body.appendChild(app)` – určuje, kde v DOM se kalkulačka zobrazí. V příkladu se zobrazí v elementu `body`.

```javascript
// příklad pomocné funkce
function showCalc() {
    let app = document.createElement('hc-calc');
    app.callback = processCalcResult;
    app.apiKey = 'calculator_test_key'; // příklad
    app.dataCalculatorBaseUrl = 'https://apicz-test.homecredit.cz/verdun-train/public/v1/calculator/';
    app.productSetCode = 'COCHCONL'; // příklad
    app.price = document.getElementById('price').value; // v haléřích / centech
    app.downPayment = 0; // v haléřích / centech
    app.fixDownPayment = true; // true = zákazník nemůže akontaci měnit
    app.language = 'cs-CZ'; // 'cs-CZ' nebo 'sk-SK'
    app.isModal = true; // true = zobrazit v modálním okně
    app.hideHeader = false; // true = skrýt hlavičku kalkulačky
    document.body.appendChild(app); // kam se kalkulačka vloží
}
```

### 3. Naimplementovat funkci `processCalcResult(calcResult)`

Funkce zpracuje výsledek z kalkulačky. Typicky uloží údaje pro pozdější použití a přesune zákazníka do košíku. Příklad objektu `calcResult`, který funkce dostane jako parametr:

```javascript
function processCalcResult(calcResult) {
    console.log(calcResult);
    // uložit hodnoty ...
    // přejít do košíku ...
}

// příklad objektu calcResult:
{
    annualInterestRate: 19.97,
    creditAmount: 1300000, // v haléřích / centech
    creditTotalRepay: 1554000, // v haléřích / centech
    preferredDownPayment: 100000, // v haléřích / centech
    legalLine: "Každou žádost posuzujeme...",
    preferredInstallment: 129500, // v haléřích / centech
    productCode: "COCONL12",
    annualPercentageRate: 22,
    preferredMonths: 12
}
```

### 4. Načíst skript kalkulačky

#### Varianta A – hostováno u HC

Do hlavičky stránky přidejte jediný řádek:

```html
<head>
    <script src="https://kalkulacka.cdn.homecredit.cz/app.js" defer></script>
</head>
```

- Atribut `defer` doporučujeme – skript se stáhne na pozadí a nezdržuje načtení stránky e-shopu.
- Adresa je stálá, **neměňte ji ani si soubor nekopírujte k sobě** – jinak přijdete o automatické aktualizace.
- Fonty (Source Sans 3) si kalkulačka přidá do stránky sama. Pokud je na stránce už máte, podruhé se nenačtou.

#### Varianta B – soubor na serveru e-shopu

1. Stáhněte aktuální [`app.js`](../releases/app.js) (seznam verzí je v [Releases](https://github.com/homecreditcz/widget-calculator/releases)) a nahrajte ho na svůj webový server, např. `https://eshop.example.com/js/app.js`.
2. Do hlavičky stránky přidejte fonty a skript (cestu ke skriptu si zvolíte sami):

```html
<head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">
    <script src="/js/app.js" defer></script>
</head>
```

> Při každém vydání nové verze kalkulačky je potřeba soubor `app.js` na serveru nahradit novým.

## Co když jsou data dočasně nedostupná

Pokud se kalkulačce nepodaří načíst údaje pro výpočet (např. při výpadku spojení), nezobrazí žádný výpočet ani tlačítko pro pokračování. Zákazník uvidí hlášku **„Kalkulačka je dočasně nedostupná.“** a tlačítko **„Zkusit načíst znovu“**. Na straně e-shopu není potřeba nic řešit – `processCalcResult` se v takovém případě nezavolá.

## Content Security Policy

Pokud má váš e-shop nastavenou hlavičku `Content-Security-Policy`, je potřeba v ní povolit:

| Direktiva | Co povolit | Proč |
|---|---|---|
| `script-src` | `https://kalkulacka.cdn.homecredit.cz` (jen varianta A) | skript kalkulačky |
| `connect-src` | doména z `dataCalculatorBaseUrl` (např. `https://api.homecredit.cz`) | data o splátkách |
| `style-src` | `https://fonts.googleapis.com` | definice fontů |
| `font-src` | `https://fonts.gstatic.com` | soubory fontů |

## Přechod z varianty B na variantu A

Pokud už kalkulačku máte nasazenou a `app.js` si držíte u sebe, stačí:

1. V `<script src="...">` nahradit cestu ke svému `app.js` adresou `https://kalkulacka.cdn.homecredit.cz/app.js` (a ideálně přidat `defer`).
2. Odstranit `app.js` ze svého serveru.
3. Volitelně odstranit z hlavičky `<link>` na Google Fonts – kalkulačka si je načte sama.

Kód tlačítka, `showCalc()` ani `processCalcResult()` se **neupravuje**.
