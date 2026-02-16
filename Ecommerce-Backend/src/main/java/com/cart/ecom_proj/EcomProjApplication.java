package com.cart.ecom_proj;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class EcomProjApplication {

	public static void main(String[] args) {
		SpringApplication.run(EcomProjApplication.class, args);
	}

}
