package com.zestlifia;


import com.zestlifia.util.FileUtil;
import org.json.simple.JSONObject;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.io.File;


@Configuration
@EnableAutoConfiguration
@ComponentScan
@Controller
@SpringBootApplication
public class App extends WebMvcConfigurerAdapter {

    // static resources
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/zestlifia/**").addResourceLocations("/WEB-INF/app/");
    }


	public static void main(String[] args) {

        System.out.println("Zestlifia is running");

		SpringApplication.run(App.class, args);
	}

    @RequestMapping("/")
    public String start(){
        System.out.println("start zestlifia");
        return "redirect:/zestlifia/backoffice/index.html";
    }
}
