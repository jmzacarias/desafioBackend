const persistence = "MEMORY";

let cartsService;
let productsService;

switch(persistence){
    case "MEMORY":
        const {default:MemCarts} = await import('./memoryDAO/Carts.js');
        const {default:MemProducts} = await import('./memoryDAO/Carts.js');
        cartsService = new MemCarts ();
        productsService = new MemProducts ();
        break;

    case "FILES":
        const {default:FilesCarts} = await import('./filesDAO/Carts.js');
        const {default:FilesProducts} = await import('./filesDAO/Carts.js');
        cartsService = new FilesCarts ();
        productsService = new FilesProducts ();
        break;

    case "MONGODB":
        const {default:MongoDBCarts} = await import('./mongodbDAO/Carts.js');
        const {default:MongoDBProducts} = await import('./mongodbDAO/Carts.js');
        cartsService = new MongoDBCarts ();
        productsService = new MongoDBProducts ();
        break;     
}