const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
});

// Handle email sending
app.post('/send-email', (req, res) => {
    const { recipient, subject, message } = req.body;

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

    // Define the email options
    const mailOptions = {
        from: 'kleelavinayak@gmail.com', 
        to: recipient, 
        subject: subject, 
        text: message,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error occurred:", error);
            res.status(500).send('Error in sending email. Please try again later.');
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send('Email sent successfully!');
        }
    });
});

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});