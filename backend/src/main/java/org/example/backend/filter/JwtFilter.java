package org.example.backend.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.example.backend.model.User;
import org.example.backend.service.JwtService;
import org.example.backend.service.UserService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * JWT Authentication filter that intercepts all incoming HTTP requests.
 * <p>
 * This filter:
 * <ul>
 *     <li>Extracts the JWT from the Authorization header</li>
 *     <li>Validates the token and extracts the username</li>
 *     <li>Loads the user from the database</li>
 *     <li>Sets the authenticated user in Spring SecurityContext</li>
 * </ul>
 * It extends {@link OncePerRequestFilter} to ensure it runs only once per request.
 */
@Component
@AllArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private JwtService jwtService;
    private UserService userService;

    /**
     * Main filtering method that gets triggered for every HTTP request.
     * <p>
     * If a valid JWT token is found in the Authorization header, it:
     * <ul>
     *     <li>Extracts the username from the token</li>
     *     <li>Loads the User from the database</li>
     *     <li>Creates an Authentication object with roles</li>
     *     <li>Sets it in the Spring Security context</li>
     * </ul>
     * Otherwise, it simply forwards the request down the filter chain.
     *
     * @param request  the incoming HTTP request
     * @param response the HTTP response
     * @param chain    the filter chain
     * @throws ServletException if a servlet error occurs
     * @throws IOException      if an I/O error occurs
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        String token;
        String email;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        token = authHeader.substring(7);
        email = jwtService.extractEmail(token);

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            User user = userService.findByEmail(email);
            var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()));

            if (jwtService.isTokenValid(token, user)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(user, null, authorities);

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        chain.doFilter(request, response);
    }
}

