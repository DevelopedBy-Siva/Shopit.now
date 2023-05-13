import React, { Component } from "react";
import user from "../../../../Images/user.png";
import { FaSearch } from "react-icons/fa";
import DataLoad from "../../Errors/DataLoad";
import NetworkError from "../../Errors/NetworkError";
import EmptyMsg from "../../Errors/EmptyMsg";
import "../../../../css/users.css";

class Users extends Component {
  state = {
    search: "",
  };

  getImage = (img) => {
    const url = `data:${img.type};base64,${img.picByte}`;
    return url;
  };

  handleChange = (e) => {
    const search = e.currentTarget.value.toLowerCase();
    this.setState({ search });
  };

  render() {
    const { loading, error, data } = this.props;
    const { search } = this.state;

    const filtered =
      search.length > 0 ? data.filter((i) => i.name.includes(search)) : data;

    return (
      <div className="users-container">
        <h1>Users</h1>
        {loading ? (
          <DataLoad />
        ) : error ? (
          <NetworkError />
        ) : !data.length ? (
          <EmptyMsg msg="No Users Found" />
        ) : (
          <>
            <div className="admin-user-input-search">
              <input
                onChange={this.handleChange}
                placeholder="Search user..."
                spellCheck="false"
                autoCapitalize="off"
              />
              <div>
                <FaSearch />
              </div>
            </div>

            {filtered.length === 0 ? (
              <div>
                <EmptyMsg msg="User not found" />
              </div>
            ) : (
              <div className="users-container-datas">
                {filtered.map((i, index) => (
                  <div className="users-each-container-datas" key={index}>
                    <div className="admin-user-image">
                      <img
                        src={
                          i.userProfileImage
                            ? this.getImage(i.userProfileImage)
                            : user
                        }
                        alt={`user${index}`}
                      />
                    </div>
                    <div className="admin-user-details">
                      <h5>{i.name.toLowerCase()}</h5>
                      <h4>{i.email}</h4>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  }
}

export default Users;
