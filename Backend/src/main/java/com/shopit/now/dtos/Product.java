package com.shopit.now.dtos;

import com.shopit.now.entity.ProductRatings;
import com.shopit.now.entity.Productimage;
import com.shopit.now.entity.Thumbnail;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Product {
    private int id;
    private String title;
    private Double price;
    private String description;
    private String category;
    private String material;
    private String origin_location;
    private double emission_factor;
    private double eco_score;
    private double weight;
    private int inStock;
    private boolean trending;
    private Thumbnail thumbnail;
    private ProductRatings productRatings;
    private List<Productimage> productimage;
    private boolean isWishListed;
}
