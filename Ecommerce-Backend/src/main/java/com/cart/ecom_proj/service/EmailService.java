package com.cart.ecom_proj.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendNewsletterEmail(String toEmail) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(toEmail);
        helper.setSubject("Welcome to NexusKart Newsletter!");

        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
                        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                        .header { background-color: #000000; padding: 40px 20px; text-align: center; }
                        .header h1 { color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase; }
                        .content { padding: 40px 30px; line-height: 1.6; color: #333333; }
                        .content h2 { color: #000000; font-size: 24px; margin-bottom: 20px; }
                        .button-container { text-align: center; margin-top: 30px; }
                        .button { background-color: #000000; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; text-transform: uppercase; font-size: 14px; }
                        .footer { background-color: #fafafa; padding: 20px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #eeeeee; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>NEXUSKART</h1>
                        </div>
                        <div class="content">
                            <h2>Welcome to the inner circle.</h2>
                            <p>Thank you for subscribing to the NexusKart newsletter. You're now first in line for exclusive tech drops, premium deals, and the latest innovations in gadgetry.</p>
                            <p>Stay tuned for our upcoming "Nexus Pro" exclusive event coming later this month.</p>
                            <div class="button-container">
                                <a href="http://localhost:5173" class="button">Visit the Store</a>
                            </div>
                        </div>
                        <div class="footer">
                            <p>&copy; 2026 NexusKart Premiere. All rights reserved.</p>
                            <p>You received this email because you signed up on our website.</p>
                        </div>
                    </div>
                </body>
                </html>
                """;

        helper.setText(htmlContent, true);
        mailSender.send(message);
    }
}
