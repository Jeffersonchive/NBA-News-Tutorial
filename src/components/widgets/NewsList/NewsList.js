// Modules

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { DBTeams, DBArticles, firebaseLoop } from "../../../firebase";

// Config

// Components

import Button from "../Buttons/Buttons";
import CardInfo from "../CardInfo/CardInfo";

// Styling

import style from "./NewsList.module.css";

// Logic

class NewsList extends Component {
	state = {
		teams: [],
		items: [],
		start: this.props.start,
		end: this.props.start + this.props.amount,
		amount: this.props.amount
	};

	componentWillMount() {
		this.req(this.state.start, this.state.end);
	}

	req = (start, end) => {
		if (this.state.teams.length < 1) {
			DBTeams.once("value").then(snapshot => {
				const teams = firebaseLoop(snapshot);
				this.setState({
					teams
				});
			});
		}
		// Load an amount of articles
		DBArticles.orderByChild("id")
			.startAt(start)
			.endAt(end)
			.once("value")
			.then(snapshot => {
				const articles = firebaseLoop(snapshot);
				this.setState({
					items: [...this.state.items, ...articles],
					start,
					end
				});
			})
			.catch(error => {
				console.log(error);
			});
	};

	loadMore = () => {
		let end = this.state.end + this.state.amount;

		//  the + 1 below avoids duplication of items in the news list
		this.req(this.state.end + 1, end);
		this.setState({
			end: end
		});
	};

	renderNews = type => {
		let template = null;

		switch (type) {
			case "card":
				template = this.state.items.map((item, i) => (
					<CSSTransition
						classNames={{
							enter: style.wrapper,
							enterActive: style.wrapper_enter
						}}
						timeout={1000}
						key={i}
					>
						<div>
							<div className={style.card}>
								<Link to={`/articles/${item.id}`}>
									<CardInfo
										teams={this.state.teams}
										team={item.team}
										date={item.date}
									/>
									<h2>{item.title} </h2>
								</Link>
							</div>
						</div>
					</CSSTransition>
				));
				break;
			case "main":
				template = this.state.items.map((item, i) => (
					<CSSTransition
						classNames={{
							enter: style.wrapper,
							enterActive: style.wrapper_enter
						}}
						timeout={1000}
						key={i}
					>
						<Link to={`/articles/${item.id}`}>
							<div className={style.card_wrap}>
								<div
									className={style.left}
									style={{ background: `url(/images/articles/${item.image})` }}
								>
									<div></div>
								</div>
								<div className={style.right}>
									<CardInfo
										teams={this.state.teams}
										team={item.team}
										date={item.date}
									/>
									<h2>{item.title}</h2>
								</div>
							</div>
						</Link>
					</CSSTransition>
				));
				break;
			default:
				template = null;
		}
		return template;
	};

	render() {
		return (
			<div>
				<TransitionGroup component="div" className="list">
					{this.renderNews(this.props.type)}
				</TransitionGroup>

				<Button
					type="loadmore"
					loadMore={() => this.loadMore()}
					cta="Load More News"
				/>

				<div onClick={() => this.loadMore()}></div>
			</div>
		);
	}
}

export default NewsList;
