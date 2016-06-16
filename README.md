# lego

## Setup

```
git clone https://github.com/JinpaLhawang/lego.git
cd lego
```

## Testing and Building

```
mvn test
mvn package
```

## Running

```
mongod --dbpath ~/mongodb/data/db/
mvn spring-boot:run
```

## Viewing UI

http://localhost:8101

### Inserting Data

```
curl -X POST 'http://localhost:8101/api/bricks' -d '{ "name": "Plate 4x10", "category": "Plates", "color": "Black", "elementId": "303026" }' -H 'Content-Type: application/json'
```

### Requesting Data

```
curl 'http://localhost:8101/api/bricks'
```
