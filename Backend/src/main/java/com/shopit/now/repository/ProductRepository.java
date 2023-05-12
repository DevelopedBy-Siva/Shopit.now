package com.shopit.now.repository;

import com.shopit.now.entity.Products;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Products, Integer> {

    @Query("select p1 from Products p1 ORDER BY p1.productRatings.overallRating desc ")
    List<Products> findAllBestSellers(Pageable pageable);

    @Query("select p1 from Products p1 where p1.trending=true order by p1.price asc ")
    List<Products> findAllProductsTrending();

    @Query("select p1 from Products p1 ORDER BY p1.title")
    List<Products> findAllProductsSorted(Pageable pageable);

    @Query("select  p1 from Products p1 where concat(p1.title,p1.category) like %:query% ")
    List<Products> findProductBySearchQuery(@Param("query") String query, Pageable pageable);

    @Query("select count(p1) from Products p1 where concat(p1.title,p1.category) like %:query% ")
    int searchedProductLength(@Param("query") String query);

    @Modifying
    @Query("update Products p set p.title=:newTitle, p.price=:newPrice  where p.id=:pid")
    void updateProductDetails(@Param("newTitle") String newTitle, @Param("newPrice") String newPrice, @Param("pid") int id);

    @Modifying
    @Query("update Products p set p.inStock=:stock where p.id=:pid")
    void updateProductStock(@Param("stock") int stock, @Param("pid") int id);

    @Modifying
    @Query("update Products p set p.trending=:trend where p.id=:pid")
    void updateProductTrending(@Param("trend") boolean trend, @Param("pid") int id);

    @Query("select count(p) from Products p")
    int getHowManyProducts();

    @Query("select p from Products p where p.trending=true order by p.title asc ")
    List<Products> getTrendingProducts();

    List<Products> findByTitleLike(String name);

    @Query("select p1 from Products p1  where p1.inStock>=:stock and p1.price>=:price and p1.trending=:trending and p1.productRatings.overallRating>=:rating and CONCAT(p1.title,p1.category) like %:query% order by p1.inStock desc ")
    List<Products> getSearchedProducts(@Param("query") String query,
                                       @Param("stock") int stock,
                                       @Param("rating") double rating,
                                       @Param("price") double price,
                                       @Param("trending") boolean trending,
                                       Pageable pageable);

    @Query("select p1 from Products p1  where p1.inStock>=:stock and p1.price>=:price and p1.trending=:trending and p1.productRatings.overallRating>=:rating and CONCAT(p1.title,p1.category) like %:query% ")
    List<Products> getSearchedProductsCount(@Param("query") String query,
                                            @Param("stock") int stock,
                                            @Param("rating") double rating,
                                            @Param("price") double price,
                                            @Param("trending") boolean trending);

    @Query("select p1 from Products p1  where p1.inStock>=:stock and p1.price>=:price and p1.productRatings.overallRating>=:rating and CONCAT(p1.title,p1.category) like %:query% order by p1.inStock desc ")
    List<Products> getSearchedProductsWithTrending(@Param("query") String query,
                                                   @Param("stock") int stock,
                                                   @Param("rating") double rating,
                                                   @Param("price") double price,
                                                   Pageable pageable);

    @Query("select p1 from Products p1  where p1.inStock>=:stock and p1.price>=:price and p1.productRatings.overallRating>=:rating and CONCAT(p1.title,p1.category) like %:query% ")
    List<Products> getSearchedProductsCountWithTrending(@Param("query") String query,
                                                        @Param("stock") int stock,
                                                        @Param("rating") double rating,
                                                        @Param("price") double price);

    @Query("select p1 from Products p1  where p1.inStock>=0 and p1.price>=0 and p1.productRatings.overallRating>=0 and CONCAT(p1.title,p1.category) like %:query% order by p1.inStock desc ")
    List<Products> getSearchedProductsWithTrendingAlternative(@Param("query") String query, Pageable pageable);


    @Query("select p1 from Products p1  where p1.inStock>=0 and p1.price>=0 and p1.productRatings.overallRating>=0 and CONCAT(p1.title,p1.category) like %:query% order by p1.inStock desc ")
    List<Products> getSearchedProductsCountWithTrendingAlternative(@Param("query") String query);


    @Query("select p1 from Products p1 where p1.category=:category and p1.id<>:id")
    List<Products> getCategoryBasedProducts(@Param("category") String category, @Param("id") int id, Pageable pageable);

    @Query("select p1 from Products p1 where p1.id=:id")
    Products getTheProduct(@Param("id") int id);

}
