require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve your static files (HTML, CSS, JS)

// Route to handle contact form submissions
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Nodemailer configuration
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Or your preferred email service
        auth: {
            user:process.env.EMAIL, // Replace with your email
            pass: process.env.PASSWORD, // Replace with your email password or app-specific password
        },
    });

    const mailOptions = {
        from: email,
        to: process.env.EMAIL, // Replace with your email
        subject: `New message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send message. Please try again later.' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
