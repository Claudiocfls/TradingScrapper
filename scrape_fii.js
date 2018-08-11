const puppeteer = require('puppeteer');

module.exports = async () => {
    // const browser = await puppeteer.launch({headless: true});
    const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // const tickerName = ticker;
    await page.goto('https://www.infomoney.com.br/imoveis/fundos-imobiliarios/cotacoes');
    console.log('https://www.infomoney.com.br/imoveis/fundos-imobiliarios/cotacoes');

    const result = await page.evaluate(() => {
        let data = []; // Create an empty array that will store our data
        let rows = document.querySelectorAll('.list tr'); // Select all Products
        console.log(rows.length);
        // let precos = document.querySelectorAll('#CMP_b');

        // let nome = document.querySelectorAll('span.tv-category-title__text.tv-category-title__text--thin')[0];
        // console.log(nome);

        for (var i = rows.length - 1; i >= 0; i--){ // Loop through each proudct
            // console.log(element);
            let ticker = rows[i].childNodes[1].textContent; // Select the title
            let price = rows[i].childNodes[7].textContent;
            // let price = element.childNodes[7].children[0].innerText; // Select the price
            // let ticker2 = ticker.slice(0);
            let status = 200;
            data.push({status, ticker, price}); // Push an object with the data onto our array
        }

        return data; // Return our data array
    });

    browser.close();
    return result; // Return the data
};

// scrape().then(
//     (value) => {
//         console.log(value); // Success!
//     }
// );