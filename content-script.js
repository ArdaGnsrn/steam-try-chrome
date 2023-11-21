let TRY = 0;

let interval1, interval2;

function run() {
    // Steam Store
    convertToTryQuery('.discount_final_price')
    convertToTryQuery('.discount_original_price')
    convertToTryQuery('.game_area_dlc_price')
    convertToTryQueryLongText('.game_area_purchase_game_dropdown_menu_item_text')
    if (interval1) clearInterval(interval1)
    setInterval(function () {
        convertToTryQuery('#search_suggestion_contents .match_subtitle')
    }, 1000)

    // Steam Community Market
    convertToTryQuery('.sale_price')
    convertToTryQuery('.normal_price')
    if (interval2) clearInterval(interval2)
    setInterval(function () {
        convertToTryQuery('.market_commodity_orders_header_promote')
    }, 100)
    convertToTryQuery('#orders_histogram .jqplot-xaxis-tick')
    convertToTryQuery('#pricehistory .jqplot-yaxis-tick')
}


const drRegexSelector = /\$\d+\.\d{2} USD/;

function convertToTryQueryLongText(query) {
    try {
        document.querySelectorAll('.game_area_purchase_game_dropdown_menu_item_text').forEach($el => {
            const elText = $el.innerText
            const newText = convertToTry(elText.match(drRegexSelector)[0])

            if (newText) $el.innerText = elText.replace(drRegexSelector, newText)
        })
    } catch (e) {
        //
    }
}

function convertToTryQuery(query) {
    try {
        document.querySelectorAll(query).forEach(function ($el) {
            const newText = convertToTry($el.innerText)
            if (newText) $el.innerText = newText
        })
    } catch (e) {
        //
    }
}

function convertToTry(text) {
    const parsedPrice = parseText(text)
    if (!parsedPrice) return;

    return (parsedPrice * TRY).toFixed(2) + ' TL'
}

function parseText(text) {
    const currency = text[0]
    if (currency !== '$') return false;

    return (text.slice(1).split(' ')[0]) * 1
}

async function fetchCurrency() {
    console.log(`
          ____  _                         _____ ______   __
         / ___|| |_ ___  __ _ _ __ ___   |_   _|  _ \\ \\ / /
         \\___ \\| __/ _ \\/ _\` | '_ \` _ \\    | | | |_) \\ V / 
          ___) | ||  __/ (_| | | | | | |   | | |  _ < | |  
         |____/ \\__\\___|\\__,_|_| |_| |_|   |_| |_| \\_\\|_|  
         
         Powered By %cArda GUNSUREN%c
          %c- Personal Page: https://ardagunsuren.com       
          - Github: https://github.com/ArdaGnsrn/steam-try-chrome                           
        `,
        "text-decoration: underline; ",
        "text-decoration: none;",
        "color: #ff0000; text-decoration: none;"
    );
    console.log("[Steam TRY] Fetching currency..");
    const res = await fetch('https://api.binance.com/api/v1/ticker/price?symbol=USDTTRY');
    TRY = (await res.json()).price;
    console.log("[Steam TRY] Currency fetched: " + TRY);
    console.log("[Steam TRY] Running..");
    // add link to ardagunsuren.com with text Arda GUNSUREN

    run();
}

fetchCurrency();
setInterval(fetchCurrency, (1000 * 60 * 10)) // 10 minutes