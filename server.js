require('dotenv').config();
const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/contact', rateLimit({ windowMs: 60 * 1000, max: 5 }));

const PUBLIC_DIR = path.join(__dirname, 'CV');
app.use(express.static(PUBLIC_DIR));


app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});


app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: email,
      subject: subject || 'Neue Kontaktanfrage',
      text: `Name: ${name}\nE-Mail: ${email}\n\n${message}`,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Mail-Versand fehlgeschlagen' });
  }
});

app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
