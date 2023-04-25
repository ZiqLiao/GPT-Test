package com.uomrecruit.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.service.*;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.List;

@Configuration
@EnableSwagger2
public class SwaggerConfig {

    private static final String ENV_DEV = "dev";
    private static final String PACKAGE_NAME = "com.uomrecruit";

    @Value("${swagger_env}")
    private String currentEnv;

    private boolean isDev() {
        return currentEnv.equals(ENV_DEV);
    }

    @Bean
    public Docket createRestApi() {
        return new Docket(DocumentationType.SWAGGER_2)
                .enable(isDev())
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.basePackage(PACKAGE_NAME))
                .paths(PathSelectors.any())
                .build();
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("UoMRecruit API Documentation")
                .description("RESTFUL API style")
                .version("1.0")
                .build();
    }

    private ApiKey apiKey() {
        return new ApiKey("JWT", "Authorization", "header");
    }

    private SecurityContext securityContext() {
        return SecurityContext.builder().securityReferences(defaultAuth()).build();
    }

    private List<SecurityReference> defaultAuth() {
        AuthorizationScope authorizationScope = new AuthorizationScope("global", "accessEverything");
        AuthorizationScope[] authorizationScopes = new AuthorizationScope[1];
        authorizationScopes[0] = authorizationScope;
        return List.of(new SecurityReference("JWT", authorizationScopes));
    }
}
