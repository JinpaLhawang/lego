package com.jinpalhawang.jambudvipa.lego;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BrickRepository extends MongoRepository<Brick, ObjectId> {

  public List<Brick> findByIdIn(List<ObjectId> ids);

  public List<Brick> findByElementIdIn(List<String> elementIds);

}
