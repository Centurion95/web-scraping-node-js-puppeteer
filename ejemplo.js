//rc95 15/07/2022 13:50
// npm i puppeteer

// https://pptr.dev/
// https://pptr.dev/api/
const puppeteer = require('puppeteer'); 

(async () => {
    //   const browser = await puppeteer.launch();

    const browser = await puppeteer.launch({
        // headless: false, //con esto, hacemos que el navegador sea visible (¿hace que el page.pdf no funcione?)
        // slowMo: 250, // slow down by 250ms
        // executablePath: '/path/to/Chrome' // Runs a bundled version of Chromium
    });

    const page = await browser.newPage();
    await page.goto('https://example.com');
    await page.screenshot({ path: 'example.png' });

    await page.pdf({ path: 'pdf_ejemplo.pdf', format: 'a4' });


    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    await page.evaluate(() => console.log(`url is ${location.href}`));

    await page.evaluate(() => console.log(`hola`));
    await page.evaluate(() => console.log(`probando`));
    


    await browser.close();
})();

// node ejemplo.js

// problemas con sandbox?
// sudo sysctl -w kernel.unprivileged_userns_clone=1
// https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md