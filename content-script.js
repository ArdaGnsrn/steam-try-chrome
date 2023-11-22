TRY = 0;

const SELECTORS = [
    '.discount_final_price',
    '.discount_original_price',
    '.game_area_dlc_price',
    '.price',
    '#header_wallet_balance',
    '.account_name',
    '.game_area_purchase_game_dropdown_menu_item_text',
    '#search_suggestion_contents .match_subtitle',
    '.sale_price',
    '.normal_price',
    '.market_commodity_orders_header_promote',
    '#orders_histogram .jqplot-xaxis-tick',
    '#pricehistory .jqplot-yaxis-tick'
].map(s => s + ':not(.steam-try)').join(', ');

const REGEX = /\$([0-9,]+\.\d{2})\s*(USD)?/;
const REP_REGEX = /\$\d+\.\d{2}( USD)?/;


async function start() {
    const extStatus = (await chrome.storage.sync.get('status')).status ?? true
    const showUsd = (await chrome.storage.sync.get('show_usd')).show_usd ?? true;
    const showOriginalUsd = (await chrome.storage.sync.get('show_original_usd')).show_original_usd ?? true;

    if (!extStatus) return;

    if (showUsd) {
        const style = document.createElement('style');
        style.innerHTML = `
            .steam-try {
                font-size: 0.8em!important;
            }
        `;
        document.head.appendChild(style);
    }

    const observer = new MutationObserver(() => {
        const elements = document.querySelectorAll(SELECTORS);

        elements.forEach((element) => {
            const text = element.innerText;
            const matches = text.match(REGEX);

            if (!matches) return;

            if (showOriginalUsd && element.classList.contains('discount_original_price')) {
                return;
            }

            const usdPrice = parseFloat(matches[1]);
            const tryPrice = usdPrice * TRY;

            element.classList.add("steam-try");

            let newText = '';
            if (showUsd) {
                newText += `${usdPrice.toFixed(2)}$`;
                newText += ` (${tryPrice.toFixed(2)} TL)`;
            } else {
                newText += `${tryPrice.toFixed(2)} TL`;
            }

            element.innerText = (text.replace(REP_REGEX, newText));
        });
    });

    observer.observe(document, {childList: true, subtree: true});
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

    await start();
}

fetchCurrency();
