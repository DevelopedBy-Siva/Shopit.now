package com.shopit.now.dtos;

import com.shopit.now.entity.Thumbnail;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class View {
    private int id;
    private String title;
    private double price;
    private Thumbnail thumbnail;
}
