const puppeteer = require('puppeteer');

module.exports = async (ticker) => {
    // const browser = await puppeteer.launch({headless: true});
    const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    // const tickerName = ticker;
    await page.goto('https://br.tradingview.com/symbols/BMFBOVESPA-'+ticker+'/');
    console.log('https://br.tradingview.com/symbols/BMFBOVESPA-'+ticker+'/');

    const result = await page.evaluate(() => {
        let data = []; // Create an empty array that will store our data
        let element = document.querySelectorAll('.tv-symbol-header-quote__value.tv-symbol-header-quote__value--large.js-symbol-last')[0]; // Select all Products
        let nome = document.querySelectorAll('span.tv-category-title__text.tv-category-title__text--thin')[0];
        // console.log(nome);
        // for (var element of elements){ // Loop through each proudct
            let price = element.innerText; // Select the title
            let ticker = nome.innerText;
            // let price = element.childNodes[7].children[0].innerText; // Select the price
            // let ticker2 = ticker.slice(0);
            let status = 200;
            data.push({status, ticker, price}); // Push an object with the data onto our array
        // }

        return data; // Return our data array
    });

    browser.close();
    return result; // Return the data
};

// scrape('ITSA4').then(
//     (value) => {
//         console.log(value); // Success!
//     }
// );