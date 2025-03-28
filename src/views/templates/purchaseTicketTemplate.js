export const purchaseTicketTemplate = (ticket) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Purchase Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
        }
        .container {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: auto;
        }
        h2 {
            color: #333;
        }
        p {
            color: #555;
        }
        .ticket-info {
            text-align: left;
            margin-top: 20px;
        }
        .ticket-info table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .ticket-info th, .ticket-info td {
            padding: 8px;
            border: 1px solid #ddd;
        }
        .ticket-info th {
            background-color: #f1f1f1;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Purchase Confirmation</h2>
        <p>Thank you for your purchase! We have received your order and generated a purchase ticket.</p>
        <p>Ticket Details:</p>
        
        <div class="ticket-info">
            <table>
                <tr>
                    <th>Ticket ID</th>
                    <td>${ticket.id}</td>
                </tr>
                <tr>
                    <th>Code</th>
                    <td>${ticket.code}</td>
                </tr>
                <tr>
                    <th>Total Purchase</th>
                    <td>$${ticket.amount}</td>
                </tr>
                <tr>
                    <th>Purchaser Email</th>
                    <td>${ticket.purchaser}</td>
                </tr>
                <tr>
                    <th>Purchase Date</th>
                    <td>${ticket.purchase_datetime}</td>
                </tr>
            </table>
        </div>

        <p>If you have any questions or need further information, please feel free to contact us.</p>

        <p class="footer">This is an automated message, please do not reply.</p>
    </div>
</body>
</html>
`;