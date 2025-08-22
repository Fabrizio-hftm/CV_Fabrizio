require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5, 
  message: { error: 'Zu viele Anfragen. Bitte warten Sie einen Moment.' }
});
app.use('/contact', limiter);

app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Alle Felder sind erforderlich' });
  }

  try {
    let transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });

    await transporter.sendMail({
      from: `"Kontaktformular" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `Neue Nachricht: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #5f7ab4;">Neue Kontaktanfrage</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>E-Mail:</strong> ${email}</p>
            <p><strong>Betreff:</strong> ${subject}</p>
          </div>
          <div style="background: white; padding: 20px; border-left: 4px solid #5f7ab4;">
            <h3>Nachricht:</h3>
            <p style="white-space: pre-line;">${message}</p>
          </div>
        </div>
      `,
      replyTo: email
    });

    console.log(`E-Mail gesendet von: ${email} (${name})`);
    res.status(200).json({ success: 'Nachricht erfolgreich gesendet' });
  } catch (error) {
    console.error('Fehler beim Mailversand:', error);
    res.status(500).json({ error: 'Fehler beim Senden der Nachricht' });
  }
});

// Health Check für Render
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// SPA Support - alle anderen Routen zu index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});