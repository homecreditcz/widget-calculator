# Home Credit online kalkulačka

> Tuto variantu kalkulačky mohou využít pouze vázaní partneři. Pro nevázané partnery ("tipaře") slouží standalone varianta kalkulačky - více info např. [zde](https://github.com/homecreditcz/oneclick-api/wiki/Produk%C4%8Dn%C3%AD-prost%C5%99ed%C3%AD))

Kalkulačka (jejíž kód běží v prohlížeči zákazníka) potřebuje získat data o možných splátkách. Pomocí HTTP GET provolá odpovídající API endpointy Home Creditu. Tyto požadavky musí obsahovat odpovídající API key HTTP hlavičku.

## Instalace software Kalkulačky

Vlastní kód kalkulačky je třeba nahrát na webový server. Jedná se o soubor JS konrétně app.js.

Příklad: https://eshop.example.com/js/app.js

## Úprava webových stránek e-shopu

Na stránku s produkty, u kterých si zákazník může zvolit nákup na splátky, je třeba:

### 1. Přidat tlačítko (či obdobný prvek) "Nákup na splátky",

které vyvolá pro dané zboží kalkulačku. HTML element bude mít nastaveno zpracování události onClick - spuštění pomocné funkce showCalc.

```javascript
<button onclick="showCalc()">Nákup na splátky</button>
```

### 2. Naimplementovat pomocnou funkci `showCalc()`, 

která obsahuje potřebné udaje pro zobrazení kalkulačky.

- `productSetCode` - konstanta dodaná HC 
  - pro testovací účely:
    - CZ: ***COCHCONL***
    - SK: ***COCHCONL***
    
> Tento parametr udává produktovou sadu Home Creditu, jenž se má pro výpočet použít - pokud je zboží zařazeno do speciální akce (např. "Za 0%"), na které se vztahuje kalkulace pod akční produktovou sadou, je potřeba tuto sadu v tomto kroku použít - **Je žádoucí, aby ve správě produktů e-shopu byla možnost tuto vlastnost jednoduše nastavovat (alternativou je mít tuto možnost např. pro vybranou kategorii produktů). Výběr konkrétního produktu pak vede na použití akční produktové sady (`productSetCode`) při inicializaci kalkulačky**

- `price` - cena daného zboží (košíku)
- `language` - jazyk ve kterém kalkulačka běží. Pokud není dodán používá se Čeština
- `downPayment` - hodnota akontace, může být 0
- `fixDownPayment` – vypnutí podpory volitelné akontace
- `dataCalculatorBaseUrl` – pevně daná URL dodaná HC
  - pro testovací účely: 
    - CZ: `https://apicz-test.homecredit.cz/verdun-train/public/v1/calculator/`
    - SK: `https://apisk-test.homecredit.sk/verdun-train/public/v1/calculator/`
  - na produkčním prostředí: 
    - CZ: `https://api.homecredit.cz/public/v1/calculator/`

- `apiKey` – API klíč, konstanta dodaná HC
  - pro testovací účely:
    - CZ: ***calculator_test_key*** / ***calculator_test_key_dp*** (s podporou pro akontace)
    - SK: ***calculator_test_key*** / ***calculator_test_key_dp*** (s podporou pro akontace)
  - na produkčním prostředí:
    - obdržíte od zodpovědné osoby z HC po schválení vaší implementace

- `processCalcResult` - JS funkce, která se zavolá, když si zákazník zvolí některou z nabízených možností splácení.
- `debug` - možnost zapnout si debug. pomoci app.debug=true, který pomahá při implementaci a hledání případných chyb
- `isModal` - možnost zapnout ci vypnout zda se ma kalkulacka zobrazit v modalu a nebo ji vykreslit do prislusneho elementu, ktery se urcije pomoci document.body.appendChild(app). 
- `hideHeader` - možnost zapnout ci vypnout ci se ma zobrazovat hlavicka, ta obsahuje logo HomeCreditu, nadpis a krizek. 
- `document.body.appendChild(app)` - zde určujeme kde v DOMu chceme kalkulačku zobrazit. Dle příkladu se kalkulačka zobrazí v tagu body.

```javascript
// helper function example  
function showCalc() {
    let app = document.createElement('hc-calc');
    app.callback = processCalcResult;
    app.apiKey = 'calculator_test_key'; // example
    app.dataCalculatorBaseUrl = 'https://apicz-test.homecredit.cz/verdun-train/public/v1/calculator/';
    app.productSetCode = 'COCHCONL'; // example
    app.price = document.getElementById('price').value; // number in minor units
    app.downPayment = 0; // number in minor units
    app.fixDownPayment = true; // parameter to decide if enable od disable downpayment
    app.language = 'cs-CZ'; // Language can be "cs-CZ" or "sk-SK"
    app.isModal = true; // parametr to decide if launch in model or not
    app.hideHeader = false; // parametr to decide if hide header of hc-calc
    document.body.appendChild(app); // Where to mount calculator
}
```

### 3. Naimplementovat funkci `processCalcResult(calcResult)`,

která zpracuje výsledky z kalkulačky. Typicky uloží údaje pro pozdější použití a přesune zákazníka do Košíku. Příklad objektu `calcResult`, který je funkci předán jako parametr:

```javascript
function processCalcResult(calcResult) {  
  console.log(calcResult);  
  // store the values ...  
  // go to basket ...  
}      
// calcResult object example:  
{
  annualInterestRate: 19.97,
  creditAmount: 1300000, // minor units
  creditTotalRepay: 1554000, // minor units
  preferredDownPayment: 100000, // minor units
  legalLine: "Každou žádost posuzujeme...",
  preferredInstallment: 129500, // minor units
  productCode: "COCONL12",
  annualPercentageRate: 22,
  preferredMonths: 12
}
```

### 4. Naimportovat fonty pro danou html stránku
Do hlavičky přidat fonty

```html
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">
</head>
```

### 5. Naimportovat skripty kalkulačky
Cestu ke scriptu si zvolíte sami
```html
<script src="./app.js"></script>
```
