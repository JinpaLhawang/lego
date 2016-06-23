package com.jinpalhawang.jambudvipa.lego;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
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

    repository.deleteAll();

    repository.save(new Brick("Corner Plate 1x2x2", "Plates", "White", "242001"));
    repository.save(new Brick("Corner Plate 1x2x2", "Plates", "Red", "242021"));
    repository.save(new Brick("Corner Plate 1x2x2", "Plates", "Blue", "242023"));
    repository.save(new Brick("Corner Plate 1x2x2", "Plates", "Yellow", "242024"));
    repository.save(new Brick("Corner Plate 1x2x2", "Plates", "Black", "242026"));
    repository.save(new Brick("Corner Plate 1x2x2", "Plates", "Grey", "4210635"));

    List<ObjectId> ids = new ArrayList<ObjectId>();

    System.out.println("\nBricks found with findAll():");
    for (Brick brick : repository.findAll()) {
      System.out.println(brick);
      ids.add(brick.getId());
    }

    System.out.println("\nBricks found with findByIdIn(ids):");
    ids.remove(0);
    ids.remove(0);
    System.out.println(repository.findByIdIn(ids));

    System.out.println("\nBricks found with findByElementIdIn(elementIds):");
    List<String> elementIds = new ArrayList<String>();
    elementIds.add("242021");
    elementIds.add("242026");
    System.out.println(repository.findByElementIdIn(elementIds));
    System.out.println();
  }

}
