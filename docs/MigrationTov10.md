# Přechod hc-calc-v9 na v10
Po přechod na novou major verzi kalkulačky je potřeba upravit stavajicí kod.
Nejdrive je potreba odstranit
```html
<head>
  <link rel="stylesheet" href="hc-calc/style/style.css">
  
  <!-- Typekit Acumin Pro font initialization -->
  <script src="https://use.typekit.net/mxi3qpt.js"></script>
  <script>try { Typekit.load({ async: true }); } catch (e) { }</script>
  ...
</head>
```
a nahradit
```html
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">
```
Nasledne odstranit
```html
<script src="hc-calc/js/resize.js"></script>
<script src="hc-calc/js/appLoader.js"></script>
```
a nahradit 
```html
<script src="./app.js"></script>
```
Uložení scriptu je čistě na vás. Stačí pak přidat spravnou cestu pro načtení scriptu

Potreba odstranit stary kod html
```html
<div id="hc-calc-container">
 <div id="hc-calc-modal" class="hc-modal" role="dialog" style="display: none">
   <div class="hc-modal__dialog">
     <div class="hc-modal__content">
       <div id="hc-modal-header" class="hc-modal__header">
         <a id="hc-close-button" href="JavaScript:void(0)" class="hc-modal__close" 
             onclick="document.getElementById('hc-calc-modal').style.display = 'none'"></a>
         <div class="hc-modal__logo">
           <img src="hc-calc/img/logo.svg" alt="logo" />
         </div>
         <div class="hc-modal__title">NÁKUP NA SPLÁTKY</div>
       </div>
       <div id="hc-calculator-wrapper" class="hc-modal-body" ></div>
     </div>
   </div>
 </div>
</div>
```
Posledni je potreba upravit samotný spouštěcí script. Odstranime 
```javascript
// helper function example  
function showCalc() {        
  var productSetCode = 'COCHCONL'; 
  var price = document.getElementById('my-product-price').value;        
  var downPayment = 0;         
  var fixDownPayment = true;        
  var dataCalculatorBaseUrl = 'https://apicz-test.homecredit.cz/verdun-train/public/v1/calculator/';        
  var apiKey = 'calculator_test_key';
  showHcCalc(productSetCode, price, downPayment, fixDownPayment, dataCalculatorBaseUrl, apiKey, processCalcResult);  
}
```
a nahradime.
* Callback je JS funkce, která se zavolá, když si zákazník zvolí některou z nabízených možností splácení.
* Debug je možnost zapnout si debug mode, který pomůže při řešení problemů. Výchozí hodnota je false a není nutno implemenovat při spouštění pro zákazníky
* Language je jazyk ve kterém se kalkulačka spustí. 'cs-CZ' pro čestinu 'sk-SK' pro slovenštinu.
* Ostatní hodnoty zůstavají

Poslední řadek "document.body.appendChild(app);" určuje kde se v DOMu kalkulačka zobrazí. 
Výchozí nastavení je na tag body. Lze si upravit dle potřeb.
```javascript
// helper function example  
function showCalc() {
    let app = document.createElement('hc-calc');
    app.callback = processCalcResult;
    app.apiKey = 'calculator_test_key';
    app.dataCalculatorBaseUrl = 'https://apicz-test.homecredit.cz/verdun-train/public/v1/calculator/';
    app.productSetCode = 'COCHCONL';
    app.price = price;
    app.downPayment = 0;
    app.fixDownPayment = true;
    app.language = 'cs-CZ';
    app.debug = false;
    document.body.appendChild(app);  
}
```
V teto verzi již není potřeba používat config.json a configLoader.js\
Teď je potřeba do hodnoty apiKey vkladat reálný produkční API key, který vám byl přidělen.