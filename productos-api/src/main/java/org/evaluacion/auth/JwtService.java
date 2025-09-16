package org.evaluacion.auth;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {
    private final byte[] key;
    private final long expirationMs;

    public JwtService(@Value("${jwt.secret}") String secret,
                      @Value("${jwt.expiration-minutes}") long minutes){
        this.key = secret.getBytes(StandardCharsets.UTF_8);
        this.expirationMs = minutes * 60_000;
    }

    public String generate(String username){
        Date now = new Date();
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime()+expirationMs))
                .signWith(Keys.hmacShaKeyFor(key), SignatureAlgorithm.HS256)
                .compact();
    }

    public Jws<Claims> parse(String token){
        return Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(key)).build().parseClaimsJws(token);
    }
}