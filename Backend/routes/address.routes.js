const express = require("express")
const { isAuth } = require("../middlewares/auth.middleware")
const {
	addAddress,
	listAddresses,
	getAddress,
	updateAddress,
	deleteAddress,
	setDefaultAddress,
	getDefaultAddress,
} = require("../controllers/address.controller")

const router = express.Router()

router.use(isAuth)
router.get("/default", getDefaultAddress)
// Legacy endpoints are declared before /:id so their names are not parsed as IDs.
router.post("/new", addAddress)
router.delete("/delete/:id", deleteAddress)
router.get("/my-address", listAddresses)
router.patch("/:id/default", setDefaultAddress)
router.get("/:id", getAddress)
router.put("/:id", updateAddress)
router.delete("/:id", deleteAddress)
router.get("/", listAddresses)
router.post("/", addAddress)


module.exports = router