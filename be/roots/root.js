const express =require ('express');
const router=express.Router();
const multer=require('multer')
const app=express();
const path=require('path')
const {auth}=require('../middlewares/jwtAuthentication');
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
  creatorFeedScheduleUpload,
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
  profileDetailWithAccountId
}=require('../controllers/profileControllers/profileController')

const{
  getUserStatus,
}=require('../controllers/adminControllers/adminUserControllers');

const{
  likeFeed,
  saveFeed,
  downloadFeed,
  addComment,
  getUserSavedFeeds,
  getUserDownloadedFeeds,
  shareFeed,
}=require('../controllers/feedControllers/userActionsFeedController');

const{
  createPlan,
  updatePlan,
  deletePlan,
  getAllPlans
}=require('../controllers/adminControllers/adminSubcriptionController');


const{
  subscribePlan,
  cancelSubscription,
  getAllSubscriptionPlans,
}=require('../controllers/userControllers/userSubcriptionController');

const{
  adminFeedUpload,
}=require('../controllers/adminControllers/adminfeedController');


const{
  getCreatorDetailWithId,
  getAllCreatorDetails,
}=require('../controllers/creatorControllers/creatorDetailController');

const{
  followCreator,
  unfollowCreator,
  getUserFollowers,
  getCreatorFollowers,
}=require('../controllers/followersControllers.js/followerDetailController');

const{
  createCategory,
  // updateCategory,
  deleteCategory,
  getAllCategories
}=require('../controllers/adminControllers/adminCatagoryController');

const{
  addAccount,
  switchAccount,
  getActiveAccount,
  getAllAccounts
}=require('../controllers/accountController');

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

//User Feed Actions
router.post('/user/feed/like',likeFeed);
router.post('/user/feed/save',saveFeed);
router.post('/user/feed/download',downloadFeed);
router.post('/user/feed/comment',addComment);
router.post('/user/feed/share',shareFeed);



//User Feed Get Actions
router.get('/user/saved/feeds/:id',getUserSavedFeeds);
router.get('/user/saved/download/:id',getUserDownloadedFeeds);

//User Subscription API EndPoints
router.post('/user/plan/subscription',subscribePlan); // UserId, PlanId
router.post('/user/cancel/subscription/:id', cancelSubscription);//UserId, SubscriptionId

//User Follower API EndPoints
router.post('/user/follow/creator', followCreator);
router.post('/user/unfollow/creator', unfollowCreator);
router.get('/user/get/followers', getUserFollowers); 


//Creator Authentication API EndPoints 
router.post('/auth/creator/register',createNewCreator);
router.post('/auth/creator/login',creatorLogin);
router.post('/auth/creator/sent-otp',creatorSendOtp);
router.post('/auth/exist/creator/Verify-otp',existCreatorVerifyOtp);
router.post('/auth/new/creator/Verify-otp',newCreatorVerifyOtp);
router.post('/auth/creator/reset-password',creatorPasswordReset);

//Creator Feed API Endpoints
router.post("/creator/feed/:id",auth,upload.single('file'),creatorFeedUpload);
router.post("/creator/feed/schedule/:id",auth,upload.single('file'),creatorFeedScheduleUpload);
router.delete('/creator/delete/feeds',auth,creatorFeedDelete); // userId , feedId
router.get('/creator/getall/feeds',auth,getCreatorFeeds);

//Creator Follower API EndPoints
router.get('/creator/get/followers', getCreatorFollowers);

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
router.post('/admin/feed',auth,upload.single('file'), adminFeedUpload);

//Admin Category API EndPoints
router.post('/admin/feed/category', createCategory);
router.delete('/admin/feed/category/:id', deleteCategory);
router.get('/admin/feed/category', getAllCategories);

//Admin Subscription API EndPoints
router.post('/admin/create/subscription', createPlan); // name, price, durationDays, limits, description, planType, isActive 
router.put('/admin/update/subscription/:id', updatePlan); // Plan ID
router.delete('/admin/delete/subscription/:id', deletePlan);// Plan ID
router.get('/admin/getall/subscriptions', getAllPlans);

//Admin User API EndPoints
router.get('/admin/getall/users',getAllUserDetails);
router.get('/admin/get/user/:id',getUserdetailWithId);
router.get("/admin/users/status",getUserStatus);
// router.delete('/admin/delete/feed/:id',auth,creatorOnly,creatorFeedDelete);
// router.get('/admin/getall/feeds',auth,creatorOnly,getCreatorFeeds);

//Admin Creator API Endpoints
router.get('/admin/getall/creators',getAllCreatorDetails);
router.get('/admin/get/creator/:id',getCreatorDetailWithId);
// router.get("/admin/creators/status",getUserStatus);
// router.get('/admin/creators/status',getCreatorDetailWithId);

//Feeds API EndPoints
router.get('/all/feeds',getAllFeeds)
router.post('/feeds/watchedbyuser',feedsWatchByUser);
// router.post('/most/watched/feeds',mostWatchedFeeds);


//Tags API EndPoints
router.get('/all/tags',getAllTags)
router.get('/all/tags/:id',getTagsWithId)



//Profile Setting detail with id
 router.post('/profile/detail/update/:id',upload.single('file'),userProfileDetailUpdate)
 router.get('/get/profile/detail/:id',profileDetailWithAccountId)


 //Subscription Plan API EndPoints
router.get('/getall/subscriptions', getAllSubscriptionPlans);


//Account API EndPoints
router.post('/account/add',addAccount);
router.post('/account/switch',auth,switchAccount);
router.get('/account/active',auth,getActiveAccount);
router.get('/account/all',auth,getAllAccounts);

module.exports= router;