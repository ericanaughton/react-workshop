////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// Make this work like a normal <select> box!
////////////////////////////////////////////////////////////////////////////////
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./styles.css";

class Select extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
    defaultValue: PropTypes.any
  };

  state = {
    isOpen: false,
    value: this.props.defaultValue
  };

  isControlled() {
    return this.props.value != null;
  }

  componentWillMount() {
    if (this.isControlled() && this.props.onChange == null) {
      console.warn(
        "You should provide an onChange to a controlled <Select> component!"
      );
    }
  }

  render() {
    const { value } = this.isControlled() ? this.props : this.state;

    let label;
    const children = React.Children.map(this.props.children, child => {
      if (child.props.value === value) {
        label = child.props.children;
      }

      return React.cloneElement(child, {
        onSelect: () => {
          if (this.isControlled()) {
            if (this.props.onChange) {
              this.props.onChange(child.props.value);
            }
          } else {
            this.setState({ value: child.props.value }, () => {
              if (this.props.onChange) {
                this.props.onChange(this.state.value);
              }
            });
          }
        }
      });
    });

    return (
      <div
        className="select"
        onClick={() => this.setState({ isOpen: !this.state.isOpen })}
      >
        <div className="label">
          {this.state.selectedValue} <span className="arrow">▾</span>
        </div>

        {this.state.isOpen && <div className="options">{children}</div>}
      </div>
    );
  }
}

class Option extends React.Component {
  static propTypes = {
    onChange: PropTypes.func
  };

  onClick = () => this.props.onChange(this.props.children);

  render() {
    return (
      <div className="option" onClick={this.onClick}>
        {this.props.children}
      </div>
    );
  }
}

class App extends React.Component {
  state = {
    selectValue: "dosa"
  };

  setToMintChutney = () => {
    this.setState({ selectValue: "mint-chutney" });
  };

  render() {
    return (
      <div>
        <h1>Select/Option</h1>

        <h2>Controlled</h2>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
        <p>
          <button onClick={this.setToMintChutney}>
            Set to Mint Chutney
          </button>
        </p>

        <Select
          value={this.state.selectValue}
          onChange={value => this.setState({ selectValue: value })}
        >
          <Option value="tikka-masala">Tikka Masala</Option>
          <Option value="tandoori-chicken">Tandoori Chicken</Option>
          <Option value="dosa">Dosa</Option>
          <Option value="mint-chutney">Mint Chutney</Option>
        </Select>

        <h2>Uncontrolled</h2>
        <Select defaultValue="tikka-masala">
          <Option value="tikka-masala">Tikka Masala</Option>
          <Option value="tandoori-chicken">Tandoori Chicken</Option>
          <Option value="dosa">Dosa</Option>
          <Option value="mint-chutney">Mint Chutney</Option>
        </Select>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
