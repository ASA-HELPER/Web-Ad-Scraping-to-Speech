const colors = require("colors");
const express = require('express');
const puppeteer = require('puppeteer');
const morgan = require("morgan");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Scraping route
app.post('/api/v1/scrape', async (req, res) => {
  try {
    const keyword = await req.body.keyword;
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();

    await page.goto(`https://www.google.com/search?q=${keyword}`);

    // Extracting data
    let result = await page.evaluate(() => {
      // Case-1 : Horizontal slider Ads
      const temp = document.getElementsByClassName('dxR8gf')[0]
      const sponseredId = temp?.getElementsByTagName('span')[0]
      const horizontalChecker = sponseredId?.innerText;
      if(horizontalChecker==='Sponsored')
      {
        const pricer = document.getElementsByClassName('T4OwTb')[0]
        const price = pricer?.getElementsByTagName('span')[0]
        const imager = document.getElementsByClassName('Gor6zc')[0]
        const imgtag = imager?.getElementsByTagName('img')[0]
        const srcval = imgtag?.src
        const productNamer = document.getElementsByClassName('pymv4e')[0]
        const productName = productNamer?.innerText
        return {Price:price?.innerText,Image:srcval,Name:productName};
      }
      
      // Case-2 : Vertical Grid Ads
      const temp2 = document.getElementsByClassName('jOmXmb SwlyWb')[0];
      const sponseredId2 = temp2?.getElementsByTagName('span')[0];
      const verticalChecker = sponseredId2?.innerText;
      if(verticalChecker==='Sponsored')
      {
        const productNamer = document.getElementsByClassName('pymv4e')[0]
        const productName = productNamer?.innerText
        const pricer = document.getElementsByClassName('T4OwTb')[0]
        const price = pricer?.getElementsByTagName('span')[0]
        const imager = document.getElementsByClassName('Gor6zc')[0]
        const imgtag = imager?.getElementsByTagName('img')[0]
        const srcval = imgtag?.src
        return {Price:price?.innerText,Image:srcval,Name:productName};
      }

      // Case-3 : No Ads found
      return null;
    });

    await browser.close();
    
    if (result!==null) {
      result = {
        Name: result.Name,
        Price: result.Price,
        Image: result.Image,
        audioText: `The price of ${result.Name} is rupees ${result.Price}`,
        message:`Product is scrapped successfully!!!`
      };
    }
    else {
      result = {
        message: `No shopping ads found for ${keyword}.`,
      };
    }
    res.send(result)
  }
  catch (err) {
    res.send("An error has occurred.");
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running in development mode on port ${PORT}`.bgCyan.white);
});