import React from "react";
import classes from "./Input.module.css";
const input = props => {
  let inputElement = null;
  let inputClassArray = [classes.InputElement];
  let validationError = null;
  let passwordStrengthStatement = null;
  let textStrengthClass = null;
  if (props.shouldBeValidated && props.touched) {
    if (props.elementConfig.id === "password" && props.value.length >= 8) {
      textStrengthClass = classes.textStrengthStrong;
      passwordStrengthStatement = (
        <p>
          Password Strength is <span className={textStrengthClass}>Strong</span>
        </p>
      );
    }
    if (
      props.elementConfig.id === "password" &&
      (props.value.length < 6 || props.value.length < 8)
    ) {
      textStrengthClass = classes.textStrengthMedium;
      passwordStrengthStatement = (
        <p>
          Password Strength is <span className={textStrengthClass}>Medium</span>
        </p>
      );
    }
    if (props.elementConfig.id === "password" && props.value.length < 3) {
      textStrengthClass = classes.textStrengthLow;
      passwordStrengthStatement = (
        <p>
          Password Strength is <span className={textStrengthClass}>Weak</span>
        </p>
      );
    }
  }
  if (
    props.invalid &&
    props.shouldBeValidated &&
    props.touched &&
    props.isBlurredOut
  ) {
    inputClassArray.push(classes.Invalid);
    switch (props.valueType) {
      case "email":
        validationError = (
          <p className={classes.InputError}>
            Please enter a valid
            <span> {props.valueType}</span>
          </p>
        );
        break;
      case "password":
        validationError = (
          <p className={classes.InputError}>
            <span> {props.valueType} </span>
            must contain at least 8 characters
          </p>
        );
        break;
      case "confirmPassword":
        validationError = (
          <p id="ConfirmPasswordError" className={classes.InputError}>
            Passwords do not match
          </p>
        );
        break;
      default:
        validationError = (
          <p className={classes.InputError}>
            Please enter a<span> {props.elementConfig.type}</span>
          </p>
        );
    }
  }
  if (!props.invalid && props.shouldBeValidated && props.touched) {
    inputClassArray.push(classes.Valid);
  }

  // enable rounded edge
  if (props.isRoundedEdge) {
    inputClassArray.push(classes.RoundedEdges);
  }

  if (props.isNoBorder) {
    inputClassArray.push(classes.NoBorder);
  }
  switch (props.elementType) {
    case "input":
      inputElement = (
        <div className={classes.InputElementForLabel}>
          <label htmlFor={props.elementConfig.id} style={labelStyle}>
            {props.elementConfig.type}
          </label>

          <input
            id={props.elementConfig.id}
            className={inputClassArray.join(" ")}
            {...props.elementConfig}
            onBlur={props.blurred}
            value={props.value}
            onChange={props.changed}
          />

          {passwordStrengthStatement}
        </div>
      );
      break;
    case "textarea":
      inputElement = (
        <textarea
          className={inputClassArray.join(" ")}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
        />
      );
      break;
    case "select":
      inputElement = (
        <select
          className={inputClassArray.join(" ")}
          value={props.value}
          onChange={props.changed}
        >
          {props.elementConfig.options.map(option => (
            <option key={option.value} value={option.value}>
              {option.displayValue}
            </option>
          ))}
        </select>
      );
      break;
    case "selectWithLabel":
      inputElement = (
        <div className={classes.InputElementForLabel}>
          <label htmlFor={props.elementConfig.id} style={labelStyle}>
            {props.elementConfig.type}
          </label>
          <select
            className={inputClassArray.join(" ")}
            value={props.value}
            onChange={props.changed}
          >
            {props.elementConfig.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.displayValue}
              </option>
            ))}
          </select>
        </div>
      );
      break;
    case "checkbox":
      inputElement = (
        <div className={classes.CheckBoxContainer}>
          <input
            className={classes.CheckBox}
            id={props.elementConfig.id}
            type="checkbox"
          />
          <label
            htmlFor={props.elementConfig.id}
            style={{
              cursor: "pointer"
            }}
          >
            I want to receive Yawemarket's newsletter with best deals and offers
          </label>
        </div>
      );
      break;
    case "selectandinput":
      inputElement = (
        <React.Fragment>
          <div className={classes.InputElementForLabel}>
            <label
              htmlFor={props.elementConfig.id}
              style={{
                cursor: "pointer"
              }}
            >
              {props.elementConfig.type}
            </label>
          </div>
          <div className={classes.PhoneNumberContainer}>
            <select
              className={inputClassArray.join(" ")}
              value={props.dropDownValue}
              onChange={props.changed}
              id="phonenumberInputModule"
            >
              {props.elementConfig.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.displayValue}
                </option>
              ))}
            </select>
            <div style={{ flex: "3" }}>
              <input
                className={classes.phonenumber}
                id={props.elementConfig.id}
                type="phonenumber"
                onChange={props.changed}
                value={props.value}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </React.Fragment>
      );
      break;
    default:
      inputElement = (
        <input
          className={inputClassArray.join(" ")}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
        />
      );
  }
  return (
    <div className={classes.Input}>
      {inputElement}
      {validationError}
    </div>
  );
};

const labelStyle = {
  textTransform: "capitalize",
  textAlign: "right"
};

export default input;
