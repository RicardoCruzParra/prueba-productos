package org.evaluacion.auth;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter implements Filter {
    private final JwtService jwt;
    public JwtAuthFilter(JwtService jwt){ this.jwt = jwt; }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest r = (HttpServletRequest) req;
        String h = r.getHeader(HttpHeaders.AUTHORIZATION);
        if(h != null && h.startsWith("Bearer ")){
            try {
                var claims = jwt.parse(h.substring(7)).getBody();
                var auth = new UsernamePasswordAuthenticationToken(claims.getSubject(), null, List.of());
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (Exception ignored) {}
        }
        chain.doFilter(req,res);
    }
}