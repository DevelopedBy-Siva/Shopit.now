package com.shopit.now.service.account;

import com.shopit.now.customexception.custom.*;
import com.shopit.now.dtos.TrendView;
import com.shopit.now.dtos.UserView;
import com.shopit.now.dtos.WishlistView;
import com.shopit.now.entity.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;

public interface UserServices {

    ResponseEntity<String> registerTheUser(String fullname, String email, String password, String mobile)
            throws UserAlreadyExists;

    ResponseEntity<String> addUserAddress(int id, Address address) throws UserNotFound;

    ResponseEntity<String> changePassword(int id, String currentPassword, String newPassword)
            throws InvalidCredentials, UserNotFound;

    ResponseEntity<String> deleteAccount(int id, String password) throws UserNotFound, InvalidCredentials;

    ResponseEntity<String> updateAddress(int userId, Address address) throws UserNotFound, AddressNotFound;

    ResponseEntity<String> updateDefaultAddress(int userId, int aId) throws UserNotFound;

    String userLogin(String email, String password) throws InvalidCredentials;

    ResponseEntity<String> deleteAddress(int userId, int aId) throws UserNotFound;

    ResponseEntity<String> addProfileImage(int id, MultipartFile multipartFile) throws UserNotFound, IOException;

    UserProfileImage getProfileImage(int id) throws UserNotFound;

    List<Address> userAddresses(int id);

    List<UserView> allUsers();

    int handleUserCount();

    List<Orders> orders(int userId) throws UserNotFound;

    List<CartDetails> cart(int userId) throws UserNotFound, ProductNotFound, GlobalServerException;

    List<SaveForLater> saveForLater(int userId) throws UserNotFound;

    ResponseEntity<String> addToCart(int userId, CartDetails cartDetails) throws UserNotFound;

    ResponseEntity<Boolean> incrementCart(int userId, int productId, int itemCount) throws UserNotFound;

    ResponseEntity<Boolean> decrementCart(int userId, int productId, int itemCount) throws UserNotFound;

    ResponseEntity<String> removeFromCart(int userId, int productId) throws UserNotFound;

    ResponseEntity<String> removeFromSaveLater(int userId, int productId) throws UserNotFound;

    ResponseEntity<String> addToSaveForLater(int userId, SaveForLater saveForLater) throws UserNotFound;

    ResponseEntity<String> addBackToCart(int userId, CartDetails cartDetails) throws UserNotFound;

    ResponseEntity<String> addOrder(int userId, List<Orders> orders) throws UserNotFound, ParseException;

    ResponseEntity<String> clearCart(int userId) throws UserNotFound;

    ResponseEntity<String> cancelOrder(int userId, int orderId) throws UserNotFound;

    List<WishlistView> getWishlist(int userId) throws UserNotFound;

    boolean handleWishlist(int userId, int productId) throws UserNotFound, GlobalServerException;

    ResponseEntity<String> handleWishlistRemove(int userId, int productId) throws UserNotFound;

    boolean checkWishList(int userId, int productId) throws UserNotFound, GlobalServerException;

    ResponseEntity<String> wishlistToCart(int userId, int productId, int wishlistId)
            throws UserNotFound, GlobalServerException;

    int noOfOrders();

    List<TrendView> trendingProducts();

    String getRevenue();

    List<Orders> getOrdersForAdmin();

    ResponseEntity<String> approveOrder(int id);

    ResponseEntity<String> shipOrder(int id);

    List<Notification> getNotification();

    ResponseEntity<String> seenNotification();

    boolean checkStock(int id, int cartStock) throws ProductNotFound;

    ResponseEntity<String> checkValidJWt();

}
