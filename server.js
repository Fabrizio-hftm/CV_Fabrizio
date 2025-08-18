require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(express.static('public'));

const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5, 
});
app.use('/contact', limiter);

app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Alle Felder sind erforderlich' });
  }

  try {
    
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });

    await transporter.sendMail({
      from: `"Kontaktformular" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Neue Nachricht: ${subject}`,
      text: `
        Von: ${name} (${email})
        Betreff: ${subject}
        
        Nachricht:
        ${message}
      `,
    });

    res.status(200).json({ success: 'Nachricht erfolgreich gesendet' });
  } catch (error) {
    console.error('Fehler beim Mailversand:', error);
    res.status(500).json({ error: 'Fehler beim Senden der Nachricht' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
});
