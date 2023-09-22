package com.shopit.now.service.account;

import com.shopit.now.customexception.custom.*;
import com.shopit.now.dtos.TrendView;
import com.shopit.now.dtos.UserView;
import com.shopit.now.dtos.WishlistView;
import com.shopit.now.entity.*;
import com.shopit.now.jwtgenerator.JwtUtil;
import com.shopit.now.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserServicesImpl implements UserServices {

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private OrdersRepository ordersRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private WishListRepository wishListRepository;

    @Override
    public int handleUserCount() {
        return userRepository.userCount();
    }

    @Override
    public List<UserView> allUsers() {
        List<User> all = userRepository.getAllUsers();
        List<UserView> view = new ArrayList<>();
        for (User user : all) {
            String fullname = userRepository.getusername(user.getId());
            view.add(new UserView(user.getId(), fullname, user.getEmail(), user.getUserProfileImage()));
        }
        return view;
    }

    @Override
    public ResponseEntity<String> registerTheUser(String fullname, String email, String password, String mobile)
            throws UserAlreadyExists {

        Register register = new Register();
        register.setEmail(email);
        register.setFullname(fullname);
        register.setMobile(mobile);
        register.setPassword(password);

        int userExists = userRepository.findUserByMail(register.getEmail().toLowerCase());
        if (userExists != 0)
            throw new UserAlreadyExists("User Already Exists");

        String encodedPassword = bCryptPasswordEncoder.encode(register.getPassword());

        User user = new User();
        user.setEmail(register.getEmail().toLowerCase());
        user.setPassword(encodedPassword);
        user.setMobile(register.getMobile());
        user.setFullname(register.getFullname().toLowerCase());
        user.setUserRoles(roleGenerator());

        try {
            userRepository.save(user);
            return new ResponseEntity<>("User Successfully Registered", HttpStatus.OK);
        } catch (Exception exception) {
            return new ResponseEntity<>("Unexpected Error Occurred", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public String userLogin(String email, String password) throws InvalidCredentials {

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        } catch (Exception e) {
            throw new InvalidCredentials("Username or Password wrong");
        }
        return jwtUtil.generateToken(email);
    }

    @Override
    public List<Address> userAddresses(int id) {
        User user = userRepository.findById(id).orElse(null);
        return user.getAddress();
    }

    @Override
    public ResponseEntity<Address> addUserAddress(int id, AddressDetails address) throws UserNotFound {

        User user = userRepository.findById(id).orElse(null);
        if (user == null)
            throw new UserNotFound("User not found");

        Address toAdd = new Address();
        toAdd.setDefaultAddress(false);
        toAdd.setAddressDetails(address);

        user.getAddress().add(toAdd);
        try {
            User userResponse = userRepository.save(user);
            Address response = userResponse.getAddress().get(userResponse.getAddress().size() - 1);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception exception) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> changePassword(int id, String currentPassword, String newPassword)
            throws InvalidCredentials, UserNotFound {

        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty())
            throw new UserNotFound("User not found");
        else if (!bCryptPasswordEncoder.matches(currentPassword, user.get().getPassword()))
            throw new InvalidCredentials("User password wrong");

        try {
            String password = bCryptPasswordEncoder.encode(newPassword);
            user.get().setPassword(password);
            userRepository.save(user.get());
            String jwt = userLogin(user.get().getEmail(), newPassword);
            return new ResponseEntity<>(jwt, HttpStatus.OK);
        } catch (Exception exception) {
            return new ResponseEntity<>("Unexpected error occured", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> deleteAccount(int id, String password) throws UserNotFound, InvalidCredentials {

        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty())
            throw new UserNotFound("User not found");

        if (!bCryptPasswordEncoder.matches(password, user.get().getPassword()))
            throw new InvalidCredentials("User password wrong");
        try {
            userRepository.deleteById(id);
            return new ResponseEntity<>("Account deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Unexpected error occured", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> updateAddress(int userId, int addressId, AddressDetails address) throws UserNotFound, AddressNotFound {

        User user = userRepository.findById(userId).orElse(null);
        if (user == null)
            throw new UserNotFound("User not found");

        List<Address> found = user.getAddress();
        if (found.size() == 0)
            throw new AddressNotFound("Address not found");

        boolean isUpdated = false;
        for (Address add : found) {
            if (add.getId() == addressId) {
                add.setAddressDetails(address);
                isUpdated = true;
                break;
            }
        }

        if (!isUpdated)
            throw new AddressNotFound("Address not found");

        try {
            user.setAddress(found);
            userRepository.save(user);
            return new ResponseEntity<>("Address update successfull", HttpStatus.OK);
        } catch (Exception exception) {
            return new ResponseEntity<>("Unexpected error occured", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> updateDefaultAddress(int userId, int aId) throws UserNotFound {

        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user == null)
                throw new UserNotFound("User Not Found");
            List<Address> addresses = user.getAddress();
            for (Address address : addresses) {
                if (address.getId() == aId)
                    address.setDefaultAddress(true);
                else
                    address.setDefaultAddress(false);
            }
            user.setAddress(addresses);
            userRepository.save(user);
            return new ResponseEntity<>("Changed default address", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Unknown Error occured", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> deleteAddress(int userId, int aId) throws UserNotFound {

        User user = userRepository.findById(userId).orElse(null);
        if (user == null)
            throw new UserNotFound("User Not Found");
        List<Address> addresses = user.getAddress();
        Iterator itr = addresses.iterator();
        while (itr.hasNext()) {
            Address address = (Address) itr.next();
            if (address.getId() == aId)
                itr.remove();
        }
        user.setAddress(addresses);
        try {
            userRepository.save(user);
            return new ResponseEntity<>("Address removed successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Unknown Error occured", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> addProfileImage(int id, MultipartFile file) throws UserNotFound, IOException {
        User user = userRepository.findById(id).orElse(null);
        if (user == null)
            throw new UserNotFound("User not found");
        UserProfileImage present = user.getUserProfileImage();
        if (present == null) {
            UserProfileImage userProfileImage = new UserProfileImage(file.getOriginalFilename(), file.getContentType(),
                    file.getBytes());
            user.setUserProfileImage(userProfileImage);
            userProfileImage.setUser(user);
        } else {
            present.setName(file.getOriginalFilename());
            present.setType(file.getContentType());
            present.setPicByte(file.getBytes());
            user.setUserProfileImage(present);
        }
        try {
            userRepository.save(user);
            return new ResponseEntity<>("Profile pic added", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Unknown Error occured", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public UserProfileImage getProfileImage(int id) throws UserNotFound {
        User user = userRepository.findById(id).orElse(null);
        if (user == null)
            throw new UserNotFound("User not found");

        return user.getUserProfileImage();
    }

    @Override
    public List<CartDetails> cart(int userId) throws UserNotFound, ProductNotFound, GlobalServerException {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null)
            throw new UserNotFound("User Not Found");
        List<CartDetails> cartDetails = user.getCart();
        List<CartDetails> newCart = new ArrayList<>();
        for (CartDetails c : cartDetails) {
            Products products = productRepository.findById(c.getProductId()).orElse(null);
            if (products == null)
                throw new ProductNotFound("Not Found");
            int instock = products.getInStock();
            int cartStock = c.getItemCount();
            if (instock - cartStock < 0)
                c.setAvailable(false);
            else
                c.setAvailable(true);
            newCart.add(c);
        }
        user.getCart().clear();
        user.getCart().addAll(newCart);
        try {
            userRepository.save(user);
        } catch (Exception e) {
            throw new GlobalServerException("Server error");
        }
        return newCart;
    }

    @Override
    public List<SaveForLater> saveForLater(int userId) throws UserNotFound {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null)
            throw new UserNotFound("User Not Found");
        return user.getSaveForLater();
    }

    @Override
    public ResponseEntity<String> addToCart(int userId, CartDetails cartDetails) throws UserNotFound {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null)
            throw new UserNotFound("User Not Found");

        List<CartDetails> oldCart = user.getCart();
        boolean found = oldCart.stream().anyMatch(i -> i.getProductId() == cartDetails.getProductId());
        int totalItems = 1;
        if (found) {
            for (int index = 0; index < oldCart.size(); index++) {
                if (oldCart.get(index).getProductId() == cartDetails.getProductId()) {
                    totalItems = oldCart.get(index).getItemCount() + cartDetails.getItemCount();
                    oldCart.get(index).setItemCount(totalItems);
                    double price = cartDetails.getTotalPrice() + oldCart.get(index).getTotalPrice();
                    oldCart.get(index).setTotalPrice(price);
                }
            }
        } else {
            oldCart.add(cartDetails);
        }

        Products products = productRepository.findById(cartDetails.getProductId()).orElse(null);
        if (products == null || products.getInStock() < totalItems)
            return new ResponseEntity<>("OUT_OF_STOCK", HttpStatus.NOT_ACCEPTABLE);

        try {
            user.setCart(oldCart);
            userRepository.save(user);
            if (products.getInStock() < (totalItems + 1))
                return new ResponseEntity<>("OUT_OF_STOCK", HttpStatus.NO_CONTENT);

            return new ResponseEntity<>("Successfully added", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Unknown Error occured", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Boolean> incrementCart(int userId, int productId, int itemCount) throws UserNotFound {

        Products products = productRepository.findById(productId).orElse(null);
        if (products == null) {
            return new ResponseEntity<Boolean>(false, HttpStatus.NOT_FOUND);
        }
        int stock = products.getInStock();
        int available = stock - itemCount;
        boolean availableUpdate = true;
        if (available <= 0)
            availableUpdate = false;
        else
            availableUpdate = true;
        return cartManipulation(userId, productId, 1, availableUpdate);
    }

    @Override
    public ResponseEntity<Boolean> decrementCart(int userId, int productId, int itemCount) throws UserNotFound {
        Products products = productRepository.findById(productId).orElse(null);
        if (products == null) {
            return new ResponseEntity<Boolean>(false, HttpStatus.NOT_FOUND);
        }
        int stock = products.getInStock();
        int available = (itemCount - 1);
        boolean availableUpdate = true;
        if (available <= stock)
            availableUpdate = true;
        else
            availableUpdate = false;
        return cartManipulation(userId, productId, -1, availableUpdate);
    }

    private ResponseEntity<Boolean> cartManipulation(int userId, int productId, int num, boolean availableUpdate)
            throws UserNotFound {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null)
            throw new UserNotFound("User Not Found");
        List<CartDetails> cart = user.getCart();
        int flag = 1;
        cart.stream().forEach(i -> {
            if (i.getProductId() == productId) {
                i.setAvailable(availableUpdate);
                if (i.getItemCount() != 0) {
                    double price = i.getTotalPrice() / i.getItemCount();
                    int newItemCount = i.getItemCount() + num;
                    i.setItemCount(newItemCount);
                    i.setTotalPrice((price * newItemCount));
                } else {
                    i.setItemCount(0);
                }
            }
        });
        List<CartDetails> newCart = cart.stream().filter(i -> i.getItemCount() != 0).collect(Collectors.toList());
        user.getCart().clear();
        user.getCart().addAll(newCart);
        try {
            userRepository.save(user);
            return new ResponseEntity<Boolean>(availableUpdate, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<Boolean>(false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> removeFromCart(int userId, int productId) throws UserNotFound {

        User user = userRepository.findById(userId).orElse(null);
        if (user == null)
            throw new UserNotFound("User Not Found");
        List<CartDetails> newCart = user.getCart().stream().filter(i -> i.getProductId() != productId)
                .collect(Collectors.toList());
        user.getCart().clear();
        user.getCart().addAll(newCart);
        try {
            userRepository.save(user);
            return new ResponseEntity<>("Successfully added", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Unknown Error occured", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> removeFromSaveLater(int userId, int productId) throws UserNotFound {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null)
            throw new UserNotFound("User Not Found");
        List<SaveForLater> newCart = user.getSaveForLater().stream().filter(i -> i.getProductId() != productId)
                .collect(Collectors.toList());
        user.getSaveForLater().clear();
        user.getSaveForLater().addAll(newCart);
        try {
            userRepository.save(user);
            return new ResponseEntity<>("Successfully added", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Unknown Error occured", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> addToSaveForLater(int userId, SaveForLater saveForLater) throws UserNotFound {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null)
            throw new UserNotFound("User Not Found");
        List<SaveForLater> oldCart = user.getSaveForLater();
        List<CartDetails> oldCartDetails = user.getCart();

        List<CartDetails> newCartDetails = oldCartDetails.stream()
                .filter(i -> i.getProductId() != saveForLater.getProductId()).collect(Collectors.toList());

        oldCartDetails.clear();
        oldCartDetails.addAll(newCartDetails);
        user.setCart(oldCartDetails);

        boolean found = oldCart.stream().anyMatch(i -> i.getProductId() == saveForLater.getProductId());
        if (found) {
            oldCart.stream().forEach(i -> {
                if (i.getProductId() == saveForLater.getProductId()) {
                    i.setItemCount(i.getItemCount() + saveForLater.getItemCount());
                    int price = Integer.parseInt(saveForLater.getTotalPrice()) + Integer.parseInt(i.getTotalPrice());
                    i.setTotalPrice(price + "");
                }
            });

        } else {
            oldCart.add(saveForLater);
        }
        try {
            user.setSaveForLater(oldCart);
            userRepository.save(user);
            return new ResponseEntity<>("Successfully added", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Unknown Error occured", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> addBackToCart(int userId, CartDetails cartDetails) throws UserNotFound {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null)
            throw new UserNotFound("User Not Found");
        List<CartDetails> oldCart = user.getCart();

        List<SaveForLater> oldSaveForLater = user.getSaveForLater();

        List<SaveForLater> newSaveForLater = oldSaveForLater.stream()
                .filter(i -> i.getProductId() != cartDetails.getProductId()).collect(Collectors.toList());

        oldSaveForLater.clear();
        oldSaveForLater.addAll(newSaveForLater);
        user.setSaveForLater(oldSaveForLater);

        boolean found = oldCart.stream().anyMatch(i -> i.getProductId() == cartDetails.getProductId());
        if (found) {
            oldCart.stream().forEach(i -> {
                if (i.getProductId() == cartDetails.getProductId()) {
                    i.setItemCount(i.getItemCount() + cartDetails.getItemCount());
                    double price = cartDetails.getTotalPrice() + i.getTotalPrice();
                    i.setTotalPrice(price);
                }
            });

        } else {
            oldCart.add(cartDetails);
        }
        try {
            user.setCart(oldCart);
            userRepository.save(user);
            return new ResponseEntity<>("Successfully added", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Unknown Error occured", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public List<Orders> orders(int userId) throws UserNotFound {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null)
            throw new UserNotFound("User Not Found");
        List<Orders> orders = ordersRepository.getALlOrders(userId);
        List<Orders> group_1 = orders.stream().filter(item -> !item.getOrderStatus().isCancelled())
                .collect(Collectors.toList());
        List<Orders> group_2 = orders.stream().filter(item -> item.getOrderStatus().isCancelled())
                .collect(Collectors.toList());

        List<Orders> combinedGroup = new ArrayList<>(group_1);
        combinedGroup.addAll(group_2);
        return combinedGroup;
    }

    @Override
    public ResponseEntity<String> addOrder(int userId, List<Orders> orders) throws UserNotFound, ParseException {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null)
            throw new UserNotFound("User Not Found");
        for (Orders o : orders) {
            Instant orderDate = Instant.now();
            Instant deliveryDate = orderDate.plus(4, ChronoUnit.DAYS);

            o.setOrderDate(orderDate.toString());
            o.setDeliveryDate(deliveryDate.toString());

            OrderStatus orderStatus = new OrderStatus(false, false, false, false);
            o.setOrderStatus(orderStatus);
            Products product = productRepository.findById(o.getItemDetails().getProductId()).orElse(null);
            int stock = product.getInStock();
            int newStock = stock - o.getItemDetails().getItemCount();
            if (newStock < 0)
                return new ResponseEntity<>("Unknown Error occured", HttpStatus.BAD_REQUEST);
            product.setInStock(newStock);
            try {
                productRepository.save(product);
            } catch (Exception e) {
                return new ResponseEntity<>("Unknown Error occured", HttpStatus.INTERNAL_SERVER_ERROR);
            }
            Thumbnail thumbnail = product.getThumbnail();
            OrderImage orderImage = new OrderImage(thumbnail.getName(), thumbnail.getType(), thumbnail.getPicByte());
            o.setOrderImage(orderImage);
            o.setUser(user);
        }
        user.getOrders().addAll(orders);
        try {
            userRepository.save(user);
            return new ResponseEntity<>("Successfully added", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Unknown Error occured", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> clearCart(int userId) throws UserNotFound {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null)
            throw new UserNotFound("User Not Found");
        user.getCart().clear();
        try {
            userRepository.save(user);
            return new ResponseEntity<>("Successfully cleared", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Unknown Error occured", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> cancelOrder(int userId, int orderId) throws UserNotFound {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null)
            throw new UserNotFound("User Not Found");
        List<Orders> orders = user.getOrders();
        for (Orders o : orders) {
            if (o.getId() == orderId) {
                OrderStatus orderStatus = o.getOrderStatus();
                orderStatus.setCancelled(true);
                o.setOrderStatus(orderStatus);
            }
        }
        user.setOrders(orders);
        try {
            userRepository.save(user);
            return new ResponseEntity<>("Successfully cancelled", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Unknown Error occured", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public int noOfOrders() {
        return ordersRepository.noOfOrders();
    }

    @Override
    public List<TrendView> trendingProducts() {
        List<Products> products = productRepository.getTrendingProducts();
        ArrayList<TrendView> list = new ArrayList();
        for (Products p : products) {
            TrendView trending = new TrendView(p.getTitle(), p.getInStock());
            list.add(trending);
        }
        return list;
    }

    @Override
    public String getRevenue() {
        List<Orders> orders = ordersRepository.findAll();
        double sum = 0;
        for (Orders o : orders) {
            if (o.getOrderStatus().isCancelled() == false)
                sum += Integer.parseInt(o.getItemDetails().getTotalPrice());
        }
        return Double.toString(sum);
    }

    @Override
    public List<Orders> getOrdersForAdmin() {
        return ordersRepository.getAdminOrders();
    }

    @Override
    public ResponseEntity<String> approveOrder(int id) {
        try {
            Orders orders = ordersRepository.findById(id).orElse(null);
            if (orders.getOrderStatus().isCancelled() == true || orders.getOrderStatus().isDispatched() == true) {
                return new ResponseEntity<>("Item cancelled or approved already", HttpStatus.BAD_REQUEST);
            }
            orders.getOrderStatus().setDispatched(true);
            ordersRepository.save(orders);
            return new ResponseEntity<>("Approved Success", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Approve Failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> shipOrder(int id) {
        try {
            Orders orders = ordersRepository.findById(id).orElse(null);
            if (orders.getOrderStatus().isCancelled() == true || orders.getOrderStatus().isShipped() == true) {
                return new ResponseEntity<>("Item cancelled or dispatched already", HttpStatus.BAD_REQUEST);
            }
            orders.getOrderStatus().setShipped(true);
            ordersRepository.save(orders);
            return new ResponseEntity<>("Shipped Success", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Shipping Failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public List<Notification> getNotification() {
        return notificationRepository.getAllNotification();
    }

    @Override
    public ResponseEntity<String> seenNotification() {
        List<Notification> notifications = notificationRepository.findAll();
        for (Notification n : notifications) {
            if (n.isSeen() == false)
                n.setSeen(true);
        }
        try {
            notificationRepository.saveAll(notifications);
            return new ResponseEntity<>("Successfully Seen", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Unknown Error occured", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public List<WishlistView> getWishlist(int userId) throws UserNotFound {

        User user = userRepository.findById(userId).orElse(null);
        if (user == null)
            throw new UserNotFound("User Not found");
        List<Wishlist> wishlist = user.getWishlist();
        List<WishlistView> view = new ArrayList<>();
        for (Wishlist w : wishlist) {
            Products product = productRepository.findById(w.getProductId()).orElse(null);
            if (product != null) {
                boolean available = product.getInStock() > 0 ? true : false;
                WishlistView wishlistView = new WishlistView(w.getId(), product.getId(), product.getTitle(),
                        product.getPrice(), product.getThumbnail(), available);
                view.add(wishlistView);
            }
        }
        return view;
    }

    @Override
    @Transactional
    public boolean handleWishlist(int userId, int productId, String opr) throws UserNotFound, GlobalServerException {
        try {
            Wishlist wishlist = wishListRepository.findByProductIdAndUser_Id(productId, userId);
            if (opr.equals("ADD") && wishlist == null) {
                User user = userRepository.findById(userId).orElse(null);
                if (user != null)
                    wishListRepository.save(new Wishlist(productId, user));
            } else if (opr.equals("REMOVE")) {
                wishListRepository.deleteByProductIdAndUser_Id(productId, userId);
            }
            return true;
        } catch (Exception e) {
            throw new GlobalServerException("Server error occured");
        }
    }

    @Override
    @Transactional
    public ResponseEntity<String> handleWishlistRemove(int userId, int wishlistId) throws UserNotFound {
        try {
            wishListRepository.deleteByIdAndUser_Id(wishlistId, userId);
            return new ResponseEntity<>("Wishlist removed", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Server Error occured", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public boolean checkWishList(int userId, int productId) throws UserNotFound, GlobalServerException {
        try {
            Wishlist wishlist = wishListRepository.findByProductIdAndUser_Id(productId, userId);
            if (wishlist == null)
                return false;
            return true;
        } catch (Exception e) {
            throw new GlobalServerException("Server error");
        }
    }

    @Override
    @Transactional
    public ResponseEntity<String> wishlistToCart(int userId, int productId, int wishlistId)
            throws UserNotFound, GlobalServerException {
        boolean check = checkWishList(userId, productId);
        if (check == false)
            return new ResponseEntity<>("Wishlist already removed", HttpStatus.BAD_REQUEST);
        Products products = productRepository.findById(productId).orElse(null);
        if (products == null)
            return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
        CartDetails cartDetails = new CartDetails(productId, products.getTitle(), products.getPrice(), 1, true);
        ResponseEntity<?> response = addToCart(userId, cartDetails);
        if (response.getStatusCode() == HttpStatus.OK) {
            try {
                wishListRepository.deleteByIdAndUser_Id(wishlistId, userId);
            } catch (Exception e) {
                return new ResponseEntity<>("Server Error occured", HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return new ResponseEntity<String>("Successfully moved to cart", HttpStatus.OK);
        }
        return new ResponseEntity<String>("Server error occured", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public boolean checkStock(int id, int cartStock) throws ProductNotFound {
        Products products = productRepository.findById(id).orElse(null);
        if (products == null)
            throw new ProductNotFound("Product not found");
        int stock = products.getInStock() - cartStock;
        if (stock < 0)
            return false;
        return true;
    }

    public ResponseEntity<String> checkValidJWt() {
        return new ResponseEntity<String>("Verified", HttpStatus.OK);
    }

    private String roleGenerator() {
        StringJoiner roles = new StringJoiner(",");
        roles.add("USER");
        return roles.toString();
    }

}
