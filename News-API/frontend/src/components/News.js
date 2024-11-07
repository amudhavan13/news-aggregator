// frontend/src/components/News.js
import React, { Component } from "react";
import NewsUpdate from "./NewsUpdate";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import { checkIfFakeNews } from "../services/api";
import "./News.css";
import "./Search.css"; // Import the new CSS file

export class News extends Component {
  static defaultProps = {
    category: "general",
  };

  static propTypes = {
    category: PropTypes.string,
  };

  constructor() {
    super();
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0,
      searchTerm: "", // Track search input
    };
  }

  async detectFakeNews(articles) {
    const updatedArticles = await Promise.all(
      articles.map(async (article) => {
        const result = await checkIfFakeNews(article.description || "");
        return { ...article, isFake: result.is_fake };
      })
    );
    return updatedArticles;
  }

  async updateNews() {
    this.setState({ loading: true });
    const { category, api_key } = this.props;
    const url = `https://newsapi.org/v2/top-headlines?&language=en&category=${category}&apiKey=${api_key}&page=${this.state.page}&pageSize=12`;

    let data = await fetch(url);
    let parsedData = await data.json();

    const articlesWithFakeStatus = await this.detectFakeNews(parsedData.articles);

    this.setState({
      articles: articlesWithFakeStatus,
      totalResults: parsedData.totalResults,
      loading: false,
    });
  }

  async componentDidMount() {
    this.updateNews();
  }

  nextClick = async () => {
    this.setState({ page: this.state.page + 1 }, this.updateNews);
  };

  previousClick = async () => {
    this.setState({ page: this.state.page - 1 }, this.updateNews);
  };

  handleSearchInput = (event) => {
    this.setState({ searchTerm: event.target.value });
  };

  filterArticles = () => {
    const { articles, searchTerm } = this.state;
    return articles.filter((article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  render() {
    const filteredArticles = this.filterArticles();

    return (
      <div className="container my-3">
        <h2 className="text-center">TOP HEADLINES</h2>

        {/* Show search bar only for "general" category */}
        {this.props.category === "general" && (
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search news..."
              value={this.state.searchTerm}
              onChange={this.handleSearchInput}
              className="search-input"
            />
          </div>
        )}

        {this.state.loading && <Spinner />}

        <div className="row">
          {!this.state.loading &&
            filteredArticles.map((element) => (
              <div className="col-md-4" key={element.url}>
                <NewsUpdate
                  title={element.title}
                  newsUrl={element.url}
                  description={
                    element.description ? element.description.slice(0, 100) : ""
                  }
                  imgUrl={element.urlToImage}
                  source={element.source.name}
                  author={element.author}
                  isFake={element.isFake}
                />
              </div>
            ))}
        </div>

        <div className="container d-flex justify-content-between">
          <button
            disabled={this.state.page <= 1}
            type="button"
            className="btn btn-dark"
            onClick={this.previousClick}
          >
            Previous
          </button>
          <h5>Total Results : {this.state.totalResults}</h5>
          <button
            disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / 12)}
            type="button"
            className="btn btn-dark"
            onClick={this.nextClick}
          >
            Next
          </button>
        </div>
      </div>
    );
  }
}

export default News;
