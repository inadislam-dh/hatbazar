const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cors = require('cors')
const errorMiddleware = require('../middlewares/error.middleware')
const Role = require('../utils/userRoles.utils')
const auth = require('../middlewares/auth.middleware')
const awaitHandlerFactory = require('../middlewares/awaitHandler.middleware')
const { getAllUsers, createUser, getUserById, getUserByEmail, getCurrentUser, updateUser, deleteUser, userLogin, userLogout, changePass } = require('../controllers/user.controller')
const { Home, Dashboard, Customer } = require('../controllers/controller')
const { createUserSchema, updateUserSchema, validateLogin } = require('../middlewares/validators/userValidator.middleware')
const { Products, createProduct, productById, updateProduct, deleteProduct, productByName } = require('../controllers/product.controller')
const {Cat, createCategory, categoryByName, categoryById, updateCategory, deleteCategory} = require('../controllers/category.controller')
const multerInstance = require('../utils/multer')
const { createProductSchema, updateProductSchema } = require('../middlewares/validators/productValidator.middleware')
const cookieParser = require('cookie-parser')
const { createCategorySchema, updateCategorySchema } = require('../middlewares/validators/categoryValidator.middleware')
const { Orders, orderById, deleteOrder, createOrder, updateOrder } = require('../controllers/orders.controller')
const { Sliders, createSlider, updateSlider, deleteSlider } = require('../controllers/sliders.controller')
const { Shippings, createShipping, updateShipping, deleteShipping } = require('../controllers/shippingmethods.controller')
const { Sitesettings, updateSiteSetting, updateGS, updatePages } = require('../controllers/settings.controller')
dotenv.config()


exports.NewRoutes = (express, app) => {
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(express.json())
    app.use(cookieParser())
    app.use("/media", express.static('public'))
    app.use(cors({
        origin: "*",
        credentials: true,
    }))
    app.use(errorMiddleware)

    app.get("/home", awaitHandlerFactory(Home))
    app.post("/hello", (req, res) => {
        console.log(req.body);
    })
    
    // Category
    app.get("/category", awaitHandlerFactory(Cat))
    app.post("/category", auth(), createCategorySchema, awaitHandlerFactory(createCategory))
    app.get("/category/:catname", awaitHandlerFactory(categoryByName))
    app.get("/category/:id", awaitHandlerFactory(categoryById))
    app.patch("/category/:id", auth(), awaitHandlerFactory(updateCategory))
    app.delete("/category/:id", auth(), awaitHandlerFactory(deleteCategory))
    
    // Products
    app.get("/products", awaitHandlerFactory(Products))
    app.post("/add-product", auth(), createProductSchema, multerInstance.upload.single('image'), awaitHandlerFactory(createProduct))
    app.get("/product/:id", awaitHandlerFactory(productById))
    app.get("/productn/:productname", awaitHandlerFactory(productByName))
    app.patch("/product/:id", auth(), multerInstance.upload.single('image'), awaitHandlerFactory(updateProduct))
    app.delete("/product/:id", auth(), awaitHandlerFactory(deleteProduct))

    // Users
    app.get("/users", auth(), awaitHandlerFactory(getAllUsers))
    app.post("/create-user", auth(), awaitHandlerFactory(createUser))
    app.get("/user/:id", auth(), awaitHandlerFactory(getUserById))
    app.get("/email/:email", auth(), awaitHandlerFactory(getUserByEmail))
    app.get("/whoami", auth(), awaitHandlerFactory(getCurrentUser))
    app.patch("/user/:id", auth(), awaitHandlerFactory(updateUser))
    app.delete("/user/:id", auth(), awaitHandlerFactory(deleteUser))
    app.post('/change-pass/:userid', auth(), awaitHandlerFactory(changePass))
    app.post('/login', validateLogin, awaitHandlerFactory(userLogin))
    app.post('/user-logout', awaitHandlerFactory(userLogout))

    // Dahboard
    app.get("/dashboard-info", auth(), awaitHandlerFactory(Dashboard))
    app.get("/get-customers", auth(), awaitHandlerFactory(Customer))
    //orders
    app.get("/get-orders", auth(), awaitHandlerFactory(Orders))
    app.post("/add-orders", awaitHandlerFactory(createOrder))
    app.get("/get-order/:id", auth(), awaitHandlerFactory(orderById))
    app.patch("/update-order/:id", auth(), awaitHandlerFactory(updateOrder))
    app.delete("/delete-order/:id", auth(), awaitHandlerFactory(deleteOrder))
    // sliders
    app.get("/sliders", auth(), multerInstance.upload.single('image'), awaitHandlerFactory(Sliders))
    app.post("/sliders", auth(), multerInstance.upload.single('image'), awaitHandlerFactory(createSlider))
    app.patch("/sliders/:id", auth(), multerInstance.upload.single('image'), awaitHandlerFactory(updateSlider))
    app.delete("/sliders/:id", auth(), awaitHandlerFactory(deleteSlider))
    // shipping
    app.get("/get-sm", auth(), awaitHandlerFactory(Shippings))
    app.post("/sm", auth(), awaitHandlerFactory(createShipping))
    app.patch("/sm/:id", auth(), awaitHandlerFactory(updateShipping))
    app.delete("/sm/:id", auth(), awaitHandlerFactory(deleteShipping))
    // setting
    app.get("/site-settings", auth(), awaitHandlerFactory(Sitesettings))
    app.patch("/site-settings", auth(), multerInstance.upload.single('site_logo'), awaitHandlerFactory(updateSiteSetting))
    app.patch("/google-sheet", auth(), awaitHandlerFactory(updateGS))
    app.patch("/page", auth(), awaitHandlerFactory(updatePages))

    app.all('*', (req, res, next) => {
        res.status(404).json({
            error: true,
            message: "Endpoint not Found!!"
        })
    })
}