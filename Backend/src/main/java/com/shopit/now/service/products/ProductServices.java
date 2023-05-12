package com.shopit.now.service.products;

import com.shopit.now.customexception.custom.GlobalServerException;
import com.shopit.now.customexception.custom.InvalidRequest;
import com.shopit.now.customexception.custom.ProductNotFound;
import com.shopit.now.dtos.AdProductView;
import com.shopit.now.dtos.AllProductDisplay;
import com.shopit.now.dtos.SearchPage;
import com.shopit.now.dtos.View;
import com.shopit.now.entity.Advertisement;
import com.shopit.now.entity.Products;
import com.shopit.now.entity.UsersReview;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ProductServices {

    ResponseEntity<?> addProducts(Products products);

    ResponseEntity<?> submitProductReview(int productId, UsersReview usersReview) throws ProductNotFound;

    ResponseEntity<?> addThumbnail(int productId, MultipartFile file) throws ProductNotFound, IOException;

    ResponseEntity<?> addProductImages(int productId, MultipartFile[] files) throws ProductNotFound, IOException;

    double overallRatingCalc(Products products, int newRating);

    List<View> handleNewDeals();

    Products getProductById(int id) throws ProductNotFound, InvalidRequest;

    AllProductDisplay getProductView(int page, int size);

    ResponseEntity<?> handleProductDetailsUpdate(int id, String title, String price);

    ResponseEntity<?> handleProductStockUpdate(int id, int stock);

    ResponseEntity<?> handleProductTrending(int id, boolean trend);

    int handleGetAllproducts();

    ResponseEntity<?> addAdvertisement(int productId, MultipartFile multipartFile) throws IOException;

    List<AdProductView> searchProduct(String name);

    List<Advertisement> getAdvertisement();

    ResponseEntity<String> deleteAdvertisement(int id);

    long handleAdCount();

    SearchPage productSearch(String query, int limit, int page, double price, double rating, boolean outOfStock, boolean topDeals) throws GlobalServerException;

    AllProductDisplay handleProductSearch(int page, int size, String query);

    List<Advertisement> displayAd();

    public Advertisement displaySpecificAd();

    public List<View> getCategoryBasedProducts(int id);

    public List<View> getBestSellers();

}
