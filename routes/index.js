const NewRouter = require('restify-router').Router;

const myRouter = new NewRouter();

const dbController = require('../controllers/collectionController');
const usersController = require('../controllers/usersController');
const adminController = require('../controllers/adminController');
const postsController = require('../controllers/postsController');
const offersController = require('../controllers/offersController');

// Base Directory test Get
myRouter.get('/', dbController.baseGet);
// Create Mongo collection on mLab
myRouter.post('/createCollection', dbController.createCollectionPost);
// Create Mongo collection on mLab
myRouter.del('/dropCollection', dbController.dropCollectionDel);

// Register a new user
myRouter.post('/register', usersController.register);
// Register a new user
myRouter.post('/login', usersController.login);

// Get Document
myRouter.get('/getDoc/:id', postsController.getOne);
// Get Document
myRouter.post('/getDoc/:id', postsController.getOne);
// Get all document from the DB (not the soft-deleted ones)
myRouter.post('/getAllPosts', postsController.getAllPosts);
// Add document to the DB
myRouter.post('/addDoc', postsController.addOne);
// Soft Delete Document
myRouter.put('/delDoc/:id', postsController.softDel);

// Get all document from the DB (including soft-deleted ones)
myRouter.get('/getAll', adminController.getAll);
// Get all document from the DB (including soft-deleted ones)
myRouter.post('/getAll', adminController.getAll);
// Force delete document
myRouter.del('/forceDel/:id', adminController.forceDel);

// Add a new offer to an item
myRouter.post('/addOffer', offersController.addOffer);
// Accept an offer
myRouter.post('/acceptOffer', offersController.acceptOffer);
// Get all document from the DB (including soft-deleted ones)
myRouter.post('/getAllOffers', offersController.getAllOffers);

module.exports = myRouter;
