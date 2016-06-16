package com.jinpalhawang.jambudvipa.lego;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Brick {

  private @Id ObjectId id;
  private String name;
  private String category;
  private String color;
  private String elementId;

  public Brick() {}

  public Brick(String name, String category, String color, String elementId) {
    this.name = name;
    this.category = category;
    this.color = color;
    this.elementId = elementId;
  }

  public ObjectId getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getCategory() {
    return category;
  }

  public String getColor() {
    return color;
  }

  public String getElementId() {
    return elementId;
  }

  public void setId(ObjectId id) {
    this.id = id;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public void setColor(String color) {
    this.color = color;
  }

  public void setElementId(String elementId) {
    this.elementId = elementId;
  }

  @Override
  public String toString() {
    return "Brick [id=" + id + ", name=" + name + ", category=" + category + ", color=" + color + ", elementId="
        + elementId + "]";
  }

}
