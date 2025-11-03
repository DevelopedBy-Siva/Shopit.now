import React, { Component } from "react";
import materialsData from "../../../datas/materials.json";

class MaterialsCategory extends Component {
  state = {
    materials: [],
    emissionFactor: 0,
    ecoScore: 0,
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
        onChange({
          target: { name: "material", value: "" },
        });
      }

      this.setState({
        materials,
        emissionFactor: 0,
        ecoScore: 0,
      });
    }
  }

  handleMaterialChange = (e) => {
    const selectedMaterial = e.target.value;
    const { materials } = this.state;
    const { onChange } = this.props;

    if (onChange) onChange(e);

    const found = materials.find((m) => m.name === selectedMaterial);
    if (found) {
      this.setState({
        emissionFactor: found.emission_factor,
        ecoScore: found.eco_score,
      });
    } else {
      this.setState({ emissionFactor: 0, ecoScore: 0 });
    }
  };

  render() {
    const { materials, emissionFactor, ecoScore } = this.state;
    const { errors, touched, disabled, category } = this.props;

    const isDisabled = !category || materials.length === 0 || disabled;

    return (
      <div className="pick-category-container">
        <select
          name="material"
          value={this.props.value || ""}
          disabled={isDisabled}
          onChange={this.handleMaterialChange}
          onBlur={this.props.onBlur}
        >
          <option value="">Pick a material</option>
          {materials.map((item, index) => (
            <option value={item.name} key={index}>
              {item.name}
            </option>
          ))}
        </select>
        {errors && touched && <h5>{errors}</h5>}

        <div className="material-details">
          <div>
            <label>Emission Factor:</label>
            <input step="any" type="number" value={emissionFactor} disabled />
          </div>
          <div>
            <label>Eco Score:</label>
            <input step="any" type="number" value={ecoScore} disabled />
          </div>
        </div>
      </div>
    );
  }
}

export default MaterialsCategory;
