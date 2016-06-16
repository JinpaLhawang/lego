package com.jinpalhawang.jambudvipa.lego;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseLoader implements CommandLineRunner {

  private final BrickRepository repository;

  @Autowired
  public DatabaseLoader(BrickRepository repository) {
    this.repository = repository;
  }

  @Override
  public void run(String... args) throws Exception {

    this.repository.deleteAll();

    this.repository.save(new Brick("Corner Plate 1x2x2", "Plates", "Red", "242021"));
    this.repository.save(new Brick("Corner Plate 1x2x2", "Plates", "Black", "242021"));
    this.repository.save(new Brick("Corner Plate 1x2x2", "Plates", "Blue", "242021"));
    this.repository.save(new Brick("Corner Plate 1x2x2", "Plates", "Yellow", "242021"));
    this.repository.save(new Brick("Corner Plate 1x2x2", "Plates", "Green", "242021"));
    this.repository.save(new Brick("Corner Plate 1x2x2", "Plates", "Pink", "242021"));
    this.repository.save(new Brick("Corner Plate 1x2x2", "Plates", "Purple", "242021"));

    System.out.println("\nBricks found with findAll():");
    for (Brick brick : repository.findAll()) {
      System.out.println(brick);
    }
    System.out.println();
  }

}
