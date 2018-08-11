const puppeteer = require('puppeteer');

module.exports = async () => {
    // const browser = await puppeteer.launch({headless: true});
    const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // const tickerName = ticker;
    await page.goto('https://www.infomoney.com.br/mercados/ferramentas/carteira-de-acompanhamento');
    console.log('https://www.infomoney.com.br/mercados/ferramentas/carteira-de-acompanhamento');

    const result = await page.evaluate(() => {
        let data = []; // Create an empty array that will store our data
        let nomes = document.querySelectorAll('.tag'); // Select all Products
        let precos = document.querySelectorAll('#CMP_b');

        // let nome = document.querySelectorAll('span.tv-category-title__text.tv-category-title__text--thin')[0];
        // console.log(nome);

        for (var i = precos.length - 1; i >= 0; i--){ // Loop through each proudct
            // console.log(element);
            let ticker = nomes[i].innerText; // Select the title
            let price = precos[i].innerText;
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