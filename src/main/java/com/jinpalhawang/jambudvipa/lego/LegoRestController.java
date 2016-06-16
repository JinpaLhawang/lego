package com.jinpalhawang.jambudvipa.lego;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class LegoRestController {

  @RequestMapping(value = "/")
  public String index() {
    return "index";
  }

}
