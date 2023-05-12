package com.shopit.now.dtos;

import com.shopit.now.entity.UserProfileImage;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserView {
    private int id;
    private String name;
    private String email;
    private UserProfileImage userProfileImage;
}
