package org.evaluacion.config;

import org.evaluacion.auth.JwtAuthFilter;
import org.evaluacion.auth.JwtService;
import org.evaluacion.auth.LoginRequest;
import org.evaluacion.auth.TokenResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.*;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.bind.annotation.*;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthFilter jwtFilter;

    @Bean public SecurityFilterChain chain(HttpSecurity http) throws Exception {
        http.csrf(csrf->csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/productos/**").authenticated()
                        .requestMatchers("/api/productos/**").authenticated()
                        .anyRequest().permitAll()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean public UserDetailsService uds(PasswordEncoder pe){
        // Usuario demo: user / password
        String pass = pe.encode("password");
        UserDetails u = User.withUsername("user").password(pass).roles("USER").build();
        return new InMemoryUserDetailsManager(u);
    }

    @Bean public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean public AuthenticationManager authenticationManager(AuthenticationConfiguration c) throws Exception {
        return c.getAuthenticationManager();
    }

    @RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
    static class AuthController {
        private final AuthenticationManager am;
        private final JwtService jwt;

        @PostMapping("/login")
        public TokenResponse login(@RequestBody LoginRequest req){
            am.authenticate(new UsernamePasswordAuthenticationToken(req.username(), req.password()));
            return new TokenResponse(jwt.generate(req.username()));
        }
    }
}