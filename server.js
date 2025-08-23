app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Alle Felder sind erforderlich' });
  }

  console.log('=== DEBUGGING EMAIL CONFIG ===');
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NICHT GESETZT');
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NICHT GESETZT');
  console.log('EMAIL_HOST:', process.env.EMAIL_HOST || 'smtp.gmail.com');
  console.log('EMAIL_PORT:', process.env.EMAIL_PORT || 465);
  console.log('EMAIL_TO:', process.env.EMAIL_TO || process.env.EMAIL_USER);
  console.log('================================');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('FEHLER: EMAIL_USER oder EMAIL_PASS nicht gesetzt!');
    return res.status(500).json({ error: 'Server-Konfigurationsfehler: E-Mail Credentials fehlen' });
  }

  try {

    let transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '465'),
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('Teste SMTP-Verbindung...');
    await transporter.verify();
    console.log('SMTP-Verbindung erfolgreich!');

    console.log('Sende E-Mail...');
    const info = await transporter.sendMail({
      from: `"Portfolio Kontakt" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `Neue Nachricht von Portfolio: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #5f7ab4, #2043a1); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;"> Neue Kontaktanfrage</h2>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Über dein Portfolio-Kontaktformular</p>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-left: 4px solid #5f7ab4; margin: 0;">
            <div style="margin-bottom: 15px;">
              <strong style="color: #2043a1;">Name:</strong> 
              <span style="color: #1e293b;">${name}</span>
            </div>
            <div style="margin-bottom: 15px;">
              <strong style="color: #2043a1;"> E-Mail:</strong> 
              <span style="color: #1e293b;">${email}</span>
            </div>
            <div style="margin-bottom: 15px;">
              <strong style="color: #2043a1;"> Betreff:</strong> 
              <span style="color: #1e293b;">${subject}</span>
            </div>
          </div>
          
          <div style="background: white; padding: 25px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <h3 style="color: #2043a1; margin: 0 0 15px 0;">💬 Nachricht:</h3>
            <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 3px solid #5f7ab4;">
              <p style="white-space: pre-line; margin: 0; color: #374151; line-height: 1.6;">${message}</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #64748b; font-size: 12px;">
            <p>Diese E-Mail wurde automatisch über dein Portfolio-Kontaktformular gesendet.</p>
          </div>
        </div>
      `,
      replyTo: email
    });

    console.log('E-Mail erfolgreich gesendet!');
    console.log('Message ID:', info.messageId);
    console.log('Von:', `${name} <${email}>`);
    console.log('An:', process.env.EMAIL_TO || process.env.EMAIL_USER);
    
    res.status(200).json({ 
      success: 'Nachricht erfolgreich gesendet',
      messageId: info.messageId 
    });
    
  } catch (error) {
    console.error('FEHLER beim E-Mail-Versand:');
    console.error('Error Code:', error.code);
    console.error('Error Response:', error.response);
    console.error('Error Message:', error.message);
    console.error('Full Error Object:', error);
    
    let userMessage = 'Fehler beim Senden der Nachricht';
    
    if (error.code === 'EAUTH') {
      userMessage = 'Authentifizierungsfehler - bitte kontaktiere den Administrator';
      console.error('🔑 HINWEIS: Überprüfe EMAIL_USER und EMAIL_PASS (App-Passwort!)');
    } else if (error.code === 'ESOCKET') {
      userMessage = 'Netzwerkfehler - bitte versuche es später erneut';
      console.error('HINWEIS: Netzwerkproblem oder falscher HOST/PORT');
    } else if (error.code === 'EMESSAGE') {
      userMessage = 'Ungültige E-Mail-Daten';
      console.error('HINWEIS: Problem mit E-Mail-Inhalt oder -Format');
    }
    
    res.status(500).json({ 
      error: userMessage,
      code: error.code 
    });
  }
});