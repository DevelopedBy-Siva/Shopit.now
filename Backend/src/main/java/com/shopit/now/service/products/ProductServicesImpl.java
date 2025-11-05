package com.shopit.now.service.products;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopit.now.customexception.custom.GlobalServerException;
import com.shopit.now.customexception.custom.InvalidRequest;
import com.shopit.now.customexception.custom.ProductNotFound;
import com.shopit.now.dtos.*;
import com.shopit.now.entity.*;
import com.shopit.now.repository.AdvertisementRepository;
import com.shopit.now.repository.ProductRepository;
import com.shopit.now.repository.WishListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductServicesImpl implements ProductServices {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AdvertisementRepository advertisementRepository;

    @Autowired
    private WishListRepository wishListRepository;

    @Autowired
    private ObjectMapper objectMapper;


    @Override
    public int handleGetAllproducts() {
        return productRepository.getHowManyProducts();
    }

    @Override
    public ResponseEntity<?> addProducts(Products products){
        try{
            products.setTitle(products.getTitle().toLowerCase());
            products.setInStock(10);
            products.setTrending(false);
            products.setCategory(products.getCategory().toLowerCase());
            products.setMaterial(products.getMaterial().toLowerCase());

            // calculate eco score
            double penalty = (products.getEmission_factor() / 10.0) + (products.getWeight() / 2.0);
            int score = (int) Math.round(products.getEco_score() - penalty);
            double eco_score = Math.max(1, Math.min(10, score));
            products.setEco_score(eco_score);

            productRepository.save(products);
            return new ResponseEntity<>(products.getId(), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>("Internal Server Error. Try again later", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<?> addThumbnail(int productId,MultipartFile file) throws ProductNotFound, IOException {

        Products products=productRepository.findById(productId).orElse(null);
        if(products==null) throw  new ProductNotFound("Cannot Find The product");
        Thumbnail thumbnail = new Thumbnail(file.getOriginalFilename(), file.getContentType(),file.getBytes());
        products.setThumbnail(thumbnail);
        try {
            productRepository.save(products);
            return new ResponseEntity<>("Thumbnail uploaded Successfull",HttpStatus.OK);
        }catch (Exception e){
            productRepository.deleteById(productId);
            return new ResponseEntity<>("Thumbnail not uploaded",HttpStatus.BAD_REQUEST);
        }
    }

    public ResponseEntity<?> addProductImages(int productId,MultipartFile[] files) throws ProductNotFound, IOException {
        Products products=productRepository.findById(productId).orElse(null);
        if(products==null) throw  new ProductNotFound("Cannot Find The product");
        List<Productimage> images=new ArrayList<>();
        for(MultipartFile file:files){
            Productimage productimage=new Productimage(file.getOriginalFilename(), file.getContentType(),file.getBytes());
            images.add(productimage);
        }
        products.setProductimage(images);
        try {
            productRepository.save(products);
            return new ResponseEntity<>("All Images uploaded Successfull",HttpStatus.OK);
        }catch (Exception e){
            productRepository.deleteById(productId);
            return new ResponseEntity<>("All Images not uploaded",HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public double overallRatingCalc(Products products,int newRating) {
        int totalReviews=products.getProductRatings().getUsersReviews().size();
        if(newRating!=0) totalReviews+=1;
        int ratings=products.getProductRatings().getUsersReviews()
                .stream()
                .map(x -> x.getRating())
                .reduce(0, Integer::sum);
        return (Math.round(((float)(ratings+newRating)/totalReviews)*10.0)/10.0);
    }

    @Override
    public List<View> handleNewDeals() {
        List<Products> product=productRepository.findAllProductsTrending();
        List<View> productView=new ArrayList<>();
        for(Products p:product){
            View view=new View(p.getId(),p.getTitle(),p.getPrice(),p.getThumbnail());
            productView.add(view);
        }
        return productView;
    }

    @Override
    public Product getProductById(int id, String userId) throws ProductNotFound, InvalidRequest {
        Products products = productRepository.findById(id).orElse(null);
        if(products == null) throw new ProductNotFound("Product not found");
        Product response = objectMapper.convertValue(products, Product.class);
        try {
            int user = Integer.parseInt(userId);
            Wishlist wishlist = wishListRepository.findByProductIdAndUser_Id(id, user);
            if(wishlist != null)
                response.setWishListed(true);
        } catch (Exception ex){}

        return response;
    }

    @Override
    public AllProductDisplay getProductView(int page, int size) {
        Pageable pageable=PageRequest.of(page,size);
        List<Products> products=productRepository.findAllProductsSorted(pageable);
        List<ProductView> productViews=new ArrayList<>();
        products
                .stream()
                .forEach(p->productViews.add(new ProductView(p.getId(),p.getTitle(),p.getCategory(),p.getPrice(),p.isTrending(),p.getInStock(), p.getMaterial(), p.getOrigin_location(), p.getEmission_factor(),p.getEco_score(),p.getWeight())));
        return new AllProductDisplay(handleGetAllproducts(),productViews);
    }

    @Override
    public AllProductDisplay handleProductSearch(int page, int size,String query) {
        Pageable pageable=PageRequest.of(page,size);
        String newQuery=query.toLowerCase();
        List<Products> products=productRepository.findProductBySearchQuery(newQuery,pageable);
        List<ProductView> productViews=new ArrayList<>();
        products
                .stream()
                .forEach(p->productViews.add(new ProductView(p.getId(),p.getTitle(),p.getCategory(),p.getPrice(),p.isTrending(),p.getInStock(),p.getMaterial(), p.getOrigin_location(), p.getEmission_factor(),p.getEco_score(),p.getWeight())));
        return new AllProductDisplay(productRepository.searchedProductLength(newQuery),productViews);
    }

    @Override
    public List<Advertisement> displayAd() {
        Pageable pageable=PageRequest.of(0,4);
        List<Advertisement> advertisement= advertisementRepository.adToDisplay(pageable);
        return advertisement;
    }

	@Override
	public Advertisement displaySpecificAd() {
		List<Advertisement> advertisements = advertisementRepository.findAll();
		if (advertisements.size() > 1)
			return advertisements.get(advertisements.size() - 1);
		return null;
	}

    @Override
    public List<View> getCategoryBasedProducts(int id) {
        Products product=productRepository.getTheProduct(id);
        Pageable pageable=PageRequest.of(0,10);
        List<Products> newProducts=productRepository.getCategoryBasedProducts(product.getCategory(),id,pageable);
        List<View> view=new ArrayList<>();
        newProducts.stream().forEach(i->view.add(new View(i.getId(),i.getTitle(),i.getPrice(),i.getThumbnail())));
        return view;
    }

    @Override
    public List<View> getBestSellers() {
        Pageable pageable=PageRequest.of(0,10);
        List<Products> products=productRepository.findAllBestSellers(pageable);
        List<View> views=new ArrayList<>();
        products.stream().forEach(i->views.add( new View(i.getId(),i.getTitle(),i.getPrice(), i.getThumbnail())));
        return views;
    }

    @Override
    @Transactional
    public ResponseEntity<?> handleProductDetailsUpdate(int id, String title, String price, int stock) {
        try {
            double newPrice = Double.parseDouble(price);
            productRepository.updateProductDetails(title, newPrice, stock, id);
            return new ResponseEntity<>("Updated Successfully",HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>("Unknown error occured",HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    @Transactional
    public ResponseEntity<?> handleProductStockUpdate(int id, int stock) {
        try {
            productRepository.updateProductStock(stock,id);
            return new ResponseEntity<>("Updated Successfully",HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>("Unknown error occured",HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    @Transactional
    public ResponseEntity<?> handleProductTrending(int id, boolean trend) {
        try {
            productRepository.updateProductTrending(trend,id);
            return new ResponseEntity<>("Updated Successfully",HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>("Unknown error occured",HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public ResponseEntity<?> submitProductReview(int productId, UsersReview usersReview) throws ProductNotFound {
        Products products = productRepository.findById(productId).orElse(null);
        if (products == null)
            throw new ProductNotFound("Product not found");

        double overallRating = overallRatingCalc(products, usersReview.getRating());
        products.getProductRatings().setOverallRating(overallRating);
        boolean found = false;
        for (int index = 0; index < products.getProductRatings().getUsersReviews().size(); index++) {
            if (products.getProductRatings().getUsersReviews().get(index).getEmail().equals(usersReview.getEmail()))
                found = true;
        }
        if (found)
            return new ResponseEntity(null, HttpStatus.NO_CONTENT);

        products.getProductRatings().getUsersReviews().add(usersReview);
        try {
            productRepository.save(products);
            return new ResponseEntity("User review added successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity("Internal Server Error. Try again later", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> addAdvertisement(int productId,MultipartFile multipartFile) throws IOException {
        Products products=productRepository.findById(productId).orElse(null);
        Advertisement advertisement=new Advertisement(productId,products.getTitle(),multipartFile.getOriginalFilename(),multipartFile.getContentType(),multipartFile.getBytes());
        Advertisement ad=advertisementRepository.findByProductId(productId);
        if(ad!=null){
            return new ResponseEntity<>("Ad already added",HttpStatus.BAD_REQUEST);
        }
        try {
            Advertisement response = advertisementRepository.save(advertisement);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>("Server error",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public List<AdProductView> searchProduct(String name){
        List<Products> products= productRepository.findByTitleLike("%"+name.toLowerCase()+"%");
        ArrayList<AdProductView> productList=new ArrayList<>();
        for(Products p:products){
            productList.add(new AdProductView(p.getId(),p.getTitle(),p.getThumbnail()));
        }
        return productList;
    }

    @Override
    public List<Advertisement> getAdvertisement() {
        return advertisementRepository.getAllAd();
    }

    @Override
    public ResponseEntity<String> deleteAdvertisement(int id) {
        Advertisement ad=advertisementRepository.findByProductId(id);
        if(ad==null){
            return new ResponseEntity<>("Already deleted",HttpStatus.BAD_REQUEST);
        }
        try {
            advertisementRepository.deleteById(id);
            return new ResponseEntity<>("Success",HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>("Failed",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public long handleAdCount() {
       return advertisementRepository.count();
    }

    @Override
    public SearchPage productSearch(String query, int limit, int page, double price, double rating, boolean outOfStock, boolean topDeals) throws GlobalServerException {
        try {
            Pageable pageable=PageRequest.of(page,limit);
            int newStock=(outOfStock==false?1:0);
            int newDeals=(topDeals==true?1:0);
            String queryUpdate=query.toLowerCase();
            List<Products> products=null;
            int size=0;
            if(newDeals==0){
                products=productRepository.getSearchedProductsWithTrending(queryUpdate, newStock, rating, price, pageable);
                size = productRepository.getSearchedProductsCountWithTrending(queryUpdate, newStock, rating, price).size();
            }
            else {
                products = productRepository.getSearchedProducts(queryUpdate, newStock, rating, price, topDeals, pageable);
                size = productRepository.getSearchedProductsCount(queryUpdate, newStock, rating, price, topDeals).size();
            }
            List<SearchView> searchItems=new ArrayList<>();
            for(Products p:products) {
                int stock=p.getInStock();
                boolean available=true;
                if(stock<1) available=false;
                SearchView searchView = new SearchView(p.getId(),p.getTitle(),p.getPrice(),p.getProductRatings().getOverallRating(), p.getProductRatings().getUsersReviews().size(),available,p.isTrending(),p.getThumbnail());
                searchItems.add(searchView);
            }
            SearchPage searchPage=new SearchPage(searchItems,size);
            return searchPage;
        }catch (Exception e){
            throw new GlobalServerException("Internal Server error occured");
        }
    }


}
