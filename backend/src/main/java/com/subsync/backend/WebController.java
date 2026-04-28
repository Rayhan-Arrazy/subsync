package com.subsync.backend; // <--- This was likely missing!

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/")
    public String index() {
        return "index.html";
    }

    @GetMapping("/login")
    public String login() {
        return "login.html";
    }

    @GetMapping("/subscription-detail")
    public String detail() {
        return "subscription-detail.html";
    }

    @GetMapping("/porto")
    public String showPorto() {
        return "porto";
    }
}