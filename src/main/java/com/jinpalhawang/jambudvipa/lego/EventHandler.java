package com.jinpalhawang.jambudvipa.lego;

import static com.jinpalhawang.jambudvipa.lego.WebSocketConfiguration.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleAfterDelete;
import org.springframework.data.rest.core.annotation.HandleAfterSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.hateoas.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RepositoryEventHandler(Brick.class)
public class EventHandler {

  private final SimpMessagingTemplate websocket;
  private final EntityLinks entityLinks;

  @Autowired
  public EventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
    this.websocket = websocket;
    this.entityLinks = entityLinks;
  }

  @HandleAfterCreate
  public void newBrick(Brick brick) {
    this.websocket.convertAndSend(MESSAGE_PREFIX + "/newBrick", getPath(brick));
  }

  @HandleAfterSave
  public void updateBrick(Brick brick) {
    this.websocket.convertAndSend(MESSAGE_PREFIX + "/updateBrick", getPath(brick));
  }

  @HandleAfterDelete
  public void deleteBrick(Brick brick) {
    this.websocket.convertAndSend(MESSAGE_PREFIX + "/deleteBrick", getPath(brick));
  }

  private String getPath(Brick brick) {
    return this.entityLinks.linkForSingleResource(brick.getClass(), brick.getId())
        .toUri().getPath();
  }

}
