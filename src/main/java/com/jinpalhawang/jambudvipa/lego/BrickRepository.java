package com.jinpalhawang.jambudvipa.lego;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BrickRepository extends MongoRepository<Brick, ObjectId> {

}
