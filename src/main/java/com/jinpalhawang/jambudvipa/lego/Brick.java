package com.jinpalhawang.jambudvipa.lego;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document
public class Brick {

  private @Id ObjectId id;
  private String name;
  private String category;
  private String color;
  private String elementId;

  private Brick() {}

  public Brick(String name, String category, String color, String elementId) {
    this.name = name;
    this.category = category;
    this.color = color;
    this.elementId = elementId;
  }

}
