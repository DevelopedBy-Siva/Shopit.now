package com.shopit.now.dtos;

import com.shopit.now.entity.Thumbnail;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class WishlistView {
    private int wid;
    private int pid;
    private String name;
    private double price;
    private Thumbnail thumbnail;
    private boolean available;
}
