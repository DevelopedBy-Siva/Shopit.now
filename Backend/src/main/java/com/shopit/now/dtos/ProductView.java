package com.shopit.now.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductView {
    private int id;
    private String title;
    private String category;
    private double price;
    private boolean trending;
    private int inStock;
    private String material;
    private String origin_location;
    private double emission_factor;
    private double eco_score;
    private double weight;
}
