const express =require ('express');
const router=express.Router();
const multer=require('multer')
const app=express();
const path=require('path')
const auth=require('../middlewares/jwtAuthentication');
const creatorOnly=require('../middlewares/creatorOnly');

const {createNewUser,
    userLogin,
    userPasswordResetsendOtp,
    resetPasswordWithOtp,
    verifyOtp 
}=require('../controllers/userAuthController')

const {createNewCreator,
  creatorLogin,
  creatorPasswordResetsendOtp,
  creatorverifyOtp,
  resetCreatorPasswordWithOtp ,
}=require('../controllers/creatorAuthController')

const{
  createNewBusinessUser,
  businessLogin,
  businessPasswordResetsendOtp,
  resetBusinessPasswordWithOtp,
  businessverifyOtp
}=require('../controllers/businessAuthController')

const{
  creatorFeedUpload,
  creatorFeedDelete,
  getCreatorFeeds,
}=require('../controllers/creatorFeedController')

const{
  feedsWatchByUser,
}=require('../controllers/feedsController')




const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file)
    if (file.mimetype.startsWith('image/')){
      cb(null, './uploads/images');
    } else if (file.mimetype.startsWith('video/')) {
      cb(null, './uploads/videos');
    } else {
      cb(new Error('Unknown fieldname'), null);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});

const upload = multer({ storage: storage });



// Serve static files from the 'uploads' directory
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// User Authentication Endpoints
router.post('/auth/user/register',createNewUser);
router.post('/auth/user/login',userLogin);
router.post('/auth/user/otp-send',userPasswordResetsendOtp);
router.post('/auth/user/verify-otp',verifyOtp);
router.post('/auth/user/reset-password',resetPasswordWithOtp) ;

//Creator Authentication API EndPoints 
router.post('/auth/creator/register',createNewCreator);
router.post('/auth/creator/login',creatorLogin);
router.post('/auth/creator/sent-otp',creatorPasswordResetsendOtp);
router.post('/auth/creator/verify-otp',creatorverifyOtp);
router.post('/auth/creator/reset-password',resetCreatorPasswordWithOtp);
router.post('/creator/feed',auth,creatorOnly,upload.single('file'),creatorFeedUpload);
router.delete('/creator/delete/feed/:id',auth,creatorOnly,creatorFeedDelete);
router.get('/creator/getall/feeds',auth,creatorOnly,getCreatorFeeds);


// Business Authentication API EndPoints
router.post('/auth/business/register',createNewBusinessUser);
router.post('/auth/business/login',businessLogin);
router.post('/auth/business/sent-otp',businessPasswordResetsendOtp);
router.post('/auth/business/verify-otp',businessverifyOtp);
router.post('/auth/business/reset-password',resetBusinessPasswordWithOtp);


//Feeds API EndPoints
router.post('/feeds/watchedbyuser',feedsWatchByUser);




console.log('roots works properly')


module.exports= router;