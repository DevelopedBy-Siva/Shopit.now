package com.shopit.now.controller;

import com.shopit.now.customexception.custom.*;
import com.shopit.now.dtos.TrendView;
import com.shopit.now.dtos.UserView;
import com.shopit.now.dtos.WishlistView;
import com.shopit.now.entity.*;
import com.shopit.now.service.account.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;

@RestController
@CrossOrigin("*")
public class UserAccountController {

    @Autowired
    private UserServices accountServices;

    @PostMapping("/auth/register")
    ResponseEntity<String> userRegistration(@RequestHeader("user-email") String email,
                                            @RequestHeader("user-fullname") String fullname, @RequestHeader("user-mobile") String mobile,
                                            @RequestHeader("user-password") String password) throws UserAlreadyExists {
        return accountServices.registerTheUser(fullname, email, password, mobile);
    }

    @PostMapping("/auth/login")
    public String authenticateUser(@RequestHeader("user-email") String email,
                                   @RequestHeader("user-password") String password) throws Exception {
        return accountServices.userLogin(email, password);
    }

    @GetMapping("/admin/all-users")
    public List<UserView> allusers() {
        return accountServices.allUsers();
    }

    @GetMapping("/admin/user-count")
    public int userCount() {
        return accountServices.handleUserCount();
    }

    @PutMapping("/user/address/{id}")
    ResponseEntity<Address> handleAddress(@PathVariable int id, @RequestBody AddressDetails address) throws UserNotFound {
        return accountServices.addUserAddress(id, address);
    }

    @GetMapping("/user/address/{id}")
    List<Address> handlegetAddress(@PathVariable int id) {
        return accountServices.userAddresses(id);
    }

    @PutMapping("/user/update-password/{id}")
    ResponseEntity<String> handlePasswordUpdation(@PathVariable int id,
                                                  @RequestHeader("current-password") String password, @RequestHeader("new-password") String newPassword)
            throws InvalidCredentials, UserNotFound {
        return accountServices.changePassword(id, password, newPassword);
    }

    @PostMapping("/user/delete-user/{id}")
    ResponseEntity<String> handleAccountDeletion(@PathVariable int id, @RequestHeader("user-password") String password)
            throws UserNotFound, InvalidCredentials {
        return accountServices.deleteAccount(id, password);
    }

    @PutMapping("/user/update-address/{userId}/{addressId}")
    ResponseEntity<String> updateAddress(@PathVariable int userId, @PathVariable int addressId, @RequestBody AddressDetails address)
            throws UserNotFound, AddressNotFound {
        return accountServices.updateAddress(userId, addressId, address);
    }

    @PutMapping("/user/update-default-address/{uid}/{aid}")
    ResponseEntity<String> handleDefaultAddress(@PathVariable(value = "uid") int uid,
                                                @PathVariable(value = "aid") int aid) throws UserNotFound {
        return accountServices.updateDefaultAddress(uid, aid);
    }

    @DeleteMapping("/user/delete-address/{uid}/{aid}")
    ResponseEntity<String> handleDeleteAddress(@PathVariable(value = "uid") int uid,
                                               @PathVariable(value = "aid") int aid) throws UserNotFound {
        return accountServices.deleteAddress(uid, aid);
    }

    @GetMapping("/user/orders/{id}")
    List<Orders> getProducts(@PathVariable int id) throws UserNotFound {
        return accountServices.orders(id);
    }

    @GetMapping("/user/cart/{id}")
    List<CartDetails> getCart(@PathVariable int id) throws UserNotFound, ProductNotFound, GlobalServerException {
        return accountServices.cart(id);
    }

    @PostMapping("/user/cart/add/{id}")
    ResponseEntity<String> addToCart(@PathVariable int id, @RequestBody CartDetails cartDetails) throws UserNotFound {
        return accountServices.addToCart(id, cartDetails);
    }

    @PostMapping("/user/cart/increment/{id}/{productId}/{itemCount}")
    ResponseEntity<Boolean> incrementCart(@PathVariable int id, @PathVariable int productId,
                                          @PathVariable int itemCount) throws UserNotFound {
        return accountServices.incrementCart(id, productId, itemCount);
    }

    @PostMapping("/user/cart/decrement/{id}/{productId}/{itemCount}")
    ResponseEntity<Boolean> decrementCart(@PathVariable int id, @PathVariable int productId,
                                          @PathVariable int itemCount) throws UserNotFound {
        return accountServices.decrementCart(id, productId, itemCount);
    }

    @DeleteMapping("/user/cart/remove/{id}/{productId}")
    ResponseEntity<String> removeFromCart(@PathVariable int id, @PathVariable int productId) throws UserNotFound {
        return accountServices.removeFromCart(id, productId);
    }

    @GetMapping("/user/save-later/{id}")
    List<SaveForLater> getSaveForLater(@PathVariable int id) throws UserNotFound {
        return accountServices.saveForLater(id);
    }

    @DeleteMapping("/user/save-later/remove/{id}/{productId}")
    ResponseEntity<String> removeFromSaveLater(@PathVariable int id, @PathVariable int productId) throws UserNotFound {
        return accountServices.removeFromSaveLater(id, productId);
    }

    @PostMapping("/user/save-later/add/{id}")
    ResponseEntity<String> addToSaveLater(@PathVariable int id, @RequestBody SaveForLater saveForLater)
            throws UserNotFound {
        return accountServices.addToSaveForLater(id, saveForLater);
    }

    @PostMapping("/user/cart/back-to-cart/{id}")
    ResponseEntity<String> addBackToCart(@PathVariable int id, @RequestBody CartDetails cartDetails)
            throws UserNotFound {
        return accountServices.addBackToCart(id, cartDetails);
    }

    @PostMapping("/user/orders/{id}")
    ResponseEntity<String> addOrder(@PathVariable int id, @RequestBody List<Orders> orders)
            throws UserNotFound, ParseException {
        return accountServices.addOrder(id, orders);
    }

    @DeleteMapping("/user/cart/clear/{id}")
    ResponseEntity<String> clearCart(@PathVariable int id) throws UserNotFound {
        return accountServices.clearCart(id);
    }

    @PutMapping("/user/orders/cancel/{id}/{orderId}")
    ResponseEntity<String> cancelOrder(@PathVariable int id, @PathVariable int orderId) throws UserNotFound {
        return accountServices.cancelOrder(id, orderId);
    }

    @GetMapping("/user/orders/no-of")
    int getNoOfOrders() {
        return accountServices.noOfOrders();
    }

    @GetMapping("/user/trending")
    List<TrendView> getAllTrendingProducts() {
        return accountServices.trendingProducts();
    }

    @GetMapping("/user/orders/for-admin")
    List<Orders> getAllOrderForAdmin() {
        return accountServices.getOrdersForAdmin();
    }

    @GetMapping("/user/orders/revenue")
    String getRevenue() {
        return accountServices.getRevenue();
    }

    @PutMapping("/user/orders/approve/{id}")
    ResponseEntity<String> aproveOrder(@PathVariable int id) {
        return accountServices.approveOrder(id);
    }

    @PutMapping("/user/orders/ship/{id}")
    ResponseEntity<String> shipOrder(@PathVariable int id) {
        return accountServices.shipOrder(id);
    }

    @GetMapping("/user/wishlist/{userId}")
    List<WishlistView> getWishList(@PathVariable int userId) throws UserNotFound {
        return accountServices.getWishlist(userId);
    }

    @GetMapping("/user/wishlist/check/{userId}/{productId}")
    boolean checkWishListedOrNot(@PathVariable int userId, @PathVariable int productId)
            throws UserNotFound, GlobalServerException {
        return accountServices.checkWishList(userId, productId);
    }

    @PostMapping("/user/wishlist/{userId}/{productId}")
    boolean handleWishList(@PathVariable int userId, @PathVariable int productId, @RequestParam(required = true) String opr)
            throws UserNotFound, GlobalServerException {
        return accountServices.handleWishlist(userId, productId, opr);
    }

    @DeleteMapping("/user/wishlist/{userId}/{wishlistId}")
    ResponseEntity<String> deleteFromWishlist(@PathVariable int userId, @PathVariable int wishlistId)
            throws UserNotFound {
        return accountServices.handleWishlistRemove(userId, wishlistId);
    }

    @PostMapping("/user/wishlist/to-cart/{userId}/{productId}/{wishlistId}")
    ResponseEntity<String> handleWishListToCart(@PathVariable int userId, @PathVariable int productId,
                                                @PathVariable int wishlistId) throws UserNotFound, GlobalServerException {
        return accountServices.wishlistToCart(userId, productId, wishlistId);
    }

    @GetMapping("/user/cart/check-stock/{productId}/{stock}")
    boolean checkStock(@PathVariable int productId, @PathVariable int stock) throws ProductNotFound {
        return accountServices.checkStock(productId, stock);
    }

    @PostMapping("/user/verify")
    ResponseEntity<String> verifyTheJwt() {
        return accountServices.checkValidJWt();
    }

}