import React, { Component } from "react";
import materialsData from "../../../datas/materials.json";

class MaterialsCategory extends Component {
  state = {
    materials: [],
    selectedMaterials: [],
    dropdownOpen: false,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.category !== this.props.category) {
      const { category, onChange } = this.props;
      let materials = [];

      if (category === "Mobiles" || category === "Laptops") {
        materials = materialsData["Mobile & Laptops"];
      } else if (category === "Fashion") {
        materials = materialsData["Fashion"];
      } else if (category === "Kids & Baby") {
        materials = materialsData["Kids & Baby"];
      } else if (category === "Appliances") {
        materials = materialsData["Appliances"];
      }

      if (onChange) {
        onChange({ target: { name: "material", value: "" } });
      }

      this.setState({
        materials,
        selectedMaterials: [],
      });
    }
  }

  toggleDropdown = () => {
    this.setState((prev) => ({ dropdownOpen: !prev.dropdownOpen }));
  };

  handleCheckboxChange = (material) => {
    this.setState((prevState) => {
      const alreadySelected = prevState.selectedMaterials.includes(material);
      const selectedMaterials = alreadySelected
        ? prevState.selectedMaterials.filter((m) => m !== material)
        : [...prevState.selectedMaterials, material];
      return { selectedMaterials };
    }, this.updateAverages);
  };

  updateAverages = () => {
    const { selectedMaterials } = this.state;
    const { onChange } = this.props;

    if (onChange) {
      onChange({
        target: {
          name: "material",
          value: selectedMaterials.join(", "),
        },
      });
    }
  };

  render() {
    const { materials, selectedMaterials, dropdownOpen } = this.state;
    const { category, disabled, touched, errors } = this.props;

    const isDisabled = !category || materials.length === 0 || disabled;

    return (
      <div className="material-dropdown-container">
        <label>Select Material(s):</label>

        <div
          className={`dropdown ${isDisabled ? "disabled" : ""}`}
          onClick={!isDisabled ? this.toggleDropdown : undefined}
        >
          <div className="dropdown-header">
            {selectedMaterials.length > 0
              ? selectedMaterials.join(", ")
              : "Pick materials"}
            <span className="arrow">{dropdownOpen ? "▲" : "▼"}</span>
          </div>

          {dropdownOpen && (
            <div className="dropdown-list">
              {materials.map((item, index) => (
                <label key={index} className="dropdown-item">
                  <input
                    type="checkbox"
                    checked={selectedMaterials.includes(item.name)}
                    onChange={() => this.handleCheckboxChange(item.name)}
                  />
                  {item.name}
                </label>
              ))}
            </div>
          )}
        </div>
        {errors && touched && <h5>{errors}</h5>}
      </div>
    );
  }
}

export default MaterialsCategory;
