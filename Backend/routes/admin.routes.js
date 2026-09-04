const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin.controller');
const { isAdmin, isAuth } = require('../middlewares/auth.middleware');

router.get('/overview', isAuth, isAdmin, controller.getOverview);
router.get('/users', isAuth, isAdmin, controller.getUsers);
router.patch('/users/:userId/status', isAuth, isAdmin, controller.updateUserStatus);
router.get('/orders', isAuth, isAdmin, controller.getOrders);
router.get('/complaints', isAuth, isAdmin, controller.getComplaints);
router.patch('/complaints/:complaintId', isAuth, isAdmin, controller.updateComplaint);
router.get('/activity-logs', isAuth, isAdmin, controller.getActivityLogs);
router.get('/pending-shops', isAuth, isAdmin, controller.getPendingShops);
router.get('/verified-shops', isAuth, isAdmin, controller.getVerifiedShops);
router.get('/shops/:shopId', isAuth, isAdmin, controller.getShopDetails);
router.post('/verify-shop/:shopId', isAuth, isAdmin, controller.verifyShop);
router.post('/reject-shop/:shopId', isAuth, isAdmin, controller.rejectShop);
router.patch('/shops/:shopId/suspension', isAuth, isAdmin, controller.suspendShop);
router.post('/unverify-shop/:shopId', isAuth, isAdmin, controller.unverifyShop);
router.get('/pending-riders', isAuth, isAdmin, controller.getPendingRiders);
router.get('/verified-riders', isAuth, isAdmin, controller.getVerifiedRiders);
router.get('/riders/:riderId', isAuth, isAdmin, controller.getRiderDetails);
router.post('/verify-rider/:riderId', isAuth, isAdmin, controller.verifyRider);
router.post('/reject-rider/:riderId', isAuth, isAdmin, controller.rejectRider);
router.patch('/riders/:riderId/suspension', isAuth, isAdmin, controller.suspendRider);
router.post('/unverify-rider/:riderId', isAuth, isAdmin, controller.unverifyRider);

module.exports = router;