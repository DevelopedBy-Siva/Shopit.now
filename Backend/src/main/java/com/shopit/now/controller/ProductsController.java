package com.shopit.now.controller;

import com.shopit.now.customexception.custom.GlobalServerException;
import com.shopit.now.customexception.custom.InvalidRequest;
import com.shopit.now.customexception.custom.ProductNotFound;
import com.shopit.now.dtos.*;
import com.shopit.now.entity.Advertisement;
import com.shopit.now.entity.Products;
import com.shopit.now.entity.UsersReview;
import com.shopit.now.service.products.ProductServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/products")
public class ProductsController {

    @Autowired
    private ProductServices services;

    @GetMapping("/view/all-products")
    public AllProductDisplay displaySorted(@RequestParam int page, @RequestParam int size) {
        return services.getProductView(page, size);
    }

    @GetMapping("/view/search-products/{query}")
    public AllProductDisplay searchProduct(@PathVariable String query, @RequestParam int page, @RequestParam int size) {
        return services.handleProductSearch(page, size, query);
    }

    @GetMapping("/view/new-deals")
    public List<View> displayNewDeals() {
        return services.handleNewDeals();
    }

    @GetMapping("/view/get-product/{id}")
    public Product getTheProduct(@PathVariable int id, @RequestParam(required = false, defaultValue = "") String userId) throws ProductNotFound, InvalidRequest {
        return services.getProductById(id, userId);
    }

    @GetMapping("/view/advertisements")
    public List<Advertisement> getAllAdvertisement() {
        return services.displayAd();
    }

    @GetMapping("/view/advertisements-speci")
    public Advertisement getSpecificAdvertisement() {
        return services.displaySpecificAd();
    }

    @GetMapping("/view/no-of-products")
    public int getAllProducts() {
        return services.handleGetAllproducts();
    }

    @PostMapping("/add-item")
    public ResponseEntity<?> handleProductInsert(@RequestBody Products product) {
        return services.addProducts(product);
    }

    @PostMapping("/add-item/thumbnail-image/{productId}")
    public ResponseEntity<?> addTumbnailToTheProduct(@PathVariable int productId, @RequestParam("thumbnailFile") MultipartFile file) throws ProductNotFound, IOException {
        return services.addThumbnail(productId, file);
    }

    @PostMapping("/add-item/product-images/{productId}")
    public ResponseEntity<?> addImagesToTheProduct(@PathVariable int productId, @RequestParam("imageFiles") MultipartFile[] files) throws ProductNotFound, IOException {
        return services.addProductImages(productId, files);
    }

    @PostMapping("/add-product-review/{id}")
    public ResponseEntity<?> handleProductReview(@PathVariable int id, @RequestBody UsersReview usersReview) throws ProductNotFound {
        return services.submitProductReview(id, usersReview);
    }

    @PutMapping("/update/update-details/{id}")
    public ResponseEntity<?> handleProductDetailsUpdate(@PathVariable int id, @RequestBody AdminProductUpdate adminProductUpdate) {
        return services.handleProductDetailsUpdate(id, adminProductUpdate.getTitle(), adminProductUpdate.getPrice(), adminProductUpdate.getStock());
    }

    @PutMapping("/update/update-stock/{id}")
    public ResponseEntity<?> handleProductStockUpdate(@PathVariable int id, @RequestBody AdminProductUpdate adminProductUpdate) {
        return services.handleProductStockUpdate(id, adminProductUpdate.getStock());
    }

    @PutMapping("/update/update-trending/{id}")
    public ResponseEntity<?> handleProductTrending(@PathVariable int id, @RequestBody AdminProductUpdate adminProductUpdate) {
        return services.handleProductTrending(id, adminProductUpdate.isTrending());
    }

    @PostMapping("/mark/et-ing/{id}")
    public ResponseEntity<?> handleAddAdvertisment(@PathVariable int id, @RequestParam("imageFile") MultipartFile multipartFile) throws ProductNotFound, IOException {
        return services.addAdvertisement(id, multipartFile);
    }

    @GetMapping("/mark/search/{name}")
    public List<AdProductView> handleProductSearch(@PathVariable String name) {
        return services.searchProduct(name);
    }

    @GetMapping("/mark/marks")
    public List<Advertisement> getAdvertisements() {
        return services.getAdvertisement();
    }

    @DeleteMapping("/mark/marks/{id}")
    public ResponseEntity<String> handleAdDelete(@PathVariable int id) {
        return services.deleteAdvertisement(id);
    }

    @GetMapping("/mark/marks-count")
    public long getAdCount() {
        return services.handleAdCount();
    }

    @GetMapping("/search/{query}")
    public SearchPage getSearch(
            @PathVariable String query,
            @RequestParam int limit,
            @RequestParam int page,
            @RequestParam double price,
            @RequestParam double rating,
            @RequestParam boolean outOfStock,
            @RequestParam boolean topDeals
    ) throws GlobalServerException {
        return services.productSearch(query, limit, page, price, rating, outOfStock, topDeals);
    }

    @GetMapping("/view/category/{id}")
    public List<View> getCategoryWiseProducts(@PathVariable int id) {
        return services.getCategoryBasedProducts(id);
    }

    @GetMapping("/view/bestsellers")
    public List<View> getBestsellers() {
        return services.getBestSellers();
    }

}
