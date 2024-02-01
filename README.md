#E-Commerce assignment
# Run

### Install

```
npm install
```

### Start API

```
Create a .env file with the Mongo db connection URL and the API URL  you want with the following names
CONNECTION_STRING=< MongoDB Connection URL >
API_URL = < URL wanted >
Then run the following command:
npm start
```

# Routes

### Products

```
GET      /api/v1/products
GET      /api/v1/products/:id
POST     /api/v1/products
PUT      /api/v1/products/:id
DELETE   /api/v1/products/:id
GET      /api/v1/products/search?query=
```

### SWAGGER UI
```
URL = http://localhost:3000/api-docs/
```

### RUN TESTS
```
npm test
```



