const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'vinayak155',
    database: 'userdetails'
})

connection.connect((err) => {
    if (!err) {
        console.log("connected to database");
    } else {
        console.log('Error connecting to database:', err.message || err);
    }
})

app.get('/', (req, res) => {
    res.render('home');
});

// Handle email sending
app.post('/send-email', async (req, res) => {
    //console.log('Request Body:',req.body);
    const { username, usermail, Scammedmail, recipient, subject, message } = req.body;
    connection.query(`INSERT INTO details(UserName, UserEmailId, Scammed_upi_id, PoliceStationEmailId, ScamType, Message) VALUES ('${username}', '${usermail}', '${Scammedmail}', '${recipient}', '${subject}', '${message}')`, (err, results) => {
        if (err) {
            console.log('Getting error while inserting data into databse:', err.message || err);
        } else {
            console.log('Data inserted successfully into database');
        }
    });

    const transporter = nodemailer.createTransport({
        //service: 'gmail',
        secure: false,
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'kleelavinayak@gmail.com',
            pass: 'ajdu qffu pacf esfq'
        }
    });

    // Define the email options for police
    const policeMailOptions = {
        from: 'kleelavinayak@gmail.com',
        to: recipient,
        subject: 'Fake UPI ID Reported: ' + subject,
        html: `
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
                    .container { background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                    h2 { color: #d9534f; }
                    p { line-height: 1.6; }
                    .details { background-color: #f9f9f9; padding: 10px; border-left: 4px solid #d9534f; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Fake UPI ID Report</h2>
                    <p>Dear Sir/Madam,</p>
                    <p>I would like to report a fake UPI ID: <strong>${Scammedmail}</strong>.</p>
                    <div class="details">
                        <p><strong>Reported by:</strong></p>
                        <p>Name: ${username}</p>
                        <p>Email: ${usermail}</p>
                        <p>Scam Type: ${subject}</p>
                        <p>Description: ${message}</p>
                    </div>
                    <p>Please take the necessary actions.</p>
                    <p>Best regards,<br>${username}</p>
                </div>
            </body>
            </html>
        `
    };

    // Define the email options for user
    const userMailOptions = {
        from: 'kleelavinayak@gmail.com',
        to: usermail,
        subject: 'Fake UPI ID Reported - Confirmation',
        html: `
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
                    .container { background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                    h2 { color: #5cb85c; }
                    p { line-height: 1.6; }
                    .details { background-color: #f9f9f9; padding: 10px; border-left: 4px solid #5cb85c; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Report Submitted Successfully</h2>
                    <p>Dear ${username},</p>
                    <p>Thank you for reporting the fake UPI ID: <strong>${Scammedmail}</strong>. We have received your report and forwarded it to the police station for further action.</p>
                    <div class="details">
                        <p><strong>Report Details:</strong></p>
                        <p>Scam Type: ${subject}</p>
                        <p>Description: ${message}</p>
                        <p>Reported to: ${recipient}</p>
                    </div>
                    <p>Our team will take appropriate action. You will be updated on the progress.</p>
                    <p>Best regards,<br>Support Team</p>
                </div>
            </body>
            </html>
        `
    };

    try {
        // Send email to police
        await transporter.sendMail(policeMailOptions);
        console.log('Email sent to police');

        // Send email to user
        await transporter.sendMail(userMailOptions);
        console.log('Email sent to user');

        res.status(200).send('Emails sent successfully!');
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send('Error in sending emails. Please try again later.');
    }
});

/*
//Sending mail to the user who reported on the fake UPI ID
app.post('/user-details', (req, res) => {
    const { username, usermail, Scammedmail } = req.body;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'kleelavinayak@gmail.com',
            pass: 'ajdu qffu pacf esfq'
        }
    });

    const mailOptions = {
        from: 'kleelavinayak@gmail.com',
        to: usermail,
        subject: 'Fake UPI ID Reported',
        text: `Dear ${username},\n\nThank you for reporting the fake UPI ID: ${Scammedmail}. We have received your report and will take appropriate action.\n\nBest regards,\nSupport Team`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error ocurred: ", error);
        } else {
            console.log('Email sent: ', info.response);
        }
    });
});
*/
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});