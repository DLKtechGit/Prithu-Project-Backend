const express = require('express');
const router = express.Router();
const multer = require('multer');
const app = express();
const path = require('path');
const { auth } = require('../middlewares/jwtAuthentication');


// Controllers
const {
  createNewUser,
  userLogin,
  userSendOtp,
  userPasswordReset,
  existUserVerifyOtp, 
  newUserVerifyOtp,
  userlogOut,
} = require('../controllers/authenticationControllers/userAuthController');

const {
  createNewCreator,
  creatorLogin,
  creatorSendOtp,
  existCreatorVerifyOtp,
  newCreatorVerifyOtp,
  creatorPasswordReset,
} = require('../controllers/authenticationControllers/creatorAuthController');

const {
  createNewBusinessUser,
  businessLogin,
  businessSendOtp,
  businessPasswordReset,
  existBusinessVerifyOtp,
  newBusinessVerifyOtp,
} = require('../controllers/authenticationControllers/businessAuthController');

const {
  creatorFeedUpload,
  creatorFeedDelete,
  getCreatorFeeds,
  creatorFeedScheduleUpload,
} = require('../controllers/feedControllers/creatorFeedController');

const {
  feedsWatchByUser,
  mostWatchedFeeds,
  getAllFeeds,
} = require('../controllers/feedControllers/feedsController');

const {
  newAdmin,
  adminLogin,
  adminSendOtp,
  existAdminVerifyOtp,
  newAdminVerifyOtp,
  adminPasswordReset,
} = require('../controllers/authenticationControllers/adminAuthController');

const {
  getUserdetailWithId,
  userSelectCategory,
  userAppLanguage,
  userFeedLanguage,
} = require('../controllers/userControllers/userDetailController');

const {
  getCategoryWithId,
  getAllCategories,
  getContentCategories,
} = require('../controllers/categoriesController');

const {
  userProfileDetailUpdate,
  getProfileDetail,
  childAdminProfileDetailUpdate,
  adminProfileDetailUpdate,
} = require('../controllers/profileControllers/profileController');

const {
  getUserStatus,
  getUsersByDate,
  getAllUserDetails,
} = require('../controllers/adminControllers/adminUserControllers');

const {
  likeFeed,
  saveFeed,
  downloadFeed,
  postComment,
  getUserSavedFeeds,
  getUserDownloadedFeeds,
  shareFeed,
  commentLike,
} = require('../controllers/feedControllers/userActionsFeedController');

const{
  getLeftReferrals,
  getRightReferrals,
}=require('../controllers/userControllers/userRefferalController')


const {
creatorlikeFeed,
creatorsaveFeed,
creatordownloadFeed,
creatorshareFeed,
creatorpostComment,
creatorpostView,
creatorcommentLike,
}=require('../controllers/creatorActionController')

const {
  createPlan,
  updatePlan,
  deletePlan,
  getAllPlans
} = require('../controllers/adminControllers/adminSubcriptionController');

const {
  subscribePlan,
  cancelSubscription,
  getAllSubscriptionPlans,
  getUserSubscriptionPlanWithId
} = require('../controllers/userControllers/userSubcriptionController');

const {
  adminFeedUpload,
} = require('../controllers/adminControllers/adminfeedController');

const {
  getCreatorDetailWithId,
  getAllCreatorDetails,
} = require('../controllers/creatorControllers/creatorDetailController');

const {
  followAccount,
  unfollowAccount,
  getAccountFollowers,
  getCreatorFollowers,
} = require('../controllers/followersControllers.js/followerDetailController');

const {
  adminAddCategory,
  deleteCategory,
} = require('../controllers/adminControllers/adminCatagoryController');

const {
  addAccount,
  switchToCreator,
  switchToBusiness,
  switchToUserAccount,
  checkAccountStatus,
  getAllAccounts
} = require('../controllers/accountController');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
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
const upload = multer({ storage });

// Serve static files from 'uploads' folder
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
}, express.static(path.join(__dirname, 'uploads')));

/* --------------------- User Authentication --------------------- */
router.post('/auth/user/register', createNewUser);
router.post('/auth/user/login', userLogin);
router.post('/auth/user/otp-send', userSendOtp);
router.post('/auth/exist/user/verify-otp', existUserVerifyOtp);
router.post('/auth/new/user/verify-otp', newUserVerifyOtp);
router.post('/auth/user/reset-password', userPasswordReset);
router.post('/auth/user/logout', userlogOut);

/* --------------------- Fresh Users API --------------------- */
router.post('/app/language', auth, userAppLanguage);
router.post('/feed/language', auth, userFeedLanguage);
router.get('/get/category', getAllCategories);
router.post('/user/select/category', userSelectCategory);

/* --------------------- User Feed Actions --------------------- */
router.post('/user/feed/like', likeFeed);
router.post('/user/comment/like',commentLike);
router.post('/user/feed/save', auth, saveFeed);
router.post('/user/feed/download', auth, downloadFeed);
router.post('/user/feed/comment', postComment);
router.post('/user/feed/share', auth, shareFeed);

/* --------------------- User Feed Get Actions --------------------- */
router.get('/user/saved/feeds', auth, getUserSavedFeeds);
router.get('/user/saved/download', auth, getUserDownloadedFeeds);

/* --------------------- User Subscription --------------------- */
router.post('/user/plan/subscription', auth, subscribePlan);
router.post('/user/cancel/subscription', auth, cancelSubscription);
router.get('/user/user/subscriptions', auth, getUserSubscriptionPlanWithId);


/* --------------------- User Subscription --------------------- */
router.get('/user/left/tree/referals',getLeftReferrals);
router.get('/user/right/tree/referals',getRightReferrals);
// router.get('/user/user/subscriptions', auth, getUserSubscriptionPlanWithId);



/* --------------------- User Follower API --------------------- */
router.post('/user/follow/creator', auth, followAccount);
router.post('/user/unfollow/creator', auth, unfollowAccount);
router.get('/user/get/followers', auth, getAccountFollowers);

/* --------------------- User Profile API --------------------- */
router.post('/user/profile/detail/update',upload.single('file'), userProfileDetailUpdate);

/* --------------------- Creator Feed API --------------------- */
router.post("/creator/feed/upload", upload.single('file'), creatorFeedUpload);
router.post("/creator/feed/schedule", auth, upload.single('file'), creatorFeedScheduleUpload);
router.delete('/creator/delete/feeds', auth, creatorFeedDelete);
router.get('/creator/getall/feeds', auth, getCreatorFeeds);
router.get('/creator/get/feed/category', getContentCategories);

/* --------------------- Cretor Feed Actions --------------------- */
router.post('/creator/feed/like', likeFeed);
router.post('/creator/comment/like',commentLike);
router.post('/creator/feed/save', auth, saveFeed);
router.post('/creator/feed/download', auth, downloadFeed);
router.post('/creator/feed/comment', postComment);
router.post('/creator/feed/share', auth, shareFeed);

/* --------------------- Creator Follower API --------------------- */
router.get('/creator/get/followers', getCreatorFollowers);

/* --------------------- Admin Authentication --------------------- */
router.post('/auth/admin/register', newAdmin);
router.post('/auth/admin/login', adminLogin);
router.post('/auth/admin/sent-otp', adminSendOtp);
router.post('/auth/exist/admin/verify-otp', existAdminVerifyOtp);
router.post('/auth/new/admin/verify-otp', newAdminVerifyOtp);
router.post('/auth/admin/reset-password', adminPasswordReset);

/* --------------------- Admin Profile API --------------------- */
router.post('/admin/profile/detail/update',auth, upload.single('file'), adminProfileDetailUpdate);

/* --------------------- Admin Feed API --------------------- */
router.post('/admin/feed', upload.single('file'), adminFeedUpload);

/* --------------------- Admin Category API --------------------- */
router.post('/admin/feed/category', adminAddCategory);
router.delete('/admin/feed/category', deleteCategory);
router.get('/admin/feed/category', getAllCategories);

/* --------------------- Admin Subscription API --------------------- */
router.post('/admin/create/subscription', createPlan);
router.put('/admin/update/subscription/:id', updatePlan);
router.delete('/admin/delete/subscription/:id', deletePlan);
router.get('/admin/getall/subscriptions', getAllPlans);

/* --------------------- Admin User API --------------------- */
router.get('/admin/getall/users', getAllUserDetails);
router.get('/admin/get/user/:id', getUserdetailWithId);
router.get("/admin/users/status", getUserStatus);
router.get("/admin/user/detail/by-date", getUsersByDate);

/* --------------------- Admin User API --------------------- */
router.get('/admin/getall/creators', getAllCreatorDetails);
// router.get('/admin/get/user/:id', getUserdetailWithId);
// router.get("/admin/users/status", getUserStatus);
// router.get("/admin/user/detail/by-date", getUsersByDate);


/* --------------------- Child Follower API --------------------- */
router.post('/child/admin/profile/detail/update',auth, upload.single('file'), childAdminProfileDetailUpdate);


/* --------------------- Feeds API --------------------- */
 router.get('/all/feeds', getAllFeeds);
// router.post('/feeds/watchedbyuser', feedsWatchByUser);

/* --------------------- Tags API --------------------- */
router.get('/all/catagories', getContentCategories);
router.get('/all/catagories/:id', getCategoryWithId);

/* --------------------- Profile Settings --------------------- */
router.get('/get/profile/detail', getProfileDetail);

/* --------------------- Account API --------------------- */
router.post('/account/add', auth, addAccount);
router.post('/account/switch/creator', switchToCreator);
router.post('/account/switch/user', auth, switchToUserAccount);
router.post('/account/status', auth, checkAccountStatus);

module.exports = router;
