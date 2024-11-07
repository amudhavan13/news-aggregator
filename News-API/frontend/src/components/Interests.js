import React, { Component } from "react";
import NewsUpdate from "./NewsUpdate"; // Assuming NewsUpdate displays each news item
import axios from "axios";
import "./Interests.css";

export class Interests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: "",
      categories: [
        "business",
        "entertainment",
        "health",
        "science",
        "sports",
        "technology",
      ],
      interests: [],
      articles: [],
      loading: false,
    };
  }

  componentDidMount() {
    // Load saved interests on component mount
    this.loadInterests();
  }

  loadInterests = async () => {
    try {
      const response = await axios.get("http://localhost:5000/user/interests", {
        params: { email: this.props.email }, // Send user email
      });
      if (response.data.success) {
        this.setState({ interests: response.data.interests });
      }
    } catch (error) {
      console.error("Error loading interests:", error);
    }
  };

  handleCategoryChange = (e) => {
    this.setState({ selectedCategory: e.target.value });
  };

  addInterest = async () => {
    const { selectedCategory, interests } = this.state;
    if (selectedCategory && !interests.includes(selectedCategory)) {
      const updatedInterests = [...interests, selectedCategory];
      this.setState({ interests: updatedInterests, selectedCategory: "" });

      try {
        await axios.post("http://localhost:5000/user/interests", {
          email: this.props.email,
          interests: updatedInterests,
        });
      } catch (error) {
        console.error("Error saving interests:", error);
      }
    }
  };

  removeInterest = async (interestToRemove) => {
    const updatedInterests = this.state.interests.filter(
      (interest) => interest !== interestToRemove
    );
    this.setState({ interests: updatedInterests });

    try {
      await axios.post("http://localhost:5000/user/remove-interest", {
        email: this.props.email,
        interest: interestToRemove,
      });
    } catch (error) {
      console.error("Error removing interest:", error);
    }
  };

  fetchNews = async () => {
    const { interests } = this.state;
    const api_key = "585f3a3a24764a82a970c0f33e9b28ba"; // Use your API key
    let allArticles = [];

    this.setState({ loading: true });

    for (const category of interests) {
      const url = `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${api_key}`;
      const response = await fetch(url);
      const data = await response.json();
      allArticles = [...allArticles, ...data.articles];
    }

    this.setState({ articles: allArticles, loading: false });
  };

  render() {
    const { selectedCategory, categories, interests, articles, loading } = this.state;

    return (
      <div className="interests-container">
        <h2>Your News Interests</h2>

        <div className="category-selection">
          <label htmlFor="categories">Select your news category:</label>
          <select
            id="categories"
            value={selectedCategory}
            onChange={this.handleCategoryChange}
          >
            <option value="">-- Select a category --</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <button onClick={this.addInterest} className="add-button">Add</button>
        </div>

        <div className="interests-list">
          {interests.map((interest, index) => (
            <div key={index} className="interest-box">
              {interest.charAt(0).toUpperCase() + interest.slice(1)}
              <button onClick={() => this.removeInterest(interest)} className="remove-button">
                Remove
              </button>
            </div>
          ))}
        </div>

        {interests.length > 0 && (
          <button onClick={this.fetchNews} className="view-news-button">
            View News
          </button>
        )}

        <div className="news-articles">
          {loading && <p>Loading...</p>}
          {!loading && articles.map((article, index) => (
            <div key={index} className="news-article">
              <NewsUpdate
                title={article.title}
                newsUrl={article.url}
                description={article.description ? article.description.slice(0, 100) : ""}
                imgUrl={article.urlToImage}
                source={article.source.name}
                author={article.author}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Interests;
