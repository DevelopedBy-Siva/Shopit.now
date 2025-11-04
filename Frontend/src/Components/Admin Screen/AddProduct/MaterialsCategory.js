import React, { Component } from "react";
import materialsData from "../../../datas/materials.json";

class MaterialsCategory extends Component {
  state = {
    materials: [],
    selectedMaterials: [],
    avgEmissionFactor: 0,
    avgEcoScore: 0,
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
        avgEmissionFactor: 0,
        avgEcoScore: 0,
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
    const { selectedMaterials, materials } = this.state;
    const { onChange, onChangeeEmissionFactor, onChangeEcoScore } = this.props;

    const selectedObjects = materials.filter((m) =>
      selectedMaterials.includes(m.name)
    );

    if (onChange) {
      onChange({
        target: {
          name: "material",
          value: selectedMaterials.join(", "),
        },
      });
    }

    if (selectedObjects.length > 0) {
      const avgEmissionFactor =
        selectedObjects.reduce((sum, m) => sum + m.emission_factor, 0) /
        selectedObjects.length;
      const avgEcoScore =
        selectedObjects.reduce((sum, m) => sum + m.eco_score, 0) /
        selectedObjects.length;

      this.setState({ avgEmissionFactor, avgEcoScore });

      if (onChangeeEmissionFactor)
        onChangeeEmissionFactor({
          target: { name: "emission_factor", value: avgEmissionFactor },
        });

      if (onChangeEcoScore)
        onChangeEcoScore({
          target: { name: "eco_score", value: avgEcoScore },
        });
    } else {
      this.setState({ avgEmissionFactor: 0, avgEcoScore: 0 });
    }
  };

  render() {
    const {
      materials,
      selectedMaterials,
      dropdownOpen,
      avgEmissionFactor,
      avgEcoScore,
    } = this.state;
    const { category, disabled } = this.props;

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

        <div className="material-details">
          <div>
            <label>Average Emission Factor:</label>
            <input
              type="number"
              value={avgEmissionFactor.toFixed(3)}
              disabled
            />
          </div>
          <div>
            <label>Average Base Eco Score:</label>
            <input type="number" value={avgEcoScore.toFixed(2)} disabled />
          </div>
        </div>
      </div>
    );
  }
}

export default MaterialsCategory;
