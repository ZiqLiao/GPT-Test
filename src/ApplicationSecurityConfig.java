package com.uomrecruit.config;

import com.uomrecruit.auth.ApplicationStudentService;
import com.uomrecruit.auth.ApplicationSchoolService;
import com.uomrecruit.auth.AuthEntryPoint;
import com.uomrecruit.jwt.JwtStudentAuthFilter;
import com.uomrecruit.jwt.JwtTokenVerifier;
import com.uomrecruit.jwt.JwtSchoolAuthFilter;
import com.uomrecruit.repositories.SchoolRepository;
import com.uomrecruit.repositories.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;

import javax.crypto.SecretKey;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class ApplicationSecurityConfig extends WebSecurityConfigurerAdapter {

    private final ApplicationSchoolService myUserDetailsService;
    private final SecretKey secretKey;
    private final SchoolRepository schoolRepository;

    private final ApplicationStudentService applicationStudentService;
    private final StudentRepository studentRepository;

    @SneakyThrows
    protected void configure(HttpSecurity http) {
        JwtStudentAuthFilter studentFilter = new JwtStudentAuthFilter(providerManager(), secretKey, studentRepository);
        JwtSchoolAuthFilter schoolFilter = new JwtSchoolAuthFilter(authenticationManager(), secretKey, schoolRepository);
        studentFilter.setFilterProcessesUrl("/students/login");
        schoolFilter.setFilterProcessesUrl("/login");
        http
                .csrf().disable()
                .cors().configurationSource(request -> {
                    var cors = new CorsConfiguration();
                    cors.setAllowedOrigins(List.of("http://localhost:3000"));
                    cors.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    cors.setAllowedHeaders(List.of("*"));
                    return cors;
                })
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .addFilter(schoolFilter)
                .addFilterAfter(studentFilter, JwtSchoolAuthFilter.class)
                .addFilterAfter(new JwtTokenVerifier(secretKey), JwtSchoolAuthFilter.class)
                .authorizeRequests()
                .antMatchers("/schools/{id:^[1-9]\\d*$}")
                .access("@guard.checkUserAccess(authentication, #id)")
                .antMatchers(
                        "/",
                        "/password",
                        "/schools/signup",
                        "/students/login",
                        "/students/signup",
                        "/schools/confirm-email",
                        "/schools/resend-confirmation",
                        // -- Swagger UI v2
                        "/v2/api-docs",
                        "/swagger-resources",
                        "/swagger-resources/**",
                        "/configuration/ui",
                        "/configuration/security",
                        "/swagger-ui.html",
                        "/webjars/**",
                        "/swagger-ui/**"
                )
                .permitAll()
                .anyRequest()
                .authenticated()
                .and()
                .exceptionHandling().authenticationEntryPoint(new AuthEntryPoint());
    }

    public ProviderManager providerManager() {
        return new ProviderManager(studentDaoAuthenticationProvider());
    }

    public DaoAuthenticationProvider studentDaoAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder());
        provider.setUserDetailsService(applicationStudentService);
        return provider;
    }

    @Override
    @SneakyThrows
    protected void configure(AuthenticationManagerBuilder auth) {
        auth.authenticationProvider(daoAuthenticationProvider());
    }

    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder());
        provider.setUserDetailsService(myUserDetailsService);
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}
