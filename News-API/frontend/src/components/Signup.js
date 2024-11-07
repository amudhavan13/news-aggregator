import React, { Component } from "react";
import axios from "axios";
import "./Signup.css";

export class Signup extends Component {
  state = {
    email: "",
    password: "",
    confirmPassword: "",
    message: ""
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleRegister = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = this.state;

    if (password !== confirmPassword) {
      this.setState({ message: "Passwords do not match." });
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/signup", {
        email, // Make sure this is correct
        password,
      });
      this.setState({ message: response.data.message });
      // Redirect to login page after successful registration
      window.location.href = "/Login";
    } catch (error) {
      this.setState({ message: "Registration failed: " + error.response.data.message });
    }
  };

  render() {
    return (
      <div className="signup-container">
        <div className="signup-box">
          <h2>Register to our News Aggregator Website</h2>
          <form onSubmit={this.handleRegister}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email" // Ensure this matches with the state and backend
                className="form-control"
                placeholder="Enter your email"
                value={this.state.email}
                onChange={this.handleInputChange}
                required // Add this to ensure field is not empty
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter your password"
                value={this.state.password}
                onChange={this.handleInputChange}
                required // Add this to ensure field is not empty
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                placeholder="Confirm your password"
                value={this.state.confirmPassword}
                onChange={this.handleInputChange}
                required // Add this to ensure field is not empty
              />
            </div>
            <button type="submit" className="register-button">Register</button>
          </form>
          <p className="message">{this.state.message}</p>
        </div>
      </div>
    );
  }
}

export default Signup;
