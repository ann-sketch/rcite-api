const express = require('express');
const app = express();
const cors = require("cors")
const fs = require('fs');
const pdf = require('html-pdf');
const options = { format: "Letter" };

app.use(express.json())
app.use(cors())

app.get('/download', (req, res) => {
  res.download(`${__dirname}\\reniescite.pdf`);
  // res.json("okay")
});

app.get("/", (req, res) => {
  res.send("Connected.")
})

app.post('/', (req, res) => {
  if (req.body) {
    let listOfData = []
    let overallTotal = 0
    for (const item of req.body.data) {
      const data = `<tr> <td>${item.itemName}</td> <td>${item.noOfItems}</td> <td>${item.amt}</td> <td>${item.noOfItems * item.amt}</td> </tr>`
      listOfData.push(data)
      overallTotal = overallTotal + item.noOfItems * item.amt
    }

    let html = [topCode, listOfData.join(""), bottomCode(overallTotal)].join("")

    pdf.create(html, options).toFile('./reniescite.pdf', function (err, res) {
      if (err) return console.log(err);
      console.log(res); // { filename: '/app/businesscard.pdf' }
    });
    // res.download(`${__dirname}\\reniescite.pdf`);
    // res.json(`${__dirname}\\reniescite.pdf`)
    res.redirect("/download")
  } else {
    res.json({ "status": "error" });
  }

})

app.listen(process.env.PORT || 3000);

// static html code from document html to tbody
const topCode = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<style>
    body {
        background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 10%, rgba(252, 70, 107, 0.8763655120251226) 100%);
        background-color: #fff;     
        height: 1304px;   
    }

    .container {
        width: 80%;
        height: fit-content;
        /* background-color: #fff; */
        position: absolute;
        top: 40%;
        left: 10%;
        transform: translateY(-50%);
        background-color: rgba(255, 255, 255, 0.605);

    }

    .logo {
        text-align: center;
    }

    table {
        width: 100%;
    }

    th {
        font-size: 30px;
    }

    td {
        text-align: center;
        font-size: 20px;
    }

    .total {
        text-align: center;
    }
</style>

<body>
    <div class="container">
        <h1 class="logo">Renies Cite</h1>
        <!-- <hr> -->
        <table border="1">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>No Of Items</th>
                    <th>Amount</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>`

// generates the rest of the html code including overallTotal value
let bottomCode = (overallTotal) => {
  return `</tbody>
</table>
<h2 class="total">Overall Total = ${overallTotal}</h2>
</div>
</body>
</html>`
}
