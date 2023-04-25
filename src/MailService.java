package com.uomrecruit.services;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.JWTVerifier;
import org.springframework.mail.javamail.MimeMessageHelper;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {

  private final JavaMailSender javaMailSender;

  @Value("${jwt.activatedKey}")
  private String jwtSecret;

    public void sendEmail(String to, String subject, String body) {
    MimeMessage message = javaMailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message);

    try {
      helper.setFrom("Cai19980122@gmail.com");
      helper.setTo(to);
      helper.setSubject(subject);
      helper.setText(body, true); // The 'true' argument indicates the email body is HTML
    } catch (MessagingException e) {
      e.printStackTrace();
    }

    javaMailSender.send(message);
  }

  public String createJwtToken(String email) {
    Algorithm algorithm = Algorithm.HMAC256(jwtSecret);
    Date expirationDate = new Date(System.currentTimeMillis() + 1200000);
    String token = JWT.create()
        .withSubject("email-confirmation")
        .withClaim("email", email)
        .withIssuedAt(new Date())
        .withExpiresAt(expirationDate)
        .sign(algorithm);
    return token;
  }

  public DecodedJWT verifyAndDecodeJwtToken(String token) {
    try {
      Algorithm algorithm = Algorithm.HMAC256(jwtSecret);
      JWTVerifier verifier = JWT.require(algorithm)
          .withSubject("email-confirmation")
          .build();
      DecodedJWT jwt = verifier.verify(token);
      Date expiresAt = jwt.getExpiresAt();
      if (expiresAt != null && expiresAt.before(new Date())) {
        throw new RuntimeException("JWT token has expired");
      }
      return jwt;
    } catch (JWTDecodeException exception) {
      // Handle invalid token
      throw new RuntimeException("Invalid JWT token", exception);
    }
  }

}
