const express =require ('express');
const router=express.Router();
const multer=require('multer')
const app=express();
const path=require('path')
const auth=require('../middlewares/jwtAuthentication');
const creatorOnly=require('../middlewares/creatorOnly');
const adminOnly=require('../middlewares/adminOnly')

const {createNewUser,
    userLogin,
    userSendOtp,
    userPasswordReset,
    existUserVerifyOtp, 
    newUserVerifyOtp,
    userlogOut,
}=require('../controllers/authenticationControllers/userAuthController')

const {createNewCreator,
  creatorLogin,
  creatorSendOtp,
  existCreatorVerifyOtp,
  newCreatorVerifyOtp,
  creatorPasswordReset ,
}=require('../controllers/authenticationControllers/creatorAuthController')

const{
  createNewBusinessUser,
  businessLogin,
  businessSendOtp,
  businessPasswordReset,
  existBusinessVerifyOtp,
  newBusinessVerifyOtp,
}=require('../controllers/authenticationControllers/businessAuthController')

const{
  creatorFeedUpload,
  creatorFeedDelete,
  getCreatorFeeds,
}=require('../controllers/feedControllers/creatorFeedController')

const{
  feedsWatchByUser,
  mostWatchedFeeds,
  getAllFeeds,
}=require('../controllers/feedControllers/feedsController')

const{
  newAdmin,
  adminLogin ,
  adminSendOtp,
  existAdminVerifyOtp,
  newAdminVerifyOtp,
  adminPasswordReset,
}=require('../controllers/authenticationControllers/adminAuthController')

const{
  getUserdetailWithId,
  getAllUserDetails,
}=require('../controllers/userControllers/userDetailController')

const{
  getAllTags,
  getTagsWithId,
}=require('../controllers/tagsController')

const{
  userProfileDetailUpdate,
  profileDetailWithId,
}=require('../controllers/profileControllers/profileController')

const{
  getUserStatus,
}=require('../controllers/adminControllers/adminUserControllers')






const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req)
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
router.post('/auth/user/otp-send',userSendOtp);
router.post('/auth/exist/user/verify-otp',existUserVerifyOtp,);
router.post('/auth/new/user/verify-otp',newUserVerifyOtp,);
router.post('/auth/user/reset-password',userPasswordReset) ;
router.post("/auth/user/logout",userlogOut);



//Creator Authentication API EndPoints 
router.post('/auth/creator/register',createNewCreator);
router.post('/auth/creator/login',creatorLogin);
router.post('/auth/creator/sent-otp',creatorSendOtp);
router.post('/auth/exist/creator/Verify-otp',existCreatorVerifyOtp);
router.post('/auth/new/creator/Verify-otp',newCreatorVerifyOtp);
router.post('/auth/creator/reset-password',creatorPasswordReset);

//Creator Feed API Endpoints
router.post('/creator/feed',upload.single('file'),creatorFeedUpload);
router.delete('/creator/delete/feed/:id',auth,creatorOnly,creatorFeedDelete);
router.get('/creator/getall/feeds',auth,creatorOnly,getCreatorFeeds);


// Business Authentication API EndPoints
router.post('/auth/business/register',createNewBusinessUser);
router.post('/auth/business/login',businessLogin);
router.post('/auth/business/sent-otp',businessSendOtp);
router.post('/auth/exist/business/verify-otp',existBusinessVerifyOtp);
router.post('/auth/new/business/verify-otp',newBusinessVerifyOtp);
router.post('/auth/business/reset-password',businessPasswordReset);


//Admin Authentication API EndPoints
router.post('/auth/admin/register',newAdmin);
router.post('/auth/admin/login',adminLogin);
router.post('/auth/admin/sent-otp',adminSendOtp);
router.post('/auth/exist/admin/verify-otp',existAdminVerifyOtp);
router.post('/auth/new/admin/verify-otp',newAdminVerifyOtp);
router.post('/auth/admin/reset-password',adminPasswordReset);

//Admin Feed API EndPoints
router.post('/admin/feed', auth, creatorOnly, upload.single('file'), creatorFeedUpload);


//Admin User API EndPoints
router.get('/admin/getall/users',getAllUserDetails);
router.get('/admin/get/user/:id',getUserdetailWithId);
router.get("/admin/users/status",getUserStatus);
// router.delete('/admin/delete/feed/:id',auth,creatorOnly,creatorFeedDelete);
// router.get('/admin/getall/feeds',auth,creatorOnly,getCreatorFeeds);


//Feeds API EndPoints
router.get('/all/feeds',getAllFeeds)
router.post('/feeds/watchedbyuser',feedsWatchByUser);
// router.post('/most/watched/feeds',mostWatchedFeeds);


//Tags API EndPoints
router.get('/all/tags',getAllTags)
router.get('/all/tags/:id',getTagsWithId)



//Profile Setting detail with id
 router.post('/profile/detail/update/:id',upload.single('file'),userProfileDetailUpdate)
 router.get('/get/profile/detail/:id',profileDetailWithId)





module.exports= router;