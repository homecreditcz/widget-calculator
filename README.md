# Home Credit online kalkulačka splátek

Kalkulačka, kterou e-shop zobrazí u zboží: zákazník si v ní vybere, kolik chce měsíčně splácet a na jak dlouho, a e-shop dostane zpět zvolené parametry úvěru (výši splátky, počet měsíců, RPSN…), se kterými pokračuje do košíku.

> Tuto kalkulačku mohou využít pouze vázaní partneři. Pro nevázané partnery ("tipaře") slouží standalone varianta kalkulačky - více info např. [zde](https://github.com/homecreditcz/oneclick-api/wiki/Produk%C4%8Dn%C3%AD-prost%C5%99ed%C3%AD))

## Jak to funguje

1. Zákazník klikne u zboží na tlačítko **„Nákup na splátky“**.
2. E-shop vloží do stránky prvek `<hc-calc>` s cenou zboží a údaji od Home Creditu (API klíč, produktová sada).
3. Kalkulačka běží v prohlížeči zákazníka a výpočty si sama načítá z API Home Creditu.
4. Když si zákazník vybere splátky, kalkulačka zavolá vaši funkci a předá jí výsledek. E-shop ho uloží a pošle zákazníka do košíku.

Na straně e-shopu tedy stačí přidat tlačítko, dvě krátké JavaScriptové funkce a načíst skript kalkulačky. Žádný serverový kód není potřeba.

## Kterou variantu nasazení zvolit

Kód na stránce je v obou variantách stejný – liší se jen tím, **odkud se načítá soubor `app.js`**.

| | **A) Hostováno u HC (doporučeno)** | **B) Soubor na serveru e-shopu** |
|---|---|---|
| Kde je `app.js` | na serveru Home Creditu | na vašem webovém serveru |
| Nové verze kalkulačky | automaticky, do několika minut od vydání | ručně – novou verzi musíte nahrát sami |
| Fonty | kalkulačka si je načte sama | přidáváte do hlavičky stránky |
| Vhodné pro | většinu e-shopů | e-shopy, které nesmí načítat skripty z cizí domény (např. kvůli interním bezpečnostním pravidlům) |

- **Nevíte? Zvolte variantu A.** Nasazení je jednodušší a opravy, úpravy textů i nové funkce se k vám dostanou bez zásahu na vaší straně.
- **Variantu B** zvolte jen tehdy, pokud potřebujete mít plnou kontrolu nad tím, jaký kód na vašich stránkách běží.

## Postup nasazení

Podrobný návod s ukázkami kódu: **[docs/install.md](docs/install.md)**

1. Přidat na stránku tlačítko „Nákup na splátky“.
2. Napsat funkci `showCalc()`, která kalkulačku otevře s cenou zboží a údaji od HC.
3. Napsat funkci `processCalcResult()`, která převezme výsledek a pošle zákazníka do košíku.
4. Načíst skript kalkulačky – podle zvolené varianty A nebo B.

### Co dostanete od Home Creditu

| Údaj | Pro testování | Pro produkci |
|---|---|---|
| `apiKey` | `calculator_test_key` (bez akontace) / `calculator_test_key_dp` (s akontací) | dostanete po schválení vaší implementace |
| `productSetCode` | `COCHCONL` | dostanete od HC; pro akce typu „Za 0 %“ jiný kód |
| `dataCalculatorBaseUrl` | CZ: `https://apicz-test.homecredit.cz/verdun-train/public/v1/calculator/`<br>SK: `https://apisk-test.homecredit.sk/verdun-train/public/v1/calculator/` | CZ: `https://api.homecredit.cz/public/v1/calculator/` |

Testovací hodnoty můžete použít hned, bez registrace. Produkční API klíč vám předá zodpovědná osoba z HC poté, co implementaci zkontroluje.

> Všechny částky (`price`, `downPayment` i částky ve výsledku) se předávají v **haléřích / centech** – zboží za 13 000 Kč tedy předáte jako `1300000`.

## Další informace

- **[Návod k nasazení](docs/install.md)** – kroky 1–4, popis všech parametrů, výpadek dat, Content Security Policy, přechod z varianty B na A
- **[Přechod z v9 na v10](docs/MigrationTov10.md)** – pro e-shopy, které mají nasazenou starší verzi kalkulačky
- **[Vydané verze](https://github.com/homecreditcz/widget-calculator/releases)** – `app.js` ke stažení pro variantu B
