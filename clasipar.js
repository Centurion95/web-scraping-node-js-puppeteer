//rc95 15/07/2022 13:50
// npm i puppeteer

// https://pptr.dev/
// https://pptr.dev/api/
const puppeteer = require('puppeteer');

const getDate = () => {
    // https://stackoverflow.com/questions/8362952/javascript-output-current-datetime-in-yyyy-mm-dd-hhmsec-format
    // return (new Date()).toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ");

    var date = new Date()
    var dateStr =
        ("00" + date.getDate()).slice(-2) + "/" +
        ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
        date.getFullYear() + " " +
        ("00" + date.getHours()).slice(-2) + ":" +
        ("00" + date.getMinutes()).slice(-2) + ":" +
        ("00" + date.getSeconds()).slice(-2)
    return dateStr
}

(async () => {
    //   const browser = await puppeteer.launch()

    const browser = await puppeteer.launch({
        headless: false, //con esto, hacemos que el navegador sea visible (¿hace que el page.pdf no funcione?)
        // slowMo: 250, // slow down by 250ms
        executablePath: '/usr/bin/google-chrome' // Runs a bundled version of Chromium
        // https://unix.stackexchange.com/questions/436835/universal-path-for-chrome-on-nix-systems#:~:text=%2Fusr%2Fbin%2Fchrome,On%20PATH
        // para windows: https://stackoverflow.com/questions/40674914/google-chrome-path-in-windows-10
        // executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    })

    console.log(getDate() + ' >>>  Abriendo el navegador...')
    const page = await browser.newPage()

    console.log(getDate() + ' >>>  Navegando a la web...')
    await page.goto('https://clasipar.paraguay.com/')
    // await page.screenshot({ path: 'example.png' })
    // await page.pdf({ path: 'pdf_ejemplo.pdf', format: 'a4' })

    console.log(getDate() + ` >>>  Inició el proceso..`)

    //con esto podemos capturar los console.log del navegador y mostrarlos en nuestra terminal..
    //para no ensuciar, lo voy a comentar por ahora..
    // page.on('console', msg => console.log(getDate() + ' >>> ', msg.text()))
    // await page.evaluate(() => console.log(getDate() + ` >>>  url is ${location.href}`));

    console.log(getDate() + ` >>>  Va a esperar el elemento para escribir..`)
    await page.waitForSelector('#buscar') //esperamos que cargue el elemento, buscamos por ID

    console.log(getDate() + ` >>>  Va a enviar las teclas..`)
    // await page.type('#buscar', 'terreno') //enviamos las siguientes teclas..
    await page.type('#buscar', 'terreno', { delay: 80 }) //enviamos las siguientes teclas.. con delay, para ver..

    console.log(getDate() + ` >>>  Va a esperar el elemento para hacer click..`)
    await page.waitForSelector('.btn-success')

    console.log(getDate() + ` >>>  Va a hacer click en BUSCAR..`)
    await page.click('.btn-success')

    console.log(getDate() + ` >>>  Va a esperar 3 segundos..`)
    await page.waitForTimeout(3000)


    console.log(getDate() + ` >>>  Va a esperar al elemento de la siguiente pantalla..`)
    await page.waitForSelector('.box-premium')

    console.log(getDate() + ` >>>  Va a iterar en todos los items del elemento..`)

    const listaProductos = await page.evaluate((registrosTag) => {
        // await page.evaluate((registrosTag) => {
        const registros = document.querySelectorAll(registrosTag)

        const listaProductos = []
        for (const registro of registros) {
            // const registroText = registro ? registro.innerHTML : ''
            const registroTitulo = registro ? registro.getElementsByClassName('titAnuncio')[0].innerHTML : ''
            const registroPrecio = registro ? registro.getElementsByClassName('price')[0].innerHTML : ''
            const registroSubTitulo = registro ? registro.getElementsByTagName('h6')[0].getElementsByTagName('a')[0].innerHTML : ''

            // console.log(registroTitulo)
            // console.log(registroPrecio)
            // console.log(registroSubTitulo)
            // console.log('----------------------------')

            let nuevoProducto = {}
            nuevoProducto.descripcion = registroTitulo
            nuevoProducto.precio = registroPrecio
            nuevoProducto.categoria = registroSubTitulo

            listaProductos.push(nuevoProducto)
        }
        return listaProductos
    }, '.box-anuncio--premium')

    console.log(getDate() + ` >>>  Items encontrados:`)
    console.log(listaProductos)
    console.log(getDate() + ` >>>  Finalizó el proceso..`)

    await browser.close()
})()

// node clasipar.js

// problemas con sandbox?
// sudo sysctl -w kernel.unprivileged_userns_clone=1
// https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md