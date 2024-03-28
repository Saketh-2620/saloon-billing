export function generateHTML(bill){
    console.log(bill);
    try{
        let html = `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'PT Sans', sans-serif;
                }

                @page {
                    size: 2.8in 11in;
                    margin-top: 0cm;
                    margin-left: 0cm;
                    margin-right: 0cm;
                }

                table {
                    width: 100%;
                }

                tr {
                    width: 100%;

                }

                h1 {
                    text-align: center;
                    vertical-align: middle;
                }

                #logo {
                    width: 60%;
                    text-align: center;
                    -webkit-align-content: center;
                    align-content: center;
                    padding: 5px;
                    margin: 2px;
                    display: block;
                    margin: 0 auto;
                }

                header {
                    width: 100%;
                    text-align: center;
                    -webkit-align-content: center;
                    align-content: center;
                    vertical-align: middle;
                }

                .items thead {
                    text-align: center;
                }

                .center-align {
                    text-align: center;
                }

                .bill-details td {
                    font-size: 12px;
                }

                .receipt {
                    font-size: medium;
                }

                .items .heading {
                    font-size: 12.5px;
                    text-transform: uppercase;
                    border-top:1px solid black;
                    margin-bottom: 4px;
                    border-bottom: 1px solid black;
                    vertical-align: middle;
                }

                .items thead tr th:first-child,
                .items tbody tr td:first-child {
                    width: 47%;
                    min-width: 47%;
                    max-width: 47%;
                    word-break: break-all;
                    text-align: left;
                }

                .items td {
                    font-size: 12px;
                    text-align: right;
                    vertical-align: bottom;
                }

                .price::before {
                    content: "\\20B9";
                    font-family: Arial;
                    text-align: right;
                }

                .sum-up {
                    text-align: right !important;
                }
                .total {
                    font-size: 13px;
                    border-top:1px dashed black !important;
                    border-bottom:1px dashed black !important;
                }
                .total.text, .total.price {
                    text-align: right;
                }
                .total.price::before {
                    content: "\\20B9"; 
                }
                .line {
                    border-top:1px solid black !important;
                }
                .heading.rate {
                    width: 20%;
                }
                .heading.amount {
                    width: 25%;
                }
                .heading.qty {
                    width: 5%
                }
                p {
                    padding: 1px;
                    margin: 0;
                }
                section, footer {
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <p style="align:center;">Saloon Grand</p>
            <table class="bill-details">
                <tbody>
                    <tr>
                        <td>Date : <span>${new Date().toLocaleDateString('en-GB')}</span></td>
                        <td>Time : <span>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }).split(',')}</span></td>
                    </tr>
                    <tr>
                        <td>Employee #: <span>${bill.employeeId}</span></td>
                        <td>Bill # : <span>${bill.id}</span></td>
                    </tr>
                    <tr>
                        <td>Tip : <span>${bill.tip}</span></td>
                        <td>Discount : <span>${bill.discount}</span></td>
                    </tr>
                    <tr>
                        <th class="center-align" colspan="2"><span class="receipt">Original Receipt</span></th>
                    </tr>
                </tbody>
            </table>
            
            <table class="items">
                <thead>
                    <tr>
                        <th class="heading name">Item</th>
                        <th class="heading qty">Qty</th>
                        <th class="heading rate">Rate</th>
                        <th class="heading amount">Amount</th>
                    </tr>
                </thead>
                <tbody>
        `;
        billItems.forEach(item => {
        html += `
            <tr>
            <td>${item.productName}</td>
            <td>${item.price}</td>
            <td class="price">${item.quantity}</td>
            <td class="price">${item.price * item.quantity}</td>
            </tr>
        `;
        });

        html += `
            <tr>
                <th colspan="3" class="total text">Total</th>
                <th class="total price">${
                    (billItems.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0) + Number(bill.tip) - Number(bill.discount)).toFixed(2)
                }</th>
            </tr>
        `
  
        html += `
        </tbody>
        </table>
        <section>
            <p>
                Paid by : <span>${bill.modeOfPayment}</span>
            </p>
            <p style="text-align:center">
                Thank you for your visit!
            </p>
        </section>
    </body>
    
    </html>
        `;
        return html;
    } catch (error) {
        console.error('Error generating HTML:', error);
        return '';
    }
  };